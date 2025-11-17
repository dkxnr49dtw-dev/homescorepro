# Automatic Deployment Setup - GitHub Desktop Guide

This guide uses **GitHub Desktop** (visual interface) instead of command line. Much easier! 🎉

---

## Prerequisites

- **GitHub Desktop** installed (download: https://desktop.github.com/)
- A **GitHub account** (free)
- A **Netlify account** (free)

---

## Step 1: Install GitHub Desktop (if not already installed)

1. **Download GitHub Desktop:**
   - Go to: https://desktop.github.com/
   - Click "Download for macOS"
   - Open the downloaded file
   - Drag GitHub Desktop to your Applications folder

2. **Open GitHub Desktop:**
   - Find it in Applications
   - Double-click to open

3. **Sign in:**
   - Click "Sign in to GitHub.com"
   - Enter your GitHub username and password
   - Authorize GitHub Desktop

---

## Step 2: Create a GitHub Repository

1. **Go to GitHub in your browser:**
   - Navigate to: https://github.com/new

2. **Create the repository:**
   - **Repository name:** `homescorepro`
   - **Description:** (optional) "Property intelligence platform for Melbourne"
   - **Visibility:** Select **Public** (required for free Netlify)
   - **DO NOT** check any boxes (README, .gitignore, license)
   - Click **"Create repository"**

3. **Copy the repository URL:**
   - After creating, you'll see a page with setup instructions
   - Copy the URL (looks like: `https://github.com/YOUR_USERNAME/homescorepro.git`)
   - You'll need this in the next step

---

## Step 3: Add Your Project to GitHub Desktop

1. **In GitHub Desktop, click "File" → "Add Local Repository"**

2. **Browse to your project folder:**
   - Click "Choose..."
   - Navigate to: `/Users/jaeilchoi/Library/Mobile Documents/com~apple~CloudDocs/homescorepro`
   - Click "Open"

3. **If GitHub Desktop says "This directory does not appear to be a Git repository":**
   - Click "create a repository" link
   - **Name:** `homescorepro`
   - **Local path:** Should already be filled in
   - **Git ignore:** Select "None" (you already have a .gitignore)
   - **License:** Select "None"
   - Click **"Create Repository"**

4. **If it says "This directory appears to be a Git repository":**
   - Click "Add Repository"
   - You're all set!

---

## Step 4: Connect to GitHub (if not already connected)

1. **In GitHub Desktop, look at the top:**
   - You should see "Publish repository" button (if not connected)
   - OR you'll see the repository name with a branch selector (if connected)

2. **If you see "Publish repository":**
   - Click it
   - **Name:** `homescorepro` (should match your GitHub repo)
   - **Description:** (optional)
   - **Keep this code private:** UNCHECKED (must be public for free Netlify)
   - Click **"Publish Repository"**

3. **If you need to connect to existing GitHub repo:**
   - Click "Repository" → "Repository Settings"
   - Click "Remote" tab
   - Click "Add" next to "Primary remote"
   - **Name:** `origin`
   - **URL:** Paste your GitHub repository URL (from Step 2)
   - Click "Save"
   - Go back to main window
   - Click "Repository" → "Push" (or use the button at top)

---

## Step 5: Make Your First Commit and Push

1. **Review changes:**
   - In GitHub Desktop, you'll see a list of files on the left
   - These are all the files in your project

2. **Stage all files:**
   - At the bottom left, you'll see checkboxes
   - Click the checkbox at the top to select all files
   - OR manually check the files you want to commit

3. **Write a commit message:**
   - At the bottom left, you'll see a text box
   - Type: `Initial commit - HomeScorePro React app`

4. **Commit:**
   - Click the **"Commit to main"** button at the bottom

5. **Push to GitHub:**
   - After committing, you'll see a button at the top: **"Push origin"**
   - Click it
   - Wait for the upload to complete (may take a few minutes)
   - You'll see a progress bar

6. **Verify on GitHub:**
   - Go to: `https://github.com/YOUR_USERNAME/homescorepro`
   - You should see all your files there!

---

## Step 6: Create Netlify Account (if you don't have one)

1. **Go to Netlify:**
   - Navigate to: https://app.netlify.com/signup

2. **Sign up:**
   - Click **"Sign up with GitHub"** (easiest option)
   - Authorize Netlify to access your GitHub account
   - OR sign up with email if you prefer

3. **Complete the signup process**

---

## Step 7: Connect GitHub Repository to Netlify

1. **In Netlify Dashboard:**
   - After signing in, you'll see your dashboard
   - Click the **"Add new site"** button (usually a big button, top right)

2. **Select "Import an existing project"**

3. **Choose "Deploy with GitHub":**
   - Click the GitHub button/logo
   - You may need to authorize Netlify (if not done already)
   - Click "Authorize Netlify" if prompted

4. **Select your repository:**
   - You'll see a list of your GitHub repositories
   - Find and click on **`homescorepro`**

---

## Step 8: Configure Build Settings

Netlify will show you a configuration screen. Fill it in like this:

1. **Branch to deploy:**
   - Select: **`main`** (should be default)

2. **Base directory:**
   - Click "Show advanced"
   - Enter: **`react-app`**
   - This tells Netlify to run commands from the `react-app` folder

3. **Build command:**
   - Enter: **`npm install && npm run build`**
   - This installs dependencies and builds your React app

4. **Publish directory:**
   - Enter: **`../dist`**
   - ⚠️ **Important:** Include the `../` (this goes up one level from `react-app`)
   - This is where Vite outputs the built files

5. **Click "Deploy site"**

---

## Step 9: Wait for First Deployment

1. **Watch the build:**
   - Netlify will show you a build log
   - You'll see it:
     - Installing dependencies
     - Running the build command
     - Deploying files

2. **Wait 2-5 minutes:**
   - First deployment takes longer
   - You'll see progress in real-time
   - Don't close the tab!

3. **Get your live URL:**
   - Once complete, you'll see: **"Site is live"**
   - Your URL will be something like: `https://random-name-123.netlify.app`
   - **Copy this URL!**

---

## Step 10: Configure SPA Routing (React Router)

1. **In GitHub Desktop:**
   - Make sure you're in your project

2. **Verify the redirects file exists:**
   - The file `react-app/public/_redirects` should already exist
   - If not, create it (see below)

3. **If you need to create it:**
   - In Finder, navigate to: `react-app/public/`
   - Create a new file named: `_redirects` (with underscore, no extension)
   - Open it in a text editor
   - Add this single line:
     ```
     /*    /index.html   200
     ```
   - Save the file

4. **Commit and push the file:**
   - Go back to GitHub Desktop
   - You'll see `_redirects` in the changed files list
   - Check the box next to it
   - Write commit message: `Add Netlify redirects for SPA routing`
   - Click "Commit to main"
   - Click "Push origin"
   - Wait for it to push

5. **Netlify will automatically redeploy:**
   - Go to your Netlify dashboard
   - You'll see a new deployment start automatically
   - Wait for it to complete

---

## Step 11: Test Automatic Deployment

1. **Make a small test change:**
   - Open any file in your project (e.g., `react-app/src/App.jsx`)
   - Add a comment like: `// Test change`
   - Save the file

2. **Commit and push in GitHub Desktop:**
   - Go to GitHub Desktop
   - You'll see your changed file in the list
   - Check the box next to it
   - Write commit message: `Test automatic deployment`
   - Click "Commit to main"
   - Click "Push origin"

3. **Watch Netlify:**
   - Go to your Netlify dashboard
   - You should see a new deployment start automatically!
   - It will say "Triggered by GitHub push"
   - Wait 1-2 minutes for it to complete

4. **Verify the change:**
   - Visit your live site
   - Your change should be there!

---

## Your New Workflow (Super Easy!)

**Every time you make changes:**

1. **Make your code changes** (edit files normally)

2. **Open GitHub Desktop:**
   - You'll see all your changed files listed

3. **Stage files:**
   - Check the boxes next to files you want to commit
   - Or check "All" to commit everything

4. **Write commit message:**
   - Describe what you changed (e.g., "Fixed B-Score calculation")

5. **Click "Commit to main"**

6. **Click "Push origin"**

7. **Netlify automatically deploys!** 🎉
   - No manual steps needed
   - Just wait 1-2 minutes
   - Your site updates automatically

---

## Troubleshooting

### Build Fails in Netlify

1. **Check build logs:**
   - Go to Netlify dashboard
   - Click on your site
   - Click "Deploys" tab
   - Click on the failed deploy
   - Read the error messages

2. **Common fixes:**
   - **Wrong publish directory:** Make sure it's `../dist` (not `dist`)
   - **Base directory:** Make sure it's `react-app`
   - **Node version:** In Netlify, go to Site settings → Build & deploy → Environment → Add variable: `NODE_VERSION` = `18`

### Site Shows 404 Errors

1. **Check redirects file:**
   - Make sure `react-app/public/_redirects` exists
   - Should contain: `/*    /index.html   200`
   - Commit and push it if you just created it

2. **Wait for deployment:**
   - After adding `_redirects`, wait for Netlify to redeploy

### Changes Not Appearing

1. **Check deployment status:**
   - Go to Netlify dashboard
   - Look for green checkmark (Published)
   - If it's still building, wait

2. **Clear browser cache:**
   - Hard refresh: `Cmd + Shift + R` (Mac)

3. **Verify you pushed:**
   - In GitHub Desktop, make sure "Push origin" button is grayed out (means everything is pushed)

---

## Customizing Your Site URL

1. **In Netlify Dashboard:**
   - Click on your site
   - Click "Site settings" (left sidebar)

2. **Go to "Domain management":**
   - Click "Domain management" in left sidebar

3. **Change site name:**
   - Click "Change site name"
   - Enter your preferred name (e.g., `homescorepro`)
   - Your new URL: `https://homescorepro.netlify.app`

4. **Add custom domain (optional):**
   - Click "Add custom domain"
   - Follow instructions to connect your own domain

---

## Quick Reference: GitHub Desktop Buttons

- **"Commit to main"** - Saves your changes locally
- **"Push origin"** - Uploads to GitHub (triggers Netlify)
- **"Pull origin"** - Downloads changes from GitHub
- **"Fetch origin"** - Checks for updates (doesn't download)
- **"Publish branch"** - Creates new branch on GitHub
- **"Sync"** - Pulls and pushes at the same time

---

## Summary

✅ **What you've set up:**
- GitHub repository connected via GitHub Desktop
- Netlify connected to GitHub
- Automatic deployments on every push
- Live site that updates automatically

✅ **Your workflow now:**
1. Make code changes
2. Open GitHub Desktop
3. Commit (with message)
4. Push
5. Netlify automatically deploys!

**No command line needed!** Everything is visual and easy. 🚀

---

## Need Help?

- **GitHub Desktop Help:** https://docs.github.com/en/desktop
- **Netlify Docs:** https://docs.netlify.com/
- **Build failing?** Check the build logs in Netlify dashboard for error messages

