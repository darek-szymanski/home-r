export function getBaseUrl() {
    // Always prioritize environment variable if set (for production)
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL
    }

    // Client-side fallback
    if (typeof window !== 'undefined') {
        return window.location.origin
    }

    // Server-side fallback for development
    return 'http://localhost:3000'
} export function getCallbackUrl() {
    return `${getBaseUrl()}/auth/callback`
}
