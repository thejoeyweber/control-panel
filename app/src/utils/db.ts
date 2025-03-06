/*
  File: src/utils/db.ts
  Purpose: Central utility for database operations
  Dependencies: Uses Astro DB for data access
*/

import { db, eq, desc, and, like, or, gt, lt, isNull, sql } from 'astro:db';
import { 
  Activities,
  Projects,
  WritingPieces,
  Books,
  Resources,
  Revenue,
  RevenueGoals,
  AITools
} from 'astro:db';
import { nanoid } from 'nanoid';

// Helper for handling visibility filtering based on auth status
export function withVisibility(query: any, isAuthenticated: boolean) {
  if (!isAuthenticated) {
    return query.where(eq(Activities.visibility, 'public'));
  }
  return query;
}

export function withProjectVisibility(query: any, isAuthenticated: boolean) {
  if (!isAuthenticated) {
    return query.where(eq(Projects.visibility, 'public'));
  }
  return query;
}

// --------------------- Activity Operations -----------------------

// Get all activities with optional filtering
export async function getAllActivities(isAuthenticated = false) {
  try {
    const query = db.select().from(Activities).orderBy(desc(Activities.date));
    const activities = await withVisibility(query, isAuthenticated);
    return activities;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

// Get recent activities (last 30 days)
export async function getRecentActivities(limit = 20, isAuthenticated = false) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const query = db.select()
      .from(Activities)
      .where(gt(Activities.date, thirtyDaysAgo))
      .orderBy(desc(Activities.date))
      .limit(limit);
    
    const activities = await withVisibility(query, isAuthenticated);
    return activities;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
}

// Search activities by description or tags
export async function searchActivities(searchTerm: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Activities)
      .where(
        or(
          like(Activities.description, `%${searchTerm}%`),
          sql`json_array_length(filter(${Activities.tags}, (x) => x LIKE '%${searchTerm}%')) > 0`
        )
      )
      .orderBy(desc(Activities.date));

    const activities = await withVisibility(query, isAuthenticated);
    return activities;
  } catch (error) {
    console.error('Error searching activities:', error);
    return [];
  }
}

// Get a specific activity by ID
export async function getActivity(id: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Activities)
      .where(eq(Activities.id, id));
    
    const [activity] = await withVisibility(query, isAuthenticated);
    return activity;
  } catch (error) {
    console.error(`Error fetching activity with ID ${id}:`, error);
    return null;
  }
}

// Create a new activity
export async function createActivity(activityData: any) {
  try {
    const id = activityData.id || nanoid(8);
    const date = activityData.date instanceof Date ? activityData.date : new Date(activityData.date);
    const createdAt = new Date();

    // Ensure visibility is set
    const visibility = activityData.visibility || 'private';

    // Ensure tags is an array
    const tags = Array.isArray(activityData.tags) 
      ? activityData.tags 
      : (typeof activityData.tags === 'string' ? activityData.tags.split(',').map(t => t.trim()).filter(t => t) : []);

    const activity = {
      id,
      projectId: activityData.projectId,
      type: activityData.type,
      description: activityData.description,
      date,
      createdAt,
      duration: activityData.duration ? Number(activityData.duration) : null,
      url: activityData.url || null,
      tags,
      visibility
    };

    await db.insert(Activities).values(activity);
    return activity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
}

// Update an existing activity
export async function updateActivity(id: string, activityData: any) {
  try {
    const existingActivity = await getActivity(id, true);
    if (!existingActivity) {
      throw new Error(`Activity with ID ${id} not found`);
    }

    // Process date fields
    const date = activityData.date instanceof Date ? activityData.date : new Date(activityData.date);
    
    // Ensure tags is an array
    const tags = Array.isArray(activityData.tags) 
      ? activityData.tags 
      : (typeof activityData.tags === 'string' ? activityData.tags.split(',').map(t => t.trim()).filter(t => t) : []);

    const activity = {
      projectId: activityData.projectId,
      type: activityData.type,
      description: activityData.description,
      date,
      duration: activityData.duration ? Number(activityData.duration) : null,
      url: activityData.url || null,
      tags,
      visibility: activityData.visibility || existingActivity.visibility
    };

    await db.update(Activities).set(activity).where(eq(Activities.id, id));
    return { id, ...activity };
  } catch (error) {
    console.error(`Error updating activity with ID ${id}:`, error);
    throw error;
  }
}

// Delete an activity
export async function deleteActivity(id: string) {
  try {
    await db.delete(Activities).where(eq(Activities.id, id));
    return { success: true, id };
  } catch (error) {
    console.error(`Error deleting activity with ID ${id}:`, error);
    throw error;
  }
}

// Calculate activity statistics (counts by type, etc.)
export async function getActivityStats(isAuthenticated = false) {
  try {
    const activities = await getAllActivities(isAuthenticated);
    
    // Count by type
    const typeCount: Record<string, number> = {};
    activities.forEach(activity => {
      const type = activity.type;
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    // Count by project
    const projectCount: Record<string, number> = {};
    activities.forEach(activity => {
      if (activity.projectId) {
        projectCount[activity.projectId] = (projectCount[activity.projectId] || 0) + 1;
      }
    });

    // Count by month (for trend analysis)
    const monthCount: Record<string, number> = {};
    activities.forEach(activity => {
      const date = activity.date instanceof Date ? activity.date : new Date(activity.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthCount[monthYear] = (monthCount[monthYear] || 0) + 1;
    });

    return {
      total: activities.length,
      byType: typeCount,
      byProject: projectCount,
      byMonth: monthCount
    };
  } catch (error) {
    console.error('Error calculating activity stats:', error);
    return { total: 0, byType: {}, byProject: {}, byMonth: {} };
  }
}

// Create an empty activity object (for new activity forms)
export function createEmptyActivity() {
  return {
    id: nanoid(8),
    projectId: '',
    type: 'manual',
    description: '',
    date: new Date(),
    createdAt: new Date(),
    duration: null,
    url: null,
    tags: [],
    visibility: 'private'
  };
}

// --------------------- Project Operations -----------------------

// Get all projects with optional filtering
export async function getAllProjects(isAuthenticated = false) {
  try {
    const query = db.select().from(Projects).orderBy(desc(Projects.lastUpdated));
    const projects = await withProjectVisibility(query, isAuthenticated);
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Get a specific project by ID
export async function getProject(id: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Projects)
      .where(eq(Projects.id, id));
    
    const [project] = await withProjectVisibility(query, isAuthenticated);
    return project;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }
}

// Get project activities
export async function getProjectActivities(projectId: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Activities)
      .where(eq(Activities.projectId, projectId))
      .orderBy(desc(Activities.date));
    
    const activities = await withVisibility(query, isAuthenticated);
    return activities;
  } catch (error) {
    console.error(`Error fetching activities for project ${projectId}:`, error);
    return [];
  }
}

// Create a new project
export async function createProject(projectData: any) {
  try {
    const id = projectData.id || nanoid(8);
    const startDate = projectData.startDate instanceof Date ? projectData.startDate : new Date(projectData.startDate || new Date());
    const lastUpdated = new Date();

    // Ensure required fields have values
    const title = projectData.title || projectData.name || 'Untitled Project';
    const category = projectData.category || 'other';
    const progress = projectData.progress !== undefined ? Number(projectData.progress) : 0;
    const techStack = Array.isArray(projectData.techStack) ? projectData.techStack : [];
    const visibility = projectData.visibility || 'private';
    const tags = Array.isArray(projectData.tags) 
      ? projectData.tags 
      : (typeof projectData.tags === 'string' ? projectData.tags.split(',').map(t => t.trim()).filter(t => t) : []);

    const project = {
      id,
      title,
      description: projectData.description || '',
      status: projectData.status || 'planning',
      category,
      startDate,
      lastUpdated,
      progress,
      tags,
      techStack,
      nextSteps: projectData.nextSteps || null,
      notes: projectData.notes || null,
      githubUrl: projectData.githubUrl || null,
      liveUrl: projectData.liveUrl || null,
      visibility
    };

    await db.insert(Projects).values(project);
    return project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Update an existing project
export async function updateProject(id: string, projectData: any) {
  try {
    const existingProject = await getProject(id, true);
    if (!existingProject) {
      throw new Error(`Project with ID ${id} not found`);
    }

    // Process date fields
    const startDate = projectData.startDate ? 
      (projectData.startDate instanceof Date ? projectData.startDate : new Date(projectData.startDate)) :
      existingProject.startDate;
    
    const lastUpdated = new Date();
    
    // Ensure tags and techStack are arrays
    const tags = projectData.tags ? (
      Array.isArray(projectData.tags) 
        ? projectData.tags 
        : (typeof projectData.tags === 'string' ? projectData.tags.split(',').map(t => t.trim()).filter(t => t) : [])
    ) : existingProject.tags;

    const techStack = projectData.techStack ? (
      Array.isArray(projectData.techStack) 
        ? projectData.techStack 
        : (typeof projectData.techStack === 'string' ? projectData.techStack.split(',').map(t => t.trim()).filter(t => t) : [])
    ) : existingProject.techStack;

    const project = {
      title: projectData.title || existingProject.title,
      description: projectData.description !== undefined ? projectData.description : existingProject.description,
      status: projectData.status || existingProject.status,
      category: projectData.category || existingProject.category,
      startDate,
      lastUpdated,
      progress: projectData.progress !== undefined ? Number(projectData.progress) : existingProject.progress,
      tags,
      techStack,
      nextSteps: projectData.nextSteps !== undefined ? projectData.nextSteps : existingProject.nextSteps,
      notes: projectData.notes !== undefined ? projectData.notes : existingProject.notes,
      githubUrl: projectData.githubUrl !== undefined ? projectData.githubUrl : existingProject.githubUrl,
      liveUrl: projectData.liveUrl !== undefined ? projectData.liveUrl : existingProject.liveUrl,
      visibility: projectData.visibility || existingProject.visibility
    };

    await db.update(Projects).set(project).where(eq(Projects.id, id));
    return { id, ...project };
  } catch (error) {
    console.error(`Error updating project with ID ${id}:`, error);
    throw error;
  }
}

// Delete a project
export async function deleteProject(id: string) {
  try {
    await db.delete(Projects).where(eq(Projects.id, id));
    return { success: true, id };
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    throw error;
  }
}

// Create an empty project object (for new project forms)
export function createEmptyProject() {
  return {
    id: nanoid(8),
    title: '',
    description: '',
    status: 'planning',
    category: 'other',
    startDate: new Date(),
    lastUpdated: new Date(),
    progress: 0,
    tags: [],
    techStack: [],
    nextSteps: null,
    notes: null,
    githubUrl: null,
    liveUrl: null,
    visibility: 'private'
  };
}

// Calculate project statistics
export async function getProjectStats(isAuthenticated = false) {
  try {
    const projects = await getAllProjects(isAuthenticated);
    
    // Count by status
    const statusCount: Record<string, number> = {};
    projects.forEach(project => {
      const status = project.status;
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    // Count by category
    const categoryCount: Record<string, number> = {};
    projects.forEach(project => {
      const category = project.category;
      if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });
    
    // Calculate average progress
    const totalProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0);
    const averageProgress = projects.length > 0 ? Math.round(totalProgress / projects.length) : 0;
    
    // Count tags
    const tagCounts: Record<string, number> = {};
    projects.forEach(project => {
      if (Array.isArray(project.tags)) {
        project.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Get top tags
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total: projects.length,
      byStatus: statusCount,
      byCategory: categoryCount,
      averageProgress,
      topTags
    };
  } catch (error) {
    console.error('Error calculating project stats:', error);
    return { 
      total: 0, 
      byStatus: {}, 
      byCategory: {}, 
      averageProgress: 0,
      topTags: []
    };
  }
}

// --------------------- Writing Operations -----------------------

// Helper for writing visibility
export function withWritingVisibility(query: any, isAuthenticated: boolean) {
  if (!isAuthenticated) {
    return query.where(eq(WritingPieces.visibility, 'public'));
  }
  return query;
}

// Get all writing pieces with optional filtering
export async function getAllWriting(isAuthenticated = false) {
  try {
    const query = db.select().from(WritingPieces).orderBy(desc(WritingPieces.lastUpdated));
    const writings = await withWritingVisibility(query, isAuthenticated);
    return writings;
  } catch (error) {
    console.error('Error fetching writing pieces:', error);
    return [];
  }
}

// Get writing by category
export async function getWritingByCategory(category: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(WritingPieces)
      .where(eq(WritingPieces.category, category))
      .orderBy(desc(WritingPieces.lastUpdated));
    
    const writings = await withWritingVisibility(query, isAuthenticated);
    return writings;
  } catch (error) {
    console.error(`Error fetching writing pieces in category ${category}:`, error);
    return [];
  }
}

// Get a specific writing piece by ID
export async function getWritingPiece(id: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(WritingPieces)
      .where(eq(WritingPieces.id, id));
    
    const [writing] = await withWritingVisibility(query, isAuthenticated);
    return writing;
  } catch (error) {
    console.error(`Error fetching writing piece with ID ${id}:`, error);
    return null;
  }
}

// Create a new writing piece
export async function createWritingPiece(writingData: any) {
  try {
    const id = writingData.id || nanoid(8);
    const createdDate = writingData.createdDate instanceof Date ? writingData.createdDate : new Date(writingData.createdDate || new Date());
    const lastUpdated = new Date();
    const publishedDate = writingData.publishedDate ? 
      (writingData.publishedDate instanceof Date ? writingData.publishedDate : new Date(writingData.publishedDate)) : null;

    // Ensure tags is an array
    const tags = Array.isArray(writingData.tags) 
      ? writingData.tags 
      : (typeof writingData.tags === 'string' ? writingData.tags.split(',').map(t => t.trim()).filter(t => t) : []);

    const writing = {
      id,
      title: writingData.title || 'Untitled Writing',
      summary: writingData.summary || '',
      status: writingData.status || 'draft',
      category: writingData.category || 'blog',
      tags,
      createdDate,
      publishedDate,
      lastUpdated,
      wordCount: writingData.wordCount !== undefined ? Number(writingData.wordCount) : 0,
      content: writingData.content || null,
      externalUrl: writingData.externalUrl || null,
      visibility: writingData.visibility || 'private'
    };

    await db.insert(WritingPieces).values(writing);
    return writing;
  } catch (error) {
    console.error('Error creating writing piece:', error);
    throw error;
  }
}

// Update an existing writing piece
export async function updateWritingPiece(id: string, writingData: any) {
  try {
    const existingWriting = await getWritingPiece(id, true);
    if (!existingWriting) {
      throw new Error(`Writing piece with ID ${id} not found`);
    }

    // Process date fields
    const lastUpdated = new Date();
    const publishedDate = writingData.publishedDate ? 
      (writingData.publishedDate instanceof Date ? writingData.publishedDate : new Date(writingData.publishedDate)) : 
      existingWriting.publishedDate;
    
    // Ensure tags is an array
    const tags = writingData.tags ? (
      Array.isArray(writingData.tags) 
        ? writingData.tags 
        : (typeof writingData.tags === 'string' ? writingData.tags.split(',').map(t => t.trim()).filter(t => t) : [])
    ) : existingWriting.tags;

    const writing = {
      title: writingData.title || existingWriting.title,
      summary: writingData.summary !== undefined ? writingData.summary : existingWriting.summary,
      status: writingData.status || existingWriting.status,
      category: writingData.category || existingWriting.category,
      tags,
      publishedDate,
      lastUpdated,
      wordCount: writingData.wordCount !== undefined ? Number(writingData.wordCount) : existingWriting.wordCount,
      content: writingData.content !== undefined ? writingData.content : existingWriting.content,
      externalUrl: writingData.externalUrl !== undefined ? writingData.externalUrl : existingWriting.externalUrl,
      visibility: writingData.visibility || existingWriting.visibility
    };

    await db.update(WritingPieces).set(writing).where(eq(WritingPieces.id, id));
    return { id, ...writing };
  } catch (error) {
    console.error(`Error updating writing piece with ID ${id}:`, error);
    throw error;
  }
}

// Delete a writing piece
export async function deleteWritingPiece(id: string) {
  try {
    await db.delete(WritingPieces).where(eq(WritingPieces.id, id));
    return { success: true, id };
  } catch (error) {
    console.error(`Error deleting writing piece with ID ${id}:`, error);
    throw error;
  }
}

// Create an empty writing piece object (for new writing forms)
export function createEmptyWritingPiece() {
  return {
    id: nanoid(8),
    title: '',
    summary: '',
    status: 'draft',
    category: 'blog',
    tags: [],
    createdDate: new Date(),
    publishedDate: null,
    lastUpdated: new Date(),
    wordCount: 0,
    content: null,
    externalUrl: null,
    visibility: 'private'
  };
}

// Calculate writing statistics (counts by status, category, etc.)
export async function getWritingStats(isAuthenticated = false) {
  try {
    const writings = await getAllWriting(isAuthenticated);
    
    // Count by status
    const statusCount: Record<string, number> = {};
    writings.forEach(writing => {
      const status = writing.status;
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    // Count by category
    const categoryCount: Record<string, number> = {};
    writings.forEach(writing => {
      const category = writing.category;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Calculate total word count
    const wordCount = writings.reduce((total, writing) => total + (writing.wordCount || 0), 0);
    
    // Count tags
    const tagCounts: Record<string, number> = {};
    writings.forEach(writing => {
      if (Array.isArray(writing.tags)) {
        writing.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Get top tags
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total: writings.length,
      byStatus: statusCount,
      byCategory: categoryCount,
      wordCount,
      topTags
    };
  } catch (error) {
    console.error('Error calculating writing stats:', error);
    return { total: 0, byStatus: {}, byCategory: {}, wordCount: 0, topTags: [] };
  }
}

// --------------------- Books Operations -----------------------

// Helper for books visibility
export function withBooksVisibility(query: any, isAuthenticated: boolean) {
  if (!isAuthenticated) {
    return query.where(eq(Books.visibility, 'public'));
  }
  return query;
}

// Get all books with optional filtering
export async function getAllBooks(isAuthenticated = false) {
  try {
    const query = db.select().from(Books).orderBy(desc(Books.startedDate));
    const books = await withBooksVisibility(query, isAuthenticated);
    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

// Get books by status
export async function getBooksByStatus(status: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Books)
      .where(eq(Books.status, status))
      .orderBy(desc(Books.startedDate));
    
    const books = await withBooksVisibility(query, isAuthenticated);
    return books;
  } catch (error) {
    console.error(`Error fetching books with status ${status}:`, error);
    return [];
  }
}

// Get books by category
export async function getBooksByCategory(category: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Books)
      .where(eq(Books.category, category))
      .orderBy(desc(Books.startedDate));
    
    const books = await withBooksVisibility(query, isAuthenticated);
    return books;
  } catch (error) {
    console.error(`Error fetching books in category ${category}:`, error);
    return [];
  }
}

// Get a specific book by ID
export async function getBook(id: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Books)
      .where(eq(Books.id, id));
    
    const [book] = await withBooksVisibility(query, isAuthenticated);
    return book;
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    return null;
  }
}

// Create a new book
export async function createBook(bookData: any) {
  try {
    const id = bookData.id || nanoid(8);
    const startedDate = bookData.startedDate ? 
      (bookData.startedDate instanceof Date ? bookData.startedDate : new Date(bookData.startedDate)) : null;
    const completedDate = bookData.completedDate ? 
      (bookData.completedDate instanceof Date ? bookData.completedDate : new Date(bookData.completedDate)) : null;

    // Ensure tags is an array
    const tags = Array.isArray(bookData.tags) 
      ? bookData.tags 
      : (typeof bookData.tags === 'string' ? bookData.tags.split(',').map(t => t.trim()).filter(t => t) : []);

    const book = {
      id,
      title: bookData.title || 'Untitled Book',
      author: bookData.author || 'Unknown Author',
      category: bookData.category || 'other',
      status: bookData.status || 'to-read',
      startedDate,
      completedDate,
      format: bookData.format || 'physical',
      notes: bookData.notes || null,
      rating: bookData.rating !== undefined ? Number(bookData.rating) : null,
      tags,
      coverUrl: bookData.coverUrl || null,
      purchaseUrl: bookData.purchaseUrl || null,
      visibility: bookData.visibility || 'private'
    };

    await db.insert(Books).values(book);
    return book;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
}

// Update an existing book
export async function updateBook(id: string, bookData: any) {
  try {
    const existingBook = await getBook(id, true);
    if (!existingBook) {
      throw new Error(`Book with ID ${id} not found`);
    }

    // Process date fields
    const startedDate = bookData.startedDate ? 
      (bookData.startedDate instanceof Date ? bookData.startedDate : new Date(bookData.startedDate)) : 
      existingBook.startedDate;
    
    const completedDate = bookData.completedDate ? 
      (bookData.completedDate instanceof Date ? bookData.completedDate : new Date(bookData.completedDate)) : 
      existingBook.completedDate;
    
    // Ensure tags is an array
    const tags = bookData.tags ? (
      Array.isArray(bookData.tags) 
        ? bookData.tags 
        : (typeof bookData.tags === 'string' ? bookData.tags.split(',').map(t => t.trim()).filter(t => t) : [])
    ) : existingBook.tags;

    const book = {
      title: bookData.title || existingBook.title,
      author: bookData.author || existingBook.author,
      category: bookData.category || existingBook.category,
      status: bookData.status || existingBook.status,
      startedDate,
      completedDate,
      format: bookData.format || existingBook.format,
      notes: bookData.notes !== undefined ? bookData.notes : existingBook.notes,
      rating: bookData.rating !== undefined ? Number(bookData.rating) : existingBook.rating,
      tags,
      coverUrl: bookData.coverUrl !== undefined ? bookData.coverUrl : existingBook.coverUrl,
      purchaseUrl: bookData.purchaseUrl !== undefined ? bookData.purchaseUrl : existingBook.purchaseUrl,
      visibility: bookData.visibility || existingBook.visibility
    };

    await db.update(Books).set(book).where(eq(Books.id, id));
    return { id, ...book };
  } catch (error) {
    console.error(`Error updating book with ID ${id}:`, error);
    throw error;
  }
}

// Delete a book
export async function deleteBook(id: string) {
  try {
    await db.delete(Books).where(eq(Books.id, id));
    return { success: true, id };
  } catch (error) {
    console.error(`Error deleting book with ID ${id}:`, error);
    throw error;
  }
}

// Create an empty book object (for new book forms)
export function createEmptyBook() {
  return {
    id: nanoid(8),
    title: '',
    author: '',
    category: 'other',
    status: 'to-read',
    startedDate: null,
    completedDate: null,
    format: 'physical',
    notes: null,
    rating: null,
    tags: [],
    coverUrl: null,
    purchaseUrl: null,
    visibility: 'private'
  };
}

// Calculate book statistics (counts by status, format, etc.)
export async function getBookStats(isAuthenticated = false) {
  try {
    const books = await getAllBooks(isAuthenticated);
    
    // Count by status
    const statusCount: Record<string, number> = {};
    books.forEach(book => {
      const status = book.status;
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    // Count by category
    const categoryCount: Record<string, number> = {};
    books.forEach(book => {
      const category = book.category;
      if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });

    // Count by format
    const formatCount: Record<string, number> = {};
    books.forEach(book => {
      const format = book.format;
      if (format) {
        formatCount[format] = (formatCount[format] || 0) + 1;
      }
    });
    
    // Count tags
    const tagCounts: Record<string, number> = {};
    books.forEach(book => {
      if (Array.isArray(book.tags)) {
        book.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Get top tags
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate average rating for rated books
    const ratedBooks = books.filter(book => book.rating && book.rating > 0);
    const avgRating = ratedBooks.length > 0 
      ? ratedBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / ratedBooks.length 
      : 0;

    return {
      total: books.length,
      byStatus: statusCount,
      byCategory: categoryCount,
      byFormat: formatCount,
      avgRating,
      topTags
    };
  } catch (error) {
    console.error('Error calculating book stats:', error);
    return { 
      total: 0, 
      byStatus: {}, 
      byCategory: {}, 
      byFormat: {}, 
      avgRating: 0,
      topTags: [] 
    };
  }
}

// --------------------- Resources Operations -----------------------

// Helper for resources visibility
export function withResourcesVisibility(query: any, isAuthenticated: boolean) {
  if (!isAuthenticated) {
    return query.where(eq(Resources.visibility, 'public'));
  }
  return query;
}

// Get all resources with optional filtering
export async function getAllResources(isAuthenticated = false) {
  try {
    const query = db.select().from(Resources).orderBy(desc(Resources.dateAdded));
    const resources = await withResourcesVisibility(query, isAuthenticated);
    return resources;
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}

// Get resources by category
export async function getResourcesByCategory(category: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Resources)
      .where(eq(Resources.category, category))
      .orderBy(desc(Resources.dateAdded));
    
    const resources = await withResourcesVisibility(query, isAuthenticated);
    return resources;
  } catch (error) {
    console.error(`Error fetching resources in category ${category}:`, error);
    return [];
  }
}

// Get resources by type
export async function getResourcesByType(type: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Resources)
      .where(eq(Resources.type, type))
      .orderBy(desc(Resources.dateAdded));
    
    const resources = await withResourcesVisibility(query, isAuthenticated);
    return resources;
  } catch (error) {
    console.error(`Error fetching resources of type ${type}:`, error);
    return [];
  }
}

// Get favorite resources
export async function getFavoriteResources(isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Resources)
      .where(eq(Resources.isFavorite, true))
      .orderBy(desc(Resources.dateAdded));
    
    const resources = await withResourcesVisibility(query, isAuthenticated);
    return resources;
  } catch (error) {
    console.error('Error fetching favorite resources:', error);
    return [];
  }
}

// Get a specific resource by ID
export async function getResource(id: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Resources)
      .where(eq(Resources.id, id));
    
    const [resource] = await withResourcesVisibility(query, isAuthenticated);
    return resource;
  } catch (error) {
    console.error(`Error fetching resource with ID ${id}:`, error);
    return null;
  }
}

// Create a new resource
export async function createResource(resourceData: any) {
  try {
    const id = resourceData.id || nanoid(8);
    const dateAdded = resourceData.dateAdded instanceof Date ? resourceData.dateAdded : new Date(resourceData.dateAdded || new Date());
    const lastAccessed = resourceData.lastAccessed ? 
      (resourceData.lastAccessed instanceof Date ? resourceData.lastAccessed : new Date(resourceData.lastAccessed)) : null;

    // Ensure tags is an array
    const tags = Array.isArray(resourceData.tags) 
      ? resourceData.tags 
      : (typeof resourceData.tags === 'string' ? resourceData.tags.split(',').map(t => t.trim()).filter(t => t) : []);

    const resource = {
      id,
      title: resourceData.title || 'Untitled Resource',
      url: resourceData.url || '',
      description: resourceData.description || null,
      category: resourceData.category || 'other',
      type: resourceData.type || 'link',
      tags,
      dateAdded,
      lastAccessed,
      isFavorite: resourceData.isFavorite === true,
      visibility: resourceData.visibility || 'private'
    };

    await db.insert(Resources).values(resource);
    return resource;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
}

// Update an existing resource
export async function updateResource(id: string, resourceData: any) {
  try {
    const existingResource = await getResource(id, true);
    if (!existingResource) {
      throw new Error(`Resource with ID ${id} not found`);
    }

    // Process date fields
    const lastAccessed = resourceData.lastAccessed ? 
      (resourceData.lastAccessed instanceof Date ? resourceData.lastAccessed : new Date(resourceData.lastAccessed)) : 
      existingResource.lastAccessed;
    
    // Ensure tags is an array
    const tags = resourceData.tags ? (
      Array.isArray(resourceData.tags) 
        ? resourceData.tags 
        : (typeof resourceData.tags === 'string' ? resourceData.tags.split(',').map(t => t.trim()).filter(t => t) : [])
    ) : existingResource.tags;

    const resource = {
      title: resourceData.title || existingResource.title,
      url: resourceData.url || existingResource.url,
      description: resourceData.description !== undefined ? resourceData.description : existingResource.description,
      category: resourceData.category || existingResource.category,
      type: resourceData.type || existingResource.type,
      tags,
      lastAccessed,
      isFavorite: resourceData.isFavorite !== undefined ? resourceData.isFavorite : existingResource.isFavorite,
      visibility: resourceData.visibility || existingResource.visibility
    };

    await db.update(Resources).set(resource).where(eq(Resources.id, id));
    return { id, ...resource };
  } catch (error) {
    console.error(`Error updating resource with ID ${id}:`, error);
    throw error;
  }
}

// Delete a resource
export async function deleteResource(id: string) {
  try {
    await db.delete(Resources).where(eq(Resources.id, id));
    return { success: true, id };
  } catch (error) {
    console.error(`Error deleting resource with ID ${id}:`, error);
    throw error;
  }
}

// Create an empty resource object (for new resource forms)
export function createEmptyResource() {
  return {
    id: nanoid(8),
    title: '',
    url: '',
    description: null,
    category: 'other',
    type: 'link',
    tags: [],
    dateAdded: new Date(),
    lastAccessed: null,
    isFavorite: false,
    visibility: 'private'
  };
}

// Calculate resource statistics (counts by category, type, etc.)
export async function getResourceStats(isAuthenticated = false) {
  try {
    const resources = await getAllResources(isAuthenticated);
    
    // Count by category
    const categoryCount: Record<string, number> = {};
    resources.forEach(resource => {
      const category = resource.category;
      if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });

    // Count by type
    const typeCount: Record<string, number> = {};
    resources.forEach(resource => {
      const type = resource.type;
      if (type) {
        typeCount[type] = (typeCount[type] || 0) + 1;
      }
    });
    
    // Count tags
    const tagCounts: Record<string, number> = {};
    resources.forEach(resource => {
      if (Array.isArray(resource.tags)) {
        resource.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Get top tags
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Count favorites
    const favoriteCount = resources.filter(resource => resource.isFavorite).length;

    return {
      total: resources.length,
      byCategory: categoryCount,
      byType: typeCount,
      favoriteCount,
      topTags
    };
  } catch (error) {
    console.error('Error calculating resource stats:', error);
    return { 
      total: 0, 
      byCategory: {}, 
      byType: {}, 
      favoriteCount: 0,
      topTags: []
    };
  }
}

// --------------------- Revenue Operations -----------------------

// Helper for revenue visibility
export function withRevenueVisibility(query: any, isAuthenticated: boolean) {
  if (!isAuthenticated) {
    return query.where(eq(Revenue.visibility, 'public'));
  }
  return query;
}

// Helper for revenue goals visibility
export function withRevenueGoalsVisibility(query: any, isAuthenticated: boolean) {
  if (!isAuthenticated) {
    return query.where(eq(RevenueGoals.visibility, 'public'));
  }
  return query;
}

// Get all revenue entries with optional filtering
export async function getAllRevenue(isAuthenticated = false) {
  try {
    const query = db.select().from(Revenue).orderBy(desc(Revenue.date));
    const revenue = await withRevenueVisibility(query, isAuthenticated);
    return revenue;
  } catch (error) {
    console.error('Error fetching revenue entries:', error);
    return [];
  }
}

// Get revenue by project
export async function getRevenueByProject(projectId: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Revenue)
      .where(eq(Revenue.projectId, projectId))
      .orderBy(desc(Revenue.date));
    
    const revenue = await withRevenueVisibility(query, isAuthenticated);
    return revenue;
  } catch (error) {
    console.error(`Error fetching revenue for project ${projectId}:`, error);
    return [];
  }
}

// Get revenue by status
export async function getRevenueByStatus(status: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Revenue)
      .where(eq(Revenue.status, status))
      .orderBy(desc(Revenue.date));
    
    const revenue = await withRevenueVisibility(query, isAuthenticated);
    return revenue;
  } catch (error) {
    console.error(`Error fetching revenue with status ${status}:`, error);
    return [];
  }
}

// Get revenue by type
export async function getRevenueByType(type: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Revenue)
      .where(eq(Revenue.type, type))
      .orderBy(desc(Revenue.date));
    
    const revenue = await withRevenueVisibility(query, isAuthenticated);
    return revenue;
  } catch (error) {
    console.error(`Error fetching revenue of type ${type}:`, error);
    return [];
  }
}

// Get a specific revenue entry by ID
export async function getRevenue(id: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(Revenue)
      .where(eq(Revenue.id, id));
    
    const [revenue] = await withRevenueVisibility(query, isAuthenticated);
    return revenue;
  } catch (error) {
    console.error(`Error fetching revenue with ID ${id}:`, error);
    return null;
  }
}

// Create a new revenue entry
export async function createRevenue(revenueData: any) {
  try {
    const id = revenueData.id || nanoid(8);
    const date = revenueData.date instanceof Date ? revenueData.date : new Date(revenueData.date || new Date());

    const revenue = {
      id,
      projectId: revenueData.projectId || null,
      amount: revenueData.amount !== undefined ? Number(revenueData.amount) : 0,
      date,
      description: revenueData.description || '',
      type: revenueData.type || 'other',
      status: revenueData.status || 'paid',
      visibility: revenueData.visibility || 'private'
    };

    await db.insert(Revenue).values(revenue);
    return revenue;
  } catch (error) {
    console.error('Error creating revenue entry:', error);
    throw error;
  }
}

// Update an existing revenue entry
export async function updateRevenue(id: string, revenueData: any) {
  try {
    const existingRevenue = await getRevenue(id, true);
    if (!existingRevenue) {
      throw new Error(`Revenue entry with ID ${id} not found`);
    }

    // Process date field
    const date = revenueData.date ? 
      (revenueData.date instanceof Date ? revenueData.date : new Date(revenueData.date)) : 
      existingRevenue.date;

    const revenue = {
      projectId: revenueData.projectId !== undefined ? revenueData.projectId : existingRevenue.projectId,
      amount: revenueData.amount !== undefined ? Number(revenueData.amount) : existingRevenue.amount,
      date,
      description: revenueData.description !== undefined ? revenueData.description : existingRevenue.description,
      type: revenueData.type || existingRevenue.type,
      status: revenueData.status || existingRevenue.status,
      visibility: revenueData.visibility || existingRevenue.visibility
    };

    await db.update(Revenue).set(revenue).where(eq(Revenue.id, id));
    return { id, ...revenue };
  } catch (error) {
    console.error(`Error updating revenue entry with ID ${id}:`, error);
    throw error;
  }
}

// Delete a revenue entry
export async function deleteRevenue(id: string) {
  try {
    await db.delete(Revenue).where(eq(Revenue.id, id));
    return { success: true, id };
  } catch (error) {
    console.error(`Error deleting revenue entry with ID ${id}:`, error);
    throw error;
  }
}

// Create an empty revenue entry object (for new revenue forms)
export function createEmptyRevenue() {
  return {
    id: nanoid(8),
    projectId: null,
    amount: 0,
    date: new Date(),
    description: '',
    type: 'other',
    status: 'paid',
    visibility: 'private'
  };
}

// Calculate revenue statistics (counts by type, status, etc.)
export async function getRevenueStats(isAuthenticated = false) {
  try {
    const revenueEntries = await getAllRevenue(isAuthenticated);
    
    // Calculate total revenue
    const total = revenueEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    
    // Count by type
    const typeRevenue: Record<string, number> = {};
    revenueEntries.forEach(entry => {
      const type = entry.type;
      if (type) {
        typeRevenue[type] = (typeRevenue[type] || 0) + (entry.amount || 0);
      }
    });

    // Count by status
    const statusRevenue: Record<string, number> = {};
    revenueEntries.forEach(entry => {
      const status = entry.status;
      if (status) {
        statusRevenue[status] = (statusRevenue[status] || 0) + (entry.amount || 0);
      }
    });
    
    // Count by month (for trend analysis)
    const monthRevenue: Record<string, number> = {};
    revenueEntries.forEach(entry => {
      if (entry.date) {
        const date = entry.date instanceof Date ? entry.date : new Date(entry.date);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        monthRevenue[monthYear] = (monthRevenue[monthYear] || 0) + (entry.amount || 0);
      }
    });

    return {
      total,
      byType: typeRevenue,
      byStatus: statusRevenue,
      byMonth: monthRevenue
    };
  } catch (error) {
    console.error('Error calculating revenue stats:', error);
    return { 
      total: 0, 
      byType: {}, 
      byStatus: {},
      byMonth: {}
    };
  }
}

// --------------------- Revenue Goals Operations -----------------------

// Get all revenue goals
export async function getAllRevenueGoals(isAuthenticated = false) {
  try {
    const query = db.select().from(RevenueGoals).orderBy(desc(RevenueGoals.startDate));
    const goals = await withRevenueGoalsVisibility(query, isAuthenticated);
    return goals;
  } catch (error) {
    console.error('Error fetching revenue goals:', error);
    return [];
  }
}

// Get active revenue goals
export async function getActiveRevenueGoals(isAuthenticated = false) {
  try {
    const now = new Date();
    const query = db.select()
      .from(RevenueGoals)
      .where(
        or(
          isNull(RevenueGoals.endDate),
          gt(RevenueGoals.endDate, now)
        )
      )
      .orderBy(desc(RevenueGoals.startDate));
    
    const goals = await withRevenueGoalsVisibility(query, isAuthenticated);
    return goals;
  } catch (error) {
    console.error('Error fetching active revenue goals:', error);
    return [];
  }
}

// Get a specific revenue goal by ID
export async function getRevenueGoal(id: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(RevenueGoals)
      .where(eq(RevenueGoals.id, id));
    
    const [goal] = await withRevenueGoalsVisibility(query, isAuthenticated);
    return goal;
  } catch (error) {
    console.error(`Error fetching revenue goal with ID ${id}:`, error);
    return null;
  }
}

// Create a new revenue goal
export async function createRevenueGoal(goalData: any) {
  try {
    const id = goalData.id || nanoid(8);
    const startDate = goalData.startDate instanceof Date ? goalData.startDate : new Date(goalData.startDate || new Date());
    const endDate = goalData.endDate ? 
      (goalData.endDate instanceof Date ? goalData.endDate : new Date(goalData.endDate)) : null;

    const goal = {
      id,
      name: goalData.name || 'Untitled Goal',
      target: goalData.target !== undefined ? Number(goalData.target) : 0,
      period: goalData.period || 'monthly',
      startDate,
      endDate,
      visibility: goalData.visibility || 'private'
    };

    await db.insert(RevenueGoals).values(goal);
    return goal;
  } catch (error) {
    console.error('Error creating revenue goal:', error);
    throw error;
  }
}

// Update an existing revenue goal
export async function updateRevenueGoal(id: string, goalData: any) {
  try {
    const existingGoal = await getRevenueGoal(id, true);
    if (!existingGoal) {
      throw new Error(`Revenue goal with ID ${id} not found`);
    }

    // Process date fields
    const startDate = goalData.startDate ? 
      (goalData.startDate instanceof Date ? goalData.startDate : new Date(goalData.startDate)) : 
      existingGoal.startDate;
    
    const endDate = goalData.endDate !== undefined ? 
      (goalData.endDate ? (goalData.endDate instanceof Date ? goalData.endDate : new Date(goalData.endDate)) : null) : 
      existingGoal.endDate;

    const goal = {
      name: goalData.name || existingGoal.name,
      target: goalData.target !== undefined ? Number(goalData.target) : existingGoal.target,
      period: goalData.period || existingGoal.period,
      startDate,
      endDate,
      visibility: goalData.visibility || existingGoal.visibility
    };

    await db.update(RevenueGoals).set(goal).where(eq(RevenueGoals.id, id));
    return { id, ...goal };
  } catch (error) {
    console.error(`Error updating revenue goal with ID ${id}:`, error);
    throw error;
  }
}

// Delete a revenue goal
export async function deleteRevenueGoal(id: string) {
  try {
    await db.delete(RevenueGoals).where(eq(RevenueGoals.id, id));
    return { success: true, id };
  } catch (error) {
    console.error(`Error deleting revenue goal with ID ${id}:`, error);
    throw error;
  }
}

// Create an empty revenue goal object (for new goal forms)
export function createEmptyRevenueGoal() {
  return {
    id: nanoid(8),
    name: '',
    target: 0,
    period: 'monthly',
    startDate: new Date(),
    endDate: null,
    visibility: 'private'
  };
}

// --------------------- AI Tools Operations -----------------------

// Helper for AI tools visibility
export function withAIToolsVisibility(query: any, isAuthenticated: boolean) {
  if (!isAuthenticated) {
    return query.where(eq(AITools.visibility, 'public'));
  }
  return query;
}

// Get all AI tools with optional filtering
export async function getAllAITools(isAuthenticated = false) {
  try {
    const query = db.select().from(AITools).orderBy(desc(AITools.dateCreated));
    const tools = await withAIToolsVisibility(query, isAuthenticated);
    return tools;
  } catch (error) {
    console.error('Error fetching AI tools:', error);
    return [];
  }
}

// Get AI tools by category
export async function getAIToolsByCategory(category: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(AITools)
      .where(eq(AITools.category, category))
      .orderBy(desc(AITools.dateCreated));
    
    const tools = await withAIToolsVisibility(query, isAuthenticated);
    return tools;
  } catch (error) {
    console.error(`Error fetching AI tools in category ${category}:`, error);
    return [];
  }
}

// Get favorite AI tools
export async function getFavoriteAITools(isAuthenticated = false) {
  try {
    const query = db.select()
      .from(AITools)
      .where(eq(AITools.isFavorite, true))
      .orderBy(desc(AITools.dateCreated));
    
    const tools = await withAIToolsVisibility(query, isAuthenticated);
    return tools;
  } catch (error) {
    console.error('Error fetching favorite AI tools:', error);
    return [];
  }
}

// Get a specific AI tool by ID
export async function getAITool(id: string, isAuthenticated = false) {
  try {
    const query = db.select()
      .from(AITools)
      .where(eq(AITools.id, id));
    
    const [tool] = await withAIToolsVisibility(query, isAuthenticated);
    return tool;
  } catch (error) {
    console.error(`Error fetching AI tool with ID ${id}:`, error);
    return null;
  }
}

// Create a new AI tool
export async function createAITool(toolData: any) {
  try {
    const id = toolData.id || nanoid(8);
    const dateCreated = toolData.dateCreated instanceof Date ? toolData.dateCreated : new Date(toolData.dateCreated || new Date());
    const lastUsed = toolData.lastUsed ? 
      (toolData.lastUsed instanceof Date ? toolData.lastUsed : new Date(toolData.lastUsed)) : null;

    // Ensure tags is an array
    const tags = Array.isArray(toolData.tags) 
      ? toolData.tags 
      : (typeof toolData.tags === 'string' ? toolData.tags.split(',').map(t => t.trim()).filter(t => t) : []);

    const tool = {
      id,
      name: toolData.name || 'Untitled Tool',
      description: toolData.description || '',
      prompt: toolData.prompt || '',
      category: toolData.category || 'other',
      tags,
      dateCreated,
      lastUsed,
      exampleResponse: toolData.exampleResponse || null,
      isFavorite: toolData.isFavorite === true,
      visibility: toolData.visibility || 'private'
    };

    await db.insert(AITools).values(tool);
    return tool;
  } catch (error) {
    console.error('Error creating AI tool:', error);
    throw error;
  }
}

// Update an existing AI tool
export async function updateAITool(id: string, toolData: any) {
  try {
    const existingTool = await getAITool(id, true);
    if (!existingTool) {
      throw new Error(`AI tool with ID ${id} not found`);
    }

    // Process date fields
    const lastUsed = toolData.lastUsed ? 
      (toolData.lastUsed instanceof Date ? toolData.lastUsed : new Date(toolData.lastUsed)) : 
      existingTool.lastUsed;
    
    // Ensure tags is an array
    const tags = toolData.tags ? (
      Array.isArray(toolData.tags) 
        ? toolData.tags 
        : (typeof toolData.tags === 'string' ? toolData.tags.split(',').map(t => t.trim()).filter(t => t) : [])
    ) : existingTool.tags;

    const tool = {
      name: toolData.name || existingTool.name,
      description: toolData.description !== undefined ? toolData.description : existingTool.description,
      prompt: toolData.prompt !== undefined ? toolData.prompt : existingTool.prompt,
      category: toolData.category || existingTool.category,
      tags,
      lastUsed,
      exampleResponse: toolData.exampleResponse !== undefined ? toolData.exampleResponse : existingTool.exampleResponse,
      isFavorite: toolData.isFavorite !== undefined ? toolData.isFavorite : existingTool.isFavorite,
      visibility: toolData.visibility || existingTool.visibility
    };

    await db.update(AITools).set(tool).where(eq(AITools.id, id));
    return { id, ...tool };
  } catch (error) {
    console.error(`Error updating AI tool with ID ${id}:`, error);
    throw error;
  }
}

// Delete an AI tool
export async function deleteAITool(id: string) {
  try {
    await db.delete(AITools).where(eq(AITools.id, id));
    return { success: true, id };
  } catch (error) {
    console.error(`Error deleting AI tool with ID ${id}:`, error);
    throw error;
  }
}

// Create an empty AI tool object (for new tool forms)
export function createEmptyAITool() {
  return {
    id: nanoid(8),
    name: '',
    description: '',
    prompt: '',
    category: 'other',
    tags: [],
    dateCreated: new Date(),
    lastUsed: null,
    exampleResponse: null,
    isFavorite: false,
    visibility: 'private'
  };
}

// Calculate AI tool statistics (counts by category, etc.)
export async function getAIToolStats(isAuthenticated = false) {
  try {
    const aiTools = await getAllAITools(isAuthenticated);
    
    // Count by category
    const categoryCount: Record<string, number> = {};
    aiTools.forEach(tool => {
      const category = tool.category;
      if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });
    
    // Count tags
    const tagCounts: Record<string, number> = {};
    aiTools.forEach(tool => {
      if (Array.isArray(tool.tags)) {
        tool.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Get top tags
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Count favorites
    const favoriteCount = aiTools.filter(tool => tool.isFavorite).length;

    return {
      total: aiTools.length,
      byCategory: categoryCount,
      favoriteCount,
      topTags
    };
  } catch (error) {
    console.error('Error calculating AI tool stats:', error);
    return { 
      total: 0, 
      byCategory: {}, 
      favoriteCount: 0,
      topTags: []
    };
  }
} 