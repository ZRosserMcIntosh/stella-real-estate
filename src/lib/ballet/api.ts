// Ballet API Service Layer
// Handles all database operations for Ballet project management system

import { supabase } from '../supabaseClient'
import type {
  Workspace,
  Project,
  Task,
  Section,
  Comment,
  Attachment,
  Goal,
  Portfolio,
  AutomationRule,
  Notification,
  ActivityEvent,
  User,
} from '../../pages/admin/ballet/types'

// ============================================================================
// WORKSPACES
// ============================================================================

export async function fetchWorkspaces(): Promise<Workspace[]> {
  const { data, error } = await supabase
    .from('ballet_workspaces')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(mapWorkspaceFromDb)
}

export async function createWorkspace(workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workspace> {
  const { data: user } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('ballet_workspaces')
    .insert({
      name: workspace.name,
      description: workspace.description,
      color: workspace.color,
      icon: workspace.icon,
      owner_id: user?.user?.id || workspace.ownerId,
      member_ids: workspace.memberIds,
    })
    .select()
    .single()

  if (error) throw error
  return mapWorkspaceFromDb(data)
}

export async function updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace> {
  const { data, error } = await supabase
    .from('ballet_workspaces')
    .update({
      name: updates.name,
      description: updates.description,
      color: updates.color,
      icon: updates.icon,
      member_ids: updates.memberIds,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapWorkspaceFromDb(data)
}

export async function deleteWorkspace(id: string): Promise<void> {
  const { error } = await supabase
    .from('ballet_workspaces')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// PROJECTS
// ============================================================================

export async function fetchProjects(workspaceId?: string): Promise<Project[]> {
  let query = supabase
    .from('ballet_projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (workspaceId) {
    query = query.eq('workspace_id', workspaceId)
  }

  const { data, error } = await query
  if (error) throw error

  // Fetch sections for each project
  const projectsWithSections = await Promise.all(
    data.map(async (proj) => {
      const sections = await fetchSections(proj.id)
      return mapProjectFromDb(proj, sections)
    })
  )

  return projectsWithSections
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'sections' | 'taskIds'>): Promise<Project> {
  const { data: user } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('ballet_projects')
    .insert({
      name: project.name,
      description: project.description,
      workspace_id: project.workspaceId,
      owner_id: user?.user?.id || project.ownerId,
      team_ids: project.teamIds,
      status: project.status,
      color: project.color,
      icon: project.icon,
      privacy: project.privacy,
      due_date: project.dueDate,
      start_date: project.startDate,
      custom_fields: project.customFields,
      tags: project.tags,
      default_view: project.defaultView,
    })
    .select()
    .single()

  if (error) throw error

  // Create default sections
  const defaultSections = [
    { name: 'To Do', projectId: data.id, position: 0, collapsed: false },
    { name: 'In Progress', projectId: data.id, position: 1, collapsed: false },
    { name: 'Done', projectId: data.id, position: 2, collapsed: false },
  ]

  const sections = await Promise.all(
    defaultSections.map(s => createSection(s))
  )

  return mapProjectFromDb(data, sections)
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase
    .from('ballet_projects')
    .update({
      name: updates.name,
      description: updates.description,
      status: updates.status,
      color: updates.color,
      icon: updates.icon,
      privacy: updates.privacy,
      due_date: updates.dueDate,
      start_date: updates.startDate,
      custom_fields: updates.customFields,
      tags: updates.tags,
      default_view: updates.defaultView,
      team_ids: updates.teamIds,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  
  const sections = await fetchSections(id)
  return mapProjectFromDb(data, sections)
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('ballet_projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// SECTIONS
// ============================================================================

export async function fetchSections(projectId: string): Promise<Section[]> {
  const { data, error } = await supabase
    .from('ballet_sections')
    .select('*')
    .eq('project_id', projectId)
    .order('position', { ascending: true })

  if (error) throw error

  // Get task IDs for each section
  return await Promise.all(
    data.map(async (section) => {
      const { data: tasks } = await supabase
        .from('ballet_tasks')
        .select('id')
        .eq('section_id', section.id)
        .order('position', { ascending: true })

      return mapSectionFromDb(section, tasks?.map(t => t.id) || [])
    })
  )
}

export async function createSection(section: Omit<Section, 'id' | 'createdAt' | 'updatedAt' | 'taskIds'>): Promise<Section> {
  const { data, error } = await supabase
    .from('ballet_sections')
    .insert({
      name: section.name,
      project_id: section.projectId,
      position: section.position,
      collapsed: section.collapsed,
    })
    .select()
    .single()

  if (error) throw error
  return mapSectionFromDb(data, [])
}

export async function updateSection(id: string, updates: Partial<Section>): Promise<Section> {
  const { data, error } = await supabase
    .from('ballet_sections')
    .update({
      name: updates.name,
      position: updates.position,
      collapsed: updates.collapsed,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  
  const { data: tasks } = await supabase
    .from('ballet_tasks')
    .select('id')
    .eq('section_id', id)
  
  return mapSectionFromDb(data, tasks?.map(t => t.id) || [])
}

export async function deleteSection(id: string): Promise<void> {
  const { error } = await supabase
    .from('ballet_sections')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// TASKS
// ============================================================================

export async function fetchTasks(projectId?: string): Promise<Task[]> {
  let query = supabase
    .from('ballet_tasks')
    .select('*')
    .order('position', { ascending: true })

  if (projectId) {
    query = query.eq('project_id', projectId)
  }

  const { data, error } = await query
  if (error) throw error

  // Fetch comments and attachments for each task
  return await Promise.all(
    data.map(async (task) => {
      const [comments, attachments] = await Promise.all([
        fetchComments(task.id),
        fetchAttachments(task.id),
      ])
      return mapTaskFromDb(task, comments, attachments)
    })
  )
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>): Promise<Task> {
  const { data: user } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('ballet_tasks')
    .insert({
      title: task.title,
      description: task.description,
      project_id: task.projectId,
      section_id: task.sectionId,
      assignee_id: task.assigneeId,
      creator_id: user?.user?.id || task.creatorId,
      status: task.status,
      priority: task.priority,
      due_date: task.dueDate,
      start_date: task.startDate,
      estimated_hours: task.estimatedHours,
      actual_hours: task.actualHours,
      tags: task.tags,
      depends_on: task.dependsOn,
      blocked_by: task.blockedBy,
      subtask_ids: task.subtasks,
      collaborator_ids: task.collaboratorIds,
      follower_ids: task.followerIds,
      custom_fields: task.customFields,
      is_milestone: task.isMilestone ?? false,
      position: task.position,
    })
    .select()
    .single()

  if (error) throw error

  // Create activity event
  await createActivityEvent({
    type: 'task-created',
    userId: user?.user?.id || task.creatorId,
    projectId: task.projectId,
    taskId: data.id,
    description: `Created task: ${task.title}`,
    metadata: {},
    createdAt: new Date().toISOString(),
  })

  return mapTaskFromDb(data, [], [])
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const { data: user } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('ballet_tasks')
    .update({
      title: updates.title,
      description: updates.description,
      section_id: updates.sectionId,
      assignee_id: updates.assigneeId,
      status: updates.status,
      priority: updates.priority,
      due_date: updates.dueDate,
      start_date: updates.startDate,
      completed_at: updates.completedAt,
      estimated_hours: updates.estimatedHours,
      actual_hours: updates.actualHours,
      tags: updates.tags,
      depends_on: updates.dependsOn,
      blocked_by: updates.blockedBy,
      subtask_ids: updates.subtasks,
      collaborator_ids: updates.collaboratorIds,
      follower_ids: updates.followerIds,
      custom_fields: updates.customFields,
      is_milestone: updates.isMilestone,
      position: updates.position,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  // Create activity event
  const { data: task } = await supabase
    .from('ballet_tasks')
    .select('project_id, title')
    .eq('id', id)
    .single()

  if (task) {
    await createActivityEvent({
      type: 'task-updated',
      userId: user?.user?.id || '',
      projectId: task.project_id,
      taskId: id,
      description: `Updated task: ${task.title}`,
      metadata: updates,
      createdAt: new Date().toISOString(),
    })
  }

  const [comments, attachments] = await Promise.all([
    fetchComments(id),
    fetchAttachments(id),
  ])

  return mapTaskFromDb(data, comments, attachments)
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('ballet_tasks')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// COMMENTS
// ============================================================================

export async function fetchComments(taskId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('ballet_comments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })

  if (error) throw error

  return await Promise.all(
    data.map(async (comment) => {
      const attachments = await fetchAttachments(undefined, comment.id)
      return mapCommentFromDb(comment, attachments)
    })
  )
}

export async function createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'attachments'> & { taskId: string }): Promise<Comment> {
  const { data: user } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('ballet_comments')
    .insert({
      task_id: comment.taskId,
      text: comment.text,
      author_id: user?.user?.id || comment.authorId,
      mentions: comment.mentions,
    })
    .select()
    .single()

  if (error) throw error

  // Create notifications for mentions
  if (comment.mentions && comment.mentions.length > 0) {
    await Promise.all(
      comment.mentions.map(userId =>
        createNotification({
          userId,
          type: 'mention',
          title: 'You were mentioned',
          message: `You were mentioned in a comment`,
          linkTo: `/admin/ballet?task=${comment.taskId}`,
          read: false,
          createdAt: new Date().toISOString(),
        })
      )
    )
  }

  return mapCommentFromDb(data, [])
}

export async function updateComment(id: string, updates: Partial<Comment>): Promise<Comment> {
  const { data, error } = await supabase
    .from('ballet_comments')
    .update({
      text: updates.text,
      mentions: updates.mentions,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  const attachments = await fetchAttachments(undefined, id)
  return mapCommentFromDb(data, attachments)
}

export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabase
    .from('ballet_comments')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// ATTACHMENTS
// ============================================================================

export async function fetchAttachments(taskId?: string, commentId?: string): Promise<Attachment[]> {
  let query = supabase
    .from('ballet_attachments')
    .select('*')
    .order('uploaded_at', { ascending: true })

  if (taskId) query = query.eq('task_id', taskId)
  if (commentId) query = query.eq('comment_id', commentId)

  const { data, error } = await query
  if (error) throw error

  return data.map(mapAttachmentFromDb)
}

export async function createAttachment(attachment: Omit<Attachment, 'id' | 'uploadedAt'> & { taskId?: string; commentId?: string }): Promise<Attachment> {
  const { data: user } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('ballet_attachments')
    .insert({
      task_id: attachment.taskId,
      comment_id: attachment.commentId,
      name: attachment.name,
      url: attachment.url,
      type: attachment.type,
      size: attachment.size,
      uploaded_by: user?.user?.id || attachment.uploadedBy,
    })
    .select()
    .single()

  if (error) throw error
  return mapAttachmentFromDb(data)
}

export async function deleteAttachment(id: string): Promise<void> {
  const { error } = await supabase
    .from('ballet_attachments')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// GOALS
// ============================================================================

export async function fetchGoals(workspaceId?: string): Promise<Goal[]> {
  let query = supabase
    .from('ballet_goals')
    .select('*')
    .order('created_at', { ascending: false })

  if (workspaceId) {
    query = query.eq('workspace_id', workspaceId)
  }

  const { data, error } = await query
  if (error) throw error

  return data.map(mapGoalFromDb)
}

export async function createGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
  const { data: user } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('ballet_goals')
    .insert({
      title: goal.title,
      description: goal.description,
      workspace_id: goal.workspaceId,
      owner_id: user?.user?.id || goal.ownerId,
      status: goal.status,
      progress: goal.progress,
      due_date: goal.dueDate,
      start_date: goal.startDate,
      parent_goal_id: goal.parentGoalId,
      linked_project_ids: goal.linkedProjectIds,
      linked_task_ids: goal.linkedTaskIds,
      key_results: goal.keyResults,
    })
    .select()
    .single()

  if (error) throw error
  return mapGoalFromDb(data)
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
  const { data, error } = await supabase
    .from('ballet_goals')
    .update({
      title: updates.title,
      description: updates.description,
      status: updates.status,
      progress: updates.progress,
      due_date: updates.dueDate,
      start_date: updates.startDate,
      parent_goal_id: updates.parentGoalId,
      linked_project_ids: updates.linkedProjectIds,
      linked_task_ids: updates.linkedTaskIds,
      key_results: updates.keyResults,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapGoalFromDb(data)
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from('ballet_goals')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// PORTFOLIOS
// ============================================================================

export async function fetchPortfolios(workspaceId?: string): Promise<Portfolio[]> {
  let query = supabase
    .from('ballet_portfolios')
    .select('*')
    .order('created_at', { ascending: false })

  if (workspaceId) {
    query = query.eq('workspace_id', workspaceId)
  }

  const { data, error } = await query
  if (error) throw error

  return data.map(mapPortfolioFromDb)
}

export async function createPortfolio(portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>): Promise<Portfolio> {
  const { data: user } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('ballet_portfolios')
    .insert({
      name: portfolio.name,
      description: portfolio.description,
      workspace_id: portfolio.workspaceId,
      owner_id: user?.user?.id || portfolio.ownerId,
      project_ids: portfolio.projectIds,
      color: portfolio.color,
    })
    .select()
    .single()

  if (error) throw error
  return mapPortfolioFromDb(data)
}

export async function updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio> {
  const { data, error } = await supabase
    .from('ballet_portfolios')
    .update({
      name: updates.name,
      description: updates.description,
      project_ids: updates.projectIds,
      color: updates.color,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapPortfolioFromDb(data)
}

export async function deletePortfolio(id: string): Promise<void> {
  const { error } = await supabase
    .from('ballet_portfolios')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('ballet_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data.map(mapNotificationFromDb)
}

export async function createNotification(notification: Omit<Notification, 'id'>): Promise<Notification> {
  const { data, error } = await supabase
    .from('ballet_notifications')
    .insert({
      user_id: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link_to: notification.linkTo,
      read: notification.read,
    })
    .select()
    .single()

  if (error) throw error
  return mapNotificationFromDb(data)
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('ballet_notifications')
    .update({ read: true })
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// ACTIVITY EVENTS
// ============================================================================

export async function createActivityEvent(event: Omit<ActivityEvent, 'id'>): Promise<ActivityEvent> {
  const { data, error } = await supabase
    .from('ballet_activity_events')
    .insert({
      type: event.type,
      user_id: event.userId,
      project_id: event.projectId,
      task_id: event.taskId,
      description: event.description,
      metadata: event.metadata,
    })
    .select()
    .single()

  if (error) throw error
  return mapActivityEventFromDb(data)
}

// ============================================================================
// USERS (from auth.users)
// ============================================================================

export async function fetchWorkspaceUsers(workspace: Workspace): Promise<User[]> {
  const allUserIds = [workspace.ownerId, ...workspace.memberIds].filter(Boolean)
  
  if (allUserIds.length === 0) return []

  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    // Fallback: get current user only
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      return [{
        id: data.user.id,
        name: data.user.email?.split('@')[0] || 'User',
        email: data.user.email || '',
        role: 'admin',
      }]
    }
    return []
  }

  return users
    .filter(u => allUserIds.includes(u.id))
    .map(u => ({
      id: u.id,
      name: u.email?.split('@')[0] || 'User',
      email: u.email || '',
      role: u.id === workspace.ownerId ? 'admin' as const : 'member' as const,
    }))
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser()
  
  if (!data.user) return null

  return {
    id: data.user.id,
    name: data.user.email?.split('@')[0] || 'User',
    email: data.user.email || '',
    role: 'admin',
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

export function subscribeToTasks(projectId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`tasks-${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ballet_tasks',
        filter: `project_id=eq.${projectId}`,
      },
      callback
    )
    .subscribe()
}

export function subscribeToComments(taskId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`comments-${taskId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ballet_comments',
        filter: `task_id=eq.${taskId}`,
      },
      callback
    )
    .subscribe()
}

export function subscribeToProjects(workspaceId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`projects-${workspaceId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ballet_projects',
        filter: `workspace_id=eq.${workspaceId}`,
      },
      callback
    )
    .subscribe()
}

// ============================================================================
// MAPPER FUNCTIONS (DB to App types)
// ============================================================================

function mapWorkspaceFromDb(data: any): Workspace {
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    color: data.color,
    icon: data.icon,
    ownerId: data.owner_id,
    memberIds: data.member_ids || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapProjectFromDb(data: any, sections: Section[]): Project {
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    workspaceId: data.workspace_id,
    ownerId: data.owner_id,
    teamIds: data.team_ids || [],
    status: data.status,
    color: data.color,
    icon: data.icon,
    privacy: data.privacy,
    dueDate: data.due_date,
    startDate: data.start_date,
    sections,
    taskIds: [], // Will be populated from sections
    customFields: data.custom_fields || [],
    tags: data.tags || [],
    defaultView: data.default_view,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapSectionFromDb(data: any, taskIds: string[]): Section {
  return {
    id: data.id,
    name: data.name,
    projectId: data.project_id,
    position: data.position,
    collapsed: data.collapsed,
    taskIds,
  }
}

function mapTaskFromDb(data: any, comments: Comment[], attachments: Attachment[]): Task {
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    projectId: data.project_id,
    sectionId: data.section_id,
    assigneeId: data.assignee_id,
    creatorId: data.creator_id,
    status: data.status,
    priority: data.priority,
    dueDate: data.due_date,
    startDate: data.start_date,
    completedAt: data.completed_at,
    estimatedHours: data.estimated_hours,
    actualHours: data.actual_hours,
    tags: data.tags || [],
    dependsOn: data.depends_on || [],
    blockedBy: data.blocked_by || [],
    subtasks: data.subtask_ids || [],
    collaboratorIds: data.collaborator_ids || [],
    followerIds: data.follower_ids || [],
    customFields: data.custom_fields || [],
    isMilestone: Boolean(data.is_milestone),
    attachments,
    comments,
    position: data.position,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapCommentFromDb(data: any, attachments: Attachment[]): Comment {
  return {
    id: data.id,
    text: data.text,
    authorId: data.author_id,
    mentions: data.mentions || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    attachments,
  }
}

function mapAttachmentFromDb(data: any): Attachment {
  return {
    id: data.id,
    name: data.name,
    url: data.url,
    type: data.type,
    size: data.size,
    uploadedBy: data.uploaded_by,
    uploadedAt: data.uploaded_at,
  }
}

function mapGoalFromDb(data: any): Goal {
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    workspaceId: data.workspace_id,
    ownerId: data.owner_id,
    status: data.status,
    progress: data.progress,
    dueDate: data.due_date,
    startDate: data.start_date,
    parentGoalId: data.parent_goal_id,
    linkedProjectIds: data.linked_project_ids || [],
    linkedTaskIds: data.linked_task_ids || [],
    keyResults: data.key_results || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapPortfolioFromDb(data: any): Portfolio {
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    workspaceId: data.workspace_id,
    ownerId: data.owner_id,
    projectIds: data.project_ids || [],
    color: data.color,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapNotificationFromDb(data: any): Notification {
  return {
    id: data.id,
    userId: data.user_id,
    type: data.type,
    title: data.title,
    message: data.message,
    linkTo: data.link_to,
    read: data.read,
    createdAt: data.created_at,
  }
}

function mapActivityEventFromDb(data: any): ActivityEvent {
  return {
    id: data.id,
    type: data.type,
    userId: data.user_id,
    projectId: data.project_id,
    taskId: data.task_id,
    description: data.description,
    metadata: data.metadata || {},
    createdAt: data.created_at,
  }
}
