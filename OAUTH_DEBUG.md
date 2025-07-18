# 🔍 OAuth Callback Debugging Guide

## Issue: Callback still points to localhost despite setting NEXT_PUBLIC_SITE_URL

### ✅ Fix Applied

Updated `lib/utils.ts` to prioritize `NEXT_PUBLIC_SITE_URL` environment variable over `window.location.origin`.

### 🐛 Debug Steps

1. **Check Environment Variable in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Verify `NEXT_PUBLIC_SITE_URL` is set to your production URL (e.g., `https://your-app.vercel.app`)
   - Make sure it's set for "Production" environment

2. **Redeploy After Setting Environment Variables:**
   - Environment variables only take effect after redeployment
   - In Vercel dashboard, go to Deployments
   - Click "Redeploy" on your latest deployment
   - OR trigger a new deployment by pushing to your repo

3. **Check Debug Output:**
   - Visit your deployed app's `/login` page
   - Look for the debug box in the bottom-right corner
   - It should show:

     ```
     Debug URLs:
     Base URL: https://your-app.vercel.app
     Callback URL: https://your-app.vercel.app/auth/callback
     ENV: https://your-app.vercel.app
     ```

4. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Click "Continue with Google"
   - Look for logs:

     ```
     OAuth Callback URL: https://your-app.vercel.app/auth/callback
     Environment SITE_URL: https://your-app.vercel.app
     ```

### 🔧 Common Issues & Solutions

#### Issue: Environment variable not showing

- **Cause:** Environment variable not set in Vercel
- **Solution:** Set `NEXT_PUBLIC_SITE_URL` in Vercel dashboard

#### Issue: Environment variable shows but callback is still localhost

- **Cause:** Old deployment cached, environment variable not applied
- **Solution:** Redeploy the application

#### Issue: Environment variable shows correctly but OAuth still fails

- **Cause:** Supabase redirect URLs not updated
- **Solution:**
  1. Go to Supabase Dashboard → Authentication → URL Configuration
  2. Set Site URL: `https://your-app.vercel.app`
  3. Set Redirect URLs: `https://your-app.vercel.app/auth/callback`

#### Issue: Google OAuth provider issues

- **Cause:** Google OAuth client not configured for production domain
- **Solution:**
  1. Go to Google Cloud Console
  2. Navigate to APIs & Services → Credentials
  3. Edit your OAuth 2.0 Client ID
  4. Add to Authorized JavaScript origins: `https://your-app.vercel.app`
  5. Add to Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`

### 📋 Deployment Checklist

- [ ] `NEXT_PUBLIC_SITE_URL` set in Vercel environment variables
- [ ] Application redeployed after setting environment variables
- [ ] Debug output shows correct URLs
- [ ] Supabase Site URL updated to production domain
- [ ] Supabase Redirect URLs updated to production domain
- [ ] Google OAuth client configured for production domain

### 🧪 Testing Steps

1. **Deploy with debug components**
2. **Visit `/login` page on your production domain**
3. **Check debug output in bottom-right corner**
4. **Check browser console for logs**
5. **Test Google OAuth flow**
6. **Verify successful authentication**

### 🚀 After Successful Testing

Remove debug components by:

1. Removing `<DebugUrls />` from `app/login/page.tsx`
2. Removing console.log statements from `app/login/login-form.tsx`
3. Deleting `components/debug-urls.tsx`
4. Redeploying

The OAuth callback should now correctly point to your production domain! 🎉
