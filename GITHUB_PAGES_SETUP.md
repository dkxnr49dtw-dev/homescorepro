# GitHub Pages Setup - Quick Steps

## Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `homescorepro` (or any name you want)
3. Make it **Public** (required for free GitHub Pages)
4. **Don't** initialize with README
5. Click **Create repository**

---

## Step 2: Push Your Code to GitHub

Run these commands in your terminal (from the homescorepro folder):

```bash
cd /Users/jaeilchoi/Desktop/homescorepro

# Add all files
git add .

# Commit
git commit -m "Initial commit - HomeScorePro website"

# Add your GitHub repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/homescorepro.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** You'll need to enter your GitHub username and password (or use a personal access token).

---

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

---

## Step 4: Get Your Live URL

After a few minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/homescorepro/
```

**That's it!** Share this URL with your friend.

---

## To Update Your Site

Whenever you make changes:

```bash
git add .
git commit -m "Update description"
git push
```

GitHub Pages will automatically update in 1-2 minutes.

---

## Troubleshooting

- **Site not loading?** Wait 2-3 minutes after enabling Pages
- **404 errors?** Make sure you selected `/ (root)` folder in Pages settings
- **Need to change URL?** You can rename the repository (Settings → General → Repository name)

