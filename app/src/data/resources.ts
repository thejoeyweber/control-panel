/*
  File: src/data/resources.ts
  Purpose: Data service for resources CRUD operations
  Dependencies: fs, path for file operations, uuid for ID generation
*/

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Resource } from '../types/Resource';
import { isAuthenticated } from '../utils/auth';

// Define the file path for resources data
const dataFilePath = path.join(process.cwd(), 'src/data/resources.json');

/**
 * Ensures the data file exists, creating it with empty array if not
 */
async function ensureDataFileExists(): Promise<void> {
  if (!fs.existsSync(dataFilePath)) {
    await fs.promises.writeFile(dataFilePath, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * Get all resources
 */
export async function getAllResources(): Promise<Resource[]> {
  await ensureDataFileExists();
  const data = await fs.promises.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Get resources by category
 */
export async function getResourcesByCategory(category: string): Promise<Resource[]> {
  const resources = await getAllResources();
  return resources.filter(resource => resource.category === category);
}

/**
 * Get resources by type
 */
export async function getResourcesByType(type: string): Promise<Resource[]> {
  const resources = await getAllResources();
  return resources.filter(resource => resource.type === type);
}

/**
 * Get resource by ID
 */
export async function getResourceById(id: string): Promise<Resource | null> {
  const resources = await getAllResources();
  return resources.find(resource => resource.id === id) || null;
}

/**
 * Get favorite resources
 */
export async function getFavoriteResources(): Promise<Resource[]> {
  const resources = await getAllResources();
  return resources.filter(resource => resource.isFavorite);
}

/**
 * Create a new resource
 */
export async function createResource(resourceData: Partial<Resource>): Promise<Resource> {
  await ensureDataFileExists();
  
  const resources = await getAllResources();
  
  // Process tags if provided as string
  if (typeof resourceData.tags === 'string') {
    resourceData.tags = (resourceData.tags as string)
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
  }
  
  // Create new resource with defaults and provided data
  const newResource: Resource = {
    id: uuidv4(),
    title: '',
    url: '',
    description: '',
    category: '',
    type: '',
    dateAdded: new Date().toISOString(),
    isFavorite: false,
    visibility: 'private',
    ...resourceData
  };
  
  resources.push(newResource);
  
  await fs.promises.writeFile(dataFilePath, JSON.stringify(resources, null, 2), 'utf-8');
  
  return newResource;
}

/**
 * Update an existing resource
 */
export async function updateResource(id: string, resourceData: Partial<Resource>): Promise<Resource | null> {
  await ensureDataFileExists();
  
  const resources = await getAllResources();
  const index = resources.findIndex(resource => resource.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Process tags if provided as string
  if (typeof resourceData.tags === 'string') {
    resourceData.tags = (resourceData.tags as string)
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
  }
  
  // Update resource with new data
  const updatedResource = {
    ...resources[index],
    ...resourceData,
  };
  
  resources[index] = updatedResource;
  
  await fs.promises.writeFile(dataFilePath, JSON.stringify(resources, null, 2), 'utf-8');
  
  return updatedResource;
}

/**
 * Delete a resource
 */
export async function deleteResource(id: string): Promise<boolean> {
  await ensureDataFileExists();
  
  const resources = await getAllResources();
  const initialLength = resources.length;
  
  const filteredResources = resources.filter(resource => resource.id !== id);
  
  if (filteredResources.length === initialLength) {
    return false; // Nothing was deleted
  }
  
  await fs.promises.writeFile(dataFilePath, JSON.stringify(filteredResources, null, 2), 'utf-8');
  
  return true;
}

/**
 * Search resources by query
 */
export async function searchResources(query: string): Promise<Resource[]> {
  const resources = await getAllResources();
  const lowerQuery = query.toLowerCase();
  
  return resources.filter(resource => 
    resource.title.toLowerCase().includes(lowerQuery) ||
    resource.description?.toLowerCase().includes(lowerQuery) ||
    resource.category?.toLowerCase().includes(lowerQuery) ||
    resource.type?.toLowerCase().includes(lowerQuery) ||
    (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
  );
}

/**
 * Get resource statistics
 */
export async function getResourceStats(): Promise<{
  total: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  favoriteCount: number;
  recentlyAdded: number;
  topCategories: { category: string; count: number }[];
  topTags: { tag: string; count: number }[];
}> {
  const resources = await getAllResources();
  
  // Initialize stats object
  const stats = {
    total: resources.length,
    byCategory: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    favoriteCount: 0,
    recentlyAdded: 0,
    topCategories: [] as { category: string; count: number }[],
    topTags: [] as { tag: string; count: number }[],
  };
  
  // Current date for calculations
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  // Tag count map
  const tagCounts: Record<string, number> = {};
  
  // Calculate stats
  resources.forEach(resource => {
    // Count by category
    if (resource.category) {
      stats.byCategory[resource.category] = (stats.byCategory[resource.category] || 0) + 1;
    }
    
    // Count by type
    if (resource.type) {
      stats.byType[resource.type] = (stats.byType[resource.type] || 0) + 1;
    }
    
    // Count favorites
    if (resource.isFavorite) {
      stats.favoriteCount++;
    }
    
    // Count recently added
    const addedDate = new Date(resource.dateAdded);
    if (addedDate >= thirtyDaysAgo) {
      stats.recentlyAdded++;
    }
    
    // Count tags
    if (resource.tags) {
      resource.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  // Calculate top categories
  stats.topCategories = Object.entries(stats.byCategory)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Calculate top tags
  stats.topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return stats;
}

/**
 * Create an empty resource object (for form initialization)
 */
export function createEmptyResource(): Resource {
  return {
    id: '',
    title: '',
    url: '',
    description: '',
    category: '',
    type: '',
    tags: [],
    dateAdded: new Date().toISOString(),
    isFavorite: false,
    visibility: 'private'
  };
}

/**
 * Get visible resources based on authentication status
 */
export function getVisibleResources(): Resource[] {
  const authenticated = isAuthenticated();
  
  // Mock data for demonstration
  return [
    {
      id: '1',
      title: 'MDN Web Docs',
      url: 'https://developer.mozilla.org',
      description: 'Comprehensive documentation for web developers',
      category: 'Documentation',
      type: 'website',
      tags: ['web', 'javascript', 'html', 'css'],
      dateAdded: '2023-01-15',
      lastAccessed: '2023-06-10',
      isFavorite: true,
      visibility: 'public'
    },
    {
      id: '2',
      title: 'Astro Documentation',
      url: 'https://docs.astro.build',
      description: 'Official documentation for Astro framework',
      category: 'Documentation',
      type: 'website',
      tags: ['astro', 'framework', 'javascript'],
      dateAdded: '2023-02-20',
      isFavorite: true,
      visibility: 'public'
    },
    {
      id: '3',
      title: 'Tailwind CSS',
      url: 'https://tailwindcss.com',
      description: 'Utility-first CSS framework',
      category: 'Tool',
      type: 'website',
      tags: ['css', 'design'],
      dateAdded: '2023-03-05',
      isFavorite: false,
      visibility: 'public'
    }
  ];
} 