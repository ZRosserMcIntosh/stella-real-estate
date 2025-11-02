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
}

export function BoardView({ project, tasks, users, onTaskClick, onTaskUpdate, onTaskComplete }: BoardViewProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {project.sections.map(section => {
        const sectionTasks = tasks.filter(t => t.sectionId === section.id)
        
        return (
          <div key={section.id} className="flex-shrink-0 w-80">
            {/* Section Header */}
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">{section.name}</h3>
              <span className="text-sm text-slate-500">{sectionTasks.length}</span>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              {sectionTasks.map(task => {
                const assignee = task.assigneeId ? getUserById(users, task.assigneeId) : null
                
                return (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task.id)}
                    className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-pink-300 hover:shadow-md"
                  >
                    {/* Task Title */}
                    <div className="mb-2 flex items-start gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onTaskComplete(task.id)
                        }}
                        className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 transition-colors ${
                          task.status === 'completed'
                            ? 'border-green-500 bg-green-500'
                            : 'border-slate-300 hover:border-pink-400'
                        }`}
                      >
                        {task.status === 'completed' && (
                          <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                          {task.title}
                        </h4>
                      </div>
                    </div>

                    {/* Task Meta */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {/* Priority */}
                      <span className={`rounded-full px-2 py-0.5 font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>

                      {/* Due Date */}
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}

                      {/* Assignee */}
                      {assignee && (
                        <span className="ml-auto flex items-center gap-1">
                          <span>{assignee.avatar}</span>
                          <span className="text-xs">{assignee.name.split(' ')[0]}</span>
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {task.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {task.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Subtasks/Comments indicator */}
                    <div className="mt-2 flex gap-3 text-xs text-slate-400">
                      {task.subtasks.length > 0 && (
                        <span>📋 {task.subtasks.length}</span>
                      )}
                      {task.comments.length > 0 && (
                        <span>💬 {task.comments.length}</span>
                      )}
                      {task.attachments.length > 0 && (
                        <span>📎 {task.attachments.length}</span>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Add Task Button */}
              <button className="w-full rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500 transition-colors hover:border-pink-400 hover:text-pink-600">
                + Add task
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
