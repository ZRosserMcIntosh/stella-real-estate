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
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm p-12 text-center shadow-2xl shadow-pink-500/5">
        <div className="text-6xl mb-4 animate-bounce">📊</div>
        <h3 className="text-lg font-semibold text-slate-100 mb-2">No timeline data</h3>
        <p className="text-sm text-slate-400">Add start and due dates to tasks to see them on the timeline</p>
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
      case 'urgent': return 'bg-gradient-to-r from-red-600 to-red-500'
      case 'high': return 'bg-gradient-to-r from-orange-600 to-orange-500'
      case 'medium': return 'bg-gradient-to-r from-yellow-600 to-yellow-500'
      default: return 'bg-gradient-to-r from-blue-600 to-blue-500'
    }
  }

  return (
    <div className="overflow-auto rounded-xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm shadow-2xl shadow-pink-500/5">
      {/* Timeline Header */}
      <div className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex">
          <div className="w-64 flex-shrink-0 border-r border-slate-700/50 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Task</span>
          </div>
          <div className="flex flex-1">
            {months.map((month, idx) => (
              <div
                key={idx}
                className="flex-1 border-r border-slate-700/30 px-2 py-3 text-center"
              >
                <div className="text-xs font-semibold text-slate-100">
                  {month.toLocaleDateString('en-US', { month: 'short' })}
                </div>
                <div className="text-xs text-slate-400">
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
          const isMilestone = task.isMilestone

          return (
            <div
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className={`flex cursor-pointer transition-all hover:bg-slate-700/40 hover:shadow-lg hover:shadow-pink-500/10 group ${
                idx % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/40'
              }`}
            >
              {/* Task Info */}
              <div className="w-64 flex-shrink-0 border-r border-slate-700/50 px-4 py-3">
                <div className="text-sm font-medium text-slate-200 truncate group-hover:text-pink-200 transition-colors">{task.title}</div>
                {assignee && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-[10px] font-medium text-white shadow-sm shadow-pink-500/30">
                      {assignee.name.charAt(0)}
                    </div>
                    <span>{assignee.name.split(' ')[0]}</span>
                  </div>
                )}
              </div>

              {/* Timeline Bar */}
              <div className="relative flex-1 py-3">
                <div
                  className={`absolute top-1/2 -translate-y-1/2 rounded-lg ${getBarColor(task.priority)} shadow-lg transition-all hover:shadow-xl hover:scale-105 ${isMilestone ? 'ring-2 ring-yellow-300' : ''}`}
                  style={isMilestone ? { ...position, width: '12px', left: position.left } : position}
                >
                  <div className="flex h-full items-center justify-center px-3">
                    <span className="truncate text-xs font-medium text-white drop-shadow-sm flex items-center gap-1">
                      {isMilestone && <span>★</span>}
                      {task.title}
                    </span>
                  </div>
                </div>
                {task.dependsOn.length > 0 && (
                  <span className="absolute right-2 top-1 text-[10px] text-slate-400 flex items-center gap-1">
                    ⛓ {task.dependsOn.length}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
