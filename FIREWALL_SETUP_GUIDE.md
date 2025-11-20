# macOS Firewall Setup - Complete Step-by-Step Guide

**Last Updated:** 2025-11-20  
**Purpose:** Granular, detailed instructions for enabling and configuring macOS Firewall

---

## 📋 Prerequisites

- macOS Ventura (13.0) or later (or macOS Monterey 12.0+ with slightly different UI)
- Administrator password
- 5-10 minutes

---

## 🎯 Step 1: Open System Settings

### Method A: From Apple Menu
1. **Click the Apple logo** (🍎) in the top-left corner of your screen
2. **Click "System Settings"** (or "System Preferences" on older macOS)

### Method B: From Spotlight
1. **Press `Command + Space`** (⌘ + Space) to open Spotlight
2. **Type:** `System Settings`
3. **Press Enter** or click on "System Settings"

### Method C: From Dock
1. **Click the System Settings icon** in your Dock (gear icon)
   - If not in Dock, use Method A or B

---

## 🔍 Step 2: Navigate to Network Settings

1. **In the left sidebar**, scroll down and find **"Network"**
   - It has a globe/network icon (🌐)
   - Located in the "Internet Accounts" section

2. **Click on "Network"**
   - The right panel will show network settings

3. **Scroll down** in the right panel to find **"Firewall"**
   - It's near the bottom of the network settings
   - You'll see a toggle switch that says "Firewall: Off" (or "On" if already enabled)

---

## 🔥 Step 3: Enable the Firewall

1. **Locate the "Firewall" toggle switch**
   - It's a large toggle button
   - Currently shows "Off" (gray/white)

2. **Click the toggle switch** to turn it ON
   - The switch will turn blue/green
   - Text will change to "Firewall: On"

3. **Wait 1-2 seconds** for macOS to enable it
   - You may see a brief loading indicator

4. **Verify it's ON:**
   - The toggle should be blue/green
   - Text should say "Firewall: On"

---

## ⚙️ Step 4: Configure Firewall Options

1. **Click the "Options..." button** (or "Firewall Options...")
   - Located right below or next to the Firewall toggle
   - Button text: "Options..." or "Firewall Options..."

2. **A new window/dialog will open** titled "Firewall Options"
   - This is where you configure detailed settings

---

## 🎛️ Step 5: Configure Firewall Settings

In the "Firewall Options" window, you'll see several checkboxes and settings:

### Setting 1: Block All Incoming Connections

**Location:** Top checkbox in the options window

**What it says:**
- ☐ "Block all incoming connections"
- Description: "Blocks all incoming connections except those required for basic internet services, such as DHCP, Bonjour, and IPSec."

**What to do:**
- **Leave this UNCHECKED** (recommended for normal use)
- Only check this if you want maximum security and don't need any apps to accept incoming connections
- For your server, you need this UNCHECKED so Node.js can accept connections

**Visual:**
```
☐ Block all incoming connections
  Blocks all incoming connections except those required for basic 
  internet services, such as DHCP, Bonjour, and IPSec.
```

---

### Setting 2: Automatically Allow Signed Software

**Location:** Second checkbox

**What it says:**
- ☑ "Automatically allow built-in software to receive incoming connections"
- ☑ "Automatically allow downloaded signed software to receive incoming connections"

**What to do:**
- **Keep both CHECKED** (recommended)
- This allows trusted apps to work automatically
- Reduces popup prompts
- Still secure because it only allows signed/trusted software

**Visual:**
```
☑ Automatically allow built-in software to receive incoming connections
☑ Automatically allow downloaded signed software to receive incoming connections
```

---

### Setting 3: Enable Stealth Mode

**Location:** Third checkbox

**What it says:**
- ☐ "Enable stealth mode"
- Description: "Don't respond to or acknowledge attempts to access this computer from the network by test applications using ICMP, such as Ping."

**What to do:**
- **CHECK this box** (recommended for extra security)
- Makes your Mac invisible to network scans
- Hackers can't "ping" your Mac to see if it exists
- Doesn't affect normal usage

**Visual:**
```
☐ Enable stealth mode
  Don't respond to or acknowledge attempts to access this computer 
  from the network by test applications using ICMP, such as Ping.
```

---

### Setting 4: List of Allowed Apps

**Location:** Below the checkboxes, you'll see a list

**What it shows:**
- A list of apps that are allowed/blocked
- Each app has a toggle switch
- Shows "Allow incoming connections" or "Block incoming connections"

**What to do:**
- **Scroll through the list** to see what's there
- Most apps will already be set to "Allow"
- You'll add Node.js here in the next step

**Visual:**
```
Allowed Apps:
┌─────────────────────────────────────────────────┐
│ Safari                    [Allow] [Block]       │
│ Mail                      [Allow] [Block]       │
│ Messages                  [Allow] [Block]       │
│ ... (more apps)                                 │
└─────────────────────────────────────────────────┘
```

---

## ➕ Step 6: Add Node.js to Allowed Apps

### Option A: Add When Prompted (Easiest)

1. **Close the Firewall Options window** (click "OK" or the red X)
2. **Start your server** (if not already running):
   ```bash
   pm2 start ecosystem.config.js
   ```
3. **macOS will show a popup** asking:
   - "Do you want the application 'node' to accept incoming network connections?"
   - Options: "Allow" or "Deny"
4. **Click "Allow"**
   - Node.js will be added automatically
   - You won't be asked again

### Option B: Add Manually

1. **In the Firewall Options window**, click the **"+" button** (plus sign)
   - Located below the app list
   - Button text: "+" or "Add Application..."

2. **A file browser window will open**

3. **Navigate to Node.js:**
   - Press `Command + Shift + G` (⌘ + Shift + G) to go to a specific folder
   - Type: `/usr/local/bin` (or `/opt/homebrew/bin` on Apple Silicon)
   - Press Enter
   - Look for `node` file
   - **OR** search for "node" in the file browser

4. **Select the `node` file** and click "Open"
   - Node.js will be added to the list
   - Set it to "Allow incoming connections"

5. **If you use PM2**, also add it:
   - Click "+" again
   - Navigate to: `/usr/local/bin/pm2` (or wherever PM2 is installed)
   - Add it and set to "Allow"

---

## ✅ Step 7: Verify Configuration

1. **Check the app list** in Firewall Options:
   - Node.js should appear in the list
   - It should be set to "Allow incoming connections"
   - Toggle should be on the "Allow" side

2. **Verify your settings:**
   - ☐ Block all incoming connections: **UNCHECKED**
   - ☑ Automatically allow signed software: **CHECKED**
   - ☑ Enable stealth mode: **CHECKED** (recommended)
   - Node.js: **ALLOW**

3. **Click "OK"** to save and close the options window

---

## 🧪 Step 8: Test the Firewall

1. **Make sure your server is running:**
   ```bash
   pm2 status
   ```

2. **Try accessing your site:**
   - Open a browser
   - Go to: `http://localhost:3000`
   - Should work normally

3. **Check firewall is active:**
   - Go back to System Settings → Network → Firewall
   - Should still show "Firewall: On"

---

## 🔧 Step 9: Advanced Configuration (Optional)

### View Firewall Logs

1. **Open Console app** (Applications → Utilities → Console)
2. **In the search box**, type: `firewall`
3. **View firewall activity** in real-time

### Reset Firewall Settings

If something goes wrong:

1. **Open Terminal**
2. **Run:**
   ```bash
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
   ```
3. **Reconfigure** using steps above

---

## 📸 Visual Reference (What You'll See)

### System Settings → Network
```
┌─────────────────────────────────────────┐
│ System Settings                         │
├─────────────────────────────────────────┤
│ [Sidebar]          [Main Panel]         │
│                                        │
│ General            Network Settings     │
│ Appearance         ┌─────────────────┐ │
│ Accessibility      │ WiFi: Connected │ │
│ Control Center     │ Ethernet: ...    │ │
│ Desktop & Dock     │ ...              │ │
│ ...                │                  │ │
│ Network     ←───   │ Firewall: Off    │ │
│ Notifications      │ [Toggle Switch]  │ │
│ ...                │ [Options...]     │ │
│                    └─────────────────┘ │
└─────────────────────────────────────────┘
```

### Firewall Options Window
```
┌─────────────────────────────────────────────┐
│ Firewall Options                            │
├─────────────────────────────────────────────┤
│                                             │
│ ☐ Block all incoming connections            │
│                                             │
│ ☑ Automatically allow built-in software     │
│ ☑ Automatically allow signed software       │
│                                             │
│ ☑ Enable stealth mode                       │
│                                             │
│ Allowed Apps:                               │
│ ┌─────────────────────────────────────┐   │
│ │ Safari          [Allow] [Block]     │   │
│ │ Mail            [Allow] [Block]     │   │
│ │ node            [Allow] [Block]     │   │
│ │ ...                                 │   │
│ └─────────────────────────────────────┘   │
│                                             │
│                    [+ Add]  [OK]  [Cancel] │
└─────────────────────────────────────────────┘
```

---

## ⚠️ Troubleshooting

### Problem: Can't find Firewall option

**Solution:**
- Make sure you're in **System Settings → Network** (not Wi-Fi or other network sub-sections)
- Scroll down in the right panel
- On older macOS, it might be in **Security & Privacy → Firewall**

### Problem: Toggle is grayed out (can't click)

**Solution:**
- Click the **lock icon** (🔒) in the bottom-left corner
- Enter your administrator password
- Try again

### Problem: Node.js not in the list

**Solution:**
- Use **Option A** (add when prompted) - start your server and macOS will ask
- Or manually add using the "+" button
- Make sure you're adding the correct `node` binary

### Problem: Server won't accept connections

**Solution:**
1. Check Node.js is set to "Allow" in firewall options
2. Make sure "Block all incoming connections" is UNCHECKED
3. Restart your server: `pm2 restart homescorepro`
4. Check firewall logs in Console app

### Problem: Too many popups

**Solution:**
- Make sure "Automatically allow signed software" is CHECKED
- This reduces prompts for trusted apps

---

## ✅ Final Checklist

After setup, verify:

- [ ] Firewall is ON (toggle is blue/green)
- [ ] "Block all incoming connections" is UNCHECKED
- [ ] "Automatically allow signed software" is CHECKED
- [ ] "Enable stealth mode" is CHECKED (optional but recommended)
- [ ] Node.js is in the allowed apps list
- [ ] Node.js is set to "Allow incoming connections"
- [ ] Server is running and accessible
- [ ] No unwanted connection attempts are getting through

---

## 🎯 Quick Reference Commands

### Check Firewall Status (Terminal)
```bash
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
```

### Enable Firewall (Terminal)
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
```

### Disable Firewall (Terminal)
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
```

### List Allowed Apps (Terminal)
```bash
/usr/libexec/ApplicationFirewall/socketfilterfw --listapps
```

---

## 📚 Additional Resources

- [Apple Support: Use the Application Firewall](https://support.apple.com/guide/mac-help/use-the-application-firewall-mh11783/mac)
- [macOS Security Guide](https://support.apple.com/guide/security/welcome/web)

---

## 🎉 You're Done!

Your macOS Firewall is now configured and protecting your Mac while allowing your server to work normally.

**Remember:**
- The firewall protects you from unwanted incoming connections
- Your normal Mac usage is unaffected
- Your server can still accept connections (because Node.js is allowed)
- You're now more secure! 🛡️

