// Timeline View Component - Gantt chart style

import React from 'react'
import { Project, Task, User } from '../types'
import { getUserById } from '../store'

interface TimelineViewProps {
  project: Project
  tasks: Task[]
  users: User[]
  onTaskClick: (taskId: string) => void
}

export function TimelineView({ project, tasks, users, onTaskClick }: TimelineViewProps) {
  // Calculate timeline range
  const tasksWithDates = tasks.filter(t => t.startDate && t.dueDate)
  
  if (tasksWithDates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-12 text-center">
        <div className="text-4xl mb-3">📊</div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">No timeline data</h3>
        <p className="text-sm text-slate-500">Add start and due dates to tasks to see them on the timeline</p>
      </div>
    )
  }

  const allDates = tasksWithDates.flatMap(t => [
    new Date(t.startDate!).getTime(),
    new Date(t.dueDate!).getTime()
  ])
  const minDate = new Date(Math.min(...allDates))
  const maxDate = new Date(Math.max(...allDates))
  
  // Generate months between min and max
  const months: Date[] = []
  const current = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  while (current <= maxDate) {
    months.push(new Date(current))
    current.setMonth(current.getMonth() + 1)
  }

  const getTaskPosition = (task: Task) => {
    const start = new Date(task.startDate!).getTime()
    const end = new Date(task.dueDate!).getTime()
    const total = maxDate.getTime() - minDate.getTime()
    
    const left = ((start - minDate.getTime()) / total) * 100
    const width = ((end - start) / total) * 100
    
    return { left: `${left}%`, width: `${Math.max(width, 2)}%` }
  }

  const getBarColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
      {/* Timeline Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
        <div className="flex">
          <div className="w-64 flex-shrink-0 border-r border-slate-200 px-4 py-3">
            <span className="text-xs font-semibold uppercase text-slate-600">Task</span>
          </div>
          <div className="flex flex-1">
            {months.map((month, idx) => (
              <div
                key={idx}
                className="flex-1 border-r border-slate-200 px-2 py-3 text-center"
              >
                <div className="text-xs font-semibold text-slate-900">
                  {month.toLocaleDateString('en-US', { month: 'short' })}
                </div>
                <div className="text-xs text-slate-500">
                  {month.getFullYear()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Body */}
      <div>
        {tasksWithDates.map((task, idx) => {
          const assignee = task.assigneeId ? getUserById(users, task.assigneeId) : null
          const position = getTaskPosition(task)

          return (
            <div
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className={`flex cursor-pointer transition-colors hover:bg-pink-50 ${
                idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
              }`}
            >
              {/* Task Info */}
              <div className="w-64 flex-shrink-0 border-r border-slate-200 px-4 py-3">
                <div className="text-sm font-medium text-slate-900 truncate">{task.title}</div>
                {assignee && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <span>{assignee.avatar}</span>
                    <span>{assignee.name.split(' ')[0]}</span>
                  </div>
                )}
              </div>

              {/* Timeline Bar */}
              <div className="relative flex-1 py-3">
                <div
                  className={`absolute top-1/2 h-6 -translate-y-1/2 rounded ${getBarColor(task.priority)} shadow-sm transition-all hover:shadow-md`}
                  style={position}
                >
                  <div className="flex h-full items-center justify-center px-2">
                    <span className="truncate text-xs font-medium text-white">
                      {task.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
