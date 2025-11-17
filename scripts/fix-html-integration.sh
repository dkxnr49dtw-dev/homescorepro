#!/bin/bash

# HomeScorePro - HTML Integration Fix Script
# This script updates all HTML files to properly link new JS and CSS files

echo "🔧 HomeScorePro HTML Integration Fix"
echo "===================================="

# Define the root directory
ROOT_DIR="/Users/jaeilchoi/Desktop/homescorepro"

# Define HTML files to update
HTML_FILES=(
    "index.html"
    "about.html"
    "contact.html"
    "search.html"
    "pricing.html"
    "landing.html"
    "demo.html"
)

# Create backup directory
BACKUP_DIR="$ROOT_DIR/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📁 Creating backups in: $BACKUP_DIR"

# Function to add CSS links after existing styles.css
add_css_links() {
    local file=$1
    
    # Check if modern.css is already linked
    if ! grep -q "modern.css" "$file"; then
        echo "  Adding CSS links to $(basename $file)..."
        
        # Add new CSS files after styles.css
        sed -i.bak '/<link.*styles\.css/a\
    <link rel="stylesheet" href="/css/modern.css">\
    <link rel="stylesheet" href="/css/ui-enhancements.css">
' "$file"
    else
        echo "  CSS already linked in $(basename $file)"
    fi
}

# Function to add JS links before closing body tag
add_js_links() {
    local file=$1
    
    # Check if new JS files are already linked
    if ! grep -q "poc-config.js" "$file"; then
        echo "  Adding JS links to $(basename $file)..."
        
        # Add new JS files before </body>
        sed -i.bak '/<\/body>/i\
    <!-- POC Configuration -->\
    <script src="/js/poc-config.js"></script>\
    \
    <!-- Core Dependencies -->\
    <script src="/js/api.js"></script>\
    <script src="/js/auth.js"></script>\
    \
    <!-- Application Modules -->\
    <script src="/js/scoring-engine.js"></script>\
    <script src="/js/data-visualizer.js"></script>\
    <script src="/js/components.js"></script>\
    \
    <!-- Main Application Controller -->\
    <script src="/js/app.js"></script>\
    \
    <!-- Initialize Application -->\
    <script>\
        // Initialize app if not already done\
        if (window.HomeScoreApp && !window.app) {\
            window.app = new HomeScoreApp();\
            window.app.init();\
        }\
    </script>
' "$file"
    else
        echo "  JS already linked in $(basename $file)"
    fi
}

# Process each HTML file
for html_file in "${HTML_FILES[@]}"; do
    file_path="$ROOT_DIR/$html_file"
    
    if [ -f "$file_path" ]; then
        echo ""
        echo "📄 Processing: $html_file"
        
        # Create backup
        cp "$file_path" "$BACKUP_DIR/$html_file"
        
        # Add CSS links
        add_css_links "$file_path"
        
        # Add JS links
        add_js_links "$file_path"
        
        # Clean up .bak files created by sed
        rm -f "${file_path}.bak"
        
        echo "  ✅ Completed"
    else
        echo "  ⚠️ File not found: $html_file"
    fi
done

echo ""
echo "===================================="
echo "✅ Integration complete!"
echo ""
echo "📋 Next steps:"
echo "1. Open index.html in browser"
echo "2. Open browser console (F12)"
echo "3. Click '🧪 Run Tests' button (bottom right)"
echo "4. Verify all dependencies load correctly"
echo ""
echo "💾 Backups saved to: $BACKUP_DIR"
echo ""
echo "🔄 To restore backups:"
echo "cp $BACKUP_DIR/*.html $ROOT_DIR/"