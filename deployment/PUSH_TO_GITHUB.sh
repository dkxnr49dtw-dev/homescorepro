#!/bin/bash
# Quick script to push to GitHub
# Replace YOUR_USERNAME with your actual GitHub username

echo "Enter your GitHub username:"
read GITHUB_USERNAME

echo "Adding remote repository..."
git remote add origin https://github.com/$GITHUB_USERNAME/homescorepro.git

echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Now go to GitHub and enable Pages in Settings."

