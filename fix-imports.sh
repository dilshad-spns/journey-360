#!/bin/bash

# Journey 360 - Fix Versioned Imports Script
# This script removes version numbers from all import statements

echo "🔧 Fixing versioned imports in Journey 360..."
echo ""

# Function to fix imports in a file
fix_file() {
    local file=$1
    echo "Processing: $file"
    
    # Fix @radix-ui imports
    sed -i.bak 's/@radix-ui\/react-[a-z-]*@[0-9.]*/@radix-ui\/react-\1/g' "$file"
    
    # More specific fixes for common patterns
    sed -i.bak 's/@radix-ui\/react-accordion@[0-9.]*/@radix-ui\/react-accordion/g' "$file"
    sed -i.bak 's/@radix-ui\/react-alert-dialog@[0-9.]*/@radix-ui\/react-alert-dialog/g' "$file"
    sed -i.bak 's/@radix-ui\/react-aspect-ratio@[0-9.]*/@radix-ui\/react-aspect-ratio/g' "$file"
    sed -i.bak 's/@radix-ui\/react-avatar@[0-9.]*/@radix-ui\/react-avatar/g' "$file"
    sed -i.bak 's/@radix-ui\/react-checkbox@[0-9.]*/@radix-ui\/react-checkbox/g' "$file"
    sed -i.bak 's/@radix-ui\/react-collapsible@[0-9.]*/@radix-ui\/react-collapsible/g' "$file"
    sed -i.bak 's/@radix-ui\/react-context-menu@[0-9.]*/@radix-ui\/react-context-menu/g' "$file"
    sed -i.bak 's/@radix-ui\/react-dialog@[0-9.]*/@radix-ui\/react-dialog/g' "$file"
    sed -i.bak 's/@radix-ui\/react-dropdown-menu@[0-9.]*/@radix-ui\/react-dropdown-menu/g' "$file"
    sed -i.bak 's/@radix-ui\/react-hover-card@[0-9.]*/@radix-ui\/react-hover-card/g' "$file"
    sed -i.bak 's/@radix-ui\/react-label@[0-9.]*/@radix-ui\/react-label/g' "$file"
    sed -i.bak 's/@radix-ui\/react-menubar@[0-9.]*/@radix-ui\/react-menubar/g' "$file"
    sed -i.bak 's/@radix-ui\/react-navigation-menu@[0-9.]*/@radix-ui\/react-navigation-menu/g' "$file"
    sed -i.bak 's/@radix-ui\/react-popover@[0-9.]*/@radix-ui\/react-popover/g' "$file"
    sed -i.bak 's/@radix-ui\/react-progress@[0-9.]*/@radix-ui\/react-progress/g' "$file"
    sed -i.bak 's/@radix-ui\/react-radio-group@[0-9.]*/@radix-ui\/react-radio-group/g' "$file"
    sed -i.bak 's/@radix-ui\/react-scroll-area@[0-9.]*/@radix-ui\/react-scroll-area/g' "$file"
    sed -i.bak 's/@radix-ui\/react-select@[0-9.]*/@radix-ui\/react-select/g' "$file"
    sed -i.bak 's/@radix-ui\/react-separator@[0-9.]*/@radix-ui\/react-separator/g' "$file"
    sed -i.bak 's/@radix-ui\/react-slider@[0-9.]*/@radix-ui\/react-slider/g' "$file"
    sed -i.bak 's/@radix-ui\/react-slot@[0-9.]*/@radix-ui\/react-slot/g' "$file"
    sed -i.bak 's/@radix-ui\/react-switch@[0-9.]*/@radix-ui\/react-switch/g' "$file"
    sed -i.bak 's/@radix-ui\/react-tabs@[0-9.]*/@radix-ui\/react-tabs/g' "$file"
    sed -i.bak 's/@radix-ui\/react-toggle@[0-9.]*/@radix-ui\/react-toggle/g' "$file"
    sed -i.bak 's/@radix-ui\/react-toggle-group@[0-9.]*/@radix-ui\/react-toggle-group/g' "$file"
    sed -i.bak 's/@radix-ui\/react-tooltip@[0-9.]*/@radix-ui\/react-tooltip/g' "$file"
    
    # Fix lucide-react imports
    sed -i.bak 's/lucide-react@[0-9.]*"/lucide-react"/g' "$file"
    
    # Fix class-variance-authority imports
    sed -i.bak 's/class-variance-authority@[0-9.]*"/class-variance-authority"/g' "$file"
    
    # Fix other library imports
    sed -i.bak 's/react-day-picker@[0-9.]*"/react-day-picker"/g' "$file"
    sed -i.bak 's/embla-carousel-react@[0-9.]*"/embla-carousel-react"/g' "$file"
    sed -i.bak 's/recharts@[0-9.]*"/recharts"/g' "$file"
    sed -i.bak 's/cmdk@[0-9.]*"/cmdk"/g' "$file"
    sed -i.bak 's/vaul@[0-9.]*"/vaul"/g' "$file"
    sed -i.bak 's/input-otp@[0-9.]*"/input-otp"/g' "$file"
    sed -i.bak 's/react-resizable-panels@[0-9.]*"/react-resizable-panels"/g' "$file"
    sed -i.bak 's/next-themes@[0-9.]*"/next-themes"/g' "$file"
    sed -i.bak 's/sonner@[0-9.]*"/sonner"/g' "$file"
    sed -i.bak 's/react-hook-form@[0-9.]*"/react-hook-form"/g' "$file"
    
    # Remove backup file
    rm -f "$file.bak"
}

# Find and fix all TypeScript/TSX files
find ./components -name "*.tsx" -o -name "*.ts" | while read file; do
    fix_file "$file"
done

find ./app -name "*.tsx" -o -name "*.ts" | while read file; do
    fix_file "$file"
done

echo ""
echo "✅ Import fixes complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run dev"
echo "3. Check for any remaining errors"
