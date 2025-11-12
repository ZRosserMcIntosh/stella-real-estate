// Board View Component - Kanban style

import React from 'react'
import { Project, Task, User } from '../types'
import { getUserById } from '../store'

interface BoardViewProps {
  project: Project
  tasks: Task[]
  users: User[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskComplete: (taskId: string) => void
  onAddTask?: (sectionId?: string) => void
}

export function BoardView({ project, tasks, users, onTaskClick, onTaskUpdate, onTaskComplete, onAddTask }: BoardViewProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      default: return 'bg-slate-600/20 text-slate-300 border-slate-500/30'
    }
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {project.sections.map(section => {
        const sectionTasks = tasks.filter(t => t.sectionId === section.id)
        
        return (
          <div key={section.id} className="flex-shrink-0 w-80">
            {/* Section Header */}
            <div className="mb-3 flex items-center justify-between rounded-lg bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 px-4 py-2.5 shadow-lg">
              <h3 className="font-semibold text-slate-100">{section.name}</h3>
              <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-xs font-medium text-slate-300">{sectionTasks.length}</span>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              {sectionTasks.map(task => {
                const assignee = task.assigneeId ? getUserById(users, task.assigneeId) : null
                
                return (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task.id)}
                    className="group cursor-pointer rounded-lg border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm p-3 shadow-lg shadow-pink-500/5 transition-all hover:border-pink-500/40 hover:shadow-pink-500/20 hover:bg-slate-800/80"
                  >
                    {/* Task Title */}
                    <div className="mb-2 flex items-start gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onTaskComplete(task.id)
                        }}
                        className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 transition-all duration-200 ${
                          task.status === 'completed'
                            ? 'border-green-500 bg-green-500 shadow-lg shadow-green-500/50'
                            : 'border-slate-600 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-400/30'
                        }`}
                      >
                        {task.status === 'completed' && (
                          <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-medium ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                            {task.title}
                          </h4>
                          {task.isMilestone && (
                            <span className="text-xs text-yellow-300 drop-shadow">★</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Task Meta */}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      {/* Priority */}
                      <span className={`rounded-full border px-2 py-0.5 font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>

                      {/* Due Date */}
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-slate-400">
                          📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}

                      {/* Assignee */}
                      {assignee && (
                        <span className="ml-auto flex items-center gap-1 rounded-full bg-slate-700/60 px-2 py-0.5">
                          <span>{assignee.avatar}</span>
                          <span className="text-xs text-slate-300">{assignee.name.split(' ')[0]}</span>
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {task.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {task.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="rounded bg-slate-700/60 border border-slate-600/50 px-1.5 py-0.5 text-xs text-slate-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Subtasks/Comments indicator */}
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      {task.subtasks.length > 0 && (
                        <span className="flex items-center gap-0.5">📋 {task.subtasks.length}</span>
                      )}
                      {task.comments.length > 0 && (
                        <span className="flex items-center gap-0.5">💬 {task.comments.length}</span>
                      )}
                      {task.attachments.length > 0 && (
                        <span className="flex items-center gap-0.5">📎 {task.attachments.length}</span>
                      )}
                      {task.dependsOn.length > 0 && (
                        <span className="flex items-center gap-0.5">⛓ {task.dependsOn.length}</span>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Add Task Button */}
              <button
                onClick={() => onAddTask?.(section.id)}
                className="w-full rounded-lg border border-dashed border-slate-700/50 bg-slate-800/20 p-3 text-sm text-slate-500 transition-all hover:border-pink-500/50 hover:bg-slate-800/40 hover:text-pink-400 hover:shadow-lg hover:shadow-pink-500/10"
              >
                + Add task
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
