/*
  File: src/data/projects.ts
  Purpose: Provides mock project data for the control panel
  Dependencies: Project and Activity types from types/index.ts
*/

import type { Project, Activity } from '../types';
import { isAuthenticated } from '../utils/auth';
import * as dataUtils from '../utils/data';

// Default project data
const defaultProjects: Project[] = [
  {
    id: 'control-panel',
    title: 'Personal Control Panel',
    description: 'A dashboard for managing personal projects, revenue, writing, and more.',
    status: 'active',
    category: 'Development',
    startDate: '2023-10-15',
    lastUpdated: '2023-11-20',
    progress: 65,
    tags: ['dashboard', 'personal', 'productivity'],
    techStack: ['Astro', 'TypeScript', 'Tailwind CSS'],
    nextSteps: [
      'Implement authentication',
      'Add revenue tracking',
      'Create writing section'
    ],
    notes: 'This project aims to centralize all my personal productivity tools and data.',
    githubUrl: 'https://github.com/username/control-panel',
    liveUrl: 'https://control-panel.example.com',
    visibility: 'private',
    activities: [
      {
        id: 'act-recent-1',
        projectId: 'control-panel',
        type: 'commit',
        date: '2025-03-04',
        description: 'Implemented activity filtering functionality'
      },
      {
        id: 'act-recent-2',
        projectId: 'control-panel',
        type: 'manual',
        date: '2025-03-04',
        description: 'Added test data for today to verify date filtering'
      },
      {
        id: 'act1',
        projectId: 'control-panel',
        type: 'manual',
        date: '2023-11-18',
        description: 'Sketched initial dashboard wireframes'
      },
      {
        id: 'act2',
        projectId: 'control-panel',
        type: 'commit',
        date: '2023-11-20',
        description: 'Initial project setup and configuration'
      }
    ]
  },
  {
    id: 'blog-platform',
    title: 'Personal Blog Platform',
    description: 'A custom blog platform built with modern web technologies.',
    status: 'planning',
    category: 'Writing',
    startDate: '2023-12-01',
    lastUpdated: '2023-12-01',
    progress: 10,
    tags: ['blog', 'writing', 'content'],
    techStack: ['Next.js', 'MDX', 'Tailwind CSS'],
    nextSteps: [],
    visibility: 'public',
    activities: [
      {
        id: 'act3',
        projectId: 'blog-platform',
        type: 'manual',
        date: '2023-12-01',
        description: 'Created initial project plan'
      }
    ]
  },
  {
    id: 'recipe-app',
    title: 'Recipe Collection App',
    description: 'An app to store and organize favorite recipes with meal planning features.',
    status: 'completed',
    category: 'Development',
    startDate: '2023-08-10',
    lastUpdated: '2023-10-05',
    progress: 100,
    tags: ['recipes', 'food', 'organization'],
    techStack: ['React', 'Firebase', 'Styled Components'],
    notes: 'Successfully launched v1.0. Considering adding meal planning in v2.',
    githubUrl: 'https://github.com/username/recipe-app',
    liveUrl: 'https://recipes.example.com',
    visibility: 'public',
    activities: [
      {
        id: 'act4',
        projectId: 'recipe-app',
        type: 'pr',
        date: '2023-10-05',
        description: 'Merged final features for v1.0 release'
      },
      {
        id: 'act5',
        projectId: 'recipe-app',
        type: 'commit',
        date: '2023-09-28',
        description: 'Fixed search functionality bugs'
      }
    ]
  },
  {
    id: 'fitness-tracker',
    title: 'Personal Fitness Tracker',
    description: 'A web app to track workouts, nutrition, and fitness goals.',
    status: 'paused',
    category: 'Health',
    startDate: '2023-07-01',
    lastUpdated: '2023-08-15',
    progress: 45,
    tags: ['fitness', 'health', 'tracking'],
    techStack: ['Vue.js', 'Express', 'MongoDB'],
    nextSteps: [
      'Implement nutrition tracking',
      'Add goal setting features'
    ],
    notes: 'Project paused due to other priorities. Plan to resume in Q1 2024.',
    githubUrl: 'https://github.com/username/fitness-tracker',
    visibility: 'private',
    activities: [
      {
        id: 'act6',
        projectId: 'fitness-tracker',
        type: 'commit',
        date: '2023-08-15',
        description: 'Added workout history visualization'
      }
    ]
  },
  {
    id: 'book-notes',
    title: 'Book Notes System',
    description: 'A system for organizing and retrieving notes from books I\'ve read.',
    status: 'active',
    category: 'Writing',
    startDate: '2023-09-01',
    lastUpdated: '2023-11-10',
    progress: 70,
    tags: ['books', 'notes', 'knowledge-management'],
    techStack: ['Notion API', 'JavaScript'],
    nextSteps: [
      'Add tagging system',
      'Implement search functionality'
    ],
    visibility: 'private',
    activities: [
      {
        id: 'act-recent-3',
        projectId: 'book-notes',
        type: 'manual',
        date: '2025-03-04',
        description: 'Added notes for "Deep Work" by Cal Newport'
      },
      {
        id: 'act7',
        projectId: 'book-notes',
        type: 'manual',
        date: '2023-11-10',
        description: 'Added notes for "Atomic Habits"'
      }
    ]
  },
  {
    id: 'writing-portfolio',
    title: 'Writing Portfolio',
    description: 'A collection of my technical blog posts, articles, and tutorials.',
    status: 'active',
    category: 'Writing',
    startDate: '2023-09-01',
    lastUpdated: '2023-11-15',
    progress: 80,
    tags: ['writing', 'portfolio', 'blogging'],
    techStack: ['Markdown', 'Gatsby', 'React'],
    nextSteps: [
      'Add categories and filtering',
      'Implement newsletter signup',
      'Design PDF download option'
    ],
    notes: 'Focus on technical articles and tutorials for developers.',
    githubUrl: 'https://github.com/username/writing-portfolio',
    liveUrl: 'https://yourname.com/writing',
    visibility: 'public',
    activities: [
      {
        id: 'wp-act1',
        projectId: 'writing-portfolio',
        type: 'manual',
        date: '2023-11-15',
        description: 'Published article on React hooks'
      },
      {
        id: 'wp-act2',
        projectId: 'writing-portfolio',
        type: 'commit',
        date: '2023-11-10',
        description: 'Updated site styling and typography'
      }
    ]
  },
  {
    id: 'task-tracker',
    title: 'Task Tracker',
    description: 'A simple task management application for personal use.',
    status: 'planning',
    category: 'Development',
    startDate: '2023-12-01',
    lastUpdated: '2023-11-25',
    progress: 15,
    tags: ['productivity', 'tasks', 'personal'],
    techStack: ['React', 'Node.js', 'MongoDB'],
    nextSteps: [
      'Create data model',
      'Design UI mockups',
      'Set up database'
    ],
    notes: 'Should include time tracking and priority features.',
    githubUrl: '',
    liveUrl: '',
    visibility: 'private',
    activities: [
      {
        id: 'tt-act1',
        projectId: 'task-tracker',
        type: 'manual',
        date: '2023-11-25',
        description: 'Researched similar applications and features'
      }
    ]
  },
  {
    id: 'newsletter',
    title: 'Tech Insights Newsletter',
    description: 'A weekly newsletter on tech trends and developer tips.',
    status: 'paused',
    category: 'Writing',
    startDate: '2023-08-15',
    lastUpdated: '2023-10-30',
    progress: 40,
    tags: ['newsletter', 'writing', 'audience-building'],
    techStack: ['Substack', 'Markdown', 'ConvertKit'],
    nextSteps: [
      'Plan next 4 issues',
      'Create subscriber onboarding sequence',
      'Design new newsletter template'
    ],
    notes: 'Paused for reconsideration of format and audience targeting.',
    githubUrl: '',
    liveUrl: 'https://newsletter.example.com',
    visibility: 'public',
    activities: [
      {
        id: 'nl-act1',
        projectId: 'newsletter',
        type: 'manual',
        date: '2023-10-30',
        description: 'Sent issue #12 on debugging techniques'
      },
      {
        id: 'nl-act2',
        projectId: 'newsletter',
        type: 'manual',
        date: '2023-10-15',
        description: 'Analyzed subscriber engagement metrics'
      }
    ]
  },
  {
    id: 'personal-site',
    title: 'Personal Website Redesign',
    description: 'A refresh of my personal website and portfolio.',
    status: 'completed',
    category: 'Design',
    startDate: '2023-07-10',
    lastUpdated: '2023-09-20',
    progress: 100,
    tags: ['portfolio', 'design', 'personal-brand'],
    techStack: ['Next.js', 'TailwindCSS', 'Framer Motion'],
    nextSteps: [],
    notes: 'Complete redesign with improved portfolio section and contact form.',
    githubUrl: 'https://github.com/username/personal-site',
    liveUrl: 'https://yourname.com',
    visibility: 'public',
    activities: [
      {
        id: 'ps-act1',
        projectId: 'personal-site',
        type: 'commit',
        date: '2023-09-20',
        description: 'Deployed final version to production'
      },
      {
        id: 'ps-act2',
        projectId: 'personal-site',
        type: 'commit',
        date: '2023-09-15',
        description: 'Implemented animations and transitions'
      }
    ]
  },
  {
    id: 'open-source-lib',
    title: 'React Form Builder',
    description: 'An open-source library for building dynamic forms in React.',
    status: 'active',
    category: 'Open Source',
    startDate: '2023-06-01',
    lastUpdated: '2023-11-22',
    progress: 75,
    tags: ['react', 'forms', 'open-source', 'library'],
    techStack: ['React', 'TypeScript', 'Jest'],
    nextSteps: [
      'Add file upload component',
      'Improve validation system',
      'Write more documentation examples'
    ],
    notes: 'Currently at v0.9.0, aiming for 1.0 release by January.',
    githubUrl: 'https://github.com/username/react-form-builder',
    liveUrl: 'https://react-form-builder.example.com',
    visibility: 'public',
    activities: [
      {
        id: 'os-act1',
        projectId: 'open-source-lib',
        type: 'commit',
        date: '2023-11-22',
        description: 'Fixed validation bug reported in issue #42'
      },
      {
        id: 'os-act2',
        projectId: 'open-source-lib',
        type: 'pr',
        date: '2023-11-18',
        description: 'Merged PR for accessibility improvements'
      }
    ]
  }
];

// Initialize projects with localStorage integration
// Only runs client-side (fails gracefully during SSR)
export const projects = typeof window !== 'undefined' 
  ? dataUtils.initializeData<Project>('projects', defaultProjects)
  : defaultProjects;

/**
 * Get projects filtered by visibility
 * @returns Array of projects visible to the user
 */
export function getVisibleContent(): Project[] {
  return dataUtils.getVisibleContent(projects, isAuthenticated());
}

/**
 * Get a project by its ID
 * @param id The project ID to find
 * @returns The project or undefined if not found
 */
export function getProjectById(id: string): Project | undefined {
  return dataUtils.getItemById(projects, id);
}

/**
 * Get statistics about projects
 * @returns Object containing project statistics
 */
export function getProjectStats() {
  const visibleProjects = getVisibleContent();
  
  // Count projects by status
  const statusCounts = dataUtils.countByProperty(visibleProjects, 'status');
  const statusPercentages = dataUtils.calculatePercentages(statusCounts);
  
  // Count projects by category
  const categoryCounts = dataUtils.countByProperty(visibleProjects, 'category');
  
  // Calculate overall progress
  const totalProgress = visibleProjects.reduce((sum, project) => sum + project.progress, 0);
  const averageProgress = visibleProjects.length > 0 
    ? Math.round(totalProgress / visibleProjects.length) 
    : 0;
  
  return {
    totalProjects: visibleProjects.length,
    statusCounts,
    statusPercentages,
    categoryCounts,
    averageProgress
  };
}

/**
 * Get projects that need attention
 * @returns Array of projects needing attention
 */
export function getProjectsNeedingAttention(): Project[] {
  const visibleProjects = getVisibleContent();
  
  // Filter for active projects with progress < 50% or recently updated
  return visibleProjects
    .filter(project => 
      (project.status === 'active' && project.progress < 50) ||
      (project.status === 'active' && 
       new Date(project.lastUpdated) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    )
    .slice(0, 3); // Get top 3
}

/**
 * Get all activities across all projects
 * @returns Array of all activities
 */
export function getAllActivities(): Activity[] {
  const visibleProjects = getVisibleContent();
  
  // Collect all activities from all projects
  return visibleProjects
    .flatMap(project => (project.activities || [])
      .map(activity => ({
        ...activity,
        projectTitle: project.title
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Save a project (add new or update existing)
 * @param project The project to save
 * @returns Array of updated projects
 */
export function saveProject(project: Project): Project[] {
  // Make a copy of the projects array to ensure reactivity
  let updatedProjects: Project[];
  
  // Set 'lastUpdated' to current date if not provided
  const now = new Date().toISOString().split('T')[0];
  const projectWithDate = {
    ...project,
    lastUpdated: now
  };
  
  // Generate ID if new project
  if (!projectWithDate.id) {
    projectWithDate.id = dataUtils.generateId();
  }
  
  // Save to localStorage and update projects array
  updatedProjects = dataUtils.saveItem('projects', projectWithDate, projects);
  
  // Update the projects reference
  // This is a workaround since we can't directly modify the imported array
  projects.length = 0;
  projects.push(...updatedProjects);
  
  return updatedProjects;
}

/**
 * Delete a project by ID
 * @param id The ID of the project to delete
 * @returns Array of remaining projects
 */
export function deleteProject(id: string): Project[] {
  // Delete from localStorage and get updated list
  const updatedProjects = dataUtils.deleteItem('projects', id, projects);
  
  // Update the projects reference
  projects.length = 0;
  projects.push(...updatedProjects);
  
  return updatedProjects;
}

/**
 * Create a new, empty project template
 * @returns A new project with default values
 */
export function createEmptyProject(): Project {
  const now = new Date().toISOString().split('T')[0];
  
  return {
    id: '', // Will be set when saved
    title: '',
    description: '',
    status: 'planning',
    category: '',
    startDate: now,
    lastUpdated: now,
    progress: 0,
    tags: [],
    techStack: [],
    visibility: 'private',
    activities: []
  };
} 