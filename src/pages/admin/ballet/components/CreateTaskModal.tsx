// Create Task Modal Component

import React, { useEffect, useState } from 'react'
import { Project, Task, User, Priority, TaskStatus } from '../types'

interface CreateTaskModalProps {
  project: Project
  users: User[]
  currentUser: User | null
  existingTasks: Task[]
  defaultSectionId?: string
  onClose: () => void
  onCreate: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function CreateTaskModal({ project, users, currentUser, existingTasks, defaultSectionId, onClose, onCreate }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sectionId: project.sections[0]?.id || '',
    assigneeId: '',
    priority: 'medium' as Priority,
    status: 'todo' as TaskStatus,
    dueDate: '',
    startDate: '',
    tags: [] as string[],
    isMilestone: false,
    dependsOn: [] as string[],
  })

  const [tagInput, setTagInput] = useState('')
  const dependencyOptions = existingTasks.filter(task => task.id && task.id.length > 0)

  useEffect(() => {
    if (defaultSectionId) {
      setFormData(prev => ({ ...prev, sectionId: defaultSectionId }))
    } else if (!formData.sectionId && project.sections.length > 0) {
      setFormData(prev => ({ ...prev, sectionId: project.sections[0].id }))
    }
  }, [defaultSectionId, project.sections])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      description: formData.description,
      projectId: project.id,
      sectionId: formData.sectionId,
      assigneeId: formData.assigneeId || undefined,
      creatorId: currentUser?.id || 'local-owner',
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      startDate: formData.startDate || undefined,
      tags: formData.tags,
      blockedBy: [],
      subtasks: [],
      collaboratorIds: [],
      followerIds: [],
      customFields: [],
      isMilestone: formData.isMilestone,
      dependsOn: formData.dependsOn,
      attachments: [],
      comments: [],
      position: 0,
    }

    onCreate(newTask)
  }

  const toggleDependency = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      dependsOn: prev.dependsOn.includes(taskId)
        ? prev.dependsOn.filter(id => id !== taskId)
        : [...prev.dependsOn, taskId],
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700/60 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-pink-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Create New Task</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Task Name *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                placeholder="Enter task name..."
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                placeholder="Add more details..."
              />
            </div>

            {/* Section & Assignee Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Section
                </label>
                <select
                  value={formData.sectionId}
                  onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-100 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                >
                  {project.sections.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Assignee
                </label>
                <select
                  value={formData.assigneeId}
                  onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-100 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.avatar} {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority & Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-100 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-100 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-100 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-100 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
            </div>

            {/* Milestone & Dependencies */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Milestone</h4>
                    <p className="text-xs text-slate-400">Highlight this task on timeline and calendar.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isMilestone: !formData.isMilestone })}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                      formData.isMilestone
                        ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40'
                        : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {formData.isMilestone ? 'Milestone' : 'Standard task'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Dependencies
                </label>
                <div className="max-h-32 overflow-y-auto rounded-xl border border-slate-700 bg-slate-800/40">
                  {dependencyOptions.length === 0 ? (
                    <div className="p-3 text-xs text-slate-400">No other tasks yet.</div>
                  ) : (
                    dependencyOptions.map(task => (
                      <label
                        key={task.id}
                        className="flex cursor-pointer items-center gap-2 border-b border-slate-700/40 px-3 py-2 text-xs last:border-b-0 hover:bg-slate-700/40"
                      >
                        <input
                          type="checkbox"
                          checked={formData.dependsOn.includes(task.id)}
                          onChange={() => toggleDependency(task.id)}
                          className="rounded border-slate-600 text-pink-500 focus:ring-pink-500/40 bg-slate-800"
                        />
                        <span className="text-slate-200">{task.title}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  placeholder="Add tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-xl bg-slate-700/60 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-700/60 border border-slate-600 px-2.5 py-1 text-xs text-slate-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-slate-400 hover:text-pink-300 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className="rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 hover:from-pink-500 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
