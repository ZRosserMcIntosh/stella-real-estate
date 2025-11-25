#!/bin/bash

# Script to remove all light mode classes and force dark theme across the codebase
# Run from the project root: ./scripts/remove-light-mode.sh

echo "🌙 Removing light mode classes and forcing dark theme..."

# Function to process a file
process_file() {
    local file=$1
    echo "Processing: $file"
    
    # Common patterns to replace (using perl for in-place editing with regex)
    
    # Text colors: text-slate-900 dark:text-white → text-white
    perl -i -pe 's/text-slate-900 dark:text-white/text-white/g' "$file"
    perl -i -pe 's/text-slate-800 dark:text-white/text-white/g' "$file"
    perl -i -pe 's/text-slate-700 dark:text-slate-200/text-slate-200/g' "$file"
    perl -i -pe 's/text-slate-700 dark:text-slate-300/text-slate-300/g' "$file"
    perl -i -pe 's/text-slate-600 dark:text-slate-300/text-slate-300/g' "$file"
    perl -i -pe 's/text-slate-600 dark:text-slate-400/text-slate-400/g' "$file"
    perl -i -pe 's/text-slate-500 dark:text-slate-400/text-slate-400/g' "$file"
    
    # Backgrounds: bg-white dark:bg-slate-XXX → bg-slate-XXX
    perl -i -pe 's/bg-white dark:bg-slate-900/bg-slate-900/g' "$file"
    perl -i -pe 's/bg-white dark:bg-slate-800/bg-slate-800/g' "$file"
    perl -i -pe 's/bg-white\/\d+ dark:bg-slate-(\d+)\/(\d+)/bg-slate-$1\/$2/g' "$file"
    
    # Borders: border-slate-200 dark:border-slate-700 → border-slate-700
    perl -i -pe 's/border-slate-200 dark:border-slate-700/border-slate-700/g' "$file"
    perl -i -pe 's/border-slate-200 dark:border-slate-800/border-slate-800/g' "$file"
    perl -i -pe 's/border-slate-300 dark:border-slate-600/border-slate-600/g' "$file"
    perl -i -pe 's/border-slate-300 dark:border-slate-700/border-slate-700/g' "$file"
    
    # Gradients: from-white dark:from-slate-900 → from-slate-900
    perl -i -pe 's/from-white dark:from-slate-900/from-slate-900/g' "$file"
    perl -i -pe 's/via-white dark:via-slate-\d+/via-slate-$1/g' "$file"
    perl -i -pe 's/to-white dark:to-slate-900/to-slate-900/g' "$file"
    
    # Hover states
    perl -i -pe 's/hover:bg-slate-100 dark:hover:bg-white\/10/hover:bg-white\/10/g' "$file"
    perl -i -pe 's/hover:text-brand-600 dark:hover:text-brand-400/hover:text-brand-400/g' "$file"
    
    # Brand colors
    perl -i -pe 's/text-brand-600 dark:text-brand-400/text-brand-400/g' "$file"
    perl -i -pe 's/bg-slate-900 dark:bg-white/bg-white/g' "$file"
    perl -i -pe 's/text-white dark:text-slate-900/text-slate-900/g' "$file"
}

# Find and process all component files
echo ""
echo "📁 Processing TypeScript/TSX files in src/..."
find src -name "*.tsx" -o -name "*.ts" | while read file; do
    if [ "$file" != "src/App.tsx" ]; then  # Skip App.tsx as it's already done
        process_file "$file"
    fi
done

echo ""
echo "✅ Light mode removal complete!"
echo ""
echo "Next steps:"
echo "1. Review the changes with: git diff"
echo "2. Test the application thoroughly"
echo "3. Build and deploy: npm run build"
echo ""
echo "Note: You may need to manually review some complex conditional classes."
