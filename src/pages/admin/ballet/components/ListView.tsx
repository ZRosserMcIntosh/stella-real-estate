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
      case 'urgent': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Task name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Assignee</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Due date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Priority</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Section</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {project.sections.map(section => {
            const sectionTasks = tasks.filter(t => t.sectionId === section.id)
            if (sectionTasks.length === 0) return null

            return (
              <React.Fragment key={section.id}>
                {/* Section Header Row */}
                <tr className="bg-slate-50">
                  <td colSpan={7} className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-slate-600">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <span className="font-semibold text-slate-900">{section.name}</span>
                      <span className="text-sm text-slate-500">({sectionTasks.length})</span>
                    </div>
                  </td>
                </tr>

                {/* Task Rows */}
                {sectionTasks.map(task => {
                  const assignee = task.assigneeId ? getUserById(users, task.assigneeId) : null

                  return (
                    <tr
                      key={task.id}
                      onClick={() => onTaskClick(task.id)}
                      className="cursor-pointer transition-colors hover:bg-pink-50"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onTaskComplete(task.id)
                          }}
                          className={`h-5 w-5 rounded border-2 transition-colors ${
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
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {task.title}
                          </span>
                          <div className="flex gap-1">
                            {task.subtasks.length > 0 && <span className="text-xs text-slate-400">📋{task.subtasks.length}</span>}
                            {task.comments.length > 0 && <span className="text-xs text-slate-400">💬{task.comments.length}</span>}
                          </div>
                        </div>
                        {task.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{assignee.avatar}</span>
                            <span className="text-sm text-slate-700">{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {task.dueDate ? (
                          <span className="text-sm text-slate-700">
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">No due date</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          task.status === 'completed' ? 'bg-green-100 text-green-700' :
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          task.status === 'review' ? 'bg-purple-100 text-purple-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{section.name}</td>
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
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No tasks yet</h3>
          <p className="text-sm text-slate-500">Create your first task to get started</p>
        </div>
      )}
    </div>
  )
}
