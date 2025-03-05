/*
  File: src/data/revenue.ts
  Purpose: Data service for revenue entries, providing CRUD operations
  Dependencies: Requires fs for file operations, uuid for ID generation
*/

import type { Revenue } from '../types';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// File path for revenue data
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'revenue.json');

// Ensure data file exists
async function ensureDataFile() {
  try {
    await fs.access(dataFilePath);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(dataFilePath, JSON.stringify([]));
  }
}

// Get all revenue entries
export async function getAllRevenue(): Promise<Revenue[]> {
  await ensureDataFile();
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

// Get revenue by project ID
export async function getRevenueByProject(projectId: string): Promise<Revenue[]> {
  const revenue = await getAllRevenue();
  return revenue.filter(entry => entry.projectId === projectId);
}

// Get revenue by ID
export async function getRevenueById(id: string): Promise<Revenue | null> {
  const revenue = await getAllRevenue();
  return revenue.find(entry => entry.id === id) || null;
}

// Create a new revenue entry
export async function createRevenue(revenueData: Partial<Revenue>): Promise<Revenue> {
  const revenue = await getAllRevenue();
  
  const newRevenue: Revenue = {
    id: uuidv4(),
    projectId: revenueData.projectId || '',
    amount: revenueData.amount || 0,
    date: revenueData.date || new Date().toISOString().split('T')[0],
    description: revenueData.description || '',
    type: revenueData.type || 'invoice',
    status: revenueData.status || 'paid',
    visibility: revenueData.visibility || 'private',
  };
  
  revenue.push(newRevenue);
  await fs.writeFile(dataFilePath, JSON.stringify(revenue, null, 2));
  
  return newRevenue;
}

// Update a revenue entry
export async function updateRevenue(id: string, revenueData: Partial<Revenue>): Promise<Revenue | null> {
  const revenue = await getAllRevenue();
  const index = revenue.findIndex(entry => entry.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Update the revenue entry
  revenue[index] = {
    ...revenue[index],
    ...revenueData,
    id, // Ensure ID remains the same
  };
  
  await fs.writeFile(dataFilePath, JSON.stringify(revenue, null, 2));
  return revenue[index];
}

// Delete a revenue entry
export async function deleteRevenue(id: string): Promise<boolean> {
  const revenue = await getAllRevenue();
  const filteredRevenue = revenue.filter(entry => entry.id !== id);
  
  if (filteredRevenue.length === revenue.length) {
    return false; // No entry was removed
  }
  
  await fs.writeFile(dataFilePath, JSON.stringify(filteredRevenue, null, 2));
  return true;
}

// Get revenue statistics
export async function getRevenueStats() {
  const revenue = await getAllRevenue();
  
  // Calculate total revenue
  const totalRevenue = revenue.reduce((sum, entry) => sum + entry.amount, 0);
  
  // Get revenue by type
  const revenueByType = revenue.reduce((acc, entry) => {
    acc[entry.type] = (acc[entry.type] || 0) + entry.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Get revenue by status
  const revenueByStatus = revenue.reduce((acc, entry) => {
    acc[entry.status] = (acc[entry.status] || 0) + entry.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Get recent revenue (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentRevenue = revenue.filter(
    entry => new Date(entry.date) >= thirtyDaysAgo
  );
  
  // Calculate monthly breakdown (last 12 months)
  const monthlyRevenue: Record<string, number> = {};
  const now = new Date();
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(now);
    date.setMonth(now.getMonth() - i);
    const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    monthlyRevenue[yearMonth] = 0;
  }
  
  revenue.forEach(entry => {
    const entryDate = new Date(entry.date);
    const yearMonth = `${entryDate.getFullYear()}-${(entryDate.getMonth() + 1).toString().padStart(2, '0')}`;
    if (monthlyRevenue[yearMonth] !== undefined) {
      monthlyRevenue[yearMonth] += entry.amount;
    }
  });
  
  return {
    total: totalRevenue,
    byType: revenueByType,
    byStatus: revenueByStatus,
    recent: recentRevenue,
    monthly: monthlyRevenue,
  };
}

// Create an empty revenue entry (for form initialization)
export function createEmptyRevenue(): Revenue {
  return {
    id: '',
    projectId: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'invoice',
    status: 'paid',
    visibility: 'private',
  };
} 