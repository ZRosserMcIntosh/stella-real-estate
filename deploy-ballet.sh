#!/bin/bash
# Ballet Task Manager - Quick Deployment Script

echo "🩰 Ballet Task Manager - Database Setup"
echo "========================================"
echo ""

# Check if Supabase is configured
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "⚠️  Warning: Supabase environment variables not set"
  echo "   Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are in your .env.local"
  echo ""
fi

echo "📋 Deployment Steps:"
echo ""
echo "1. Apply Database Migration"
echo "   Option A: Using Supabase CLI"
echo "   $ supabase db push"
echo ""
echo "   Option B: Manual in Supabase Dashboard"
echo "   - Go to https://app.supabase.com"
echo "   - Select your project"
echo "   - Go to SQL Editor"
echo "   - Create new query"
echo "   - Copy/paste contents of:"
echo "     supabase/migrations/20250105000000_ballet_project_management.sql"
echo "   - Click 'Run'"
echo ""

echo "2. Generate Prisma Client (Optional)"
echo "   $ npx prisma generate"
echo ""

echo "3. Test the Application"
echo "   $ npm run dev"
echo "   Navigate to: http://localhost:5173/admin/ballet"
echo ""

echo "✅ Features Included:"
echo "   • Real user authentication"
echo "   • Workspace & project management"
echo "   • Task creation & assignment"
echo "   • Comments with @mentions"
echo "   • Real-time updates"
echo "   • Row Level Security (RLS)"
echo "   • Activity tracking"
echo ""

read -p "Press Enter to continue..."
