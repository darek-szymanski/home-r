/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["@supabase/ssr"],
    // Configure for Vercel deployment
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
}

export default nextConfig
