# Invitation Code for tricia@stellareal.com.br

## How to Generate the Code

1. Navigate to `/admin/team` in your admin dashboard
2. Click on the **"Invitations"** tab (newly added)
3. Fill in the form:
   - **Employee Email**: `tricia@stellareal.com.br`
   - **Organization Name**: `Stella Real Estate` (or your org name)
   - **Role**: Select appropriate role (e.g., `employee`, `agent`, `editor`, etc.)
   - **Note**: Optional note like "New team member"
4. Click **"Generate Invitation Code"**
5. Copy the 16-digit code in format: `XXXX-XXXX-XXXX-XXXX`
6. Send this code to Tricia

## Where to Use the Code

The employee should:
1. Go to the signup page (usually at `/constellation/signup` or your signup URL)
2. Enter their email: `tricia@stellareal.com.br`
3. Enter the 16-digit invitation code when prompted
4. Complete the signup process

The code will automatically:
- Associate them with your organization
- Assign them the role you specified
- Expire after 7 days if not used
- Can only be used once

## Alternative: Developer Access Codes Page

You can also generate codes from `/admin/developer/access-codes` if you have developer access.

## Technical Details

- Codes are stored in localStorage under key: `stella:onboarding:invites`
- Format: `XXXX-XXXX-XXXX-XXXX` (4 blocks of 4 characters)
- Expiration: 7 days from generation
- Single-use per code
- Email-bound: Only the specified email can use the code
