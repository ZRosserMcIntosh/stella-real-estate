import React, { useState } from 'react';

interface Feature {
  id: string;
  name: string;
  description: string;
  implemented: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  features: Feature[];
  expanded: boolean;
}

export const FeaturesChecklist: React.FC = () => {
  const [categories, setCategories] = useState<FeatureCategory[]>([
    {
      id: 'core',
      name: 'Core Task Management',
      description: 'Essential task creation and management features',
      expanded: true,
      features: [
        {
          id: 'create-tasks',
          name: 'Create Tasks',
          description: 'Add new tasks with title and description',
          implemented: true,
          priority: 'high'
        },
        {
          id: 'edit-tasks',
          name: 'Edit Tasks',
          description: 'Modify existing task details',
          implemented: true,
          priority: 'high'
        },
        {
          id: 'delete-tasks',
          name: 'Delete Tasks',
          description: 'Remove tasks from projects',
          implemented: false,
          priority: 'high'
        },
        {
          id: 'task-status',
          name: 'Task Status Management',
          description: 'Update task status (Todo, In Progress, Done, etc.)',
          implemented: true,
          priority: 'high'
        },
        {
          id: 'task-priority',
          name: 'Task Priority Levels',
          description: 'Set priority (Low, Medium, High, Urgent)',
          implemented: true,
          priority: 'high'
        },
        {
          id: 'due-dates',
          name: 'Due Dates',
          description: 'Assign and track due dates for tasks',
          implemented: true,
          priority: 'high'
        },
        {
          id: 'task-assignees',
          name: 'Task Assignees',
          description: 'Assign tasks to team members',
          implemented: true,
          priority: 'high'
        },
        {
          id: 'task-tags',
          name: 'Task Tags',
          description: 'Add labels/tags to categorize tasks',
          implemented: true,
          priority: 'medium'
        },
        {
          id: 'subtasks',
          name: 'Subtasks',
          description: 'Break down tasks into smaller subtasks',
          implemented: true,
          priority: 'high'
        },
        {
          id: 'task-dependencies',
          name: 'Task Dependencies',
          description: 'Link tasks that depend on each other',
          implemented: false,
          priority: 'medium'
        }
      ]
    },
    {
      id: 'projects',
      name: 'Project Management',
      description: 'Organize work into projects and portfolios',
      expanded: true,
      features: [
        {
          id: 'create-projects',
          name: 'Create Projects',
          description: 'Set up new projects with details',
          implemented: true,
          priority: 'high'
        },
        {
          id: 'project-sections',
          name: 'Project Sections',
          description: 'Organize tasks within projects into sections',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'project-templates',
          name: 'Project Templates',
          description: 'Save and reuse project structures',
          implemented: false,
          priority: 'low'
        },
        {
          id: 'project-status',
          name: 'Project Status Updates',
          description: 'Share project progress and updates',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'project-overview',
          name: 'Project Overview',
          description: 'Dashboard view of project health and progress',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'portfolios',
          name: 'Portfolios',
          description: 'Group multiple projects together',
          implemented: false,
          priority: 'low'
        }
      ]
    },
    {
      id: 'views',
      name: 'Multiple Views',
      description: 'Different ways to visualize and organize work',
      expanded: true,
      features: [
        {
          id: 'list-view',
          name: 'List View',
          description: 'Traditional list view of tasks',
          implemented: true,
          priority: 'high'
        },
        {
          id: 'board-view',
          name: 'Board View (Kanban)',
          description: 'Visual board with columns for task status',
          implemented: true,
          priority: 'high'
        },
        {
          id: 'timeline-view',
          name: 'Timeline View (Gantt)',
          description: 'Gantt chart visualization of tasks over time',
          implemented: true,
          priority: 'high'
        },
        {
          id: 'calendar-view',
          name: 'Calendar View',
          description: 'Calendar view of tasks by due date',
          implemented: true,
          priority: 'high'
        },
        {
          id: 'dashboard-view',
          name: 'Dashboard View',
          description: 'Analytics and reporting dashboard',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'workload-view',
          name: 'Workload View',
          description: 'See team capacity and task distribution',
          implemented: false,
          priority: 'medium'
        }
      ]
    },
    {
      id: 'collaboration',
      name: 'Team Collaboration',
      description: 'Work together with your team',
      expanded: false,
      features: [
        {
          id: 'comments',
          name: 'Task Comments',
          description: 'Discuss tasks with team members',
          implemented: false,
          priority: 'high'
        },
        {
          id: 'mentions',
          name: '@Mentions',
          description: 'Tag team members in comments',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'attachments',
          name: 'File Attachments',
          description: 'Attach files to tasks',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'activity-feed',
          name: 'Activity Feed',
          description: 'See all recent activity on tasks and projects',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'likes',
          name: 'Likes/Reactions',
          description: 'React to tasks and comments',
          implemented: false,
          priority: 'low'
        },
        {
          id: 'team-pages',
          name: 'Team Pages',
          description: 'Dedicated pages for teams',
          implemented: false,
          priority: 'low'
        }
      ]
    },
    {
      id: 'automation',
      name: 'Automation & Rules',
      description: 'Automate repetitive work',
      expanded: false,
      features: [
        {
          id: 'custom-rules',
          name: 'Custom Rules',
          description: 'Create if-this-then-that automation rules',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'recurring-tasks',
          name: 'Recurring Tasks',
          description: 'Set tasks to repeat on a schedule',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'templates',
          name: 'Task Templates',
          description: 'Save and reuse task configurations',
          implemented: false,
          priority: 'low'
        },
        {
          id: 'bulk-actions',
          name: 'Bulk Actions',
          description: 'Perform actions on multiple tasks at once',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'auto-assignment',
          name: 'Auto-assignment',
          description: 'Automatically assign tasks based on rules',
          implemented: false,
          priority: 'low'
        }
      ]
    },
    {
      id: 'search-filter',
      name: 'Search & Filter',
      description: 'Find and organize information quickly',
      expanded: false,
      features: [
        {
          id: 'global-search',
          name: 'Global Search',
          description: 'Search across all tasks and projects',
          implemented: false,
          priority: 'high'
        },
        {
          id: 'advanced-filters',
          name: 'Advanced Filters',
          description: 'Filter tasks by multiple criteria',
          implemented: false,
          priority: 'high'
        },
        {
          id: 'saved-searches',
          name: 'Saved Searches',
          description: 'Save and reuse common search queries',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'custom-fields',
          name: 'Custom Fields',
          description: 'Add custom data fields to tasks',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'sorting',
          name: 'Advanced Sorting',
          description: 'Sort tasks by various criteria',
          implemented: false,
          priority: 'medium'
        }
      ]
    },
    {
      id: 'reporting',
      name: 'Reporting & Analytics',
      description: 'Track progress and generate insights',
      expanded: false,
      features: [
        {
          id: 'progress-tracking',
          name: 'Progress Tracking',
          description: 'Visual progress indicators for projects',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'custom-reports',
          name: 'Custom Reports',
          description: 'Create custom analytics reports',
          implemented: false,
          priority: 'low'
        },
        {
          id: 'burndown-charts',
          name: 'Burndown Charts',
          description: 'Track work completion over time',
          implemented: false,
          priority: 'low'
        },
        {
          id: 'time-tracking',
          name: 'Time Tracking',
          description: 'Log time spent on tasks',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'export-data',
          name: 'Export Data',
          description: 'Export tasks and projects to CSV/JSON',
          implemented: false,
          priority: 'low'
        }
      ]
    },
    {
      id: 'notifications',
      name: 'Notifications & Updates',
      description: 'Stay informed about important changes',
      expanded: false,
      features: [
        {
          id: 'inbox',
          name: 'Inbox',
          description: 'Centralized inbox for all notifications',
          implemented: false,
          priority: 'high'
        },
        {
          id: 'email-notifications',
          name: 'Email Notifications',
          description: 'Get updates via email',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'notification-preferences',
          name: 'Notification Preferences',
          description: 'Customize what notifications you receive',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'due-date-reminders',
          name: 'Due Date Reminders',
          description: 'Get reminded about upcoming due dates',
          implemented: false,
          priority: 'high'
        }
      ]
    },
    {
      id: 'integrations',
      name: 'Integrations & API',
      description: 'Connect with other tools',
      expanded: false,
      features: [
        {
          id: 'api',
          name: 'REST API',
          description: 'Programmatic access to Ballet data',
          implemented: false,
          priority: 'low'
        },
        {
          id: 'webhooks',
          name: 'Webhooks',
          description: 'Get notified of events via webhooks',
          implemented: false,
          priority: 'low'
        },
        {
          id: 'email-integration',
          name: 'Email Integration',
          description: 'Create tasks from emails',
          implemented: false,
          priority: 'low'
        },
        {
          id: 'calendar-sync',
          name: 'Calendar Sync',
          description: 'Sync with Google Calendar, Outlook, etc.',
          implemented: false,
          priority: 'low'
        }
      ]
    },
    {
      id: 'mobile',
      name: 'Mobile & Offline',
      description: 'Access on the go',
      expanded: false,
      features: [
        {
          id: 'responsive-design',
          name: 'Responsive Design',
          description: 'Mobile-friendly interface',
          implemented: false,
          priority: 'medium'
        },
        {
          id: 'offline-mode',
          name: 'Offline Mode',
          description: 'Work without internet connection',
          implemented: false,
          priority: 'low'
        },
        {
          id: 'mobile-app',
          name: 'Mobile App',
          description: 'Native mobile application',
          implemented: false,
          priority: 'low'
        }
      ]
    }
  ]);

  const toggleCategory = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  const toggleFeature = (categoryId: string, featureId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              features: cat.features.map(feat =>
                feat.id === featureId
                  ? { ...feat, implemented: !feat.implemented }
                  : feat
              )
            }
          : cat
      )
    );
  };

  const getProgressStats = () => {
    let total = 0;
    let implemented = 0;
    
    categories.forEach(cat => {
      cat.features.forEach(feat => {
        total++;
        if (feat.implemented) implemented++;
      });
    });

    return { total, implemented, percentage: Math.round((implemented / total) * 100) };
  };

  const stats = getProgressStats();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-300 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-300 bg-green-500/20 border-green-500/30';
      default: return 'text-slate-300 bg-slate-600/20 border-slate-500/30';
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Header */}
      <div className="border-b border-slate-700/50 p-6 bg-slate-800/40 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-3">
            <img src="/ballet-new-logo.png" alt="Ballet Logo" className="w-8 h-8" />
            Ballet Features Checklist
          </h1>
          <p className="text-slate-400 mb-4">
            Track the implementation of Asana-like features in Ballet project management tool
          </p>
          
          {/* Progress Bar */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-lg shadow-pink-500/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">
                Overall Progress
              </span>
              <span className="text-sm font-bold bg-gradient-to-r from-pink-500 to-pink-600 text-transparent bg-clip-text">
                {stats.implemented} / {stats.total} ({stats.percentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-700/40 rounded-full h-3 border border-slate-600/30">
              <div
                className="bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600 h-full rounded-full transition-all duration-300 shadow-lg shadow-pink-500/50"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="overflow-y-auto relative z-10" style={{ height: 'calc(100vh - 250px)' }}>
        <div className="max-w-6xl mx-auto p-6 space-y-4">
          {categories.map(category => {
            const categoryStats = {
              total: category.features.length,
              implemented: category.features.filter(f => f.implemented).length
            };
            const categoryPercentage = Math.round((categoryStats.implemented / categoryStats.total) * 100);

            return (
              <div
                key={category.id}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl shadow-pink-500/5 overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {category.expanded ? (
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-pink-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-pink-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-slate-100 group-hover:text-pink-200 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-300">
                      {categoryStats.implemented}/{categoryStats.total}
                    </span>
                    <div className="w-24 bg-slate-700/40 rounded-full h-2 border border-slate-600/30">
                      <div
                        className="bg-gradient-to-r from-pink-600 to-pink-500 h-full rounded-full transition-all duration-300 shadow-md shadow-pink-500/30"
                        style={{ width: `${categoryPercentage}%` }}
                      />
                    </div>
                  </div>
                </button>

                {/* Features List */}
                {category.expanded && (
                  <div className="border-t border-slate-700/50">
                    {category.features.map(feature => (
                      <div
                        key={feature.id}
                        className="px-6 py-3 hover:bg-slate-700/30 border-b border-slate-700/30 last:border-b-0 transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleFeature(category.id, feature.id)}
                            className="mt-0.5 flex-shrink-0 focus:outline-none hover:scale-110 transition-transform"
                          >
                            {feature.implemented ? (
                              <svg className="w-5 h-5 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                              </svg>
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${
                                feature.implemented
                                  ? 'text-slate-500 line-through'
                                  : 'text-slate-200 group-hover:text-pink-200'
                              } transition-colors`}>
                                {feature.name}
                              </h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${getPriorityColor(feature.priority)}`}>
                                {feature.priority}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
