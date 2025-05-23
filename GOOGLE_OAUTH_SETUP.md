# Google OAuth Setup Guide for Seating Chart Planner

## 🎯 Overview
This guide will help you complete the Google OAuth integration for Task 2.3. The frontend implementation is already done - you just need to configure the server-side OAuth provider.

## ✅ Current Status
- ✅ Google OAuth buttons implemented in sign-in/sign-up dialogs
- ✅ Frontend calls to Better Auth social authentication
- ✅ Better Auth configuration updated with Google provider
- 🚨 **Missing**: Google OAuth credentials and environment variables

## 📋 Step-by-Step Setup

### Step 1: Create Google OAuth Application

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project**
   - Create a new project or select existing one
   - Project name suggestion: "Seating Chart Planner"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google Identity" if available

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application" as application type
   - Name: "Seating Chart Planner Web Client"

5. **Configure Authorized Redirect URIs**
   Add these URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```
   (Replace `yourdomain.com` with your actual production domain)

6. **Save and Copy Credentials**
   - Copy the Client ID and Client Secret
   - Keep these secure - you'll need them for environment variables

### Step 2: Configure Environment Variables

Add these lines to your `.env.local` file:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**Important**: Replace the placeholder values with your actual Google OAuth credentials.

### Step 3: Restart Development Server

After adding environment variables, restart your development server:

```bash
npm run dev
```

### Step 4: Test Google OAuth Flow

1. **Open your application**: http://localhost:3000
2. **Click "Sign Up" or "Sign In"**
3. **Click "Sign up with Google" or "Sign in with Google"**
4. **Verify the OAuth flow**:
   - Should redirect to Google's OAuth consent screen
   - After authorization, should redirect back to your app
   - User should be signed in successfully

## 🔧 Troubleshooting

### Common Issues:

1. **"OAuth client not found" error**
   - Verify GOOGLE_CLIENT_ID is correct
   - Check that the OAuth application is properly created

2. **"Redirect URI mismatch" error**
   - Ensure redirect URI in Google Console matches exactly:
     `http://localhost:3000/api/auth/callback/google`
   - No trailing slashes or extra characters

3. **"Access blocked" error**
   - Make sure Google+ API is enabled
   - Check OAuth consent screen configuration

4. **Environment variables not loading**
   - Restart development server after adding .env.local
   - Verify .env.local is in project root directory

## 🎉 Success Indicators

When Google OAuth is working correctly:
- ✅ Google sign-in button redirects to Google OAuth
- ✅ After authorization, user is redirected back to app
- ✅ User is automatically signed in
- ✅ User data is stored in Supabase database
- ✅ Session is maintained across page refreshes

## 📚 Additional Resources

- [Better Auth Google Provider Documentation](https://www.better-auth.com/docs/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

## 🔄 Next Steps After Completion

Once Google OAuth is working:
1. Mark Task 2.3 as complete: `tm set-status --id=2.3 --status=done`
2. Consider adding additional OAuth providers (GitHub, etc.)
3. Move on to Task 2.4: Session Management
4. Test the complete authentication flow end-to-end

---

**Need Help?** If you encounter issues, check the browser console and server logs for detailed error messages. 