/*
  File: src/data/resources.ts
  Purpose: Provides resource data for the control panel
  Dependencies: Resource type from types/index.ts
*/

import type { Resource } from '../types';
import { isAuthenticated } from '../utils/auth';
import * as dataUtils from '../utils/data';

// Sample resources data
export const resources: Resource[] = [
  {
    id: 'astro-docs',
    title: 'Astro Documentation',
    description: 'Official documentation for the Astro web framework.',
    url: 'https://docs.astro.build/',
    category: 'Development',
    tags: ['astro', 'documentation', 'web-development'],
    dateAdded: '2023-10-12',
    lastAccessed: '2023-12-01',
    isFavorite: true,
    visibility: 'public'
  },
  {
    id: 'tailwind-css',
    title: 'Tailwind CSS',
    description: 'A utility-first CSS framework for rapid UI development.',
    url: 'https://tailwindcss.com/',
    category: 'Development',
    tags: ['css', 'design', 'frontend'],
    dateAdded: '2023-09-15',
    lastAccessed: '2023-11-25',
    isFavorite: true,
    visibility: 'public'
  },
  {
    id: 'typescript-handbook',
    title: 'TypeScript Handbook',
    description: 'The official TypeScript documentation and guide.',
    url: 'https://www.typescriptlang.org/docs/handbook/',
    category: 'Development',
    tags: ['typescript', 'javascript', 'documentation'],
    dateAdded: '2023-08-20',
    lastAccessed: '2023-11-10',
    notes: 'Great reference for advanced TypeScript features and patterns.',
    isFavorite: false,
    visibility: 'public'
  },
  {
    id: 'notion-api',
    title: 'Notion API Documentation',
    description: 'Official API documentation for the Notion platform.',
    url: 'https://developers.notion.com/',
    category: 'API',
    tags: ['notion', 'api', 'documentation'],
    dateAdded: '2023-11-05',
    lastAccessed: '2023-11-05',
    notes: 'Useful for the book notes integration project.',
    isFavorite: false,
    visibility: 'private'
  },
  {
    id: 'design-resources',
    title: 'Design Resources for Developers',
    description: 'A curated list of design resources for developers.',
    url: 'https://github.com/bradtraversy/design-resources-for-developers',
    category: 'Design',
    tags: ['design', 'resources', 'github'],
    dateAdded: '2023-07-10',
    isFavorite: true,
    visibility: 'public'
  },
  {
    id: 'revenue-calculator',
    title: 'SaaS Revenue Calculator',
    description: 'A tool to calculate and project SaaS revenue metrics.',
    url: 'https://saascalculator.com/',
    category: 'Business',
    tags: ['saas', 'revenue', 'calculator'],
    dateAdded: '2023-11-20',
    lastAccessed: '2023-11-21',
    notes: 'Useful for revenue projections and business planning.',
    isFavorite: false,
    visibility: 'private'
  },
  {
    id: 'cloudflare-pages',
    title: 'Cloudflare Pages Documentation',
    description: 'Documentation for Cloudflare Pages hosting and deployment.',
    url: 'https://developers.cloudflare.com/pages/',
    category: 'DevOps',
    tags: ['hosting', 'deployment', 'cloudflare'],
    dateAdded: '2023-10-25',
    lastAccessed: '2023-11-15',
    notes: 'Consider for hosting the control panel.',
    isFavorite: false,
    visibility: 'public'
  }
];

/**
 * Get resources filtered by visibility
 * @returns Array of resources visible to the user
 */
export function getVisibleResources(): Resource[] {
  return dataUtils.getVisibleContent(resources, isAuthenticated());
}

/**
 * Get a resource by its ID
 * @param id The resource ID to find
 * @returns The resource or undefined if not found
 */
export function getResourceById(id: string): Resource | undefined {
  return dataUtils.getItemById(resources, id);
}

/**
 * Get resource statistics
 * @returns Object containing resource statistics
 */
export function getResourceStats() {
  const total = resources.length;
  
  // Count by category
  const categoryCounts = dataUtils.countByProperty(resources, 'category');
  
  // Count favorites
  const favorites = resources.filter(resource => resource.isFavorite).length;
  
  // Calculate recently added (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentlyAdded = resources.filter(
    resource => new Date(resource.dateAdded) >= thirtyDaysAgo
  ).length;
  
  return {
    total,
    categoryCounts,
    favorites,
    recentlyAdded
  };
}

/**
 * Get favorite resources
 * @returns Array of favorite resources
 */
export function getFavoriteResources(): Resource[] {
  return getVisibleResources().filter(resource => resource.isFavorite);
}

/**
 * Get resources by category
 * @param category The category to filter by
 * @returns Array of resources in the specified category
 */
export function getResourcesByCategory(category: string): Resource[] {
  return getVisibleResources().filter(
    resource => resource.category.toLowerCase() === category.toLowerCase()
  );
} 