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

// ====================== LOCAL STORAGE DATA PERSISTENCE ======================

/**
 * Generate a unique ID for new items
 * @returns A unique string ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

/**
 * Save an array of items to localStorage
 * @param key The key to store the data under
 * @param items The array of items to save
 */
export function saveToLocalStorage<T>(key: string, items: T[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error(`Error saving to localStorage: ${error}`);
    }
  }
}

/**
 * Load an array of items from localStorage
 * @param key The key to load data from
 * @param defaultItems Default items to use if nothing is in localStorage
 * @returns The loaded items or default items
 */
export function loadFromLocalStorage<T>(key: string, defaultItems: T[]): T[] {
  if (typeof window !== 'undefined') {
    try {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : defaultItems;
    } catch (error) {
      console.error(`Error loading from localStorage: ${error}`);
      return defaultItems;
    }
  }
  return defaultItems;
}

/**
 * Add or update an item in an array and save to localStorage
 * @param key The localStorage key
 * @param item The item to add or update
 * @param items The current array of items
 * @returns The updated array
 */
export function saveItem<T extends { id: string }>(key: string, item: T, items: T[]): T[] {
  const index = items.findIndex(i => i.id === item.id);
  let updatedItems: T[];
  
  if (index >= 0) {
    // Update existing item
    updatedItems = [
      ...items.slice(0, index),
      item,
      ...items.slice(index + 1)
    ];
  } else {
    // Add new item
    updatedItems = [...items, item];
  }
  
  saveToLocalStorage(key, updatedItems);
  return updatedItems;
}

/**
 * Delete an item from an array and save to localStorage
 * @param key The localStorage key
 * @param id The ID of the item to delete
 * @param items The current array of items
 * @returns The updated array
 */
export function deleteItem<T extends { id: string }>(key: string, id: string, items: T[]): T[] {
  const updatedItems = items.filter(item => item.id !== id);
  saveToLocalStorage(key, updatedItems);
  return updatedItems;
}

/**
 * Initialize data with merged localStorage and default data
 * @param key The localStorage key
 * @param defaultItems The default items to use if no localStorage data
 * @returns The merged array of items
 */
export function initializeData<T extends { id: string }>(key: string, defaultItems: T[]): T[] {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return defaultItems;
  }
  
  // Get stored items
  const storedItems = loadFromLocalStorage<T>(key, []);
  
  // If no stored items, initialize with default and return
  if (storedItems.length === 0) {
    saveToLocalStorage(key, defaultItems);
    return defaultItems;
  }
  
  // Create a lookup map of stored item IDs
  const storedIds = new Set(storedItems.map(item => item.id));
  
  // Add any default items that aren't in stored items
  const missingDefaults = defaultItems.filter(item => !storedIds.has(item.id));
  
  if (missingDefaults.length > 0) {
    const mergedItems = [...storedItems, ...missingDefaults];
    saveToLocalStorage(key, mergedItems);
    return mergedItems;
  }
  
  return storedItems;
} 