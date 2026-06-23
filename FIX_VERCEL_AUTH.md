# Fix Auth Issues on Vercel

## Problem: Login/Signup keeps redirecting back to sign-in page

## Solution: Set Environment Variables on Vercel

### Step 1: Go to Vercel Dashboard
- Open: https://vercel.com/dashboard
- Find your "untitled-chat-snowy" project
- Click on it

### Step 2: Go to Settings
- Click on **Settings** tab (top menu)
- Click on **Environment Variables** (left sidebar)

### Step 3: Add BETTER_AUTH_SECRET
1. Click **Add New**
2. Fill in:
   - **Name**: `BETTER_AUTH_SECRET`
   - **Value**: Paste the secret you generated earlier (or generate new one with: `openssl rand -base64 32`)
   - **Environments**: Select all (Production, Preview, Development)
3. Click **Save**

### Step 4: Verify DATABASE_URL is Set
1. Look for `DATABASE_URL` in the environment variables list
2. If it exists and has a value (Neon connection string) ✅ Good
3. If missing ❌, add it (get it from your Neon dashboard)

### Step 5: Redeploy
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the menu (three dots)
4. Click **Redeploy**
5. Wait 2-3 minutes for deployment to complete

### Step 6: Test
1. Go to: https://untitled-chat-snowy.vercel.app/
2. Try signing up with:
   - Name: "Test User"
   - Email: "test@nino.app"
   - Password: "Test@1234"
3. Should redirect to chat page (not back to sign-in)

## If Still Not Working

1. Check Vercel Logs:
   - Deployments → Latest deployment → Logs
   - Look for any error messages

2. Try pulling latest code:
   ```bash
   cd /vercel/share/v0-project
   git pull origin v0/ismailalishah2007-a2ac2875
   ```

3. Redeploy from v0:
   - Click "Publish" button in v0
   - Wait for deployment

## Common Issues

**Issue**: "Cannot POST /api/auth/..."
- Fix: Make sure both environment variables are set

**Issue**: Cookies not saving
- Fix: Already fixed in latest code (cookie handling improved)

**Issue**: Still redirecting
- Check: Vercel logs for specific error
- Try: Full page refresh (Ctrl+F5)

## Need Help?

Run locally first to verify it works:
```bash
pnpm dev
# Go to http://localhost:3000
# Try signing up
```

Then compare what works locally vs what fails on Vercel (check logs for differences).
