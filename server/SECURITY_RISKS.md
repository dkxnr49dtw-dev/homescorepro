# Security Risk Assessment & Mitigation

**Last Updated:** 2025-11-20  
**Purpose:** Assess and mitigate risks of hosting on Mac Mini

---

## ⚠️ Potential Risks

### 1. **Server Compromise → File System Access**

**Risk Level:** HIGH  
**Scenario:** If an attacker compromises the Node.js server, they could potentially:
- Access files in the server directory
- Read environment variables
- Access project files
- **POTENTIALLY** access other files if running as your user account

**Mitigation:**
- ✅ Sandbox middleware (prevents directory traversal)
- ✅ Process isolation (run as limited user)
- ✅ File system restrictions
- ✅ No direct file system access in routes

### 2. **Server Compromise → iCloud Drive Access**

**Risk Level:** MEDIUM  
**Scenario:** Your project is in iCloud Drive, so if server is compromised:
- Attacker could access files in the project directory
- **BUT** iCloud Drive files are synced, not directly accessible
- Attacker would need to navigate up directories (blocked by sandbox)

**Mitigation:**
- ✅ Sandbox prevents access outside project directory
- ✅ Directory traversal blocked
- ✅ Explicit path blocking for iCloud Drive paths

### 3. **Server Compromise → Network Access**

**Risk Level:** MEDIUM  
**Scenario:** Compromised server could:
- Make outbound network requests
- Access local network resources
- Potentially access other services on your Mac

**Mitigation:**
- ✅ Firewall rules (recommended)
- ✅ Network isolation (recommended)
- ✅ No database connections to sensitive data
- ✅ Limited API access

### 4. **Server Compromise → System Access**

**Risk Level:** LOW (with proper setup)  
**Scenario:** If running as your user account:
- Could execute commands as your user
- Could access your user files
- Could modify system settings (if permissions allow)

**Mitigation:**
- ✅ Run server as limited user (recommended)
- ✅ No sudo/root access
- ✅ Process isolation
- ✅ Restricted file permissions

---

## 🛡️ Security Measures Implemented

### 1. **Sandbox Middleware** ✅
- Prevents directory traversal (`../`)
- Blocks access to sensitive locations
- Only allows access to project directory
- Explicitly blocks iCloud Drive paths

### 2. **File System Restrictions** ✅
- All file operations go through sanitization
- No direct `fs` access in routes
- Path validation before any file operation

### 3. **Process Isolation** (Recommended)
- Run server as limited user account
- No root/sudo access
- Restricted permissions

### 4. **Network Security** ✅
- Rate limiting
- IP blocking
- Bot detection
- Password protection

---

## 🔒 Additional Security Recommendations

### 1. **Create Limited User Account** (STRONGLY RECOMMENDED)

Create a dedicated user account for the server:

```bash
# Create new user
sudo dscl . -create /Users/homescorepro
sudo dscl . -create /Users/homescorepro UserShell /bin/bash
sudo dscl . -create /Users/homescorepro RealName "HomeScorePro Server"
sudo dscl . -create /Users/homescorepro UniqueID 1001
sudo dscl . -create /Users/homescorepro PrimaryGroupID 20
sudo dscl . -create /Users/homescorepro NFSHomeDirectory /Users/homescorepro
sudo dscl . -passwd /Users/homescorepro PASSWORD_HERE

# Set up project directory (copy, don't move from iCloud)
sudo mkdir -p /Users/homescorepro/homescorepro
sudo chown -R homescorepro:staff /Users/homescorepro/homescorepro

# Run server as this user
sudo -u homescorepro pm2 start ecosystem.config.js
```

**Benefits:**
- Server can't access your personal files
- Limited permissions
- Isolated from your user account

### 2. **Firewall Configuration**

Enable macOS Firewall and restrict access:

```bash
# Enable firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on

# Allow only specific ports
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

Or use System Settings:
- System Settings → Network → Firewall
- Enable Firewall
- Add Node.js to allowed apps
- Block all other incoming connections

### 3. **Network Isolation**

**Option A: Use a separate network/VLAN**
- Put Mac Mini on isolated network
- Only allow port 3000 from specific IPs

**Option B: Use Cloudflare Tunnel** (Recommended)
- No port forwarding needed
- Traffic goes through Cloudflare
- Additional DDoS protection
- Free SSL/HTTPS

### 4. **File Permissions**

Restrict file permissions:

```bash
# Make server directory read-only except for logs
chmod -R 755 /path/to/homescorepro/server
chmod -R 644 /path/to/homescorepro/server/*.js
chmod 755 /path/to/homescorepro/server/logs
chmod 644 /path/to/homescorepro/server/logs/*

# Protect .env file
chmod 600 /path/to/homescorepro/server/.env
```

### 5. **Move Project Out of iCloud Drive** (Recommended)

iCloud Drive syncs files, which could expose them:

```bash
# Move project to local directory
sudo mv "/Users/jason/Library/Mobile Documents/com~apple~CloudDocs/homescorepro" \
        "/Users/homescorepro/homescorepro"

# Update paths in ecosystem.config.js
```

**Benefits:**
- No iCloud sync (reduces exposure)
- Faster file access
- Better for server hosting

### 6. **Enable macOS Security Features**

```bash
# Enable System Integrity Protection (SIP) - already enabled by default
# Check status:
csrutil status

# Enable Gatekeeper
sudo spctl --master-enable

# Enable FileVault (encrypts disk)
# System Settings → Privacy & Security → FileVault → Turn On
```

### 7. **Regular Security Updates**

```bash
# Keep macOS updated
softwareupdate -l

# Keep Node.js updated
npm install -g npm@latest
nvm install --lts  # if using nvm
```

### 8. **Monitor Server Activity**

```bash
# Check server logs regularly
pm2 logs homescorepro --lines 100

# Monitor suspicious activity
tail -f /var/log/system.log | grep homescorepro

# Check for unauthorized access
last | grep homescorepro
```

---

## 🚨 What to Do If Compromised

1. **Immediately stop the server:**
   ```bash
   pm2 stop homescorepro
   ```

2. **Change all passwords:**
   - Server password
   - User account password
   - Any API keys

3. **Check for unauthorized access:**
   ```bash
   # Check recent logins
   last
   
   # Check file modifications
   find /path/to/homescorepro -mtime -1 -ls
   
   # Check network connections
   netstat -an | grep ESTABLISHED
   ```

4. **Review logs:**
   ```bash
   pm2 logs homescorepro --lines 1000 > security-audit.log
   ```

5. **Restore from backup** if available

6. **Reinstall server** with new credentials

---

## ✅ Security Checklist

- [ ] Sandbox middleware implemented ✅
- [ ] Password protection enabled ✅
- [ ] Bot detection active ✅
- [ ] Rate limiting configured ✅
- [ ] Firewall enabled
- [ ] Limited user account created
- [ ] File permissions restricted
- [ ] Project moved out of iCloud Drive
- [ ] Regular backups configured
- [ ] Monitoring/logging enabled
- [ ] HTTPS/SSL enabled (for production)
- [ ] Regular security updates

---

## 📊 Risk Summary

| Risk | Current Mitigation | Additional Recommendation |
|------|-------------------|--------------------------|
| File System Access | ✅ Sandbox middleware | ⚠️ Limited user account |
| iCloud Drive Access | ✅ Path blocking | ⚠️ Move project out of iCloud |
| Network Access | ✅ Rate limiting | ⚠️ Firewall rules |
| System Access | ⚠️ Depends on user | ⚠️ Limited user account |
| Data Theft | ✅ Password protection | ⚠️ Encryption at rest |

---

## 🎯 Best Practices

1. **Never run server as root/admin**
2. **Use limited user account**
3. **Enable firewall**
4. **Keep software updated**
5. **Monitor logs regularly**
6. **Use HTTPS in production**
7. **Regular backups**
8. **Move project out of iCloud Drive**
9. **Restrict file permissions**
10. **Use Cloudflare Tunnel instead of port forwarding**

---

## 📚 Additional Resources

- [OWASP Node.js Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [macOS Security Guide](https://support.apple.com/guide/security/welcome/web)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

