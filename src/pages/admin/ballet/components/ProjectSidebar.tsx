// Project Sidebar Component

import React from 'react'
import { Project, Workspace } from '../types'

interface ProjectSidebarProps {
  project: Project | null
  workspace: Workspace | undefined | null
  projects: Project[]
  onProjectSelect: (projectId: string) => void
}

export function ProjectSidebar({ project, workspace, projects, onProjectSelect }: ProjectSidebarProps) {
  if (!project) {
    return (
      <div className="w-64 border-r border-slate-200 bg-white p-4">
        <div className="text-sm text-slate-500">Select a project to view details</div>
      </div>
    )
  }

  return (
    <div className="w-64 border-r border-slate-200 bg-white">
      {/* Project Header */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{project.icon}</span>
          <h2 className="font-semibold text-slate-900 text-sm">{project.name}</h2>
        </div>
        <p className="text-xs text-slate-500 line-clamp-2">{project.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            project.status === 'active' ? 'bg-green-100 text-green-700' :
            project.status === 'planning' ? 'bg-blue-100 text-blue-700' :
            project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-700' :
            'bg-slate-100 text-slate-700'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Details */}
      <div className="p-4 space-y-4">
        {project.dueDate && (
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Due Date</div>
            <div className="text-sm text-slate-900">
              {new Date(project.dueDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
          </div>
        )}

        {/* Sections */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Sections</div>
          <div className="space-y-1">
            {project.sections.map(section => (
              <div
                key={section.id}
                className="flex items-center justify-between rounded px-2 py-1 text-sm hover:bg-slate-50"
              >
                <span className="text-slate-700">{section.name}</span>
                <span className="text-xs text-slate-500">{section.taskIds.length}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Tags</div>
            <div className="flex flex-wrap gap-1">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Other Projects */}
      {projects.length > 1 && (
        <div className="border-t border-slate-200 p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Other Projects</div>
          <div className="space-y-1">
            {projects
              .filter(p => p.id !== project.id)
              .slice(0, 5)
              .map(p => (
                <button
                  key={p.id}
                  onClick={() => onProjectSelect(p.id)}
                  className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-slate-50"
                >
                  <span>{p.icon}</span>
                  <span className="flex-1 truncate text-slate-700">{p.name}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
