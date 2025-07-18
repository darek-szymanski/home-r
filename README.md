# Home App with Supabase Authentication

A Next.js application with Supabase authentication, designed for secure deployment on Vercel with server-side rendering.

## Features

- 🔐 **Secure Authentication**: Email/password and OAuth (Google) authentication
- 🛡️ **Server-Side Rendering**: Credentials are handled securely on the server
- 🔄 **Automatic Session Management**: Built-in session refresh and persistence
- 🚀 **Vercel Deployment Ready**: Optimized for seamless Vercel deployment
- 🛣️ **Protected Routes**: Middleware-based route protection
- 📱 **Responsive Design**: Clean, modern UI that works on all devices

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to find your project credentials
3. Enable authentication providers:
   - Go to Authentication > Providers
   - Enable Email and any OAuth providers you want (e.g., Google)
4. Set up your site URL in Authentication > URL Configuration:
   - Site URL: `https://your-app-name.vercel.app` (or your custom domain)
   - Redirect URLs: `https://your-app-name.vercel.app/auth/callback`

### 2. Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Update with your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 4. Deployment on Vercel

#### Option 1: Deploy with Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy to Vercel
vercel
```

#### Option 2: Deploy from GitHub

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/home-r&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 5. Post-Deployment

1. Update your Supabase project settings with your production URL
2. Test authentication flows in production
3. Configure any additional OAuth providers if needed

## Security Features

- **Server-Side Authentication**: User validation happens on the server
- **Secure Cookie Management**: Sessions are stored in HTTP-only cookies
- **Automatic Session Refresh**: Tokens are refreshed automatically
- **Protected Routes**: Middleware ensures only authenticated users access protected pages
- **Environment Security**: Sensitive credentials are never exposed to the client

## Project Structure

```
├── app/
│   ├── auth/callback/          # OAuth callback handler
│   ├── login/                  # Authentication pages
│   ├── client-page.tsx         # Client-side home component
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page (server component)
│   └── providers.tsx          # Authentication context provider
├── hooks/
│   └── useSupabase.ts         # Supabase client hook
├── lib/
│   └── supabase/
│       ├── client.ts          # Client-side Supabase client
│       └── server.ts          # Server-side Supabase client
├── middleware.ts              # Route protection middleware
├── next.config.js            # Next.js configuration
└── .env.local                # Environment variables
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication Flow

1. **Unauthenticated users** are redirected to `/login`
2. **Sign up** creates a new account and sends confirmation email
3. **Sign in** authenticates and redirects to home page
4. **OAuth providers** (Google) redirect through `/auth/callback`
5. **Session management** is handled automatically via middleware
6. **Sign out** clears session and redirects to login

## Troubleshooting

### Common Issues

1. **Authentication not working**: Check your Supabase URL configuration
2. **Redirect errors**: Ensure your redirect URLs are correctly set in Supabase
3. **Build errors**: Make sure all environment variables are set in Vercel
4. **Session issues**: Clear browser cookies and try again

### Support

For issues related to:

- **Supabase**: Check [Supabase documentation](https://supabase.com/docs)
- **Next.js**: Check [Next.js documentation](https://nextjs.org/docs)
- **Vercel**: Check [Vercel documentation](https://vercel.com/docs)

## License

This project is open source and available under the [MIT License](LICENSE).
