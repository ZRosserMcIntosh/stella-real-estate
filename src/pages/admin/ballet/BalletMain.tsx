// Ballet Main Component - Full project management interface with real database integration

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../context/AuthContext'
import { ViewType, Project, Task, Workspace, User, Portfolio } from './types'
import {
  ProjectSidebar,
  ListView,
  BoardView,
  TimelineView,
  CalendarView,
  CreateTaskModal,
  TaskDetailModal,
  FeaturesChecklist,
  CreateProjectModal,
  ProjectFoldersDrawer,
} from './components'
import type { CreateProjectPayload } from './components/CreateProjectModal'
import type { FolderInput } from './components/ProjectFoldersDrawer'
import * as balletApi from '../../../lib/ballet/api'
import * as localBalletApi from '../../../lib/ballet/localApi'
import { AnimatedBackground } from '../../../components/AnimatedBackground'

type DataSource = 'remote' | 'local'

export default function BalletMain() {
  const { t } = useTranslation()
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<DataSource>('remote')
  const [localModeReason, setLocalModeReason] = useState<string | null>(null)
  
  // State
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [folders, setFolders] = useState<Portfolio[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>('board')
  
  // UI State
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showProjectList, setShowProjectList] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showEditProject, setShowEditProject] = useState(false)
  const [showFoldersDrawer, setShowFoldersDrawer] = useState(false)
  const [taskModalSectionId, setTaskModalSectionId] = useState<string | undefined>(undefined)

  const currentProject = projects.find(p => p.id === currentProjectId) || null
  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId) || null
  const projectTasks = tasks.filter(t => t.projectId === currentProjectId)
  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) || null : null

  // Initial data load
  useEffect(() => {
    loadInitialData()
  }, [session])

  useEffect(() => {
    if (currentWorkspaceId) {
      loadWorkspaceFolders(currentWorkspaceId, dataSource)
    }
  }, [currentWorkspaceId, dataSource])

  async function loadWorkspaceFolders(workspaceId: string, source: DataSource = dataSource) {
    const api = source === 'local' ? localBalletApi : balletApi
    try {
      const workspaceFolders = await api.fetchPortfolios(workspaceId)
      setFolders(workspaceFolders)
    } catch (err) {
      console.error('Failed to load folders:', err)
    }
  }

  // Real-time subscriptions
  useEffect(() => {
    if (!currentProjectId) return

    const source = dataSource
    const api = source === 'local' ? localBalletApi : balletApi

    const tasksSub = api.subscribeToTasks(currentProjectId, (payload: any) => {
      if (source === 'local') {
        loadTasks(currentProjectId, source)
        return
      }

      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        loadTasks(currentProjectId, source)
      } else if (payload.eventType === 'DELETE') {
        setTasks(prev => prev.filter(t => t.id !== payload.old.id))
      }
    })

    return () => {
      tasksSub?.unsubscribe?.()
    }
  }, [currentProjectId, dataSource])

  async function loadInitialData(source: DataSource = dataSource) {
    const api = source === 'local' ? localBalletApi : balletApi

    try {
      setLoading(true)
      setError(null)

      if (source === 'remote' && !session) {
        throw new Error('AUTH_REQUIRED')
      }

      let loadedWorkspaces = await api.fetchWorkspaces()

      if (source === 'remote' && loadedWorkspaces.length === 0) {
        const profile = await balletApi.getCurrentUser()
        if (!profile) throw new Error('AUTH_REQUIRED')

        const newWorkspace = await balletApi.createWorkspace({
          name: 'My Workspace',
          description: 'Default workspace',
          color: '#6366f1',
          icon: '🏢',
          ownerId: profile.id,
          memberIds: [],
        })

        await balletApi.createProject({
          name: 'Getting Started',
          description: 'Your first project',
          workspaceId: newWorkspace.id,
          ownerId: profile.id,
          teamIds: [],
          status: 'active',
          color: '#3b82f6',
          icon: '📋',
          privacy: 'public',
          customFields: [],
          tags: [],
          defaultView: 'board',
        })

        loadedWorkspaces = [newWorkspace]
      }

      setWorkspaces(loadedWorkspaces)

      if (loadedWorkspaces.length === 0) {
        setProjects([])
        setTasks([])
        setUsers([])
        setCurrentWorkspaceId(null)
        setCurrentProjectId(null)
        setCurrentUser(null)
        return
      }

      const preferredWorkspaceId = currentWorkspaceId || loadedWorkspaces[0].id
      const activeWorkspace = loadedWorkspaces.find(ws => ws.id === preferredWorkspaceId) || loadedWorkspaces[0]
      setCurrentWorkspaceId(activeWorkspace.id)

      const [workspaceProjects, workspaceUsers] = await Promise.all([
        api.fetchProjects(activeWorkspace.id),
        api.fetchWorkspaceUsers(activeWorkspace),
      ])
      setProjects(workspaceProjects)

      if (workspaceProjects.length > 0) {
        const preferredProjectId = currentProjectId || workspaceProjects[0].id
        const activeProject = workspaceProjects.find(project => project.id === preferredProjectId) || workspaceProjects[0]
        setCurrentProjectId(activeProject.id)
        await loadTasks(activeProject.id, source)
      } else {
        setCurrentProjectId(null)
        setTasks([])
      }

      setUsers(workspaceUsers)

      const profile = source === 'remote'
        ? await balletApi.getCurrentUser()
        : await localBalletApi.getCurrentUser()
      setCurrentUser(profile || workspaceUsers[0] || null)

      if (source === 'remote') {
        setLocalModeReason(null)
        if (dataSource !== 'remote') setDataSource('remote')
      }
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : 'Failed to load data'
      const missingTables = rawMessage.includes('relation') && rawMessage.includes('does not exist')
      const authRequired = rawMessage === 'AUTH_REQUIRED'
      const normalizedMessage = missingTables ? 'DATABASE_NOT_SETUP' : rawMessage

      if (source === 'remote') {
        console.warn('Ballet Supabase load failed, switching to local mode:', err)
        const reasonText = missingTables
          ? 'DATABASE_NOT_SETUP'
          : authRequired
            ? 'Sign in to Supabase to sync tasks.'
            : normalizedMessage
        setLocalModeReason(reasonText)
        if (dataSource !== 'local') setDataSource('local')
        await loadInitialData('local')
        return
      }

      if (authRequired) {
        setError('Please sign in to access Ballet.')
      } else if (missingTables) {
        setError('DATABASE_NOT_SETUP')
      } else {
        setError(normalizedMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  async function loadTasks(projectId: string, source: DataSource = dataSource) {
    try {
      const api = source === 'local' ? localBalletApi : balletApi
      const loadedTasks = await api.fetchTasks(projectId)
      setTasks(loadedTasks)
    } catch (err) {
      console.error('Failed to load tasks:', err)
    }
  }

  // Task actions
  async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>) {
    try {
      const api = dataSource === 'local' ? localBalletApi : balletApi
      const fallbackCreatorId = task.creatorId || currentUser?.id || currentWorkspace?.ownerId || 'local-owner'
      const newTask = await api.createTask({ ...task, creatorId: fallbackCreatorId })
      setTasks(prev => [...prev, newTask])
      if (dataSource === 'local' && currentWorkspaceId) {
        const refreshedProjects = await api.fetchProjects(currentWorkspaceId)
        setProjects(refreshedProjects)
      }
      setShowCreateTask(false)
      setTaskModalSectionId(undefined)
    } catch (err) {
      console.error('Failed to create task:', err)
      alert('Failed to create task: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  async function updateTask(taskId: string, updates: Partial<Task>) {
    try {
      const api = dataSource === 'local' ? localBalletApi : balletApi
      const updatedTask = await api.updateTask(taskId, updates)
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      if (dataSource === 'local' && currentWorkspaceId) {
        const refreshedProjects = await api.fetchProjects(currentWorkspaceId)
        setProjects(refreshedProjects)
      }
    } catch (err) {
      console.error('Failed to update task:', err)
      alert('Failed to update task: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  async function deleteTask(taskId: string) {
    try {
      const api = dataSource === 'local' ? localBalletApi : balletApi
      await api.deleteTask(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
      if (dataSource === 'local' && currentWorkspaceId) {
        const refreshedProjects = await api.fetchProjects(currentWorkspaceId)
        setProjects(refreshedProjects)
      }
      setSelectedTaskId(null)
    } catch (err) {
      console.error('Failed to delete task:', err)
      alert('Failed to delete task: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  async function completeTask(taskId: string) {
    await updateTask(taskId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    })
  }

  async function createSubtask(parentTaskId: string, title: string) {
    if (!currentProjectId || !title.trim()) return
    const parentTask = tasks.find(t => t.id === parentTaskId)
    if (!parentTask) return
    const api = dataSource === 'local' ? localBalletApi : balletApi
    const sectionId = parentTask.sectionId ?? currentProject?.sections?.[0]?.id
    try {
      const subtask = await api.createTask({
        title: title.trim(),
        description: '',
        projectId: parentTask.projectId,
        sectionId: sectionId || undefined,
        assigneeId: undefined,
        creatorId: currentUser?.id || parentTask.creatorId,
        status: 'todo',
        priority: 'medium',
        dueDate: undefined,
        startDate: undefined,
        tags: [],
        dependsOn: [],
        blockedBy: [],
        subtasks: [],
        collaboratorIds: [],
        followerIds: [],
        customFields: [],
        isMilestone: false,
        position: tasks.length + 1,
      })

      await api.updateTask(parentTaskId, {
        subtasks: [...parentTask.subtasks, subtask.id],
      })

      await loadTasks(parentTask.projectId, dataSource)
    } catch (err) {
      console.error('Failed to create subtask:', err)
      alert('Could not create subtask.')
    }
  }

  async function removeSubtask(parentTaskId: string, subtaskId: string) {
    if (!currentProjectId) return
    const parentTask = tasks.find(t => t.id === parentTaskId)
    if (!parentTask) return
    const api = dataSource === 'local' ? localBalletApi : balletApi
    try {
      const nextSubtasks = parentTask.subtasks.filter(id => id !== subtaskId)
      await api.updateTask(parentTaskId, { subtasks: nextSubtasks })
      await api.deleteTask(subtaskId)
      await loadTasks(parentTask.projectId, dataSource)
    } catch (err) {
      console.error('Failed to remove subtask:', err)
    }
  }

  async function toggleSubtaskCompletion(subtaskId: string, complete: boolean) {
    await updateTask(subtaskId, {
      status: complete ? 'completed' : 'todo',
      completedAt: complete ? new Date().toISOString() : undefined,
    })
  }

  function handleSetCurrentProject(projectId: string) {
    setCurrentProjectId(projectId)
    setShowProjectList(false)
    loadTasks(projectId, dataSource)
  }

  async function retryRemoteLoad() {
    setDataSource('remote')
    setLocalModeReason(null)
    await loadInitialData('remote')
  }

  function openCreateTask(sectionId?: string) {
    setTaskModalSectionId(sectionId || currentProject?.sections?.[0]?.id || undefined)
    setShowCreateTask(true)
  }

  async function handleCreateProject(payload: CreateProjectPayload) {
    if (!currentWorkspaceId) {
      alert('Select a workspace before creating a project.')
      return
    }

    const workspace = workspaces.find(w => w.id === currentWorkspaceId)
    const ownerId = currentUser?.id || workspace?.ownerId
    if (!ownerId) {
      alert('A workspace owner or current user is required to create a project.')
      return
    }

    const api = dataSource === 'local' ? localBalletApi : balletApi
    try {
      const newProject = await api.createProject({
        name: payload.name,
        description: payload.description,
        workspaceId: currentWorkspaceId,
        ownerId,
        teamIds: [ownerId],
        status: 'active',
        color: payload.color,
        icon: payload.icon,
        privacy: 'public',
        startDate: new Date().toISOString(),
        dueDate: undefined,
        customFields: [],
        tags: [],
        defaultView: payload.defaultView,
      })
      setProjects(prev => [newProject, ...prev.filter(p => p.id !== newProject.id)])
      setCurrentProjectId(newProject.id)
      await loadTasks(newProject.id, dataSource)
      setShowCreateProject(false)
    } catch (err) {
      console.error('Failed to create project:', err)
      alert('Failed to create project.')
    }
  }

  async function handleUpdateProject(projectId: string, payload: CreateProjectPayload) {
    const api = dataSource === 'local' ? localBalletApi : balletApi
    try {
      const updatedProject = await api.updateProject(projectId, {
        name: payload.name,
        description: payload.description,
        color: payload.color,
        icon: payload.icon,
        defaultView: payload.defaultView,
      })
      setProjects(prev => prev.map(project => project.id === projectId ? updatedProject : project))
      if (projectId === currentProjectId) {
        setCurrentView(payload.defaultView)
      }
      setShowEditProject(false)
    } catch (err) {
      console.error('Failed to update project:', err)
      alert('Could not save project changes.')
    }
  }

  async function handleCreateFolder(input: FolderInput) {
    if (!currentWorkspaceId) return
    const workspace = workspaces.find(w => w.id === currentWorkspaceId)
    const ownerId = currentUser?.id || workspace?.ownerId
    if (!ownerId) return
    const api = dataSource === 'local' ? localBalletApi : balletApi
    try {
      const folder = await api.createPortfolio({
        name: input.name,
        description: input.description,
        workspaceId: currentWorkspaceId,
        ownerId,
        projectIds: input.projectIds,
        color: input.color,
      })
      setFolders(prev => [folder, ...prev.filter(f => f.id !== folder.id)])
    } catch (err) {
      console.error('Failed to create folder:', err)
    }
  }

  async function handleUpdateFolder(id: string, input: FolderInput) {
    const api = dataSource === 'local' ? localBalletApi : balletApi
    try {
      const updated = await api.updatePortfolio(id, {
        name: input.name,
        description: input.description,
        projectIds: input.projectIds,
        color: input.color,
      })
      setFolders(prev => prev.map(folder => (folder.id === id ? updated : folder)))
    } catch (err) {
      console.error('Failed to update folder:', err)
    }
  }

  async function handleDeleteFolder(id: string) {
    const api = dataSource === 'local' ? localBalletApi : balletApi
    try {
      await api.deletePortfolio(id)
      setFolders(prev => prev.filter(folder => folder.id !== id))
    } catch (err) {
      console.error('Failed to delete folder:', err)
    }
  }

  const offsetViewportClass = 'min-h-[calc(100vh-5rem)]'

  if (loading) {
    return (
      <div className={`relative ${offsetViewportClass} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex items-center justify-center`}>
        <AnimatedBackground variant="ballet" interactive={true} />
        
        {/* Spotlight Animation */}
        <style>{`
          @keyframes spotlightMergeLeft {
            0% {
              left: -10%;
              opacity: 0;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              left: 50%;
              opacity: 1;
            }
          }
          
          @keyframes spotlightMergeRight {
            0% {
              left: 110%;
              opacity: 0;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              left: 50%;
              opacity: 1;
            }
          }
          
          @keyframes ballerinaSpin {
            0% {
              transform: rotateY(0deg);
            }
            100% {
              transform: rotateY(360deg);
            }
          }
          
          .spotlight-merge-left {
            animation: spotlightMergeLeft 2s ease-out forwards;
          }
          
          .spotlight-merge-right {
            animation: spotlightMergeRight 2s ease-out forwards;
          }
          
          .ballerina-spin {
            animation: ballerinaSpin 2s linear infinite;
            transform-style: preserve-3d;
          }
        `}</style>
        
        {/* Spotlight from Left */}
        <div 
          className="spotlight-merge-left absolute top-1/2 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, rgba(236,72,153,0.3) 30%, rgba(236,72,153,0.1) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        
        {/* Spotlight from Right */}
        <div 
          className="spotlight-merge-right absolute top-1/2 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, rgba(236,72,153,0.3) 30%, rgba(236,72,153,0.1) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        
        <div className="text-center relative z-10">
          <div className="mb-4 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" style={{ perspective: '1000px' }}>
            <img src="/ballet-new-logo.png" alt="Ballet Logo" className="w-24 h-24 mx-auto ballerina-spin" />
          </div>
          <div className="text-lg text-slate-300 font-medium">{t('ballet.loading')}</div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse"></div>
            <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse delay-75"></div>
            <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    if (error === 'DATABASE_NOT_SETUP') {
      return (
        <div className={`relative ${offsetViewportClass} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden`}>
          <AnimatedBackground variant="ballet" interactive={true} />
          <div className="text-center max-w-2xl mx-auto p-8 pt-16 relative z-10">
            <div className="mb-4 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] flex justify-center">
              <img src="/ballet-new-logo.png" alt="Ballet Logo" className="w-24 h-24" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-100 mb-2">Ballet Database Setup Required</h2>
            <p className="text-slate-400 mb-6">
              The Ballet task manager tables need to be created in your Supabase database.
            </p>
            
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6 text-left mb-6 shadow-xl shadow-pink-500/5">
              <h3 className="font-semibold text-slate-100 mb-3">📋 Setup Instructions:</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-slate-200 mb-1">Option 1: Supabase Dashboard</div>
                  <ol className="text-sm text-slate-400 space-y-1 ml-4 list-decimal">
                    <li>Go to <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 underline">app.supabase.com</a></li>
                    <li>Select your project</li>
                    <li>Click "SQL Editor" in the left menu</li>
                    <li>Create a new query</li>
                    <li>Copy the contents of: <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-xs text-pink-300 font-mono">supabase/migrations/20250105000000_ballet_project_management.sql</code></li>
                    <li>Paste and click "Run"</li>
                  </ol>
                </div>
                
                <div>
                  <div className="font-medium text-slate-200 mb-1">Option 2: Supabase CLI</div>
                  <div className="bg-slate-950/60 text-slate-200 p-3 rounded text-sm font-mono border border-slate-700/50">
                    supabase db push
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => loadInitialData()}
                className="rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 px-6 py-2 text-white hover:from-pink-700 hover:to-pink-600 shadow-lg shadow-pink-500/20 transition-all duration-200 hover:scale-105 font-medium"
              >
                ↻ Retry After Setup
              </button>
              <a
                href="https://app.supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-700/60 backdrop-blur-sm px-6 py-2 text-slate-200 hover:bg-slate-600/60 shadow-lg transition-all duration-200 hover:scale-105 inline-block border border-slate-600/50 font-medium"
              >
                Open Supabase Dashboard →
              </a>
            </div>
            
            <p className="text-xs text-slate-500 mt-4">
              Migration file location: <code className="bg-slate-900/60 px-1.5 py-0.5 rounded font-mono">supabase/migrations/20250105000000_ballet_project_management.sql</code>
            </p>
          </div>
        </div>
      )
    }
    
    return (
      <div className={`relative ${offsetViewportClass} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden`}>
        <AnimatedBackground variant="ballet" interactive={true} />
        <div className="text-center max-w-md relative z-10 pt-16">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-slate-100 mb-2">Error Loading Ballet</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => loadInitialData()}
            className="rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 px-6 py-2 text-white hover:from-pink-700 hover:to-pink-600 shadow-lg shadow-pink-500/20"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${offsetViewportClass} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-12`}>
      <AnimatedBackground variant="ballet" interactive={true} />
      {dataSource === 'local' && (
        <div className="absolute right-6 top-28 z-40 max-w-sm rounded-xl border border-pink-500/40 bg-pink-500/10 px-4 py-3 text-pink-100 backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="flex-1 text-xs">
              <p className="text-sm font-semibold text-pink-100">Local mode</p>
              <p className="text-pink-100/80">
                Tasks are stored in this browser. Connect to Supabase when you&apos;re ready to sync.
              </p>
              {localModeReason === 'DATABASE_NOT_SETUP' ? (
                <p className="mt-2 text-[11px] text-pink-100/70">
                  Run <code className="font-mono text-pink-100">supabase db push</code> or apply{' '}
                  <code className="font-mono text-pink-100">supabase/migrations/20250105000000_ballet_project_management.sql</code>
                  {' '}to enable the remote database.
                </p>
              ) : localModeReason ? (
                <p className="mt-2 text-[11px] text-pink-100/70">{localModeReason}</p>
              ) : null}
            </div>
            <button
              onClick={retryRemoteLoad}
              className="rounded-md border border-pink-400/60 px-3 py-1 text-[11px] font-semibold text-pink-100 hover:bg-pink-500/20"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      {/* Top Header */}
      <div className="sticky top-4 z-30 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-pink-500/5 rounded-b-2xl">
        <div className="flex items-center gap-4 px-6 py-3">
          {/* Workspace & Project Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProjectList(!showProjectList)}
              className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-700/60 hover:border-pink-500/30 transition-all duration-200 shadow-lg shadow-pink-500/5"
            >
              <span className="text-lg drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">{currentProject?.icon || '📁'}</span>
              <span>{currentProject?.name || 'Select Project'}</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProjectList && (
              <div className="absolute left-6 top-12 z-50 w-80 rounded-xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-pink-500/10">
                <div className="p-2">
                  <div className="mb-2 px-2 text-xs font-semibold uppercase text-slate-400 tracking-wider">Projects</div>
                  {projects.filter(p => p.workspaceId === currentWorkspaceId).map(project => (
                    <button
                      key={project.id}
                      onClick={() => handleSetCurrentProject(project.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                        project.id === currentProjectId
                          ? 'bg-gradient-to-r from-pink-600/20 to-pink-500/10 text-pink-300 border border-pink-500/30 shadow-lg shadow-pink-500/10'
                          : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <span className="text-lg">{project.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-slate-500">{tasks.filter(t => t.projectId === project.id).length} tasks</div>
                      </div>
                      <span className={`h-2 w-2 rounded-full shadow-lg`} style={{ backgroundColor: project.color, boxShadow: `0 0 8px ${project.color}80` }}></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View Switcher */}
          <div className="ml-auto flex items-center gap-1 rounded-lg border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm p-1">
            {[
              { view: 'list' as ViewType, icon: '☰', label: 'List' },
              { view: 'board' as ViewType, icon: '📋', label: 'Board' },
              { view: 'timeline' as ViewType, icon: '📊', label: 'Timeline' },
              { view: 'calendar' as ViewType, icon: '📅', label: 'Calendar' },
              { view: 'features' as ViewType, icon: '✓', label: 'Features' },
            ].map(({ view, icon, label }) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  currentView === view
                    ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
                }`}
              >
                <span>{icon}</span>
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFoldersDrawer(true)}
              className="hidden md:flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-1.5 text-sm font-medium text-slate-200 hover:text-white hover:border-pink-500/50"
            >
              <span>📁</span> Folders
            </button>
            <button
              onClick={() => setShowCreateProject(true)}
              className="hidden md:flex items-center gap-2 rounded-lg border border-pink-500/40 bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-100 hover:bg-pink-500/20"
            >
              <span>➕</span> New Project
            </button>
            {currentProject && (
              <button
                onClick={() => setShowEditProject(true)}
                className="hidden md:flex items-center gap-2 rounded-lg border border-slate-600/60 bg-slate-800/40 px-4 py-1.5 text-sm font-medium text-slate-200 hover:text-white hover:border-pink-500/50"
              >
                ⚙️ Edit
              </button>
            )}
            <button
              onClick={() => openCreateTask()}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-pink-500/30 hover:from-pink-700 hover:to-pink-600 transition-all duration-200 hover:scale-105 hover:shadow-pink-500/40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-full pt-6">
        {/* Left Sidebar */}
        <ProjectSidebar
          project={currentProject}
          workspace={currentWorkspace}
          projects={projects.filter(p => p.workspaceId === currentWorkspaceId)}
          folders={folders.filter(folder => folder.workspaceId === currentWorkspaceId)}
          onProjectSelect={handleSetCurrentProject}
        />

        {/* Main View Area */}
        <div className="flex-1 overflow-auto h-full">
          {currentView === 'features' ? (
            <FeaturesChecklist />
          ) : !currentProject ? (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center">
                <div className="mb-4 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] flex justify-center">
                  <img src="/ballet-new-logo.png" alt="Ballet Logo" className="w-24 h-24" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-100 mb-2">Welcome to Ballet</h2>
                <p className="text-slate-400 mb-6">Select a project from the sidebar to get started</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {currentView === 'list' && (
                <ListView
                  project={currentProject}
                  tasks={projectTasks}
                  users={users}
                  onTaskClick={setSelectedTaskId}
                  onTaskUpdate={updateTask}
                  onTaskComplete={completeTask}
                />
              )}
              {currentView === 'board' && (
                <BoardView
                  project={currentProject}
                  tasks={projectTasks}
                  users={users}
                  onTaskClick={setSelectedTaskId}
                  onTaskUpdate={updateTask}
                  onTaskComplete={completeTask}
                  onAddTask={openCreateTask}
                />
              )}
              {currentView === 'timeline' && (
                <TimelineView
                  project={currentProject}
                  tasks={projectTasks}
                  users={users}
                  onTaskClick={setSelectedTaskId}
                />
              )}
              {currentView === 'calendar' && (
                <CalendarView
                  project={currentProject}
                  tasks={projectTasks}
                  users={users}
                  onTaskClick={setSelectedTaskId}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && currentProject && (
        <CreateTaskModal
          project={currentProject}
          users={users}
          currentUser={currentUser}
          defaultSectionId={taskModalSectionId}
          existingTasks={projectTasks}
          onClose={() => setShowCreateTask(false)}
          onCreate={createTask}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          project={currentProject}
          users={users}
          projectTasks={projectTasks}
          currentUser={currentUser}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onComplete={completeTask}
          onCreateSubtask={createSubtask}
          onRemoveSubtask={removeSubtask}
          onToggleSubtaskComplete={toggleSubtaskCompletion}
        />
      )}

      {currentWorkspace && (
        <CreateProjectModal
          open={showCreateProject}
          workspaceName={currentWorkspace.name}
          mode="create"
          onCreate={handleCreateProject}
          onClose={() => setShowCreateProject(false)}
        />
      )}

      {currentWorkspace && currentProject && (
        <CreateProjectModal
          open={showEditProject}
          workspaceName={currentWorkspace.name}
          mode="edit"
          project={currentProject}
          onUpdate={handleUpdateProject}
          onClose={() => setShowEditProject(false)}
        />
      )}

      <ProjectFoldersDrawer
        open={showFoldersDrawer}
        folders={folders}
        projects={projects.filter(project => project.workspaceId === currentWorkspaceId)}
        onClose={() => setShowFoldersDrawer(false)}
        onCreateFolder={handleCreateFolder}
        onUpdateFolder={handleUpdateFolder}
        onDeleteFolder={handleDeleteFolder}
      />
    </div>
  )
}
