// Calendar View Component

import React, { useState } from 'react'
import { Project, Task, User } from '../types'
import { getUserById } from '../store'

interface CalendarViewProps {
  project: Project
  tasks: Task[]
  users: User[]
  onTaskClick: (taskId: string) => void
}

export function CalendarView({ project, tasks, users, onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Generate calendar grid
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  // Get tasks for a specific day
  const getTasksForDay = (day: number): Task[] => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0]
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0]
      return taskDate === dateStr
    })
  }

  const isToday = (day: number) => {
    const today = new Date()
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm shadow-2xl shadow-pink-500/5">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 px-6 py-4 bg-slate-900/40">
        <h2 className="text-lg font-semibold text-slate-100">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-700/60 hover:text-pink-400 transition-all"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-700/60 hover:text-pink-300 transition-all"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-700/60 hover:text-pink-400 transition-all"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Names */}
        <div className="grid grid-cols-7 gap-px mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="bg-slate-900/20 rounded-lg p-2" />
            }

            const dayTasks = getTasksForDay(day)
            const today = isToday(day)

            return (
              <div
                key={day}
                className={`min-h-[120px] bg-slate-800/40 rounded-lg p-2 border transition-all ${
                  today 
                    ? 'border-pink-500/50 ring-2 ring-pink-500/30 shadow-lg shadow-pink-500/20' 
                    : 'border-slate-700/30 hover:border-slate-600/50'
                }`}
              >
                <div className={`mb-2 text-sm font-semibold ${
                  today 
                    ? 'flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-500/50' 
                    : 'text-slate-300'
                }`}>
                  {day}
                </div>
                <div className="space-y-1.5">
                  {dayTasks.slice(0, 3).map(task => {
                    const assignee = task.assigneeId ? getUserById(users, task.assigneeId) : null
                    return (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task.id)}
                        className="cursor-pointer rounded-lg border border-slate-600/40 bg-slate-700/40 p-1.5 text-xs hover:border-pink-400/60 hover:bg-slate-700/60 hover:shadow-md hover:shadow-pink-500/20 transition-all"
                      >
                        <div className="flex items-center gap-1 text-slate-200">
                          {task.isMilestone && <span className="text-yellow-300 text-xs">★</span>}
                          <span className="font-medium truncate">{task.title}</span>
                        </div>
                        {assignee && (
                          <div className="mt-1 flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-[8px] font-medium text-white">
                              {assignee.name.charAt(0)}
                            </div>
                            <span className="text-slate-400 text-[10px]">{assignee.name.split(' ')[0]}</span>
                          </div>
                        )}
                        {task.dependsOn.length > 0 && (
                          <div className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
                            ⛓ {task.dependsOn.length}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-slate-500 font-medium">+{dayTasks.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
