/*
  File: src/types/index.ts
  Purpose: Define TypeScript interfaces for all data types in the control panel
  Dependencies: None
*/

// ------------------ Project Types ------------------
// Central type definitions for projects
export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'planning' | 'paused';
  category: string;
  startDate: string;
  lastUpdated: string;
  progress: number;
  tags: string[];
  techStack: string[];
  nextSteps?: string[];
  notes?: string;
  githubUrl?: string;
  liveUrl?: string;
  visibility: 'public' | 'private';
  activities?: Activity[];
}

export interface Activity {
  id: string;
  projectId: string;
  type: 'commit' | 'pr' | 'manual';
  date: string;
  description: string;
}

// ------------------ Writing Types ------------------
export interface WritingPiece {
  id: string;
  title: string;
  summary: string;
  status: 'draft' | 'published' | 'scheduled';
  category: 'blog' | 'newsletter' | 'documentation' | 'other';
  tags: string[];
  createdDate: string;
  publishedDate?: string;
  lastUpdated: string;
  wordCount: number;
  content?: string;
  externalUrl?: string;
  visibility: 'public' | 'private';
}

// ------------------ Book Types ------------------
export interface Book {
  id: string;
  title: string;
  author: string;
  category: string; 
  status: 'to-read' | 'reading' | 'completed' | 'abandoned';
  startedDate?: string;
  completedDate?: string;
  format: 'physical' | 'ebook' | 'audiobook';
  notes?: string;
  rating?: number; // 1-5
  tags: string[];
  coverUrl?: string;
  purchaseUrl?: string;
  visibility: 'public' | 'private';
}

// ------------------ Resource Types ------------------
export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  dateAdded: string;
  lastAccessed?: string;
  notes?: string;
  isFavorite: boolean;
  visibility: 'public' | 'private';
}

// ------------------ Revenue Types ------------------
export interface RevenueEntry {
  id: string;
  amount: number;
  source: string;
  category: string;
  date: string;
  description?: string;
  recurring: boolean;
  visibility: 'public' | 'private';
}

export interface RevenueGoal {
  id: string;
  name: string;
  target: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  visibility: 'public' | 'private';
}

// New interface for Revenue (to replace RevenueEntry)
export interface Revenue {
  id: string;
  projectId: string;
  amount: number;
  date: string;
  description: string;
  type: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  visibility: 'public' | 'private';
}

// ------------------ AI Tool Types ------------------
export interface AITool {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
  dateCreated: string;
  lastUsed?: string;
  exampleResponse?: string;
  isFavorite: boolean;
  visibility: 'public' | 'private';
} 