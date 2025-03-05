/*
  File: src/types/Resource.ts
  Purpose: Type definition for resources
*/

export interface Resource {
  id: string;
  title: string;
  url: string;
  description?: string;
  category?: string;
  type?: string;
  tags?: string[];
  dateAdded: string;
  lastAccessed?: string;
  isFavorite: boolean;
  visibility: 'public' | 'private';
} 