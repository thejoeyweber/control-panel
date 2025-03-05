/*
  File: src/data/revenue.ts
  Purpose: Provides revenue data for the control panel
  Dependencies: RevenueEntry, RevenueGoal types from types/index.ts
*/

import type { RevenueEntry, RevenueGoal } from '../types';
import { isAuthenticated } from '../utils/auth';
import * as dataUtils from '../utils/data';

// Sample revenue entries
export const revenueEntries: RevenueEntry[] = [
  {
    id: 'rev-1',
    amount: 1200.00,
    source: 'Consulting',
    category: 'Services',
    date: '2023-11-15',
    description: 'Web development consultation for Client A',
    recurring: false,
    visibility: 'private'
  },
  {
    id: 'rev-2',
    amount: 499.99,
    source: 'Digital Product',
    category: 'Products',
    date: '2023-11-20',
    description: 'Course sales for November',
    recurring: false,
    visibility: 'private'
  },
  {
    id: 'rev-3',
    amount: 32.50,
    source: 'Affiliate',
    category: 'Passive',
    date: '2023-11-30',
    description: 'Affiliate commission from Amazon',
    recurring: true,
    visibility: 'private'
  },
  {
    id: 'rev-4',
    amount: 950.00,
    source: 'Consulting',
    category: 'Services',
    date: '2023-12-05',
    description: 'Technical writing for Client B',
    recurring: false,
    visibility: 'private'
  },
  {
    id: 'rev-5',
    amount: 150.00,
    source: 'Membership',
    category: 'Passive',
    date: '2023-12-01',
    description: 'Monthly membership subscriptions',
    recurring: true,
    visibility: 'private'
  },
  {
    id: 'rev-6',
    amount: 75.00,
    source: 'Royalties',
    category: 'Passive',
    date: '2023-12-10',
    description: 'Book royalties for November',
    recurring: true,
    visibility: 'public'
  }
];

// Sample revenue goals
export const revenueGoals: RevenueGoal[] = [
  {
    id: 'goal-1',
    name: 'Monthly Income',
    target: 3000.00,
    period: 'monthly',
    startDate: '2023-01-01',
    visibility: 'private'
  },
  {
    id: 'goal-2',
    name: 'Passive Income',
    target: 500.00,
    period: 'monthly',
    startDate: '2023-01-01',
    visibility: 'private'
  },
  {
    id: 'goal-3',
    name: 'Annual Revenue',
    target: 36000.00,
    period: 'yearly',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    visibility: 'public'
  },
  {
    id: 'goal-4',
    name: 'Q4 Consulting',
    target: 5000.00,
    period: 'quarterly',
    startDate: '2023-10-01',
    endDate: '2023-12-31',
    visibility: 'private'
  }
];

/**
 * Get revenue entries filtered by visibility
 * @returns Array of revenue entries visible to the user
 */
export function getVisibleRevenueEntries(): RevenueEntry[] {
  return dataUtils.getVisibleContent(revenueEntries, isAuthenticated());
}

/**
 * Get revenue goals filtered by visibility
 * @returns Array of revenue goals visible to the user
 */
export function getVisibleRevenueGoals(): RevenueGoal[] {
  return dataUtils.getVisibleContent(revenueGoals, isAuthenticated());
}

/**
 * Get a revenue entry by its ID
 * @param id The revenue entry ID to find
 * @returns The revenue entry or undefined if not found
 */
export function getRevenueEntryById(id: string): RevenueEntry | undefined {
  return dataUtils.getItemById(revenueEntries, id);
}

/**
 * Get a revenue goal by its ID
 * @param id The revenue goal ID to find
 * @returns The revenue goal or undefined if not found
 */
export function getRevenueGoalById(id: string): RevenueGoal | undefined {
  return dataUtils.getItemById(revenueGoals, id);
}

/**
 * Get revenue statistics
 * @param year Year to get statistics for (default: current year)
 * @param month Month to get statistics for (optional, 1-12)
 * @returns Object containing revenue statistics
 */
export function getRevenueStats(year: number = new Date().getFullYear(), month?: number) {
  // Filter by year, and optionally by month
  const filtered = revenueEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const entryYear = entryDate.getFullYear();
    
    if (entryYear !== year) return false;
    if (month && entryDate.getMonth() + 1 !== month) return false;
    
    return true;
  });
  
  // Total revenue for the period
  const total = filtered.reduce((sum, entry) => sum + entry.amount, 0);
  
  // Revenue by category
  const categoryTotals: Record<string, number> = {};
  filtered.forEach(entry => {
    categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.amount;
  });
  
  // Revenue by source
  const sourceTotals: Record<string, number> = {};
  filtered.forEach(entry => {
    sourceTotals[entry.source] = (sourceTotals[entry.source] || 0) + entry.amount;
  });
  
  // Recurring vs non-recurring
  const recurring = filtered
    .filter(entry => entry.recurring)
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  const nonRecurring = total - recurring;
  
  return {
    total,
    categoryTotals,
    sourceTotals,
    recurring,
    nonRecurring,
    entries: filtered.length
  };
}

/**
 * Get goal progress information
 * @param goalId ID of the goal to check progress for
 * @returns Object containing goal progress information
 */
export function getGoalProgress(goalId: string) {
  const goal = getRevenueGoalById(goalId);
  if (!goal) return null;
  
  let relevant: RevenueEntry[] = [];
  const now = new Date();
  
  // Determine the date range based on the goal period
  if (goal.period === 'monthly') {
    // Current month's entries
    relevant = revenueEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === now.getMonth() && 
             entryDate.getFullYear() === now.getFullYear();
    });
  } else if (goal.period === 'quarterly') {
    // Current quarter's entries
    const currentQuarter = Math.floor(now.getMonth() / 3);
    relevant = revenueEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const entryQuarter = Math.floor(entryDate.getMonth() / 3);
      return entryQuarter === currentQuarter && 
             entryDate.getFullYear() === now.getFullYear();
    });
  } else if (goal.period === 'yearly') {
    // Current year's entries
    relevant = revenueEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === now.getFullYear();
    });
  }
  
  // Calculate the current amount and percentage
  const current = relevant.reduce((sum, entry) => sum + entry.amount, 0);
  const percentage = Math.min(Math.round((current / goal.target) * 100), 100);
  
  return {
    name: goal.name,
    target: goal.target,
    current,
    percentage,
    remaining: Math.max(goal.target - current, 0)
  };
} 