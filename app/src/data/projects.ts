/*
  File: src/data/projects.ts
  Purpose: Provides mock project data for the control panel
  Dependencies: None
*/

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'planning' | 'paused';
  category: string;
  startDate: string;
  lastUpdated: string;
  progress: number;
  tags: string[];
  techStack: string[];
  nextSteps?: string[];
  notes?: string;
  githubUrl?: string;
  liveUrl?: string;
  visibility: 'public' | 'private';
  activities?: Activity[];
}

export interface Activity {
  id: string;
  projectId: string;
  type: 'commit' | 'pr' | 'manual';
  date: string;
  description: string;
}

// Mock project data
export const projects: Project[] = [
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
        id: 'act1',
        projectId: 'control-panel',
        type: 'commit',
        date: '2023-11-20',
        description: 'Added project filtering functionality'
      },
      {
        id: 'act2',
        projectId: 'control-panel',
        type: 'manual',
        date: '2023-11-15',
        description: 'Updated project requirements document'
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
        id: 'act7',
        projectId: 'book-notes',
        type: 'manual',
        date: '2023-11-10',
        description: 'Added notes for "Atomic Habits"'
      }
    ]
  }
];

/**
 * Get projects filtered by visibility
 * @param isAuthenticated Whether the user is authenticated
 * @returns Array of projects visible to the user
 */
export function getVisibleContent(isAuthenticated: boolean): Project[] {
  if (isAuthenticated) {
    return projects;
  }
  return projects.filter(project => project.visibility === 'public');
}

/**
 * Get a project by its ID
 * @param id The project ID to find
 * @returns The project or undefined if not found
 */
export function getProjectById(id: string): Project | undefined {
  return projects.find(project => project.id === id);
}

/**
 * Get statistics about projects
 * @returns Object containing project statistics
 */
export function getProjectStats() {
  const total = projects.length;
  const active = projects.filter(p => p.status === 'active').length;
  const completed = projects.filter(p => p.status === 'completed').length;
  const planning = projects.filter(p => p.status === 'planning').length;
  const paused = projects.filter(p => p.status === 'paused').length;
  
  return {
    total,
    active,
    activePercent: Math.round((active / total) * 100),
    completed,
    completedPercent: Math.round((completed / total) * 100),
    planning,
    planningPercent: Math.round((planning / total) * 100),
    paused,
    pausedPercent: Math.round((paused / total) * 100)
  };
}

/**
 * Get projects that need attention
 * @returns Array of projects needing attention
 */
export function getProjectsNeedingAttention(): Project[] {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  return projects.filter(project => {
    // Projects with no next steps
    const missingNextSteps = project.status === 'active' && 
                            (!project.nextSteps || project.nextSteps.length === 0);
    
    // Projects with no recent activity
    const lastUpdatedDate = new Date(project.lastUpdated);
    const noRecentActivity = project.status === 'active' && lastUpdatedDate < twoWeeksAgo;
    
    return missingNextSteps || noRecentActivity;
  });
}

/**
 * Get all activities across all projects
 * @returns Array of all activities
 */
export function getAllActivities(): Activity[] {
  return projects
    .flatMap(project => 
      (project.activities || []).map(activity => ({
        ...activity,
        projectId: project.id
      }))
    );
} 