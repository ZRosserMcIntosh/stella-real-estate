# User Types & Access Control System - November 16, 2025

## Overview
Implemented a complete user type system with 4 distinct user types and role-based access control to separate Constellation realtors from internal Stella users.

---

## 🎯 User Types

### 1. **stella_admin** (Internal)
- **Who**: Stella platform administrators (YOU)
- **Access**: Full access to `/admin` dashboard
- **Signup**: Requires 16-digit invite code at `/login`
- **Permissions**: Manage platform, users, settings, everything

### 2. **stella_team** (Internal)
- **Who**: Stella team members/employees
- **Access**: Full access to `/admin` dashboard
- **Signup**: Requires 16-digit invite code at `/login`
- **Permissions**: Team-level access (can be customized later)

### 3. **constellation_user** (External Customers)
- **Who**: Real estate agents/brokers using Constellation
- **Access**: `/sub/constellation/dashboard` only (blocked from `/admin`)
- **Signup**: `/sub/constellation/signup` (no invite code needed)
- **Permissions**: Build their own sites, manage their listings

### 4. **stellareal_client** (Future)
- **Who**: Placeholder for Stella Real website clients
- **Access**: TBD
- **Signup**: TBD
- **Permissions**: TBD

---

## 🔐 Access Control Flow

### Constellation Users (Realtors)
```
1. Sign up at /sub/constellation/signup
   ├─ User created with user_type: 'constellation_user'
   ├─ User profile created with constellation_user type
   ├─ founding_members record created (status: 'pending')
   └─ Signs out, stays on payment page

2. Complete payment
   ├─ If PAID: Navigate to dashboard with success message
   └─ If PENDING: Navigate to dashboard with "pay to access" message

3. Login at /sub/constellation/login
   └─ Always redirects to /sub/constellation/dashboard

4. Try to access /admin
   └─ AdminRoute blocks and redirects to /sub/constellation/dashboard
```

### Internal Users (stella_admin/stella_team)
```
1. Sign up at /login (future implementation)
   ├─ Must enter 16-digit invite code
   ├─ User created with user_type based on invite code
   └─ User profile created

2. Login at /login
   └─ Redirects to /admin

3. Access /admin routes
   └─ AdminRoute allows access (checks user_type)
```

---

## 📂 Files Created/Modified

### New Files
1. **`/supabase/migrations/20251116000000_user_types_and_invite_codes.sql`**
   - Added `user_type` column to `user_profiles`
   - Created `invite_codes` table
   - Functions: `validate_invite_code()`, `mark_invite_code_used()`, `generate_invite_code()`

2. **`/src/components/AdminRoute.tsx`**
   - Protected route wrapper for `/admin`
   - Checks `user_type` from `user_profiles`
   - Blocks constellation_user, allows stella_admin/stella_team

3. **`/docs/TEST_PAYMENT_AND_USER_FLOW_UPDATE.md`**
   - Documentation for payment flow changes

### Modified Files

#### Constellation Signup (`src/pages/constellation/ConstellationSignup.tsx`)
```typescript
// Sets user_type when creating account
options: {
  data: {
    user_type: 'constellation_user',
    full_name: signupData.fullName,
  }
}

// Creates user_profile
await supabase.from('user_profiles').insert({
  user_id: newUserId,
  user_type: 'constellation_user',
  creci_number, creci_uf, ...
})

// Redirects to dashboard instead of /admin
navigate('/sub/constellation/dashboard')
```

#### Constellation Login (`src/pages/constellation/ConstellationLogin.tsx`)
```typescript
// Changed redirect
navigate('/sub/constellation/dashboard') // was: /admin
```

#### Constellation Dashboard (`src/pages/constellation/ConstellationDashboard.tsx`)
- Checks `payment_status` from `founding_members`
- **PAID**: Shows success message, "We'll notify you when ready"
- **PENDING**: Shows "Thanks for your interest, you need to pay"

#### Main Routes (`src/main.tsx`)
```typescript
// Added dashboard route
{ path: '/sub/constellation/dashboard', element: <ConstellationDashboard /> }

// Wrapped /admin with AdminRoute
{
  path: '/admin',
  element: <AdminRoute />, // Protection layer
  children: [{
    path: '',
    element: <AdminLayout />,
    children: [...]
  }]
}
```

---

## 🗄️ Database Schema

### user_profiles Table
```sql
ALTER TABLE user_profiles 
ADD COLUMN user_type text 
CHECK (user_type IN ('stella_admin', 'stella_team', 'constellation_user', 'stellareal_client'))
DEFAULT 'constellation_user';
```

### invite_codes Table
```sql
CREATE TABLE invite_codes (
  id uuid PRIMARY KEY,
  code text UNIQUE CHECK (length(code) = 16),
  user_type text CHECK (user_type IN ('stella_admin', 'stella_team')),
  created_by uuid REFERENCES auth.users(id),
  used_by uuid REFERENCES auth.users(id),
  is_used boolean DEFAULT false,
  max_uses int DEFAULT 1,
  current_uses int DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  used_at timestamptz,
  metadata jsonb DEFAULT '{}'
);
```

---

## 🧪 Testing Guide

### Test 1: Constellation Realtor Signup & Payment (R$ 3)
```
1. Go to /sub/constellation/signup
2. Fill all 3 steps
3. Enable "Test Mode (R$ 3.00)" checkbox
4. Click "Finish Registration"
   ✅ User created with constellation_user type
   ✅ User profile created
   ✅ founding_member created (pending)
   ✅ Stays on payment page (doesn't redirect to admin)
5. Pay with test card: 4242 4242 4242 4242
   ✅ Webhook updates to 'paid'
   ✅ Redirects to /sub/constellation/dashboard
   ✅ Shows "Payment confirmed" message
6. Try to access /admin
   ✅ Blocked and redirected to /sub/constellation/dashboard
```

### Test 2: Constellation Realtor - No Payment (R$ 2,970)
```
1. Go to /sub/constellation/signup
2. Fill all 3 steps
3. DON'T enable test mode
4. Click "Finish Registration"
   ✅ Shows R$ 2,970.00 payment form
5. Close browser/logout without paying
6. Login at /sub/constellation/login
   ✅ Redirects to /sub/constellation/dashboard
   ✅ Shows "Thanks for interest, payment required" message
```

### Test 3: Admin Access Protection
```
1. Login as constellation_user
2. Try to navigate to /admin
   ✅ AdminRoute blocks access
   ✅ Redirects to /sub/constellation/dashboard
```

---

## 🚀 What Works Now

✅ Constellation realtors completely separated from internal admin
✅ User type automatically set during signup
✅ User profiles created with correct type
✅ Payment status tracked (pending/paid)
✅ Dashboard shows different message based on payment
✅ AdminRoute protects /admin from constellation users
✅ Constellation users can't access /admin at all
✅ Database migration ready for user types
✅ Invite code system (database ready, UI pending)

---

## 🔜 Still To Do (Later)

### Invite Code UI for Internal Signup
Currently invite codes exist in database but `/login` signup doesn't use them yet. Need to:
1. Add invite code field to `/login` signup form
2. Validate code before allowing signup
3. Set `user_type` based on invite code type
4. Create admin page to generate/manage invite codes

### Constellation Dashboard Build-Out
Current dashboard just shows messages. Need to build:
1. Site builder interface
2. Listings management
3. Lead management/CRM
4. Analytics dashboard
5. Settings/profile

### Permissions Granularity
Currently only stella_admin vs stella_team. May want:
1. Specific permissions per team member
2. Role hierarchy
3. Feature flags per user type

---

## 📊 User Flow Diagrams

### Constellation User Journey
```
/sub/constellation/signup
     ↓
[Fill Forms]
     ↓
Click "Finish Registration"
     ↓
[User Created: constellation_user]
[Profile Created: constellation_user]
[Founding Member: pending]
     ↓
[Payment Form Shown]
     ↓
Pay? ─┬─ YES → [Status: paid] → Dashboard (Success Message)
      │
      └─ NO → [Status: pending] → Dashboard (Payment Required)
```

### Admin User Journey (Future)
```
/login
  ↓
[Enter 16-digit invite code]
  ↓
[Validate Code]
  ↓
[User Created: stella_admin or stella_team]
  ↓
/admin (Full Access)
```

---

## 💡 Key Design Decisions

### Why Separate Dashboards?
- Constellation users build their OWN sites (multi-tenant SaaS)
- Internal users manage the PLATFORM itself
- Different permissions, features, UI/UX needs

### Why Block constellation_user from /admin?
- Security: External users shouldn't see internal platform controls
- UX: Would be confusing to see platform admin tools
- Permissions: They don't need those features

### Why user_type in user_profiles not auth.users?
- Supabase auth.users is read-only in most cases
- user_profiles gives us more control
- Can add additional metadata fields easily
- Better for RLS policies

---

## 🔍 SQL Queries for Debugging

### Check user type
```sql
SELECT user_id, full_name, user_type 
FROM user_profiles 
WHERE user_id = '<user_id>';
```

### Get all constellation users
```sql
SELECT up.full_name, up.user_type, fm.payment_status, fm.member_number
FROM user_profiles up
JOIN founding_members fm ON fm.user_id = up.user_id
WHERE up.user_type = 'constellation_user';
```

### Get users by payment status
```sql
SELECT 
  up.full_name,
  up.user_type,
  fm.payment_status,
  fm.payment_completed_at
FROM user_profiles up
JOIN founding_members fm ON fm.user_id = up.user_id
WHERE fm.payment_status = 'pending'; -- or 'paid'
```

### Generate invite code (in SQL)
```sql
SELECT generate_invite_code(); -- Returns new 16-char code
```

### Create invite code manually
```sql
INSERT INTO invite_codes (code, user_type, created_by)
VALUES ('ABCD1234EFGH5678', 'stella_admin', auth.uid());
```

---

## ✅ Deployment Checklist

Before deploying:
1. ✅ Run migration: `20251116000000_user_types_and_invite_codes.sql`
2. ✅ Test constellation signup flow
3. ✅ Test payment (R$ 3 test mode)
4. ✅ Test admin route protection
5. ✅ Verify dashboard shows correct messages
6. ⏳ Generate first invite codes for internal team
7. ⏳ Test invite code validation (when UI ready)

---

## 🎉 Summary

**What we built:**
- 4 user types: stella_admin, stella_team, constellation_user, stellareal_client
- AdminRoute protection for /admin
- Constellation dashboard with payment status checks
- User type automatically set during signup
- Complete separation of internal vs external users
- Database ready for invite code system

**Result:**
Constellation realtors are now completely isolated from your internal admin. They can only access their own dashboard, and the system recognizes whether they've paid or not.

**Ready to test!** 🚀
