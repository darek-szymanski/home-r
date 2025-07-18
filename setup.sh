#!/bin/bash

# Setup script for Home App with Supabase Authentication

echo "🏠 Setting up Home App with Supabase Authentication"
echo "=================================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "✅ .env.local created from example"
    echo "⚠️  Please update .env.local with your actual Supabase credentials"
else
    echo "✅ .env.local file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Run 'vercel' to deploy to Vercel"
echo ""
echo "📚 See README.md for detailed instructions"
