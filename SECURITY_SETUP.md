# 🔒 Security Setup - Quick Start

**Your site is now protected!** Follow these steps to complete the setup.

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Generate Password Hash

```bash
cd server
node scripts/generate-password-hash.js YOUR_SECURE_PASSWORD
```

**Example:**
```bash
node scripts/generate-password-hash.js MySecurePass123!
```

This will output:
```
SITE_PASSWORD_HASH=$2b$10$abcdefghijklmnopqrstuvwxyz...
```

### Step 2: Update server/.env

Add these lines to your `server/.env` file:

```env
# Site Password Protection (REQUIRED)
SITE_PASSWORD_HASH=$2b$10$your_generated_hash_here

# Session Secret (REQUIRED - use a random 32+ character string)
SESSION_SECRET=your_random_secret_here_minimum_32_characters_long

# Security Settings
NODE_ENV=production
ALLOW_ALL_ORIGINS=true  # Set to false in production for better security
```

**Generate a random session secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Install Dependencies & Restart

```bash
cd server
npm install
cd ..
pm2 restart homescorepro
```

---

## ✅ What's Protected

- ✅ **All pages** require password authentication
- ✅ **Google and all crawlers** are blocked (robots.txt + bot detection)
- ✅ **Web scrapers** are automatically detected and blocked
- ✅ **Brute force attacks** are prevented (rate limiting)
- ✅ **Suspicious IPs** are automatically blocked
- ✅ **XSS and CSRF attacks** are prevented

---

## 🚀 How It Works

1. **User visits site** → Redirected to login page
2. **User enters password** → Authenticated via secure session
3. **User can access site** → Session cookie stored (24 hours)
4. **Bots/scrapers blocked** → Automatically detected and denied

---

## 🔐 Login

- **URL:** `http://your-domain:3000/login`
- **Password:** The password you used in Step 1

---

## 📚 Full Documentation

See `server/SECURITY.md` for complete security documentation.

---

## ⚠️ Important

- **Never commit `.env` file** - It contains your password hash
- **Use a strong password** - At least 12 characters
- **Keep session secret secure** - Don't share it
- **Enable HTTPS in production** - For maximum security

---

## 🆘 Troubleshooting

**Can't login?**
- Check that `SITE_PASSWORD_HASH` is set correctly in `.env`
- Verify you're using the correct password
- Check server logs: `pm2 logs homescorepro`

**Server won't start?**
- Run `cd server && npm install` to install `express-session`
- Check that all environment variables are set
- Verify Node.js version: `node --version` (should be 18+)

**Still accessible without password?**
- Make sure `NODE_ENV=production` in `.env`
- Restart server: `pm2 restart homescorepro`
- Check that React app is built: `cd react-app && npm run build`

