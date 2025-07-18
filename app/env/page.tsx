'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface EnvVariable {
    value: string
    status: 'configured' | 'missing'
    display?: string
    enabled?: boolean
}

interface EnvData {
    timestamp: string
    environment: string
    status: 'healthy' | 'incomplete' | 'error'
    variables: {
        NEXT_PUBLIC_SUPABASE_URL: EnvVariable
        NEXT_PUBLIC_SITE_URL: EnvVariable
        NEXT_TELEMETRY_DISABLED: EnvVariable
    }
    summary: {
        totalVariables: number
        configured: number
        missing: number
    }
}

export default function EnvironmentPage() {
    const [envData, setEnvData] = useState<EnvData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchEnvData = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/env')
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            const data = await response.json()
            setEnvData(data)
        } catch (err) {
            console.error('Failed to fetch environment data:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch environment data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEnvData()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'configured':
            case 'healthy': return 'bg-green-500'
            case 'missing':
            case 'incomplete': return 'bg-yellow-500'
            case 'error': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'configured': return 'Configured'
            case 'missing': return 'Missing'
            case 'healthy': return 'All Good'
            case 'incomplete': return 'Incomplete'
            case 'error': return 'Error'
            default: return 'Unknown'
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-center">
                    <div className="text-lg">Loading environment variables...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-600">{error}</p>
                        <Button onClick={fetchEnvData} className="mt-4">
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Environment Variables</h1>
                    <p className="text-muted-foreground">Configuration status and values</p>
                </div>
                <Button onClick={fetchEnvData} disabled={loading}>
                    Refresh
                </Button>
            </div>

            {envData && (
                <>
                    {/* Overall Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Overall Status
                                <Badge className={getStatusColor(envData.status)}>
                                    {getStatusText(envData.status)}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                Environment: {envData.environment} |
                                Last checked: {new Date(envData.timestamp).toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold">{envData.summary.totalVariables}</div>
                                    <div className="text-sm text-muted-foreground">Total Variables</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">{envData.summary.configured}</div>
                                    <div className="text-sm text-muted-foreground">Configured</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-yellow-600">{envData.summary.missing}</div>
                                    <div className="text-sm text-muted-foreground">Missing</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Individual Variables */}
                    <div className="grid gap-4">
                        {Object.entries(envData.variables).map(([key, variable]) => (
                            <Card key={key}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="font-mono text-sm">{key}</span>
                                        <Badge className={getStatusColor(variable.status)}>
                                            {getStatusText(variable.status)}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm font-medium">Value: </span>
                                            <code className="text-sm bg-muted px-2 py-1 rounded">
                                                {variable.display || variable.value}
                                            </code>
                                        </div>

                                        {key === 'NEXT_TELEMETRY_DISABLED' && variable.enabled !== undefined && (
                                            <div>
                                                <span className="text-sm font-medium">Telemetry Status: </span>
                                                <Badge variant={variable.enabled ? "destructive" : "default"}>
                                                    {variable.enabled ? "Enabled" : "Disabled"}
                                                </Badge>
                                            </div>
                                        )}

                                        {key === 'NEXT_PUBLIC_SUPABASE_URL' && variable.status === 'configured' && (
                                            <div className="text-xs text-muted-foreground">
                                                ⚠️ Partial URL shown for security
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Access */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Access</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => window.open('/api/env', '_blank')}
                                >
                                    View Raw JSON
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.open('/health', '_blank')}
                                >
                                    Health Check
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
