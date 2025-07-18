# Deployment Guide

## Quick Start

1. **Run the setup script:**

   ```bash
   ./setup.sh
   ```

2. **Update your environment variables:**
   - Edit `.env.local` with your Supabase credentials
   - Get these from your Supabase project dashboard

3. **Start development:**

   ```bash
   npm run dev
   ```

## Supabase Configuration

### 1. Create Supabase Project

- Go to [supabase.com](https://supabase.com)
- Create a new project
- Copy your project URL and anon key

### 2. Authentication Setup

- Navigate to Authentication > Providers
- Enable Email provider
- Enable Google OAuth (optional):
  - Add Google OAuth credentials
  - Set authorized redirect URIs

### 3. URL Configuration

- Go to Authentication > URL Configuration
- Set Site URL: `https://your-app.vercel.app`
- Add redirect URL: `https://your-app.vercel.app/auth/callback`

## Vercel Deployment

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy your project
vercel
```

**Note:** If you don't have npm globally configured, you can use:

```bash
# Alternative installation methods
$(which node | sed 's/node$/npm/') install -g vercel
# Or use npx without global installation
npx vercel
```

### Option 2: GitHub Integration

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard

### Option 3: Manual Upload

1. Run `npm run build`
2. Upload the `.next` folder to Vercel

## Environment Variables

Set these in your Vercel dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

**Important:** The `NEXT_PUBLIC_SITE_URL` should match your Vercel deployment URL to ensure OAuth redirects work correctly in production.

## Testing

1. **Local Testing:**

   ```bash
   npm run dev
   ```

2. **Production Testing:**

   ```bash
   npm run build
   npm run start
   ```

3. **Authentication Flow:**
   - Visit `/login`
   - Try email/password registration
   - Try Google OAuth (if configured)
   - Verify user session persists

## Troubleshooting

### Common Deployment Issues

1. **"No Output Directory named 'dist' found" Error:**
   - This happens when Vercel doesn't detect Next.js correctly
   - Solution: Ensure `vercel.json` exists with `"framework": "nextjs"`
   - Alternative: In Vercel dashboard, go to Project Settings > Framework Preset and select "Next.js"

2. **OAuth redirects to localhost instead of production URL:**
   - Set `NEXT_PUBLIC_SITE_URL` environment variable in Vercel dashboard
   - Value should be your production URL (e.g., `https://your-app.vercel.app`)
   - Update Supabase redirect URLs to match your production domain

3. **Build errors:** Check environment variables
4. **Auth errors:** Verify Supabase URL configuration
5. **Redirect errors:** Check callback URLs in Supabase
6. **Session issues:** Clear browser cookies

### Manual Framework Detection

If Vercel still doesn't detect Next.js:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > General
4. Under "Framework Preset", select "Next.js"
5. Redeploy the project

## Security Checklist

- ✅ Environment variables set in Vercel
- ✅ Supabase URL configuration updated
- ✅ OAuth providers configured
- ✅ Row Level Security enabled in Supabase
- ✅ HTTPS enforced in production
