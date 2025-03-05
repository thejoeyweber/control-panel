/*
  File: src/utils/filters.ts
  Purpose: Provides utility functions for filtering activities and other data
  Dependencies: Activity type from types/index.ts
*/

import type { Activity } from '../types';

/**
 * Filter activities by project ID
 * @param activities Activities to filter
 * @param projectId Project ID to filter by, or 'all' for all projects
 * @returns Filtered activities
 */
export function filterByProject(activities: Activity[], projectId: string): Activity[] {
  if (!projectId || projectId === 'all') {
    return activities;
  }
  return activities.filter(activity => activity.projectId === projectId);
}

/**
 * Filter activities by activity type
 * @param activities Activities to filter
 * @param type Activity type to filter by, or 'all' for all types
 * @returns Filtered activities
 */
export function filterByType(activities: Activity[], type: string): Activity[] {
  if (!type || type === 'all') {
    return activities;
  }
  return activities.filter(activity => activity.type === type);
}

/**
 * Filter activities by date range
 * @param activities Activities to filter
 * @param dateRange Date range to filter by, or 'all' for all time
 * @returns Filtered activities
 */
export function filterByDateRange(activities: Activity[], dateRange: string): Activity[] {
  if (!dateRange || dateRange === 'all') {
    return activities;
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  let startDate: Date;
  
  switch (dateRange) {
    case 'today':
      startDate = today;
      break;
    case 'yesterday':
      startDate = yesterday;
      break;
    case 'this-week': {
      // Start of this week (Sunday)
      const day = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
      startDate = new Date(today);
      startDate.setDate(today.getDate() - day);
      break;
    }
    case 'last-week': {
      // Start of last week
      const day = today.getDay();
      startDate = new Date(today);
      startDate.setDate(today.getDate() - day - 7);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      
      return activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= startDate && activityDate <= endDate;
      });
    }
    case 'this-month': {
      // Start of this month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    }
    case 'last-month': {
      // Start of last month
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      
      return activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= startDate && activityDate <= endDate;
      });
    }
    default:
      return activities;
  }
  
  return activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= startDate;
  });
}

/**
 * Apply all filters to activities
 * @param activities Activities to filter
 * @param projectId Project ID filter
 * @param type Activity type filter
 * @param dateRange Date range filter
 * @returns Filtered activities
 */
export function applyAllFilters(
  activities: Activity[],
  projectId: string,
  type: string,
  dateRange: string
): Activity[] {
  let filtered = activities;
  
  filtered = filterByProject(filtered, projectId);
  filtered = filterByType(filtered, type);
  filtered = filterByDateRange(filtered, dateRange);
  
  return filtered;
} 