export default async function AuthCodeError({
    searchParams
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const params = await searchParams
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                        Authentication Error
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        There was an error during the authentication process. Please try signing in again.
                    </p>
                    {params.error && (
                        <p className="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded">
                            Error: {params.error}
                        </p>
                    )}
                </div>
                <div className="mt-8 space-y-6">
                    <a
                        href="/auth/login"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    )
}