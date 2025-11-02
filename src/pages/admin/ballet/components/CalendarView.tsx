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
    <div className="rounded-lg border border-slate-200 bg-white">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="rounded p-2 hover:bg-slate-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="rounded px-3 py-1 text-sm font-medium hover:bg-slate-100"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="rounded p-2 hover:bg-slate-100"
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
        <div className="grid grid-cols-7 gap-px mb-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-center text-xs font-semibold uppercase text-slate-600">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-px bg-slate-200">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="bg-slate-50 p-2" />
            }

            const dayTasks = getTasksForDay(day)
            const today = isToday(day)

            return (
              <div
                key={day}
                className={`min-h-[120px] bg-white p-2 ${today ? 'ring-2 ring-pink-400 ring-inset' : ''}`}
              >
                <div className={`mb-2 text-sm font-semibold ${
                  today ? 'flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-white' : 'text-slate-900'
                }`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map(task => {
                    const assignee = task.assigneeId ? getUserById(users, task.assigneeId) : null
                    return (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task.id)}
                        className="cursor-pointer rounded border border-slate-200 bg-slate-50 p-1.5 text-xs hover:border-pink-300 hover:bg-pink-50"
                      >
                        <div className="font-medium text-slate-900 truncate">{task.title}</div>
                        {assignee && (
                          <div className="mt-0.5 text-slate-500">{assignee.avatar}</div>
                        )}
                      </div>
                    )
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-slate-500">+{dayTasks.length - 3} more</div>
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
