# Invitation Code System

## Overview
The Stella Real Estate platform now uses a secure 2-step registration process with invitation codes for new team members. This ensures only authorized personnel can create accounts.

## Invitation Code Format
- **Format**: `XXXX-XXXX-XXXX-XXXX` (16 digits)
- **Example**: `1234-5678-9012-3456`
- Auto-formatted as user types
- Expires after 30 days by default

## How It Works

### 1. Admin Creates Invitation (admin/team)
1. Navigate to **Admin Dashboard** → **Team**
2. Click **Add Person** button
3. Fill in team member details (name, email, role, department)
4. On the Review step (Step 3), check **"Gerar Código de Convite"**
5. Click **Create**
6. Copy the generated 16-digit invitation code
7. Send the code to the new team member via secure communication

### 2. New Member Registration (/login)
**Step 1: Verification**
1. New member visits `/login`
2. Clicks on **"CADASTRAR"** tab
3. Enters their **email address** (must match the email from invitation)
4. Enters the **16-digit invitation code**
5. System validates:
   - Code exists and is valid (not expired, not used)
   - Email matches the invitation
   - Code hasn't been used before
6. If valid, proceeds to Step 2

**Step 2: Password Creation**
1. Welcome message displays with their name
2. Creates a **password**
3. **Confirms password**
4. Submits to create account
5. Account is created with pre-assigned role and department
6. Invitation code is marked as "used"
7. User is redirected to their dashboard

## Database Structure

### invitation_codes Table
```sql
- id: uuid (primary key)
- code: text (XXXX-XXXX-XXXX-XXXX format, unique)
- email: text (email this code is assigned to)
- full_name: text (name of invitee)
- role: text (owner/admin/exec/manager/agent/ops/marketing/legal/accounting/contractor/viewer)
- department: text
- status: text (pending/used/expired/cancelled)
- created_by: uuid (admin who created it)
- created_at: timestamp
- expires_at: timestamp (default: 30 days)
- used_at: timestamp
- used_by: uuid (user who used it)
```

## Security Features

### Code Validation
- ✅ Must be exactly 16 digits
- ✅ Must match email address
- ✅ Cannot be used twice
- ✅ Expires after 30 days
- ✅ Can only be validated by matching email
- ✅ Status tracked (pending/used/expired/cancelled)

### Access Control
- Only admins (owner/admin/exec) can:
  - View invitation codes
  - Create new invitation codes
  - Manage invitation codes
- RLS policies enforce these restrictions

## Database Functions

### generate_invitation_code()
```sql
-- Generates a unique 16-digit code in XXXX-XXXX-XXXX-XXXX format
-- Automatically ensures uniqueness by checking existing codes
```

### validate_invitation_code(p_code, p_email)
```sql
-- Validates if code is:
-- - Valid format
-- - Not expired
-- - Status = 'pending'
-- - Email matches
-- Returns: {valid: boolean, error?: string, ...invitation_details}
```

### use_invitation_code(p_code, p_user_id)
```sql
-- Marks code as 'used' after successful registration
-- Records used_at timestamp and used_by user_id
```

## UI/UX Features

### Login Page (/login)
- **Step Indicator**: Visual progress (2 dots showing current step)
- **Auto-formatting**: Invitation code auto-formats with dashes as user types
- **Validation**: Real-time validation before proceeding to step 2
- **Back Button**: Users can go back to step 1 to change email/code
- **Welcome Message**: Personalized greeting on step 2 with user's name
- **Error Handling**: Clear error messages for invalid/expired codes

### Admin Team Page (admin/team → Add Person)
- **Checkbox Option**: "Gerar Código de Convite" on review step
- **Code Display**: Shows generated code after creation
- **Copy Button**: One-click copy to clipboard
- **Instructions**: Clear guidance on sending code to new member
- **Email Context**: Shows which email the code is for

## Best Practices

### For Admins
1. ✅ Generate codes immediately when adding new team members
2. ✅ Send codes via secure communication (not public email)
3. ✅ Verify email address is correct before generating
4. ✅ Keep track of sent invitations
5. ✅ Check expiration dates (30 days)
6. ⚠️ Don't share codes publicly
7. ⚠️ Regenerate if code is compromised

### For New Members
1. ✅ Use the exact email address the admin provided
2. ✅ Enter all 16 digits (auto-formats with dashes)
3. ✅ Register within 30 days
4. ✅ Create a strong password
5. ⚠️ Don't share your invitation code
6. ⚠️ Contact admin if code doesn't work

## Troubleshooting

### "Invalid or expired invitation code"
- ✅ Check email matches exactly (case-insensitive)
- ✅ Verify all 16 digits are correct
- ✅ Confirm code hasn't expired (30 days)
- ✅ Ensure code hasn't been used already
- 🔧 Request a new code from admin if needed

### "Code doesn't work"
- 🔍 Check for typos in email or code
- 🔍 Verify code format: XXXX-XXXX-XXXX-XXXX
- 🔍 Try refreshing the page
- 💬 Contact your admin for verification

### Cannot generate invitation code
- 🔐 Verify you have admin/owner/exec permissions
- 🔍 Check Supabase connection
- 🔍 Verify database migration applied
- 💬 Contact system administrator

## Migration

### Applied: `20251116000000_invitation_codes.sql`
- Creates `invitation_codes` table
- Adds RLS policies
- Creates helper functions
- Adds indexes for performance

### To apply:
```bash
npx supabase db push
```

## Future Enhancements

### Potential Features
- [ ] Email notifications with invitation codes
- [ ] Bulk invitation generation
- [ ] Custom expiration dates
- [ ] Invitation code analytics
- [ ] Resend invitation option
- [ ] Admin dashboard for invitation management
- [ ] SMS delivery option
- [ ] QR code generation for invitations

## Related Files

### Frontend
- `src/pages/Login.tsx` - 2-step registration UI
- `src/pages/admin/team/AddPersonModal.tsx` - Invitation generation UI

### Backend
- `supabase/migrations/20251116000000_invitation_codes.sql` - Database schema
- Database functions: `generate_invitation_code`, `validate_invitation_code`, `use_invitation_code`

### Documentation
- This file: `docs/INVITATION_CODE_SYSTEM.md`

## Support

For questions or issues:
1. Check this documentation
2. Review error messages carefully
3. Verify permissions and configuration
4. Contact system administrator if problem persists
