// Ballet Project Management Types - Asana-like functionality

export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed'
export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'archived'
export type ViewType = 'list' | 'board' | 'timeline' | 'calendar' | 'workload' | 'features'
export type CustomFieldType = 'text' | 'number' | 'dropdown' | 'date' | 'checkbox' | 'url' | 'multiselect'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'member' | 'guest'
}

export interface Workspace {
  id: string
  name: string
  description: string
  color: string
  icon: string
  ownerId: string
  memberIds: string[]
  createdAt: string
  updatedAt: string
}

export interface CustomField {
  id: string
  name: string
  type: CustomFieldType
  required: boolean
  options?: string[] // For dropdown/multiselect
  value?: any
}

export interface Task {
  id: string
  title: string
  description: string
  projectId: string
  sectionId?: string
  assigneeId?: string
  creatorId: string
  status: TaskStatus
  priority: Priority
  dueDate?: string
  startDate?: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  tags: string[]
  dependsOn: string[] // Task IDs this task depends on
  blockedBy: string[] // Task IDs blocking this task
  subtasks: string[] // Subtask IDs
  collaboratorIds: string[]
  followerIds: string[]
  customFields: CustomField[]
  attachments: Attachment[]
  comments: Comment[]
  position: number
  createdAt: string
  updatedAt: string
}

export interface Section {
  id: string
  name: string
  projectId: string
  position: number
  collapsed: boolean
  taskIds: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  workspaceId: string
  ownerId: string
  teamIds: string[]
  status: ProjectStatus
  color: string
  icon: string
  privacy: 'public' | 'private' | 'comment-only'
  dueDate?: string
  startDate?: string
  sections: Section[]
  taskIds: string[]
  customFields: CustomField[]
  tags: string[]
  defaultView: ViewType
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: string
}

export interface Comment {
  id: string
  text: string
  authorId: string
  mentions: string[] // User IDs
  createdAt: string
  updatedAt: string
  attachments: Attachment[]
}

export interface Goal {
  id: string
  title: string
  description: string
  workspaceId: string
  ownerId: string
  status: 'on-track' | 'at-risk' | 'off-track' | 'achieved'
  progress: number // 0-100
  dueDate?: string
  startDate?: string
  parentGoalId?: string
  linkedProjectIds: string[]
  linkedTaskIds: string[]
  keyResults: KeyResult[]
  createdAt: string
  updatedAt: string
}

export interface KeyResult {
  id: string
  title: string
  type: 'number' | 'percentage' | 'boolean'
  startValue: number
  targetValue: number
  currentValue: number
  unit?: string
}

export interface Portfolio {
  id: string
  name: string
  description: string
  workspaceId: string
  ownerId: string
  projectIds: string[]
  color: string
  createdAt: string
  updatedAt: string
}

export interface AutomationRule {
  id: string
  name: string
  projectId: string
  enabled: boolean
  trigger: {
    type: 'task-created' | 'task-completed' | 'field-changed' | 'due-date-approaching'
    conditions?: Record<string, any>
  }
  actions: {
    type: 'assign-task' | 'move-section' | 'add-comment' | 'change-status' | 'send-notification'
    params: Record<string, any>
  }[]
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'mention' | 'assignment' | 'comment' | 'due-soon' | 'completed' | 'status-change'
  title: string
  message: string
  linkTo?: string
  read: boolean
  createdAt: string
}

export interface ActivityEvent {
  id: string
  type: string
  userId: string
  projectId?: string
  taskId?: string
  description: string
  metadata: Record<string, any>
  createdAt: string
}

export interface Form {
  id: string
  name: string
  description: string
  projectId?: string
  fields: FormField[]
  submitAction: 'create-task' | 'create-project'
  createdAt: string
}

export interface FormField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'file'
  required: boolean
  options?: string[]
}

export interface BalletState {
  workspaces: Workspace[]
  projects: Project[]
  tasks: Task[]
  goals: Goal[]
  portfolios: Portfolio[]
  users: User[]
  automationRules: AutomationRule[]
  notifications: Notification[]
  activityEvents: ActivityEvent[]
  forms: Form[]
  currentWorkspaceId?: string
  currentProjectId?: string
  currentView: ViewType
}
