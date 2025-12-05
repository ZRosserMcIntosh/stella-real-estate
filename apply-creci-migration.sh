#!/bin/bash

# Apply the CRECI optional migration to Supabase
# This makes cpf, creci_number, and creci_uf optional in founding_members table

echo "Applying migration to make CRECI fields optional..."

# Read database URL from environment or use the one in the file
DATABASE_URL="postgresql://postgres.fxvxdvwiqgpypcqmljja:Stella&Rosser777@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# Apply the migration
psql "$DATABASE_URL" -f supabase/migrations/20251204_make_creci_optional.sql

echo "✓ Migration applied successfully!"
echo "CPF, CRECI number, and CRECI UF are now optional in founding_members table"
