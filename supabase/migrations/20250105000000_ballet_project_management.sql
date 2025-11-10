-- Ballet Project Management System Migration
-- Create tables for Asana-like task management with real users

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces Table
CREATE TABLE IF NOT EXISTS public.ballet_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT '🏢',
  owner_id UUID NOT NULL,
  member_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS public.ballet_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  workspace_id UUID NOT NULL REFERENCES public.ballet_workspaces(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  team_ids UUID[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'on-hold', 'completed', 'archived')),
  color TEXT DEFAULT '#3b82f6',
  icon TEXT DEFAULT '📋',
  privacy TEXT DEFAULT 'public' CHECK (privacy IN ('public', 'private', 'comment-only')),
  due_date TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  custom_fields JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  default_view TEXT DEFAULT 'board' CHECK (default_view IN ('list', 'board', 'timeline', 'calendar', 'workload', 'features')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sections Table (for organizing tasks within projects)
CREATE TABLE IF NOT EXISTS public.ballet_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  project_id UUID NOT NULL REFERENCES public.ballet_projects(id) ON DELETE CASCADE,
  position INT DEFAULT 0,
  collapsed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS public.ballet_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  project_id UUID NOT NULL REFERENCES public.ballet_projects(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.ballet_sections(id) ON DELETE SET NULL,
  assignee_id UUID,
  creator_id UUID NOT NULL,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'review', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  estimated_hours FLOAT,
  actual_hours FLOAT,
  tags TEXT[] DEFAULT '{}',
  depends_on UUID[] DEFAULT '{}',
  blocked_by UUID[] DEFAULT '{}',
  subtask_ids UUID[] DEFAULT '{}',
  collaborator_ids UUID[] DEFAULT '{}',
  follower_ids UUID[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '[]',
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments Table
CREATE TABLE IF NOT EXISTS public.ballet_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.ballet_tasks(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  author_id UUID NOT NULL,
  mentions UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attachments Table
CREATE TABLE IF NOT EXISTS public.ballet_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.ballet_tasks(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.ballet_comments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  size INT NOT NULL,
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals Table
CREATE TABLE IF NOT EXISTS public.ballet_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  workspace_id UUID NOT NULL REFERENCES public.ballet_workspaces(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  status TEXT DEFAULT 'on-track' CHECK (status IN ('on-track', 'at-risk', 'off-track', 'achieved')),
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  parent_goal_id UUID REFERENCES public.ballet_goals(id) ON DELETE SET NULL,
  linked_project_ids UUID[] DEFAULT '{}',
  linked_task_ids UUID[] DEFAULT '{}',
  key_results JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolios Table
CREATE TABLE IF NOT EXISTS public.ballet_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  workspace_id UUID NOT NULL REFERENCES public.ballet_workspaces(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  project_ids UUID[] DEFAULT '{}',
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation Rules Table
CREATE TABLE IF NOT EXISTS public.ballet_automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  project_id UUID NOT NULL REFERENCES public.ballet_projects(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT TRUE,
  trigger JSONB NOT NULL,
  actions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.ballet_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mention', 'assignment', 'comment', 'due-soon', 'completed', 'status-change')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_to TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Events Table
CREATE TABLE IF NOT EXISTS public.ballet_activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.ballet_projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.ballet_tasks(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ballet_projects_workspace_id ON public.ballet_projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ballet_projects_owner_id ON public.ballet_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_ballet_sections_project_id ON public.ballet_sections(project_id);
CREATE INDEX IF NOT EXISTS idx_ballet_tasks_project_id ON public.ballet_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_ballet_tasks_section_id ON public.ballet_tasks(section_id);
CREATE INDEX IF NOT EXISTS idx_ballet_tasks_assignee_id ON public.ballet_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_ballet_tasks_creator_id ON public.ballet_tasks(creator_id);
CREATE INDEX IF NOT EXISTS idx_ballet_tasks_status ON public.ballet_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ballet_comments_task_id ON public.ballet_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_ballet_comments_author_id ON public.ballet_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_ballet_attachments_task_id ON public.ballet_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_ballet_attachments_comment_id ON public.ballet_attachments(comment_id);
CREATE INDEX IF NOT EXISTS idx_ballet_goals_workspace_id ON public.ballet_goals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ballet_goals_owner_id ON public.ballet_goals(owner_id);
CREATE INDEX IF NOT EXISTS idx_ballet_portfolios_workspace_id ON public.ballet_portfolios(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ballet_automation_rules_project_id ON public.ballet_automation_rules(project_id);
CREATE INDEX IF NOT EXISTS idx_ballet_notifications_user_id ON public.ballet_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_ballet_notifications_read ON public.ballet_notifications(read);
CREATE INDEX IF NOT EXISTS idx_ballet_activity_events_user_id ON public.ballet_activity_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ballet_activity_events_project_id ON public.ballet_activity_events(project_id);
CREATE INDEX IF NOT EXISTS idx_ballet_activity_events_task_id ON public.ballet_activity_events(task_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_ballet_workspaces_updated_at BEFORE UPDATE ON public.ballet_workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ballet_projects_updated_at BEFORE UPDATE ON public.ballet_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ballet_sections_updated_at BEFORE UPDATE ON public.ballet_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ballet_tasks_updated_at BEFORE UPDATE ON public.ballet_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ballet_comments_updated_at BEFORE UPDATE ON public.ballet_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ballet_goals_updated_at BEFORE UPDATE ON public.ballet_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ballet_portfolios_updated_at BEFORE UPDATE ON public.ballet_portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ballet_automation_rules_updated_at BEFORE UPDATE ON public.ballet_automation_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE public.ballet_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballet_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballet_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballet_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballet_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballet_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballet_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballet_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballet_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballet_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballet_activity_events ENABLE ROW LEVEL SECURITY;

-- Workspaces: Users can see workspaces they are members of
CREATE POLICY "Users can view their workspaces" ON public.ballet_workspaces
  FOR SELECT USING (
    auth.uid() = owner_id OR 
    auth.uid() = ANY(member_ids)
  );

CREATE POLICY "Users can create workspaces" ON public.ballet_workspaces
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Workspace owners can update" ON public.ballet_workspaces
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Workspace owners can delete" ON public.ballet_workspaces
  FOR DELETE USING (auth.uid() = owner_id);

-- Projects: Users can see projects in their workspaces
CREATE POLICY "Users can view workspace projects" ON public.ballet_projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ballet_workspaces w
      WHERE w.id = workspace_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    )
  );

CREATE POLICY "Workspace members can create projects" ON public.ballet_projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ballet_workspaces w
      WHERE w.id = workspace_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    )
  );

CREATE POLICY "Project team members can update projects" ON public.ballet_projects
  FOR UPDATE USING (
    auth.uid() = owner_id OR 
    auth.uid() = ANY(team_ids)
  );

CREATE POLICY "Project owners can delete projects" ON public.ballet_projects
  FOR DELETE USING (auth.uid() = owner_id);

-- Sections: Follow project visibility
CREATE POLICY "Users can view project sections" ON public.ballet_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ballet_projects p
      JOIN public.ballet_workspaces w ON p.workspace_id = w.id
      WHERE p.id = project_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    )
  );

CREATE POLICY "Project members can manage sections" ON public.ballet_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ballet_projects p
      WHERE p.id = project_id 
      AND (p.owner_id = auth.uid() OR auth.uid() = ANY(p.team_ids))
    )
  );

-- Tasks: Follow project visibility
CREATE POLICY "Users can view project tasks" ON public.ballet_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ballet_projects p
      JOIN public.ballet_workspaces w ON p.workspace_id = w.id
      WHERE p.id = project_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    )
  );

CREATE POLICY "Project members can create tasks" ON public.ballet_tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ballet_projects p
      WHERE p.id = project_id 
      AND (p.owner_id = auth.uid() OR auth.uid() = ANY(p.team_ids))
    )
  );

CREATE POLICY "Task creators and assignees can update" ON public.ballet_tasks
  FOR UPDATE USING (
    auth.uid() = creator_id OR 
    auth.uid() = assignee_id OR
    auth.uid() = ANY(collaborator_ids) OR
    EXISTS (
      SELECT 1 FROM public.ballet_projects p
      WHERE p.id = project_id AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Task creators can delete tasks" ON public.ballet_tasks
  FOR DELETE USING (
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM public.ballet_projects p
      WHERE p.id = project_id AND p.owner_id = auth.uid()
    )
  );

-- Comments: Follow task visibility
CREATE POLICY "Users can view task comments" ON public.ballet_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ballet_tasks t
      JOIN public.ballet_projects p ON t.project_id = p.id
      JOIN public.ballet_workspaces w ON p.workspace_id = w.id
      WHERE t.id = task_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    )
  );

CREATE POLICY "Users can create comments on visible tasks" ON public.ballet_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ballet_tasks t
      JOIN public.ballet_projects p ON t.project_id = p.id
      JOIN public.ballet_workspaces w ON p.workspace_id = w.id
      WHERE t.id = task_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    )
  );

CREATE POLICY "Comment authors can update their comments" ON public.ballet_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Comment authors can delete their comments" ON public.ballet_comments
  FOR DELETE USING (auth.uid() = author_id);

-- Attachments: Follow task/comment visibility
CREATE POLICY "Users can view attachments" ON public.ballet_attachments
  FOR SELECT USING (
    (task_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.ballet_tasks t
      JOIN public.ballet_projects p ON t.project_id = p.id
      JOIN public.ballet_workspaces w ON p.workspace_id = w.id
      WHERE t.id = task_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    )) OR
    (comment_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.ballet_comments c
      JOIN public.ballet_tasks t ON c.task_id = t.id
      JOIN public.ballet_projects p ON t.project_id = p.id
      JOIN public.ballet_workspaces w ON p.workspace_id = w.id
      WHERE c.id = comment_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    ))
  );

CREATE POLICY "Users can upload attachments" ON public.ballet_attachments
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Uploaders can delete attachments" ON public.ballet_attachments
  FOR DELETE USING (auth.uid() = uploaded_by);

-- Goals: Follow workspace visibility
CREATE POLICY "Users can view workspace goals" ON public.ballet_goals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ballet_workspaces w
      WHERE w.id = workspace_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    )
  );

CREATE POLICY "Workspace members can create goals" ON public.ballet_goals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ballet_workspaces w
      WHERE w.id = workspace_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    )
  );

CREATE POLICY "Goal owners can update goals" ON public.ballet_goals
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Goal owners can delete goals" ON public.ballet_goals
  FOR DELETE USING (auth.uid() = owner_id);

-- Portfolios: Follow workspace visibility
CREATE POLICY "Users can view workspace portfolios" ON public.ballet_portfolios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ballet_workspaces w
      WHERE w.id = workspace_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    )
  );

CREATE POLICY "Workspace members can create portfolios" ON public.ballet_portfolios
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ballet_workspaces w
      WHERE w.id = workspace_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    )
  );

CREATE POLICY "Portfolio owners can update portfolios" ON public.ballet_portfolios
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Portfolio owners can delete portfolios" ON public.ballet_portfolios
  FOR DELETE USING (auth.uid() = owner_id);

-- Automation Rules: Follow project visibility
CREATE POLICY "Users can view project automation rules" ON public.ballet_automation_rules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ballet_projects p
      WHERE p.id = project_id 
      AND (p.owner_id = auth.uid() OR auth.uid() = ANY(p.team_ids))
    )
  );

CREATE POLICY "Project owners can manage automation rules" ON public.ballet_automation_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ballet_projects p
      WHERE p.id = project_id AND p.owner_id = auth.uid()
    )
  );

-- Notifications: Users can only see their own
CREATE POLICY "Users can view their notifications" ON public.ballet_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.ballet_notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notifications" ON public.ballet_notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their notifications" ON public.ballet_notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Activity Events: Follow workspace visibility
CREATE POLICY "Users can view activity in their workspaces" ON public.ballet_activity_events
  FOR SELECT USING (
    (project_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.ballet_projects p
      JOIN public.ballet_workspaces w ON p.workspace_id = w.id
      WHERE p.id = project_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    )) OR
    (task_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.ballet_tasks t
      JOIN public.ballet_projects p ON t.project_id = p.id
      JOIN public.ballet_workspaces w ON p.workspace_id = w.id
      WHERE t.id = task_id 
      AND (w.owner_id = auth.uid() OR auth.uid() = ANY(w.member_ids))
    ))
  );

CREATE POLICY "System can create activity events" ON public.ballet_activity_events
  FOR INSERT WITH CHECK (true);

-- Grant permissions to authenticated users
GRANT ALL ON public.ballet_workspaces TO authenticated;
GRANT ALL ON public.ballet_projects TO authenticated;
GRANT ALL ON public.ballet_sections TO authenticated;
GRANT ALL ON public.ballet_tasks TO authenticated;
GRANT ALL ON public.ballet_comments TO authenticated;
GRANT ALL ON public.ballet_attachments TO authenticated;
GRANT ALL ON public.ballet_goals TO authenticated;
GRANT ALL ON public.ballet_portfolios TO authenticated;
GRANT ALL ON public.ballet_automation_rules TO authenticated;
GRANT ALL ON public.ballet_notifications TO authenticated;
GRANT ALL ON public.ballet_activity_events TO authenticated;

-- Insert sample data for testing
INSERT INTO public.ballet_workspaces (name, description, color, icon, owner_id, member_ids) 
VALUES 
  ('Stella Real Estate', 'Main workspace for real estate operations', '#6366f1', '🏢', '00000000-0000-0000-0000-000000000000'::uuid, ARRAY[]::uuid[])
ON CONFLICT DO NOTHING;
