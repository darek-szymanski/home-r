import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const envVars = {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'unknown',
            variables: {
                NEXT_PUBLIC_SUPABASE_URL: {
                    value: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
                    status: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
                    // Show partial URL for security
                    display: process.env.NEXT_PUBLIC_SUPABASE_URL
                        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...`
                        : 'Not set'
                },
                NEXT_PUBLIC_SITE_URL: {
                    value: process.env.NEXT_PUBLIC_SITE_URL || 'Not set',
                    status: process.env.NEXT_PUBLIC_SITE_URL ? 'configured' : 'missing'
                },
                NEXT_TELEMETRY_DISABLED: {
                    value: process.env.NEXT_TELEMETRY_DISABLED || 'Not set',
                    status: process.env.NEXT_TELEMETRY_DISABLED ? 'configured' : 'missing',
                    enabled: process.env.NEXT_TELEMETRY_DISABLED === '1' ? false : true
                }
            },
            summary: {
                totalVariables: 3,
                configured: 0,
                missing: 0
            }
        }

        // Count configured vs missing
        Object.values(envVars.variables).forEach(variable => {
            if (variable.status === 'configured') {
                envVars.summary.configured++
            } else {
                envVars.summary.missing++
            }
        })

        // Determine overall status
        const overallStatus = envVars.summary.missing === 0 ? 'healthy' : 'incomplete'

        return NextResponse.json({
            ...envVars,
            status: overallStatus
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        })

    } catch (error) {
        console.error('Environment variables check error:', error)

        return NextResponse.json({
            status: 'error',
            message: 'Failed to retrieve environment variables',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}
