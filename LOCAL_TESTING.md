# Local Testing Guide for Authentication

## Step-by-Step Setup

### Step 1: Add Password Column to Supabase (Required)

You need to add a password column to your users table. Here's how:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Login if needed
   - Select your project (ID: ysvtjwtwrdbbclplonxx)

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run This SQL**
   ```sql
   ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
   ```
   - Paste the SQL above
   - Click "Run" or press Cmd+Enter
   - You should see "Success. No rows returned"

### Step 2: Run Migration to Set Default Passwords

After adding the column, run this command in your terminal:

```bash
node scripts/runMigration.js
```

This will:
- Find all users in your database
- Set their password to their username (hashed with bcrypt)
- Skip users who already have passwords

You should see output like:
```
✅ Updated user john with default password
✅ Updated user jane with default password
...
📊 Migration Summary:
   Updated: 5 users
   Skipped: 0 users
```

### Step 3: Start Local Development Server

Now you can test locally! Run:

```bash
# Terminal 1: Start the frontend
cd frontend
npm start

# Terminal 2: You'll need a local API server
# Since you're using Vercel serverless functions, you can use:
vercel dev
```

Or if you prefer to test just the frontend with the deployed API:

```bash
cd frontend
npm start
```

The frontend will run on http://localhost:3000

### Step 4: Test the Authentication Flow

1. **Test Login**
   - Open http://localhost:3000
   - You should see the login page
   - Enter a username from your database
   - Enter the same username as the password (this is the default)
   - Click "Login"
   - You should be redirected to /feed

2. **Test Protected Routes**
   - After logging in, open DevTools (Cmd+Option+I)
   - Go to Application > Local Storage
   - You should see `authToken` and `user` stored
   - Try refreshing the page - you should stay logged in
   - Clear localStorage and try accessing /feed - you should be redirected to login

3. **Test Change Password**
   - After logging in, look at your Profile panel
   - Click "Change Password"
   - Enter current password (your username)
   - Enter a new password
   - Confirm the new password
   - Click "Change Password"
   - You should see a success message

4. **Test Logout**
   - Click the "Logout" button in Profile
   - You should be redirected to login page
   - Try accessing /feed - you should be redirected back to login

5. **Test New Password**
   - Login again with your username
   - Use the NEW password you just set
   - You should successfully login

## Quick Test Without Database Changes

If you want to test the UI without modifying the database yet, you can:

1. **Temporarily disable password check** in `api/login.js`:
   ```javascript
   // Comment out these lines (around line 70-74):
   // const isPasswordValid = await comparePassword(password, user.password);
   // if (!isPasswordValid) {
   //   return res.status(401).json({ error: "Invalid username or password" });
   // }
   ```

2. Start the dev server and test the frontend flow

3. **Remember to uncomment** those lines before deploying!

## Troubleshooting

### "Password column does not exist"
- Run: `node scripts/checkDatabase.js`
- If it says column doesn't exist, go back to Step 1

### "User not found" when logging in
- Make sure you're using a username that exists in your database
- Check your Supabase dashboard > Table Editor > users

### Frontend won't start
- Make sure you're in the frontend directory: `cd frontend`
- Try: `npm install` then `npm start`

### API errors
- Check that `.env.local` has your Supabase credentials
- Make sure `JWT_SECRET` is set in `.env.local`

## What to Test

- ✅ Login with username/password
- ✅ Protected route redirects when not logged in
- ✅ Session persists on page refresh
- ✅ Change password works
- ✅ Logout clears session
- ✅ Login with new password works
- ✅ Wrong password shows error
- ✅ Empty fields show validation

## Next Steps After Local Testing

Once everything works locally:

1. Add `JWT_SECRET` to Vercel environment variables
2. Deploy: `git push` (Vercel will auto-deploy)
3. Run migration in production (same script)
4. Test on production URL
5. Notify your users about the new authentication system
