# Automatic Deployment Setup - Step-by-Step Guide

This guide will help you set up automatic deployments so that every time you push code to GitHub, Netlify will automatically rebuild and deploy your site.

---

## Prerequisites

- A GitHub account (free)
- A Netlify account (free)
- Git installed on your computer (usually already installed on Mac)

---

## Step 1: Create a GitHub Repository

1. **Go to GitHub:**
   - Open your web browser
   - Navigate to: https://github.com/new

2. **Fill in the repository details:**
   - **Repository name:** `homescorepro` (or any name you prefer)
   - **Description:** (optional) "Property intelligence platform for Melbourne"
   - **Visibility:** Select **Public** (required for free Netlify)
   - **DO NOT** check "Add a README file"
   - **DO NOT** check "Add .gitignore"
   - **DO NOT** check "Choose a license"

3. **Click the green "Create repository" button**

4. **Copy the repository URL:**
   - After creating, GitHub will show you a page with setup instructions
   - You'll see a URL like: `https://github.com/YOUR_USERNAME/homescorepro.git`
   - **Copy this URL** - you'll need it in the next step

---

## Step 2: Initialize Git in Your Project (if not already done)

1. **Open Terminal:**
   - Press `Cmd + Space` to open Spotlight
   - Type "Terminal" and press Enter

2. **Navigate to your project folder:**
   ```bash
   cd "/Users/jaeilchoi/Library/Mobile Documents/com~apple~CloudDocs/homescorepro"
   ```

3. **Check if Git is already initialized:**
   ```bash
   ls -la | grep .git
   ```
   - If you see `.git` folder, skip to Step 3
   - If not, continue below

4. **Initialize Git (if needed):**
   ```bash
   git init
   ```

5. **Set your Git user info (if not already set):**
   ```bash
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   ```

---

## Step 3: Add All Files and Make First Commit

1. **Add all files to Git:**
   ```bash
   git add .
   ```

2. **Make your first commit:**
   ```bash
   git commit -m "Initial commit - HomeScorePro React app"
   ```

3. **Rename branch to main (if needed):**
   ```bash
   git branch -M main
   ```

---

## Step 4: Connect to GitHub Repository

1. **Add GitHub as remote:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/homescorepro.git
   ```
   ⚠️ **Replace `YOUR_USERNAME` with your actual GitHub username!**

2. **Verify the remote was added:**
   ```bash
   git remote -v
   ```
   - You should see your repository URL listed

---

## Step 5: Push Code to GitHub

1. **Push your code:**
   ```bash
   git push -u origin main
   ```

2. **Enter your credentials:**
   - GitHub will ask for your username and password
   - **Note:** If you have 2FA enabled, you'll need to use a Personal Access Token instead of your password
   - To create a token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
   - Give it `repo` permissions

3. **Wait for upload:**
   - This may take a few minutes depending on file size
   - You'll see progress messages

4. **Verify on GitHub:**
   - Go to: `https://github.com/YOUR_USERNAME/homescorepro`
   - You should see all your files there

---

## Step 6: Create Netlify Account (if you don't have one)

1. **Go to Netlify:**
   - Navigate to: https://app.netlify.com/signup

2. **Sign up:**
   - Click "Sign up with GitHub" (easiest option)
   - OR sign up with email

3. **Complete the signup process**

---

## Step 7: Connect GitHub Repository to Netlify

1. **Go to Netlify Dashboard:**
   - After signing in, you'll see your dashboard
   - Click the **"Add new site"** button (usually top right)

2. **Select "Import an existing project"**

3. **Choose "Deploy with GitHub":**
   - Click the GitHub button
   - You may need to authorize Netlify to access your GitHub account
   - Click "Authorize Netlify" if prompted

4. **Select your repository:**
   - You'll see a list of your GitHub repositories
   - Find and click on `homescorepro` (or whatever you named it)

---

## Step 8: Configure Build Settings

Netlify will show you build settings. Configure them as follows:

1. **Branch to deploy:**
   - Select: `main` (should be default)

2. **Base directory:**
   - Enter: `react-app`
   - This tells Netlify to run commands from the `react-app` folder

3. **Build command:**
   - Enter: `npm install && npm run build`
   - This will install dependencies and build the React app

4. **Publish directory:**
   - Enter: `dist`
   - This is where Vite outputs the built files (relative to base directory)
   - Note: Your `vite.config.js` builds to `../dist`, so from `react-app/`, it's `../dist`
   - **Actually enter:** `../dist` (with the `../` to go up one level)

5. **Click "Deploy site"**

---

## Step 9: Wait for First Deployment

1. **Watch the build:**
   - Netlify will show you a build log
   - It will:
     - Install dependencies
     - Run the build command
     - Deploy the files

2. **Wait 2-5 minutes:**
   - First deployment takes longer
   - You'll see progress in real-time

3. **Get your live URL:**
   - Once complete, you'll see: "Site is live"
   - Your URL will be something like: `https://random-name-123.netlify.app`
   - You can customize this later in Site settings

---

## Step 10: Configure Netlify for React Router (SPA)

1. **Go to Site settings:**
   - Click on your site name in Netlify dashboard
   - Click "Site settings" (left sidebar)

2. **Go to Build & deploy:**
   - Click "Build & deploy" in the left sidebar

3. **Edit build settings:**
   - Scroll down to "Build settings"
   - Click "Edit settings"
   - Verify:
     - **Base directory:** `react-app`
     - **Build command:** `npm install && npm run build`
     - **Publish directory:** `../dist` (important: includes `../` to go up one level)

4. **Add redirects file (for React Router):**
   - Create file in your project: `react-app/public/_redirects`
   - Add this content:
     ```
     /*    /index.html   200
     ```
   - This ensures all routes work (SPA routing)
   - Commit and push:
     ```bash
     git add react-app/public/_redirects
     git commit -m "Add Netlify redirects for SPA routing"
     git push
     ```
   - Netlify will automatically use this file on next deployment

---

## Step 11: Test Automatic Deployment

1. **Make a small change:**
   - Edit any file in your project (e.g., add a comment)

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Test automatic deployment"
   git push
   ```

3. **Watch Netlify:**
   - Go to your Netlify dashboard
   - You should see a new deployment start automatically
   - Wait for it to complete (usually 1-2 minutes)

4. **Verify the change:**
   - Visit your live site
   - Your change should be there!

---

## How It Works Now

**Every time you:**
1. Make changes to your code
2. Run: `git add .`
3. Run: `git commit -m "Your message"`
4. Run: `git push`

**Netlify will automatically:**
- Detect the push to GitHub
- Run the build command
- Deploy the new version
- Update your live site

**No more manual drag-and-drop!** 🎉

---

## Troubleshooting

### Build Fails

1. **Check build logs:**
   - Go to Netlify dashboard → Deploys
   - Click on the failed deploy
   - Read the error messages

2. **Common issues:**
   - **Missing dependencies:** Make sure `package.json` is in `react-app/`
   - **Wrong paths:** Verify build command and publish directory
   - **Node version:** Add `NODE_VERSION=18` in Netlify environment variables

### Site Shows 404 Errors

1. **Check redirects file:**
   - Make sure `_redirects` file exists
   - Should contain: `/*    /index.html   200`

2. **Verify publish directory:**
   - Should be `react-app/dist` (or `dist` if base directory is `react-app`)

### Changes Not Appearing

1. **Check deployment status:**
   - Go to Netlify dashboard
   - Look for "Published" status (green checkmark)

2. **Clear browser cache:**
   - Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)

3. **Check build logs:**
   - Make sure the build succeeded
   - Check for any warnings

---

## Customizing Your Site URL

1. **Go to Site settings:**
   - Click your site in Netlify dashboard
   - Click "Site settings"

2. **Go to Domain management:**
   - Click "Domain management" in left sidebar

3. **Change site name:**
   - Click "Change site name"
   - Enter your preferred name
   - Your new URL will be: `https://your-name.netlify.app`

4. **Add custom domain (optional):**
   - Click "Add custom domain"
   - Follow the instructions to connect your own domain

---

## Summary

✅ **What you've set up:**
- GitHub repository for your code
- Netlify connected to GitHub
- Automatic deployments on every push
- Live site that updates automatically

✅ **Your workflow now:**
1. Make code changes
2. `git add .`
3. `git commit -m "Description"`
4. `git push`
5. Netlify automatically deploys!

**No more manual steps needed!** 🚀

