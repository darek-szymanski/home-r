'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface HealthCheckDetails {
    message: string
    supabaseUrl?: string
    missing?: string[]
    authStatus?: string
    databaseStatus?: string
    error?: string
    note?: string
}

interface HealthCheck {
    timestamp: string
    status: 'ok' | 'warning' | 'error' | 'unknown'
    checks: {
        environment: {
            status: string
            details: HealthCheckDetails
        }
        supabase: {
            status: string
            details: HealthCheckDetails
        }
    }
}

export default function HealthCheckPage() {
    const [healthData, setHealthData] = useState<HealthCheck | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchHealthCheck = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/health')
            const data = await response.json()
            setHealthData(data)
        } catch (error) {
            console.error('Failed to fetch health check:', error)
            setHealthData({
                timestamp: new Date().toISOString(),
                status: 'error',
                checks: {
                    environment: {
                        status: 'error',
                        details: { message: 'Failed to fetch health check' }
                    },
                    supabase: {
                        status: 'error',
                        details: { message: 'Failed to fetch health check' }
                    }
                }
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHealthCheck()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ok': return 'bg-green-500'
            case 'warning': return 'bg-yellow-500'
            case 'error': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ok': return 'Healthy'
            case 'warning': return 'Warning'
            case 'error': return 'Error'
            default: return 'Unknown'
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-center">
                    <div className="text-lg">Checking Supabase connection...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Health Check</h1>
                    <p className="text-muted-foreground">System status and connectivity</p>
                </div>
                <Button onClick={fetchHealthCheck} disabled={loading}>
                    Refresh
                </Button>
            </div>

            {healthData && (
                <>
                    {/* Overall Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Overall Status
                                <Badge className={getStatusColor(healthData.status)}>
                                    {getStatusText(healthData.status)}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                Last checked: {new Date(healthData.timestamp).toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Environment Check */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Environment Variables
                                <Badge className={getStatusColor(healthData.checks.environment.status)}>
                                    {getStatusText(healthData.checks.environment.status)}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {healthData.checks.environment.details.message}
                                </p>
                                {healthData.checks.environment.details.supabaseUrl && (
                                    <p className="text-xs font-mono">
                                        URL: {healthData.checks.environment.details.supabaseUrl}
                                    </p>
                                )}
                                {healthData.checks.environment.details.missing && (
                                    <div className="text-sm text-red-600">
                                        Missing: {healthData.checks.environment.details.missing.join(', ')}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Supabase Connection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Supabase Connection
                                <Badge className={getStatusColor(healthData.checks.supabase.status)}>
                                    {getStatusText(healthData.checks.supabase.status)}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {healthData.checks.supabase.details.message}
                                </p>
                                {healthData.checks.supabase.details.authStatus && (
                                    <div className="text-xs space-y-1">
                                        <div>Auth Status: <span className="font-mono">{healthData.checks.supabase.details.authStatus}</span></div>
                                        {healthData.checks.supabase.details.databaseStatus && (
                                            <div>Database Status: <span className="font-mono">{healthData.checks.supabase.details.databaseStatus}</span></div>
                                        )}
                                    </div>
                                )}
                                {healthData.checks.supabase.details.error && (
                                    <div className="text-sm text-red-600 font-mono">
                                        Error: {healthData.checks.supabase.details.error}
                                    </div>
                                )}
                                {healthData.checks.supabase.details.note && (
                                    <div className="text-xs text-yellow-600">
                                        Note: {healthData.checks.supabase.details.note}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Access */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Access</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => window.open('/api/health', '_blank')}
                                >
                                    View Raw JSON
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.open('/api/health/supabase', '_blank')}
                                >
                                    Supabase Only
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
