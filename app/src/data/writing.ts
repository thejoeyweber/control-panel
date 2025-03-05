/*
  File: src/data/writing.ts
  Purpose: Data service for writing pieces with CRUD operations
  Dependencies: fs for file operations, uuid for ID generation
*/

import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { WritingPiece } from '../types';
import { isAuthenticated } from '../utils/auth';
import * as dataUtils from '../utils/data';

// Define the path to the writing data file
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'writing.json');

/**
 * Ensures the data file exists, creates it with empty array if it doesn't
 */
async function ensureDataFileExists(): Promise<void> {
  try {
    await fs.access(dataFilePath);
  } catch (error) {
    // File doesn't exist, create it with an empty array
    await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
  }
}

/**
 * Get all writing pieces
 * @returns {Promise<WritingPiece[]>} Array of all writing pieces
 */
export async function getAllWriting(): Promise<WritingPiece[]> {
  await ensureDataFileExists();
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Get writing pieces by category
 * @param {string} category - The category to filter by
 * @returns {Promise<WritingPiece[]>} Array of writing pieces in the specified category
 */
export async function getWritingByCategory(category: string): Promise<WritingPiece[]> {
  const writings = await getAllWriting();
  return writings.filter(writing => writing.category === category);
}

/**
 * Get writing pieces by status
 * @param {string} status - The status to filter by
 * @returns {Promise<WritingPiece[]>} Array of writing pieces with the specified status
 */
export async function getWritingByStatus(status: string): Promise<WritingPiece[]> {
  const writings = await getAllWriting();
  return writings.filter(writing => writing.status === status);
}

/**
 * Get a writing piece by ID
 * @param {string} id - The ID of the writing piece to retrieve
 * @returns {Promise<WritingPiece|null>} The writing piece or null if not found
 */
export async function getWritingById(id: string): Promise<WritingPiece | null> {
  const writings = await getAllWriting();
  return writings.find(writing => writing.id === id) || null;
}

/**
 * Create a new writing piece
 * @param {Partial<WritingPiece>} writingData - The writing piece data
 * @returns {Promise<WritingPiece>} The created writing piece
 */
export async function createWriting(writingData: Partial<WritingPiece>): Promise<WritingPiece> {
  await ensureDataFileExists();
  
  const writings = await getAllWriting();
  
  // Create a new writing piece with default values and provided data
  const newWriting: WritingPiece = {
    id: uuidv4(),
    title: '',
    summary: '',
    status: 'draft',
    category: 'blog',
    tags: [],
    createdDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    wordCount: 0,
    visibility: 'private',
    ...writingData
  };
  
  // Add the new writing piece to the array
  writings.push(newWriting);
  
  // Save the updated writings array
  await fs.writeFile(dataFilePath, JSON.stringify(writings, null, 2));
  
  return newWriting;
}

/**
 * Update an existing writing piece
 * @param {string} id - The ID of the writing piece to update
 * @param {Partial<WritingPiece>} writingData - The updated writing piece data
 * @returns {Promise<WritingPiece|null>} The updated writing piece or null if not found
 */
export async function updateWriting(id: string, writingData: Partial<WritingPiece>): Promise<WritingPiece | null> {
  await ensureDataFileExists();
  
  const writings = await getAllWriting();
  
  // Find the index of the writing piece to update
  const index = writings.findIndex(writing => writing.id === id);
  
  // If the writing piece doesn't exist, return null
  if (index === -1) {
    return null;
  }
  
  // Update the writing piece with the provided data
  writings[index] = {
    ...writings[index],
    ...writingData,
    id // Ensure ID doesn't change
  };
  
  // Save the updated writings array
  await fs.writeFile(dataFilePath, JSON.stringify(writings, null, 2));
  
  return writings[index];
}

/**
 * Delete a writing piece
 * @param {string} id - The ID of the writing piece to delete
 * @returns {Promise<boolean>} True if the writing piece was deleted, false if not found
 */
export async function deleteWriting(id: string): Promise<boolean> {
  await ensureDataFileExists();
  
  const writings = await getAllWriting();
  
  // Find the index of the writing piece to delete
  const index = writings.findIndex(writing => writing.id === id);
  
  // If the writing piece doesn't exist, return false
  if (index === -1) {
    return false;
  }
  
  // Remove the writing piece from the array
  writings.splice(index, 1);
  
  // Save the updated writings array
  await fs.writeFile(dataFilePath, JSON.stringify(writings, null, 2));
  
  return true;
}

/**
 * Search writing pieces by query
 * @param {string} query - The search query
 * @returns {Promise<WritingPiece[]>} Array of writing pieces matching the query
 */
export async function searchWriting(query: string): Promise<WritingPiece[]> {
  const writings = await getAllWriting();
  const lowerQuery = query.toLowerCase();
  
  return writings.filter(writing => 
    writing.title.toLowerCase().includes(lowerQuery) ||
    writing.summary.toLowerCase().includes(lowerQuery) ||
    writing.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    (writing.content && writing.content.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get writing statistics
 * @returns {Promise<Object>} Object containing writing statistics
 */
export async function getWritingStats(): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  wordCount: number;
  topTags: { tag: string; count: number }[];
}> {
  const writings = await getAllWriting();
  
  // Count writings by status
  const byStatus: Record<string, number> = {};
  writings.forEach(writing => {
    byStatus[writing.status] = (byStatus[writing.status] || 0) + 1;
  });
  
  // Count writings by category
  const byCategory: Record<string, number> = {};
  writings.forEach(writing => {
    byCategory[writing.category] = (byCategory[writing.category] || 0) + 1;
  });
  
  // Calculate total word count
  const wordCount = writings.reduce((total, writing) => total + (writing.wordCount || 0), 0);
  
  // Count tag occurrences
  const tagCounts: Record<string, number> = {};
  writings.forEach(writing => {
    writing.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  // Convert tag counts to array and sort by count
  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
  
  return {
    total: writings.length,
    byStatus,
    byCategory,
    wordCount,
    topTags
  };
}

/**
 * Create an empty writing piece for form initialization
 * @returns {WritingPiece} An empty writing piece with default values
 */
export function createEmptyWriting(): WritingPiece {
  return {
    id: '',
    title: '',
    summary: '',
    status: 'draft',
    category: 'blog',
    tags: [],
    createdDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    wordCount: 0,
    content: '',
    visibility: 'private'
  };
}

/**
 * Get writing pieces filtered by visibility
 * @returns Array of writing pieces visible to the user
 */
export async function getVisibleWriting(): Promise<WritingPiece[]> {
  const writings = await getAllWriting();
  return dataUtils.getVisibleContent(writings, isAuthenticated());
}

/**
 * Get recent writing pieces
 * @param limit Number of items to return (default: 5)
 * @returns Array of recent writing pieces sorted by last updated date
 */
export async function getRecentWriting(limit: number = 5): Promise<WritingPiece[]> {
  const writings = await getVisibleWriting();
  return dataUtils.sortByDate(writings, 'lastUpdated').slice(0, limit);
} 