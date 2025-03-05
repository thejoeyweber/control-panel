/*
  File: src/data/writing.ts
  Purpose: Provides writing data for the control panel
  Dependencies: WritingPiece type from types/index.ts
*/

import type { WritingPiece } from '../types';
import { isAuthenticated } from '../utils/auth';
import * as dataUtils from '../utils/data';

// Sample writing data
export const writingPieces: WritingPiece[] = [
  {
    id: 'astro-migration',
    title: 'Migrating My Project to Astro',
    summary: 'How I migrated my personal dashboard to Astro for better performance and DX.',
    status: 'published',
    category: 'blog',
    tags: ['astro', 'web-development', 'javascript', 'performance'],
    createdDate: '2023-11-15',
    publishedDate: '2023-11-25',
    lastUpdated: '2023-11-25',
    wordCount: 1850,
    externalUrl: 'https://example.com/blog/astro-migration',
    visibility: 'public'
  },
  {
    id: 'weekly-dev-update-12',
    title: 'Weekly Dev Update #12',
    summary: 'Progress updates on current projects and what I learned this week.',
    status: 'published',
    category: 'newsletter',
    tags: ['weekly-update', 'learning', 'projects'],
    createdDate: '2023-12-01',
    publishedDate: '2023-12-02',
    lastUpdated: '2023-12-02',
    wordCount: 950,
    visibility: 'public'
  },
  {
    id: 'revenue-streams-analysis',
    title: 'Analyzing My Revenue Streams',
    summary: 'A breakdown of my revenue sources and plans for diversification.',
    status: 'draft',
    category: 'blog',
    tags: ['revenue', 'business', 'planning'],
    createdDate: '2023-12-05',
    lastUpdated: '2023-12-05',
    wordCount: 1230,
    visibility: 'private'
  },
  {
    id: 'ai-prompt-engineering',
    title: 'Effective Prompt Engineering for AI Tools',
    summary: 'Techniques I use to get better results from AI assistants like GPT-4.',
    status: 'scheduled',
    category: 'blog',
    tags: ['ai', 'productivity', 'tools'],
    createdDate: '2023-12-03',
    publishedDate: '2023-12-15',
    lastUpdated: '2023-12-10',
    wordCount: 2100,
    visibility: 'private'
  },
  {
    id: 'book-note-atomic-habits',
    title: 'Book Notes: Atomic Habits',
    summary: 'My key takeaways and implementation ideas from James Clear\'s Atomic Habits.',
    status: 'published',
    category: 'blog',
    tags: ['books', 'productivity', 'habits'],
    createdDate: '2023-10-20',
    publishedDate: '2023-10-30',
    lastUpdated: '2023-11-05',
    wordCount: 1650,
    externalUrl: 'https://example.com/blog/atomic-habits-notes',
    visibility: 'public'
  }
];

/**
 * Get writing pieces filtered by visibility
 * @returns Array of writing pieces visible to the user
 */
export function getVisibleWriting(): WritingPiece[] {
  return dataUtils.getVisibleContent(writingPieces, isAuthenticated());
}

/**
 * Get a writing piece by its ID
 * @param id The writing piece ID to find
 * @returns The writing piece or undefined if not found
 */
export function getWritingById(id: string): WritingPiece | undefined {
  return dataUtils.getItemById(writingPieces, id);
}

/**
 * Get writing statistics
 * @returns Object containing writing statistics
 */
export function getWritingStats() {
  const total = writingPieces.length;
  
  // Count by status
  const statusCounts = dataUtils.countByProperty(writingPieces, 'status');
  const statusPercentages = dataUtils.calculatePercentages(statusCounts, total);
  
  // Count by category
  const categoryCounts = dataUtils.countByProperty(writingPieces, 'category');
  
  // Calculate total words written
  const totalWords = writingPieces.reduce((sum, piece) => sum + piece.wordCount, 0);
  
  // Calculate published word count
  const publishedWords = writingPieces
    .filter(piece => piece.status === 'published')
    .reduce((sum, piece) => sum + piece.wordCount, 0);
  
  return {
    total,
    published: statusCounts['published'] || 0,
    drafts: statusCounts['draft'] || 0,
    scheduled: statusCounts['scheduled'] || 0,
    statusPercentages,
    categoryCounts,
    totalWords,
    publishedWords
  };
}

/**
 * Get recent writing pieces
 * @param limit Number of items to return (default: 5)
 * @returns Array of recent writing pieces sorted by last updated date
 */
export function getRecentWriting(limit: number = 5): WritingPiece[] {
  return dataUtils.sortByDate(getVisibleWriting(), 'lastUpdated').slice(0, limit);
} 