# Ballet Task Manager - Quick Setup Guide

## You're seeing this error because the database tables haven't been created yet.

### 🚀 Quick Fix (2 minutes)

**Step 1: Open Supabase Dashboard**
- Go to: https://app.supabase.com
- Select your project
- Click "SQL Editor" in left menu

**Step 2: Run the Migration**
- Click "New Query"
- Open this file in your code editor:
  ```
  supabase/migrations/20250105000000_ballet_project_management.sql
  ```
- Copy ALL the SQL (it's a long file, ~500+ lines)
- Paste into the Supabase SQL Editor
- Click "Run" button

**Step 3: Refresh Ballet**
- Go back to http://localhost:5174/admin/ballet
- Click "Retry After Setup"
- Ballet should now load! ✨

---

## Alternative: Using Supabase CLI

If you have Supabase CLI installed:

```bash
cd /Users/rossermcintosh/Desktop/stella-real-estate
supabase db push
```

---

## What Gets Created

The migration creates 11 tables:
- ✅ ballet_workspaces - Team/organization containers
- ✅ ballet_projects - Projects with sections
- ✅ ballet_sections - Task organization (To Do, In Progress, Done)
- ✅ ballet_tasks - Tasks with assignments, comments, etc.
- ✅ ballet_comments - Task comments with @mentions
- ✅ ballet_attachments - File attachments
- ✅ ballet_goals - OKR-style goals
- ✅ ballet_portfolios - Project collections
- ✅ ballet_automation_rules - Workflow automation
- ✅ ballet_notifications - User notifications
- ✅ ballet_activity_events - Activity history

Plus:
- 🔒 Row Level Security policies for all tables
- 📊 Indexes for optimal performance
- ⚡ Automatic updated_at triggers

---

## Troubleshooting

**"Permission denied" error?**
- Make sure you're logged into Supabase as project owner
- Check that your project is active

**"Syntax error" in SQL?**
- Make sure you copied the ENTIRE file
- The file should start with: `-- Ballet Project Management System Migration`
- The file should end with migration completion

**Still not working?**
- Check browser console (F12) for detailed error
- Verify Supabase environment variables in `.env.local`
- Make sure you're connected to the internet

---

## After Setup

Once the migration runs successfully:
1. Ballet will auto-create a workspace for you
2. You'll see a default "Getting Started" project
3. Click "New Task" to create your first task
4. Invite team members to collaborate

**Enjoy your Asana-like task manager!** 🩰
