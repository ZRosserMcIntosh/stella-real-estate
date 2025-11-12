// Project Sidebar Component

import React from 'react'
import { Project, Workspace, ProjectFolder } from '../types'

interface ProjectSidebarProps {
  project: Project | null
  workspace: Workspace | undefined | null
  projects: Project[]
  folders: ProjectFolder[]
  onProjectSelect: (projectId: string) => void
}

export function ProjectSidebar({ project, workspace, projects, folders = [], onProjectSelect }: ProjectSidebarProps) {
  const projectFolders = project ? folders.filter(folder => folder.projectIds.includes(project.id)) : []
  if (!project) {
    return (
      <div className="w-64 h-full border-r border-slate-700/50 bg-slate-800/40 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="text-sm text-slate-400">Select a project to view details</div>
      </div>
    )
  }

  return (
    <div className="w-64 h-full border-r border-slate-700/50 bg-slate-800/40 backdrop-blur-sm overflow-y-auto">
      {/* Project Header */}
      <div className="border-b border-slate-700/50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">{project.icon}</span>
          <h2 className="font-semibold text-slate-100 text-sm">{project.name}</h2>
        </div>
        <p className="text-xs text-slate-400 line-clamp-2">{project.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            project.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
            project.status === 'planning' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
            project.status === 'on-hold' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
            'bg-slate-600/20 text-slate-300 border-slate-500/30'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Details */}
      <div className="p-4 space-y-4">
        {project.dueDate && (
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1 tracking-wider">Due Date</div>
            <div className="text-sm text-slate-200">
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
          <div className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">Sections</div>
          <div className="space-y-1">
            {project.sections.map(section => (
              <div
                key={section.id}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-slate-700/40 transition-colors group"
              >
                <span className="text-slate-300 group-hover:text-pink-200">{section.name}</span>
                <span className="text-xs text-slate-500 bg-slate-700/40 px-1.5 py-0.5 rounded">{section.taskIds.length}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">Tags</div>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-slate-700/60 border border-slate-600/30 px-2 py-0.5 text-xs text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Folders */}
        {projectFolders.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">Folders</div>
            <div className="space-y-1">
              {projectFolders.map(folder => (
                <div key={folder.id} className="flex items-center gap-2 rounded-lg border border-slate-700/60 px-2 py-1 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: folder.color }}></span>
                  <span className="text-slate-200">{folder.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Other Projects */}
      {projects.length > 1 && (
        <div className="border-t border-slate-700/50 p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">Other Projects</div>
          <div className="space-y-1">
            {projects
              .filter(p => p.id !== project.id)
              .slice(0, 5)
              .map(p => (
                <button
                  key={p.id}
                  onClick={() => onProjectSelect(p.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-700/40 transition-all group"
                >
                  <span className="drop-shadow-[0_0_6px_rgba(236,72,153,0.2)]">{p.icon}</span>
                  <span className="flex-1 truncate text-slate-300 group-hover:text-pink-200">{p.name}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
