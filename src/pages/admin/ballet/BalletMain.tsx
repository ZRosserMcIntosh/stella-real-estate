// Ballet Main Component - Full project management interface

import React, { useState } from 'react'
import { initialBalletData, getUserById, getProjectById } from './store'
import { BalletState, ViewType, Project, Task } from './types'
import {
  ProjectSidebar,
  ListView,
  BoardView,
  TimelineView,
  CalendarView,
  CreateTaskModal,
  TaskDetailModal,
  FeaturesChecklist
} from './components'

export default function BalletMain() {
  const [state, setState] = useState<BalletState>(initialBalletData)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showProjectList, setShowProjectList] = useState(false)

  const currentProject = state.currentProjectId 
    ? getProjectById(state.projects, state.currentProjectId) || null
    : null

  const currentWorkspace = state.workspaces.find(w => w.id === state.currentWorkspaceId) || null

  const projectTasks = state.tasks.filter(t => t.projectId === state.currentProjectId)

  // Task actions
  const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
      projects: prev.projects.map(p => 
        p.id === task.projectId 
          ? { ...p, taskIds: [...p.taskIds, newTask.id] }
          : p
      )
    }))
    setShowCreateTask(false)
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    }))
  }

  const deleteTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }))
    setSelectedTaskId(null)
  }

  const completeTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === taskId 
          ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } 
          : t
      )
    }))
  }

  const setCurrentView = (view: ViewType) => {
    setState(prev => ({ ...prev, currentView: view }))
  }

  const setCurrentProject = (projectId: string) => {
    setState(prev => ({ ...prev, currentProjectId: projectId }))
    setShowProjectList(false)
  }

  const selectedTask = selectedTaskId ? state.tasks.find(t => t.id === selectedTaskId) : null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <div className="fixed top-[56px] left-0 right-0 z-30 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-4 px-6 py-3">
          {/* Workspace & Project Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProjectList(!showProjectList)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <span className="text-lg">{currentProject?.icon || '📁'}</span>
              <span>{currentProject?.name || 'Select Project'}</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProjectList && (
              <div className="absolute left-6 top-12 z-50 w-80 rounded-lg border border-slate-200 bg-white shadow-xl">
                <div className="p-2">
                  <div className="mb-2 px-2 text-xs font-semibold uppercase text-slate-500">Projects</div>
                  {state.projects.filter(p => p.workspaceId === state.currentWorkspaceId).map(project => (
                    <button
                      key={project.id}
                      onClick={() => setCurrentProject(project.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        project.id === state.currentProjectId
                          ? 'bg-pink-50 text-pink-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-lg">{project.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-slate-500">{projectTasks.length} tasks</div>
                      </div>
                      <span className={`h-2 w-2 rounded-full`} style={{ backgroundColor: project.color }}></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View Switcher */}
          <div className="ml-auto flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
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
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  state.currentView === view
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{icon}</span>
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Create Task Button */}
          <button
            onClick={() => setShowCreateTask(true)}
            className="flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-pink-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex pt-[112px]">
        {/* Left Sidebar */}
        <ProjectSidebar
          project={currentProject}
          workspace={currentWorkspace}
          projects={state.projects.filter(p => p.workspaceId === state.currentWorkspaceId)}
          onProjectSelect={setCurrentProject}
        />

        {/* Main View Area */}
        <div className="flex-1 overflow-auto">
          {state.currentView === 'features' ? (
            <FeaturesChecklist />
          ) : !currentProject ? (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🩰</div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Welcome to Ballet</h2>
                <p className="text-slate-600 mb-6">Select a project from the sidebar to get started</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {state.currentView === 'list' && (
                <ListView
                  project={currentProject}
                  tasks={projectTasks}
                  users={state.users}
                  onTaskClick={setSelectedTaskId}
                  onTaskUpdate={updateTask}
                  onTaskComplete={completeTask}
                />
              )}
              {state.currentView === 'board' && (
                <BoardView
                  project={currentProject}
                  tasks={projectTasks}
                  users={state.users}
                  onTaskClick={setSelectedTaskId}
                  onTaskUpdate={updateTask}
                  onTaskComplete={completeTask}
                />
              )}
              {state.currentView === 'timeline' && (
                <TimelineView
                  project={currentProject}
                  tasks={projectTasks}
                  users={state.users}
                  onTaskClick={setSelectedTaskId}
                />
              )}
              {state.currentView === 'calendar' && (
                <CalendarView
                  project={currentProject}
                  tasks={projectTasks}
                  users={state.users}
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
          users={state.users}
          onClose={() => setShowCreateTask(false)}
          onCreate={createTask}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          project={currentProject}
          users={state.users}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onComplete={completeTask}
        />
      )}
    </div>
  )
}
