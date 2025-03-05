/*
  File: src/data/ai-tools.ts
  Purpose: Data service for AI tools, providing CRUD operations
  Dependencies: Requires fs for file operations, uuid for ID generation
*/

import type { AITool } from '../types';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// File path for AI tools data
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'ai-tools.json');

// Ensure data file exists
async function ensureDataFile() {
  try {
    await fs.access(dataFilePath);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(dataFilePath, JSON.stringify([]));
  }
}

// Get all AI tools
export async function getAllAITools(): Promise<AITool[]> {
  await ensureDataFile();
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

// Get AI tools by category
export async function getAIToolsByCategory(category: string): Promise<AITool[]> {
  const aiTools = await getAllAITools();
  return aiTools.filter(tool => tool.category === category);
}

// Get AI tool by ID
export async function getAIToolById(id: string): Promise<AITool | null> {
  const aiTools = await getAllAITools();
  return aiTools.find(tool => tool.id === id) || null;
}

// Get favorite AI tools
export async function getFavoriteAITools(): Promise<AITool[]> {
  const aiTools = await getAllAITools();
  return aiTools.filter(tool => tool.isFavorite);
}

// Create a new AI tool
export async function createAITool(aiToolData: Partial<AITool>): Promise<AITool> {
  const aiTools = await getAllAITools();
  
  const newAITool: AITool = {
    id: uuidv4(),
    name: aiToolData.name || '',
    description: aiToolData.description || '',
    prompt: aiToolData.prompt || '',
    category: aiToolData.category || '',
    tags: aiToolData.tags || [],
    dateCreated: aiToolData.dateCreated || new Date().toISOString().split('T')[0],
    lastUsed: aiToolData.lastUsed,
    exampleResponse: aiToolData.exampleResponse || '',
    isFavorite: aiToolData.isFavorite || false,
    visibility: aiToolData.visibility || 'private',
  };
  
  aiTools.push(newAITool);
  await fs.writeFile(dataFilePath, JSON.stringify(aiTools, null, 2));
  
  return newAITool;
}

// Update an AI tool
export async function updateAITool(id: string, aiToolData: Partial<AITool>): Promise<AITool | null> {
  const aiTools = await getAllAITools();
  const index = aiTools.findIndex(tool => tool.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Update the AI tool
  aiTools[index] = {
    ...aiTools[index],
    ...aiToolData,
    id, // Ensure ID remains the same
  };
  
  await fs.writeFile(dataFilePath, JSON.stringify(aiTools, null, 2));
  return aiTools[index];
}

// Delete an AI tool
export async function deleteAITool(id: string): Promise<boolean> {
  const aiTools = await getAllAITools();
  const filteredAITools = aiTools.filter(tool => tool.id !== id);
  
  if (filteredAITools.length === aiTools.length) {
    return false; // No tool was removed
  }
  
  await fs.writeFile(dataFilePath, JSON.stringify(filteredAITools, null, 2));
  return true;
}

// Search AI tools by query (matches against name, description, prompt, and tags)
export async function searchAITools(query: string): Promise<AITool[]> {
  const aiTools = await getAllAITools();
  const lowerQuery = query.toLowerCase();
  
  return aiTools.filter(tool => {
    return (
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.prompt.toLowerCase().includes(lowerQuery) ||
      tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

// Get AI tool statistics
export async function getAIToolStats() {
  const aiTools = await getAllAITools();
  
  // Total count of AI tools
  const totalCount = aiTools.length;
  
  // Count by category
  const countByCategory = aiTools.reduce((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Count of favorite tools
  const favoriteCount = aiTools.filter(tool => tool.isFavorite).length;
  
  // Most common tags
  const tagCounts: Record<string, number> = {};
  aiTools.forEach(tool => {
    tool.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  // Sort tags by count and get top 10
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
  
  return {
    total: totalCount,
    byCategory: countByCategory,
    favoriteCount,
    topTags,
  };
}

// Create an empty AI tool (for form initialization)
export function createEmptyAITool(): AITool {
  return {
    id: '',
    name: '',
    description: '',
    prompt: '',
    category: '',
    tags: [],
    dateCreated: new Date().toISOString().split('T')[0],
    exampleResponse: '',
    isFavorite: false,
    visibility: 'private',
  };
} 