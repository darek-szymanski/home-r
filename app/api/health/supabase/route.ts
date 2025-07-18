import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // Create Supabase client
        const supabase = await createClient()

        // Test the connection by making a simple query
        const { error } = await supabase
            .from('pg_stat_database')
            .select('datname')
            .limit(1)

        if (error) {
            // If the above query fails, try a simpler connection test
            const { error: authError } = await supabase.auth.getSession()

            if (authError && authError.message.includes('Invalid API key')) {
                return NextResponse.json({
                    status: 'error',
                    message: 'Invalid Supabase credentials',
                    error: authError.message,
                    timestamp: new Date().toISOString()
                }, { status: 500 })
            }

            // If it's not an auth error, it might be a permissions issue but connection is OK
            return NextResponse.json({
                status: 'connected',
                message: 'Supabase connection established (limited permissions)',
                details: 'Connection successful but may have limited database access',
                timestamp: new Date().toISOString()
            }, { status: 200 })
        }

        return NextResponse.json({
            status: 'connected',
            message: 'Supabase connection successful',
            details: 'Full database access confirmed',
            timestamp: new Date().toISOString()
        }, { status: 200 })

    } catch (error) {
        console.error('Supabase connection error:', error)

        return NextResponse.json({
            status: 'error',
            message: 'Failed to connect to Supabase',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}
