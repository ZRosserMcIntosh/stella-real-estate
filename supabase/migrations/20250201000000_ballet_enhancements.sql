-- Ballet Enhancements: milestones support
ALTER TABLE public.ballet_tasks
  ADD COLUMN IF NOT EXISTS is_milestone BOOLEAN DEFAULT FALSE;

-- Ensure existing rows have a deterministic value
UPDATE public.ballet_tasks
SET is_milestone = COALESCE(is_milestone, FALSE);
