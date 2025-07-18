import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const healthCheck = {
        timestamp: new Date().toISOString(),
        status: 'unknown',
        checks: {
            environment: {
                status: 'unknown',
                details: {}
            },
            supabase: {
                status: 'unknown',
                details: {}
            }
        }
    }

    // Check environment variables
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            healthCheck.checks.environment = {
                status: 'error',
                details: {
                    message: 'Missing required environment variables',
                    missing: [
                        ...(!supabaseUrl ? ['NEXT_PUBLIC_SUPABASE_URL'] : []),
                        ...(!supabaseAnonKey ? ['NEXT_PUBLIC_SUPABASE_ANON_KEY'] : [])
                    ]
                }
            }
        } else {
            healthCheck.checks.environment = {
                status: 'ok',
                details: {
                    message: 'Environment variables configured',
                    supabaseUrl: supabaseUrl.substring(0, 20) + '...' // Partial URL for security
                }
            }
        }
    } catch (error) {
        healthCheck.checks.environment = {
            status: 'error',
            details: {
                message: 'Error checking environment variables',
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }

    // Check Supabase connection
    try {
        const supabase = await createClient()

        // Test authentication service
        const { error: authError } = await supabase.auth.getSession()

        if (authError && authError.message.includes('Invalid API key')) {
            healthCheck.checks.supabase = {
                status: 'error',
                details: {
                    message: 'Invalid Supabase API key',
                    error: authError.message
                }
            }
        } else {
            // Try to make a simple query to test database connection
            const { error: dbError } = await supabase
                .from('information_schema.tables')
                .select('table_name')
                .limit(1)

            if (dbError) {
                healthCheck.checks.supabase = {
                    status: 'warning',
                    details: {
                        message: 'Supabase auth connected, limited database access',
                        authStatus: 'connected',
                        databaseStatus: 'limited',
                        note: 'This might be expected if RLS policies are in place'
                    }
                }
            } else {
                healthCheck.checks.supabase = {
                    status: 'ok',
                    details: {
                        message: 'Supabase fully connected',
                        authStatus: 'connected',
                        databaseStatus: 'connected'
                    }
                }
            }
        }
    } catch (error) {
        healthCheck.checks.supabase = {
            status: 'error',
            details: {
                message: 'Failed to connect to Supabase',
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }

    // Determine overall status
    const envStatus = healthCheck.checks.environment.status
    const supabaseStatus = healthCheck.checks.supabase.status

    if (envStatus === 'error' || supabaseStatus === 'error') {
        healthCheck.status = 'error'
    } else if (envStatus === 'warning' || supabaseStatus === 'warning') {
        healthCheck.status = 'warning'
    } else {
        healthCheck.status = 'ok'
    }

    const httpStatus = healthCheck.status === 'error' ? 500 : 200

    return NextResponse.json(healthCheck, { status: httpStatus })
}
