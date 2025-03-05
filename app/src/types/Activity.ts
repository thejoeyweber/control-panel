/*
  File: src/types/Activity.ts
  Purpose: Type definition for activity entries
*/

export interface Activity {
  id: string;
  projectId: string;
  type: string;
  description: string;
  date: string;
  createdAt: string;
  duration?: number;
  url?: string;
  tags?: string[];
} 