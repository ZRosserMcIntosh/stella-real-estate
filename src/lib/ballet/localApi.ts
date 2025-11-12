import type { Workspace, Project, Task, Section, User, Portfolio } from '../../pages/admin/ballet/types'

// Local fallback persistence for Ballet. Stores state inside localStorage so the UI works
// even when Supabase isn\'t configured. Mirrors the subset of functions used by the UI.

type Snapshot = {
  workspaces: Workspace[]
  projects: Project[]
  tasks: Task[]
  users: User[]
  portfolios: Portfolio[]
}

const STORAGE_KEY = 'stella:ballet:v1'

const defaultUsers: User[] = [
  { id: 'local-owner', name: 'Workspace Owner', email: 'owner@stella.local', role: 'admin', avatar: '🧑‍💼' },
  { id: 'local-designer', name: 'Design Lead', email: 'design@stella.local', role: 'member', avatar: '🎨' },
]

const defaultWorkspaceId = 'local-ws'
const defaultProjectId = 'local-project'

const defaultSections: Section[] = [
  { id: 'local-sec-todo', name: 'To Do', projectId: defaultProjectId, position: 0, collapsed: false, taskIds: [] },
  { id: 'local-sec-progress', name: 'In Progress', projectId: defaultProjectId, position: 1, collapsed: false, taskIds: [] },
  { id: 'local-sec-done', name: 'Done', projectId: defaultProjectId, position: 2, collapsed: false, taskIds: [] },
]

const now = () => new Date().toISOString()

const defaultWorkspace: Workspace = {
  id: defaultWorkspaceId,
  name: 'Local Workspace',
  description: 'Tasks stored in this browser only',
  color: '#6366f1',
  icon: '/ballet-logo.png',
  ownerId: defaultUsers[0].id,
  memberIds: [defaultUsers[0].id, defaultUsers[1].id],
  createdAt: now(),
  updatedAt: now(),
}

const defaultProject: Project = {
  id: defaultProjectId,
  name: 'Stella Build',
  description: 'Track tasks for this repository',
  workspaceId: defaultWorkspaceId,
  ownerId: defaultUsers[0].id,
  teamIds: [defaultUsers[0].id, defaultUsers[1].id],
  status: 'active',
  color: '#ec4899',
  icon: '🛠️',
  privacy: 'public',
  dueDate: undefined,
  startDate: now(),
  sections: defaultSections,
  taskIds: [],
  customFields: [],
  tags: ['local'],
  defaultView: 'board',
  createdAt: now(),
  updatedAt: now(),
}

const defaultSnapshot: Snapshot = {
  workspaces: [defaultWorkspace],
  projects: [defaultProject],
  tasks: [],
  users: defaultUsers,
  portfolios: [
    {
      id: 'local-folder',
      name: 'Launch Plan',
      description: 'Milestones grouped for launch readiness',
      workspaceId: defaultWorkspaceId,
      ownerId: defaultUsers[0].id,
      projectIds: [defaultProjectId],
      color: '#a855f7',
      createdAt: now(),
      updatedAt: now(),
    },
  ],
}

const clone = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value))
}

let memorySnapshot: Snapshot = clone(defaultSnapshot)

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

function ensureMemberships(snapshot: Snapshot) {
  const projectMap = new Map<string, Project>()
  snapshot.projects.forEach(project => {
    projectMap.set(project.id, project)
    project.taskIds = []
    project.sections = project.sections.map(section => ({
      ...section,
      taskIds: Array.isArray(section.taskIds) ? [...new Set(section.taskIds)] : [],
    }))
  })

  snapshot.tasks.forEach(task => {
    const project = projectMap.get(task.projectId)
    if (!project) return
    if (!project.taskIds.includes(task.id)) project.taskIds.push(task.id)

    if (task.sectionId) {
      const section = project.sections.find(sec => sec.id === task.sectionId)
      if (section && !section.taskIds.includes(task.id)) {
        section.taskIds.push(task.id)
      }
    }
  })
}

function normalizeWorkspace(workspace: Workspace): Workspace {
  const members = Array.isArray(workspace.memberIds) ? workspace.memberIds : []
  if (!members.includes(workspace.ownerId)) members.push(workspace.ownerId)
  return {
    ...workspace,
    memberIds: members,
    createdAt: workspace.createdAt || now(),
    updatedAt: workspace.updatedAt || now(),
  }
}

function normalizeSection(section: Section, projectId: string): Section {
  return {
    ...section,
    projectId,
    taskIds: Array.isArray(section.taskIds) ? section.taskIds : [],
    collapsed: Boolean(section.collapsed),
  }
}

function normalizeProject(project: Project): Project {
  const sections = Array.isArray(project.sections) && project.sections.length > 0
    ? project.sections.map(section => normalizeSection(section, project.id))
    : clone(defaultSections).map((section, idx) => ({
        ...section,
        id: `${project.id}-sec-${idx}`,
        projectId: project.id,
      }))

  return {
    ...project,
    sections,
    taskIds: Array.isArray(project.taskIds) ? project.taskIds : [],
    tags: Array.isArray(project.tags) ? project.tags : [],
    customFields: Array.isArray(project.customFields) ? project.customFields : [],
    teamIds: Array.isArray(project.teamIds) ? project.teamIds : [],
  }
}

function normalizeTask(task: Task): Task {
  return {
    ...task,
    description: task.description || '',
    tags: Array.isArray(task.tags) ? task.tags : [],
    dependsOn: Array.isArray(task.dependsOn) ? task.dependsOn : [],
    blockedBy: Array.isArray(task.blockedBy) ? task.blockedBy : [],
    subtasks: Array.isArray(task.subtasks) ? task.subtasks : [],
    collaboratorIds: Array.isArray(task.collaboratorIds) ? task.collaboratorIds : [],
    followerIds: Array.isArray(task.followerIds) ? task.followerIds : [],
    customFields: Array.isArray(task.customFields) ? task.customFields : [],
    isMilestone: Boolean(task.isMilestone),
    attachments: Array.isArray(task.attachments) ? task.attachments : [],
    comments: Array.isArray(task.comments) ? task.comments : [],
    position: typeof task.position === 'number' ? task.position : 0,
    createdAt: task.createdAt || now(),
    updatedAt: task.updatedAt || now(),
  }
}

function normalizePortfolio(portfolio: Portfolio): Portfolio {
  return {
    ...portfolio,
    projectIds: Array.isArray(portfolio.projectIds) ? portfolio.projectIds : [],
    color: portfolio.color || '#6366f1',
    description: portfolio.description || '',
    createdAt: portfolio.createdAt || now(),
    updatedAt: portfolio.updatedAt || now(),
  }
}

function normalizeUser(user: User): User {
  return {
    ...user,
    avatar: user.avatar || '👤',
    role: user.role,
  }
}

function normalizeSnapshot(snapshot: Snapshot | undefined | null): Snapshot {
  const base: Snapshot = snapshot && typeof snapshot === 'object'
    ? snapshot
    : defaultSnapshot

  const normalized: Snapshot = {
    workspaces: Array.isArray(base.workspaces) && base.workspaces.length > 0
      ? base.workspaces.map(normalizeWorkspace)
      : clone(defaultSnapshot.workspaces),
    projects: Array.isArray(base.projects) && base.projects.length > 0
      ? base.projects.map(normalizeProject)
      : clone(defaultSnapshot.projects),
    tasks: Array.isArray(base.tasks)
      ? base.tasks.map(normalizeTask)
      : [],
    users: Array.isArray(base.users) && base.users.length > 0
      ? base.users.map(normalizeUser)
      : clone(defaultSnapshot.users),
    portfolios: Array.isArray(base.portfolios) && base.portfolios.length > 0
      ? base.portfolios.map(normalizePortfolio)
      : clone(defaultSnapshot.portfolios),
  }

  ensureMemberships(normalized)
  return normalized
}

function getSnapshot(): Snapshot {
  if (isBrowser()) {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return clone(memorySnapshot)
    }

    try {
      const parsed = JSON.parse(raw)
      const normalized = normalizeSnapshot(parsed)
      memorySnapshot = clone(normalized)
      return clone(normalized)
    } catch {
      return clone(memorySnapshot)
    }
  }

  return clone(memorySnapshot)
}

function persistSnapshot(snapshot: Snapshot) {
  ensureMemberships(snapshot)
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  }
  memorySnapshot = clone(snapshot)
}

function generateId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function findProject(snapshot: Snapshot, projectId: string) {
  const project = snapshot.projects.find(p => p.id === projectId)
  if (!project) throw new Error('Project not found')
  return project
}

function syncSectionMembership(project: Project, taskId: string, nextSectionId?: string | null, prevSectionId?: string | null) {
  if (prevSectionId) {
    const prevSection = project.sections.find(section => section.id === prevSectionId)
    if (prevSection) {
      prevSection.taskIds = prevSection.taskIds.filter(id => id !== taskId)
    }
  }

  if (nextSectionId) {
    const nextSection = project.sections.find(section => section.id === nextSectionId)
    if (nextSection && !nextSection.taskIds.includes(taskId)) {
      nextSection.taskIds.push(taskId)
    }
  }
}

export async function fetchWorkspaces(): Promise<Workspace[]> {
  const snapshot = getSnapshot()
  return clone(snapshot.workspaces)
}

export async function createWorkspace(workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workspace> {
  const snapshot = getSnapshot()
  const newWorkspace: Workspace = normalizeWorkspace({
    ...workspace,
    id: generateId('ws'),
    createdAt: now(),
    updatedAt: now(),
  })

  snapshot.workspaces.push(newWorkspace)
  persistSnapshot(snapshot)
  return clone(newWorkspace)
}

export async function fetchProjects(workspaceId: string): Promise<Project[]> {
  const snapshot = getSnapshot()
  const projects = snapshot.projects.filter(project => project.workspaceId === workspaceId)
  return clone(projects)
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'sections' | 'taskIds'>): Promise<Project> {
  const snapshot = getSnapshot()
  const projectId = generateId('proj')
  const sections = ['To Do', 'In Progress', 'Done'].map((name, index) => ({
    id: generateId('sec'),
    name,
    projectId,
    position: index,
    collapsed: false,
    taskIds: [],
  }))

  const newProject: Project = normalizeProject({
    ...project,
    id: projectId,
    sections,
    taskIds: [],
    createdAt: now(),
    updatedAt: now(),
  })

  snapshot.projects.push(newProject)
  persistSnapshot(snapshot)
  return clone(newProject)
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
  const snapshot = getSnapshot()
  const index = snapshot.projects.findIndex(p => p.id === projectId)
  if (index === -1) {
    throw new Error(`Project with id ${projectId} not found`)
  }
  
  const updatedProject = normalizeProject({
    ...snapshot.projects[index],
    ...updates,
    id: projectId,
    updatedAt: now(),
  })
  
  snapshot.projects[index] = updatedProject
  persistSnapshot(snapshot)
  return clone(updatedProject)
}

export async function fetchTasks(projectId: string): Promise<Task[]> {
  const snapshot = getSnapshot()
  const tasks = snapshot.tasks.filter(task => task.projectId === projectId)
  return clone(tasks)
}

export async function fetchWorkspaceUsers(workspace: Workspace): Promise<User[]> {
  const snapshot = getSnapshot()
  const allowedIds = new Set([workspace.ownerId, ...workspace.memberIds])
  return snapshot.users.filter(user => allowedIds.has(user.id)).map(clone)
}

export async function getCurrentUser(): Promise<User | null> {
  const snapshot = getSnapshot()
  if (snapshot.users.length === 0) return null
  const owner = snapshot.users.find(user => user.id === snapshot.workspaces[0]?.ownerId)
  return clone(owner || snapshot.users[0])
}

export async function fetchPortfolios(workspaceId?: string): Promise<Portfolio[]> {
  const snapshot = getSnapshot()
  const folders = workspaceId
    ? snapshot.portfolios.filter(folder => folder.workspaceId === workspaceId)
    : snapshot.portfolios
  return clone(folders)
}

export async function createPortfolio(portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>): Promise<Portfolio> {
  const snapshot = getSnapshot()
  const newFolder: Portfolio = normalizePortfolio({
    ...portfolio,
    id: generateId('folder'),
    createdAt: now(),
    updatedAt: now(),
  })
  snapshot.portfolios.push(newFolder)
  persistSnapshot(snapshot)
  return clone(newFolder)
}

export async function updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio> {
  const snapshot = getSnapshot()
  const index = snapshot.portfolios.findIndex(folder => folder.id === id)
  if (index === -1) throw new Error('Folder not found')
  const updated = normalizePortfolio({
    ...snapshot.portfolios[index],
    ...updates,
    id,
    updatedAt: now(),
  })
  snapshot.portfolios[index] = updated
  persistSnapshot(snapshot)
  return clone(updated)
}

export async function deletePortfolio(id: string): Promise<void> {
  const snapshot = getSnapshot()
  snapshot.portfolios = snapshot.portfolios.filter(folder => folder.id !== id)
  persistSnapshot(snapshot)
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>): Promise<Task> {
  const snapshot = getSnapshot()
  const project = findProject(snapshot, task.projectId)
  const newTask: Task = normalizeTask({
    ...task,
    id: generateId('task'),
    comments: [],
    attachments: [],
    createdAt: now(),
    updatedAt: now(),
    position: project.taskIds.length,
  })

  snapshot.tasks.push(newTask)
  if (!project.taskIds.includes(newTask.id)) {
    project.taskIds.push(newTask.id)
  }
  syncSectionMembership(project, newTask.id, newTask.sectionId)
  persistSnapshot(snapshot)
  return clone(newTask)
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
  const snapshot = getSnapshot()
  const index = snapshot.tasks.findIndex(task => task.id === taskId)
  if (index === -1) throw new Error('Task not found')

  const existing = snapshot.tasks[index]
  const nextTask: Task = normalizeTask({
    ...existing,
    ...updates,
    id: existing.id,
    projectId: updates.projectId ?? existing.projectId,
    updatedAt: now(),
    comments: updates.comments ?? existing.comments,
    attachments: updates.attachments ?? existing.attachments,
  })

  snapshot.tasks[index] = nextTask
  if (existing.projectId !== nextTask.projectId) {
    const prevProject = findProject(snapshot, existing.projectId)
    prevProject.taskIds = prevProject.taskIds.filter(id => id !== taskId)
    syncSectionMembership(prevProject, taskId, undefined, existing.sectionId)
    const nextProject = findProject(snapshot, nextTask.projectId)
    if (!nextProject.taskIds.includes(taskId)) nextProject.taskIds.push(taskId)
    syncSectionMembership(nextProject, taskId, nextTask.sectionId)
  } else {
    const project = findProject(snapshot, nextTask.projectId)
    syncSectionMembership(project, taskId, nextTask.sectionId, existing.sectionId)
  }

  persistSnapshot(snapshot)
  return clone(nextTask)
}

export async function deleteTask(taskId: string): Promise<void> {
  const snapshot = getSnapshot()
  const index = snapshot.tasks.findIndex(task => task.id === taskId)
  if (index === -1) return
  const task = snapshot.tasks[index]
  snapshot.tasks.splice(index, 1)
  const project = findProject(snapshot, task.projectId)
  project.taskIds = project.taskIds.filter(id => id !== taskId)
  syncSectionMembership(project, taskId, undefined, task.sectionId)
  persistSnapshot(snapshot)
}

export function subscribeToTasks(_: string, __: (payload: any) => void) {
  return {
    unsubscribe() {
      // no-op in local mode
    },
  }
}
