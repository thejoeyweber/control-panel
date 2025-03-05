/*
  File: src/data/activities.ts
  Purpose: Data service for activity entries CRUD operations
  Dependencies: fs, path for file operations, uuid for ID generation
*/

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Activity } from '../types/Activity';
import { isAuthenticated } from '../utils/auth';

// Define the file path for activities data
const dataFilePath = path.join(process.cwd(), 'src/data/activities.json');

/**
 * Ensures the data file exists, creating it with empty array if not
 */
async function ensureDataFileExists(): Promise<void> {
  if (!fs.existsSync(dataFilePath)) {
    await fs.promises.writeFile(dataFilePath, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * Get all activity entries
 */
export async function getAllActivities(): Promise<Activity[]> {
  await ensureDataFileExists();
  const data = await fs.promises.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Get activities by project ID
 */
export async function getActivitiesByProject(projectId: string): Promise<Activity[]> {
  const activities = await getAllActivities();
  return activities.filter(activity => activity.projectId === projectId);
}

/**
 * Get activities by type
 */
export async function getActivitiesByType(type: string): Promise<Activity[]> {
  const activities = await getAllActivities();
  return activities.filter(activity => activity.type === type);
}

/**
 * Get activity by ID
 */
export async function getActivityById(id: string): Promise<Activity | null> {
  const activities = await getAllActivities();
  return activities.find(activity => activity.id === id) || null;
}

/**
 * Create a new activity
 */
export async function createActivity(activityData: Partial<Activity>): Promise<Activity> {
  await ensureDataFileExists();
  
  const activities = await getAllActivities();
  
  // Process tags if provided as string
  if (typeof activityData.tags === 'string') {
    activityData.tags = (activityData.tags as string)
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
  }
  
  // Create new activity with defaults and provided data
  const newActivity: Activity = {
    id: uuidv4(),
    projectId: '',
    type: 'note',
    description: '',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    ...activityData,
    // Ensure date is in ISO format
    date: new Date(activityData.date || new Date()).toISOString(),
  };
  
  activities.push(newActivity);
  
  await fs.promises.writeFile(dataFilePath, JSON.stringify(activities, null, 2), 'utf-8');
  
  return newActivity;
}

/**
 * Update an existing activity
 */
export async function updateActivity(id: string, activityData: Partial<Activity>): Promise<Activity | null> {
  await ensureDataFileExists();
  
  const activities = await getAllActivities();
  const index = activities.findIndex(activity => activity.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Process tags if provided as string
  if (typeof activityData.tags === 'string') {
    activityData.tags = (activityData.tags as string)
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
  }
  
  // Update activity with new data
  const updatedActivity = {
    ...activities[index],
    ...activityData,
    // Ensure date is in ISO format if provided
    ...(activityData.date ? { date: new Date(activityData.date).toISOString() } : {})
  };
  
  activities[index] = updatedActivity;
  
  await fs.promises.writeFile(dataFilePath, JSON.stringify(activities, null, 2), 'utf-8');
  
  return updatedActivity;
}

/**
 * Delete an activity
 */
export async function deleteActivity(id: string): Promise<boolean> {
  await ensureDataFileExists();
  
  const activities = await getAllActivities();
  const initialLength = activities.length;
  
  const filteredActivities = activities.filter(activity => activity.id !== id);
  
  if (filteredActivities.length === initialLength) {
    return false; // Nothing was deleted
  }
  
  await fs.promises.writeFile(dataFilePath, JSON.stringify(filteredActivities, null, 2), 'utf-8');
  
  return true;
}

/**
 * Search activities by query
 */
export async function searchActivities(query: string): Promise<Activity[]> {
  const activities = await getAllActivities();
  const lowerQuery = query.toLowerCase();
  
  return activities.filter(activity => 
    activity.description.toLowerCase().includes(lowerQuery) ||
    activity.type.toLowerCase().includes(lowerQuery) ||
    (activity.tags && activity.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
  );
}

/**
 * Get activity statistics
 */
export async function getActivityStats(): Promise<{
  total: number;
  byType: Record<string, number>;
  byProject: Record<string, number>;
  byMonth: Record<string, number>;
  recentDays: Record<string, number>;
}> {
  const activities = await getAllActivities();
  
  // Initialize stats object
  const stats = {
    total: activities.length,
    byType: {} as Record<string, number>,
    byProject: {} as Record<string, number>,
    byMonth: {} as Record<string, number>,
    recentDays: {} as Record<string, number>,
  };
  
  // Current date for calculations
  const now = new Date();
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(now.getMonth() - 1);
  
  // Calculate stats
  activities.forEach(activity => {
    // By type
    stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1;
    
    // By project
    stats.byProject[activity.projectId] = (stats.byProject[activity.projectId] || 0) + 1;
    
    // By month (YYYY-MM format)
    const activityDate = new Date(activity.date);
    const monthKey = `${activityDate.getFullYear()}-${String(activityDate.getMonth() + 1).padStart(2, '0')}`;
    stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + 1;
    
    // Recent days (for activity chart)
    if (activityDate >= lastMonthDate) {
      const dayKey = activityDate.toISOString().split('T')[0];
      stats.recentDays[dayKey] = (stats.recentDays[dayKey] || 0) + 1;
    }
  });
  
  return stats;
}

/**
 * Create an empty activity object (for form initialization)
 */
export function createEmptyActivity(): Activity {
  return {
    id: '',
    projectId: '',
    type: 'note',
    description: '',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    tags: [],
  };
}

/**
 * Get recent activities
 */
export async function getRecentActivities(limit: number = 10): Promise<Activity[]> {
  const activities = await getAllActivities();
  
  return activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
} 