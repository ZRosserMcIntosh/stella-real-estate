// Task Detail Modal Component

import React, { useState } from 'react'
import { Task, Project, User } from '../types'
import { getUserById } from '../store'

interface TaskDetailModalProps {
  task: Task
  project: Project | null
  users: User[]
  projectTasks: Task[]
  currentUser: User | null
  onClose: () => void
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onDelete: (taskId: string) => void
  onComplete: (taskId: string) => void
}

export function TaskDetailModal({ task, project, users, projectTasks, currentUser, onClose, onUpdate, onDelete, onComplete }: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)
  const [newComment, setNewComment] = useState('')
  const [selectedDependency, setSelectedDependency] = useState('')

  const assignee = task.assigneeId ? getUserById(users, task.assigneeId) : null
  const creator = getUserById(users, task.creatorId)
  const dependencyOptions = projectTasks.filter(t => t.id !== task.id)
  const dependencyDetails = task.dependsOn
    .map(depId => projectTasks.find(t => t.id === depId))
    .filter((t): t is Task => Boolean(t))

  const handleSave = () => {
    onUpdate(task.id, editedTask)
    setIsEditing(false)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return
    
    const comment = {
      id: `comment-${Date.now()}`,
      text: newComment,
      authorId: currentUser?.id || task.creatorId,
      mentions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: [],
    }
    
    onUpdate(task.id, {
      comments: [...task.comments, comment]
    })
    setNewComment('')
  }

  const handleAddDependency = () => {
    if (!selectedDependency || task.dependsOn.includes(selectedDependency)) return
    onUpdate(task.id, { dependsOn: [...task.dependsOn, selectedDependency] })
    setSelectedDependency('')
  }

  const handleRemoveDependency = (dependencyId: string) => {
    onUpdate(task.id, { dependsOn: task.dependsOn.filter(id => id !== dependencyId) })
  }

  const toggleMilestone = () => {
    onUpdate(task.id, { isMilestone: !task.isMilestone })
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not set'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'review': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onComplete(task.id)}
              className={`h-6 w-6 flex-shrink-0 rounded border-2 transition-colors ${
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
            <span className="text-xs font-semibold text-slate-500 uppercase">
              {project?.name || 'Task'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMilestone}
              className={`rounded p-2 text-sm ${
                task.isMilestone
                  ? 'text-yellow-400 bg-yellow-100/20 border border-yellow-300/40'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {task.isMilestone ? '★ Milestone' : '☆ Mark milestone'}
            </button>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded p-2 text-slate-600 hover:bg-slate-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Delete this task?')) {
                  onDelete(task.id)
                }
              }}
              className="rounded p-2 text-red-600 hover:bg-red-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="w-full text-2xl font-semibold text-slate-900 border-0 border-b-2 border-slate-300 focus:border-pink-500 focus:outline-none px-0"
                  />
                ) : (
                  <h1 className="text-2xl font-semibold text-slate-900">{task.title}</h1>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
                {isEditing ? (
                  <textarea
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    placeholder="Add a description..."
                  />
                ) : (
                  <p className="text-slate-700">{task.description || 'No description'}</p>
                )}
              </div>

              {/* Save/Cancel Buttons */}
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditedTask(task)
                      setIsEditing(false)
                    }}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Comments */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Comments</h3>
                <div className="space-y-3">
                  {task.comments.map(comment => {
                    const author = getUserById(users, comment.authorId)
                    return (
                      <div key={comment.id} className="flex gap-3">
                        <div className="flex-shrink-0 text-2xl">{author?.avatar || '👤'}</div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-medium text-slate-900">{author?.name || 'Unknown'}</span>
                            <span className="text-xs text-slate-500">
                              {new Date(comment.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-slate-700">{comment.text}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Add Comment */}
                <div className="mt-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    placeholder="Add a comment..."
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="mt-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-4">
              {/* Assignee */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Assignee</div>
                {assignee ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{assignee.avatar}</span>
                    <div>
                      <div className="font-medium text-slate-900">{assignee.name}</div>
                      <div className="text-xs text-slate-500">{assignee.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">Unassigned</div>
                )}
              </div>

              {/* Status */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Status</div>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>

              {/* Priority */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Priority</div>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              {/* Dates */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Dates</div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Start:</span>{' '}
                    <span className="text-slate-900">{formatDate(task.startDate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Due:</span>{' '}
                    <span className="text-slate-900">{formatDate(task.dueDate)}</span>
                  </div>
                  {task.completedAt && (
                    <div>
                      <span className="text-slate-500">Completed:</span>{' '}
                      <span className="text-slate-900">{formatDate(task.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {task.tags.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dependencies */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Dependencies</div>
                {task.dependsOn.length === 0 ? (
                  <p className="text-xs text-slate-500">No blocking tasks.</p>
                ) : (
                  <div className="space-y-1">
                    {dependencyDetails.map(dep => (
                      <div key={dep.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                        <span className="truncate">{dep.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDependency(dep.id)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex gap-1">
                  <select
                    value={selectedDependency}
                    onChange={(e) => setSelectedDependency(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-xs focus:border-pink-500 focus:outline-none"
                  >
                    <option value="">Select task</option>
                    {dependencyOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddDependency}
                    disabled={!selectedDependency}
                    className="rounded-lg bg-pink-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Created By */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Created By</div>
                {creator && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{creator.avatar}</span>
                    <span className="text-sm text-slate-700">{creator.name}</span>
                  </div>
                )}
                <div className="mt-1 text-xs text-slate-500">
                  {new Date(task.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
