/*
  File: src/utils/data.ts
  Purpose: Provides utility functions for working with data across the application
  Dependencies: None
*/

/**
 * Filter content based on visibility and authentication status
 * @param allContent Array of content to filter
 * @param isAuthenticated Whether the user is authenticated
 * @returns Filtered content based on visibility and auth status
 */
export function getVisibleContent<T extends { visibility: 'public' | 'private' }>(
  allContent: T[],
  isAuthenticated: boolean
): T[] {
  if (isAuthenticated) {
    return allContent;
  }
  return allContent.filter(item => item.visibility === 'public');
}

/**
 * Get an item by ID from an array of items
 * @param items Array of items to search
 * @param id ID to find
 * @returns The found item or undefined
 */
export function getItemById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

/**
 * Count items by a property value
 * @param items Array of items to count
 * @param property Property to group by
 * @returns Object with counts for each property value
 */
export function countByProperty<T>(
  items: T[],
  property: keyof T
): Record<string, number> {
  return items.reduce((acc, item) => {
    const value = String(item[property]);
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate percentages based on counts
 * @param counts Object with count values
 * @param total Total number (if not provided, will be calculated from counts)
 * @returns Object with the same keys but percentage values
 */
export function calculatePercentages(
  counts: Record<string, number>,
  total?: number
): Record<string, number> {
  const actualTotal = total || Object.values(counts).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(counts).reduce((acc, [key, count]) => {
    acc[key] = Math.round((count / actualTotal) * 100);
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Filter items by a tag
 * @param items Array of items to filter
 * @param tag Tag to filter by
 * @returns Filtered array of items containing the tag
 */
export function filterByTag<T extends { tags: string[] }>(items: T[], tag: string): T[] {
  return items.filter(item => item.tags.includes(tag));
}

/**
 * Sort items by a date property
 * @param items Array of items to sort
 * @param dateProperty Property containing date string
 * @param ascending Whether to sort ascending (oldest first)
 * @returns Sorted array of items
 */
export function sortByDate<T>(
  items: T[],
  dateProperty: keyof T,
  ascending: boolean = false
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[dateProperty] as string).getTime();
    const dateB = new Date(b[dateProperty] as string).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
} 