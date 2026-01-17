# Authentication Setup Guide

## Quick Start

### 1. Add Password Column to Supabase

Go to your Supabase SQL Editor and run:

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password TEXT;
```

### 2. Set Default Passwords for Existing Users

Run the migration script:

```bash
node api/migrations/addPasswordField.js
```

This will set each user's password to their username (hashed).

### 3. Add JWT Secret to Production

In your Vercel dashboard, add this environment variable:

```
JWT_SECRET=your-secure-random-secret
```

Generate a secure secret with:

```bash
openssl rand -hex 32
```

### 4. Deploy

Your app is ready! Deploy as usual:

```bash
git add .
git commit -m "Add authentication and authorization"
git push
```

Vercel will automatically deploy.

## What Changed?

- ✅ Users must login with username and password
- ✅ Default password = username (users should change it)
- ✅ JWT tokens for session management (7-day expiry)
- ✅ Protected routes - can't access /feed without login
- ✅ Change password feature in Profile
- ✅ Logout functionality
- ✅ Session persists across page refreshes

## User Instructions

**For existing users:**
1. Login with your username
2. Use your username as the password
3. After login, click "Change Password" in your profile
4. Set a new secure password

**For new users:**
- Admin adds you via the existing system
- Your initial password is your username
- Change it immediately after first login

## Testing Locally

1. Start your dev server
2. Try logging in with a username
3. Use the username as password
4. Verify you can access /feed
5. Try changing your password
6. Logout and login with new password

## Need Help?

See the full walkthrough in the artifacts for detailed information about all changes made.
