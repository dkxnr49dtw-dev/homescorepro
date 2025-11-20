# Security Configuration Guide

**Last Updated:** 2025-11-20  
**Purpose:** Complete security setup for HomeScorePro server

---

## 🔒 Security Features Implemented

1. **Password Protection** - All routes require authentication
2. **Bot Detection** - Blocks automated crawlers and scrapers
3. **Rate Limiting** - Prevents brute force and DDoS attacks
4. **IP Blocking** - Automatically blocks suspicious IPs
5. **Enhanced Security Headers** - XSS, CSRF, clickjacking protection
6. **Session Security** - Secure, HTTP-only cookies
7. **Robots.txt** - Blocks all search engine crawlers
8. **Input Sanitization** - Prevents XSS attacks

---

## 🚀 Quick Setup

### 1. Generate Password Hash

```bash
cd server
node scripts/generate-password-hash.js YOUR_PASSWORD_HERE
```

This will output a hash like:
```
SITE_PASSWORD_HASH=$2b$10$abcdefghijklmnopqrstuvwxyz1234567890
```

### 2. Configure Environment Variables

Add to `server/.env`:

```env
# Site Password (REQUIRED)
SITE_PASSWORD_HASH=$2b$10$your_generated_hash_here

# Session Secret (auto-generated if not set, but recommended to set)
SESSION_SECRET=your_random_secret_here_min_32_chars

# Security Settings
NODE_ENV=production
ALLOW_ALL_ORIGINS=false  # Set to true only if needed for local hosting
```

### 3. Install Dependencies

```bash
cd server
npm install
```

This will install `express-session` which is required for authentication.

---

## 🔐 How It Works

### Authentication Flow

1. User visits any page → Redirected to `/login`
2. User enters password → Sent to `/api/auth/login`
3. Server validates password → Creates secure session
4. User can now access all pages → Session cookie stored
5. User logs out → Session destroyed

### Security Layers

1. **Password Protection**: All routes (except `/login`, `/health`, `/robots.txt`) require authentication
2. **Bot Detection**: Automatically detects and blocks:
   - Googlebot, Bingbot, and other crawlers
   - curl, wget, Python requests
   - Postman, Insomnia, and API tools
   - Any automated access tools
3. **Rate Limiting**:
   - Login: 5 attempts per 15 minutes
   - API: 100 requests per 15 minutes
   - General: 30 requests per minute
4. **IP Blocking**: IPs with 10+ suspicious requests are blocked for 1 hour
5. **Session Security**:
   - HTTP-only cookies (prevents XSS)
   - Secure flag in production (HTTPS only)
   - SameSite=strict (CSRF protection)
   - 24-hour expiration

---

## 🛡️ Protection Against

✅ **Google/SEO Crawlers** - robots.txt + bot detection  
✅ **Web Scrapers** - Bot detection + rate limiting  
✅ **Brute Force Attacks** - Rate limiting + IP blocking  
✅ **DDoS Attacks** - Rate limiting + IP blocking  
✅ **XSS Attacks** - Input sanitization + security headers  
✅ **CSRF Attacks** - SameSite cookies + session tokens  
✅ **Clickjacking** - X-Frame-Options header  
✅ **SQL Injection** - Parameterized queries (if using database)  

---

## 📝 API Endpoints

### Public Endpoints (No Auth Required)

- `GET /health` - Health check (for monitoring)
- `GET /robots.txt` - Robots.txt (blocks all crawlers)
- `GET /login` - Login page
- `POST /api/auth/login` - Login endpoint
- `GET /api/auth/status` - Check authentication status
- `POST /api/auth/logout` - Logout endpoint

### Protected Endpoints (Auth Required)

- All other routes require authentication

---

## 🔧 Configuration Options

### Environment Variables

```env
# Required
SITE_PASSWORD_HASH=bcrypt_hash_here

# Optional (auto-generated if not set)
SESSION_SECRET=random_secret_min_32_chars

# Security Settings
NODE_ENV=production
ALLOW_ALL_ORIGINS=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Adjusting Security Levels

**More Strict (Recommended for Production):**
- Set `ALLOW_ALL_ORIGINS=false`
- Reduce rate limits
- Enable HTTPS (set `secure: true` in session config)

**Less Strict (For Development):**
- Set `ALLOW_ALL_ORIGINS=true`
- Increase rate limits
- Disable HTTPS requirement

---

## 🚨 Monitoring Suspicious Activity

The server automatically tracks suspicious IPs. To view blocked IPs, you can add an admin endpoint:

```javascript
// In server/app.js (admin route - protect with additional auth)
app.get('/api/admin/suspicious-ips', requireAuth, (req, res) => {
  const { getSuspiciousIPs } = require('./middleware/security');
  res.json({ suspiciousIPs: getSuspiciousIPs() });
});
```

---

## ⚠️ Important Notes

1. **Never commit `.env` file** - It contains sensitive passwords
2. **Use strong passwords** - At least 12 characters, mixed case, numbers, symbols
3. **Rotate passwords regularly** - Generate new hash and update `.env`
4. **Enable HTTPS in production** - Required for secure sessions
5. **Monitor logs** - Check for suspicious activity patterns

---

## 🔄 Changing Password

1. Generate new hash:
```bash
node scripts/generate-password-hash.js NEW_PASSWORD
```

2. Update `server/.env`:
```env
SITE_PASSWORD_HASH=new_hash_here
```

3. Restart server:
```bash
pm2 restart homescorepro
```

All users will need to log in again with the new password.

---

## 📚 Additional Resources

- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)

