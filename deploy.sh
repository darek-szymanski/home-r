#!/bin/bash

# Vercel deployment script for Next.js with Supabase

echo "🚀 Preparing for Vercel deployment..."

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "📝 Creating vercel.json..."
    cat > vercel.json << EOF
{
  "framework": "nextjs"
}
EOF
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found!"
    echo "   Make sure to set environment variables in Vercel dashboard:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - NEXT_PUBLIC_SITE_URL (your production URL)"
else
    echo "✅ Environment variables found in .env.local"
    echo "   Don't forget to set NEXT_PUBLIC_SITE_URL in Vercel dashboard!"
fi

# Build the project to test
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 Ready for deployment!"
    echo ""
    echo "Deploy options:"
    echo "1. Run: vercel (if you have Vercel CLI installed)"
    echo "2. Push to GitHub and connect to Vercel"
    echo "3. Upload build files manually to Vercel"
    echo ""
    echo "Don't forget to:"
    echo "- Set environment variables in Vercel dashboard"
    echo "- Update Supabase URL configuration with your domain"
    echo "- Set NEXT_PUBLIC_SITE_URL to your production URL"
    echo "- Update Google OAuth redirect URIs if using OAuth"
else
    echo "❌ Build failed! Please fix the errors above."
    exit 1
fi
