/*
  File: db/config.ts
  Purpose: Define database schema for all entities in the control panel
  Dependencies: Using Astro DB's schema definition API
*/

import { defineDb, defineTable, column } from 'astro:db';

// ------------------ Projects Table ------------------
export const Projects = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    description: column.text(),
    status: column.text(), // Will store: 'active', 'completed', 'planning', 'paused'
    category: column.text(),
    startDate: column.date(),
    lastUpdated: column.date(),
    progress: column.number(),
    tags: column.json(), // Array of strings
    techStack: column.json(), // Array of strings
    nextSteps: column.json({ optional: true }), // Optional array of strings
    notes: column.text({ optional: true }),
    githubUrl: column.text({ optional: true }),
    liveUrl: column.text({ optional: true }),
    visibility: column.text(), // Default 'private' enforced in app code
  }
});

// ------------------ Activities Table ------------------
export const Activities = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    projectId: column.text({ optional: true }),
    type: column.text(),
    description: column.text(),
    date: column.date(),
    createdAt: column.date(),
    duration: column.number({ optional: true }),
    url: column.text({ optional: true }),
    tags: column.json({ optional: true }), // Array of strings
    visibility: column.text(), // Default 'private' enforced in app code
  }
});

// ------------------ Writing Table ------------------
export const WritingPieces = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    summary: column.text(),
    status: column.text(), // Will store: 'draft', 'published', 'scheduled'
    category: column.text(), // Will store: 'blog', 'newsletter', 'documentation', 'other'
    tags: column.json(), // Array of strings
    createdDate: column.date(),
    publishedDate: column.date({ optional: true }),
    lastUpdated: column.date(),
    wordCount: column.number(),
    content: column.text({ optional: true }),
    externalUrl: column.text({ optional: true }),
    visibility: column.text(), // Default 'private' enforced in app code
  }
});

// ------------------ Books Table ------------------
export const Books = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    author: column.text(),
    category: column.text(),
    status: column.text(), // Will store: 'to-read', 'reading', 'completed', 'abandoned'
    startedDate: column.date({ optional: true }),
    completedDate: column.date({ optional: true }),
    format: column.text(), // Will store: 'physical', 'ebook', 'audiobook'
    notes: column.text({ optional: true }),
    rating: column.number({ optional: true }),
    tags: column.json(), // Array of strings
    coverUrl: column.text({ optional: true }),
    purchaseUrl: column.text({ optional: true }),
    visibility: column.text(), // Default 'private' enforced in app code
  }
});

// ------------------ Resources Table ------------------
export const Resources = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    url: column.text(),
    description: column.text({ optional: true }),
    category: column.text({ optional: true }),
    type: column.text({ optional: true }),
    tags: column.json({ optional: true }), // Array of strings
    dateAdded: column.date(),
    lastAccessed: column.date({ optional: true }),
    isFavorite: column.boolean(),
    visibility: column.text(), // Default 'private' enforced in app code
  }
});

// ------------------ Revenue Table ------------------
export const Revenue = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    projectId: column.text({ optional: true }),
    amount: column.number(),
    date: column.date(),
    description: column.text(),
    type: column.text(),
    status: column.text(), // Will store: 'paid', 'pending', 'overdue', 'cancelled'
    visibility: column.text(), // Default 'private' enforced in app code
  }
});

// ------------------ RevenueGoals Table ------------------
export const RevenueGoals = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    target: column.number(),
    period: column.text(), // Will store: 'monthly', 'quarterly', 'yearly'
    startDate: column.date(),
    endDate: column.date({ optional: true }),
    visibility: column.text(), // Default 'private' enforced in app code
  }
});

// ------------------ AI Tools Table ------------------
export const AITools = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    description: column.text(),
    prompt: column.text(),
    category: column.text(),
    tags: column.json(), // Array of strings
    dateCreated: column.date(),
    lastUsed: column.date({ optional: true }),
    exampleResponse: column.text({ optional: true }),
    isFavorite: column.boolean(),
    visibility: column.text(), // Default 'private' enforced in app code
  }
});

// Define the database with all tables
export default defineDb({
  tables: {
    Projects,
    Activities,
    WritingPieces,
    Books,
    Resources,
    Revenue,
    RevenueGoals,
    AITools,
  }
}); 