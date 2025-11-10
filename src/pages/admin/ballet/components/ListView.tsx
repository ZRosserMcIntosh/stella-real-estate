// List View Component - Table/Spreadsheet style

import React from 'react'
import { Project, Task, User } from '../types'
import { getUserById } from '../store'

interface ListViewProps {
  project: Project
  tasks: Task[]
  users: User[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskComplete: (taskId: string) => void
}

export function ListView({ project, tasks, users, onTaskClick, onTaskUpdate, onTaskComplete }: ListViewProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      default: return 'bg-slate-600/20 text-slate-300 border-slate-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'in-progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'review': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      default: return 'bg-slate-600/20 text-slate-300 border-slate-500/30'
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm shadow-2xl shadow-pink-500/5">
      <table className="w-full">
        <thead className="border-b border-slate-700/50 bg-slate-900/60">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-700/40" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Task name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Milestone</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Assignee</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Due date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Priority</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Dependencies</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Section</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {project.sections.map(section => {
            const sectionTasks = tasks.filter(t => t.sectionId === section.id)
            if (sectionTasks.length === 0) return null

            return (
              <React.Fragment key={section.id}>
                {/* Section Header Row */}
                <tr className="bg-slate-800/40">
                  <td colSpan={9} className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-500 hover:text-pink-400 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <span className="font-semibold text-slate-100">{section.name}</span>
                      <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-xs text-slate-400">({sectionTasks.length})</span>
                    </div>
                  </td>
                </tr>

                {/* Task Rows */}
                {sectionTasks.map(task => {
                  const assignee = task.assigneeId ? getUserById(users, task.assigneeId) : null
                  const isCompleted = task.status === 'completed' || !!task.completedAt

                  return (
                    <tr
                      key={task.id}
                      onClick={() => onTaskClick(task.id)}
                      className="cursor-pointer transition-all hover:bg-slate-700/40 hover:shadow-lg hover:shadow-pink-500/10 group"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onTaskComplete(task.id)
                          }}
                          className={`h-5 w-5 rounded border-2 transition-all ${
                            isCompleted
                              ? 'border-pink-500 bg-gradient-to-br from-pink-600 to-pink-500 shadow-lg shadow-pink-500/50'
                              : 'border-slate-600 hover:border-pink-400 hover:shadow-md hover:shadow-pink-500/20'
                          }`}
                        >
                          {isCompleted && (
                            <svg className="h-full w-full text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium transition-colors ${
                              isCompleted ? 'text-slate-500 line-through' : 'text-slate-200 group-hover:text-pink-200'
                            }`}>
                              {task.title}
                            </span>
                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              {task.subtasks && task.subtasks.length > 0 && (
                                <span className="text-xs text-slate-400">📋{task.subtasks.length}</span>
                              )}
                              {task.comments && task.comments.length > 0 && (
                                <span className="text-xs text-slate-400">💬{task.comments.length}</span>
                              )}
                            </div>
                          </div>
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="rounded-full bg-slate-700/60 px-2 py-0.5 text-xs text-slate-400 border border-slate-600/30">
                                  {tag}
                                </span>
                              ))}
                              {task.tags.length > 3 && (
                                <span className="text-xs text-slate-500">+{task.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {task.isMilestone ? (
                          <span className="text-yellow-300">★</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {assignee && (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-xs font-medium text-white shadow-md shadow-pink-500/30">
                              {assignee.name.charAt(0)}
                            </div>
                            <span className="text-sm text-slate-300">{assignee.name}</span>
                          </div>
                        )}
                        {!assignee && (
                          <span className="text-sm text-slate-500 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {task.dueDate ? (
                          <span className="text-sm text-slate-400">
                            {new Date(task.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-600 italic">No due date</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {task.priority && (
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-300">
                        {task.dependsOn.length > 0 ? `⛓ ${task.dependsOn.length}` : '—'}
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-400">{section.name}</span>
                      </td>
                    </tr>
                  )
                })}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="text-6xl mb-4 animate-bounce">📋</div>
          <h3 className="text-lg font-semibold text-slate-100 mb-2">No tasks yet</h3>
          <p className="text-sm text-slate-400">Create your first task to get started</p>
        </div>
      )}
    </div>
  )
}
