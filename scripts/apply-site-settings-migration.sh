#!/bin/bash

# Apply site_settings migration to Supabase
# This creates the site_settings and site_settings_history tables

echo "🔄 Applying site_settings migration to Supabase..."
echo ""

# Database connection string
DB_URL="postgresql://postgres.fxvxdvwiqgpypcqmljja:Stella%26Rosser777@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"

# Migration file
MIGRATION_FILE="supabase/migrations/20241203_create_site_settings_table.sql"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql (PostgreSQL client) is not installed"
    echo ""
    echo "Install options:"
    echo "  macOS: brew install postgresql"
    echo "  Or manually run the SQL in Supabase Dashboard SQL Editor"
    echo ""
    echo "SQL file location: $MIGRATION_FILE"
    exit 1
fi

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found: $MIGRATION_FILE"
    exit 1
fi

# Run the migration
echo "Running migration: $MIGRATION_FILE"
echo ""

psql "$DB_URL" -f "$MIGRATION_FILE"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ Migration applied successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Go to https://www.stellareal.com.br/admin/site-admin in Chrome"
    echo "  2. Select your 3 featured listings"
    echo "  3. Click 'Save Settings'"
    echo "  4. Open Safari/Firefox - featured listings will now appear!"
else
    echo ""
    echo "❌ Migration failed with exit code $EXIT_CODE"
    echo ""
    echo "Alternative: Run the migration manually in Supabase Dashboard"
    echo "  1. Go to https://supabase.com/dashboard"
    echo "  2. Select your project"
    echo "  3. Click 'SQL Editor'"
    echo "  4. Copy/paste the contents of: $MIGRATION_FILE"
    echo "  5. Click 'Run'"
fi

exit $EXIT_CODE
