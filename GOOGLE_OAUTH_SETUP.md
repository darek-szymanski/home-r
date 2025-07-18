# Google OAuth Setup for Supabase

This app uses **Google OAuth only** for authentication via Supabase. Follow these steps to configure it:

## 🔧 Supabase Configuration Required

### 1. Enable Google OAuth Provider

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Enable**
4. You'll need to configure:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure the OAuth consent screen
6. Add authorized redirect URIs:
   - `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
   - For local development: `http://localhost:54321/auth/v1/callback`

### 3. Redirect URLs

In your Supabase project settings, add these redirect URLs:

- **Production**: `https://your-app-domain.com/auth/confirm`
- **Development**: `http://localhost:3000/auth/confirm`

## 🚀 Features Implemented

### ✅ What's Working

- **Google OAuth Login**: Single-click authentication with Google
- **Google OAuth Signup**: New users can register with Google
- **Session Management**: Automatic session handling
- **Auth Confirmation**: Proper OAuth callback handling
- **Health Check**: Supabase connection verification at `/health`

### ❌ Removed Components

- Email/password login forms
- Password reset functionality
- Email verification flows
- Manual user registration

### 🔄 OAuth Flow

1. User clicks "Continue with Google"
2. Redirected to Google's OAuth consent screen
3. User authorizes the app
4. Google redirects back to `/auth/confirm`
5. App exchanges code for session
6. User is redirected to `/protected` page

## 🌐 Important URLs

- **Login**: `/auth/login`
- **Signup**: `/auth/sign-up`
- **Auth Callback**: `/auth/confirm`
- **Protected Area**: `/protected`
- **Health Check**: `/health`

## 📝 Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=your-deployed-url
```

## 🔐 Security Notes

- Only Google OAuth is enabled - no password-based authentication
- Users can only authenticate through their Google accounts
- All authentication flows go through Supabase
- Sessions are managed server-side for security
