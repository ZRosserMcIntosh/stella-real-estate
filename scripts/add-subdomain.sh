#!/bin/bash

# Subdomain Setup Helper Script
# Usage: ./scripts/add-subdomain.sh <subdomain-name> <route-path> <page-title>

set -e

SUBDOMAIN=$1
ROUTE=$2
TITLE=$3

if [ -z "$SUBDOMAIN" ] || [ -z "$ROUTE" ] || [ -z "$TITLE" ]; then
  echo "❌ Error: Missing required arguments"
  echo ""
  echo "Usage: ./scripts/add-subdomain.sh <subdomain-name> <route-path> <page-title>"
  echo ""
  echo "Example:"
  echo "  ./scripts/add-subdomain.sh invest investidores 'Stella Investors'"
  echo ""
  exit 1
fi

echo "🚀 Setting up subdomain: $SUBDOMAIN"
echo "   Route: /$ROUTE"
echo "   Title: $TITLE"
echo ""

# 1. Add to subdomain routes (manual step - inform user)
echo "📝 Manual Steps Required:"
echo ""
echo "1. Add this configuration to src/utils/subdomain.ts in the SUBDOMAIN_ROUTES array:"
echo ""
echo "  {"
echo "    subdomain: '$SUBDOMAIN',"
echo "    route: '/$ROUTE',"
echo "    title: '$TITLE',"
echo "    description: '$TITLE subdomain'"
echo "  },"
echo ""

# 2. Inform about Vercel domain setup
echo "2. In Vercel Dashboard:"
echo "   - Go to your project settings"
echo "   - Navigate to 'Domains'"
echo "   - Add: $SUBDOMAIN.stella-real-estate.vercel.app"
echo ""

# 3. Test URL
echo "3. Test your subdomain:"
echo "   https://$SUBDOMAIN.stella-real-estate.vercel.app"
echo ""

echo "✅ Setup guide complete!"
echo ""
echo "📚 For more details, see: docs/SUBDOMAIN_SETUP.md"
