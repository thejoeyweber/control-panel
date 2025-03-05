/*
  File: src/types/AITool.ts
  Purpose: Type definition for AI tools
*/

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