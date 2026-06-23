# Nino - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Generate Authentication Secret

```bash
openssl rand -base64 32
```

Copy the output (something like: `aBcDeFgHiJkLmNoPqRsT123UvWxYz456+abc/def==`)

### 2. Add to v0 Project Settings

1. Click **Settings** (⚙️) in top right of v0
2. Go to **Vars** tab
3. Click **Add Variable**
4. Set:
   - **Key**: `BETTER_AUTH_SECRET`
   - **Value**: Paste the string from step 1
5. Click **Save**

### 3. Restart Dev Server

```bash
# Kill current server (Ctrl+C)
pnpm dev
```

### 4. Test the App

```
http://localhost:3000
```

Now you should be able to:
- ✅ Sign Up (create new account)
- ✅ Sign In (log in)
- ✅ Chat with Nino
- ✅ Use voice input/output
- ✅ See 3D orb react to sentiment
- ✅ View memories in settings

---

## 🎯 What to Test

1. **Sign Up**: Create account with email/password
2. **Chat**: Type a message and get AI response
3. **Voice**: Click mic icon and speak
4. **Settings**: Change AI provider, enable/disable voice
5. **Memories**: View facts Nino learned about you
6. **3D Orb**: Watch it change color based on sentiment

---

## 🚀 Deploy to Vercel

Once everything works locally:

1. Click **Publish** in v0
2. Select your Vercel project
3. Add the same `BETTER_AUTH_SECRET` env var in Vercel
4. Deploy!

---

## 📞 Troubleshooting

**Sign Up/Login not working?**
- Make sure `BETTER_AUTH_SECRET` is set in Vars
- Restart dev server after adding the variable
- Check browser console (F12) for errors

**Database errors?**
- `DATABASE_URL` should be auto-set by Neon integration
- If not, check Settings > Integrations

**Voice not working?**
- Works in Chrome/Edge, may need permission in browser
- Check Settings to enable voice

---

## 📚 Full Documentation

- **README.md** - Complete feature list and architecture
- **DEPLOYMENT.md** - Production deployment guide
- **Code** - Fully commented and clean

Enjoy your Nino AI companion! 🎉
