/*
  File: db/seed.ts
  Purpose: Seed the Astro DB with data from existing JSON files
  Dependencies: fs for file operations
*/

import { db } from 'astro:db';
import {
  Projects,
  Activities,
  WritingPieces,
  Books,
  Resources,
  Revenue,
  RevenueGoals,
  AITools
} from 'astro:db';
import fs from 'node:fs/promises';
import path from 'node:path';

// Helper to read JSON data from file
async function readJSONFile(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const data = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

// Helper to format date strings to Date objects
function formatDate(dateString: string) {
  if (!dateString) return null;
  return new Date(dateString);
}

// Helper function to get a default date (today) for missing dates
function getDefaultDate() {
  return new Date();
}

// Helper to convert object with dates to proper format
function convertDates(obj: any, dateFields: string[]) {
  const result = { ...obj };
  for (const field of dateFields) {
    if (result[field]) {
      result[field] = formatDate(result[field]);
    }
  }
  return result;
}

export default async function() {
  console.log('🌱 Seeding database...');

  // Clear existing data (optional, remove if you want to preserve existing DB data)
  await db.delete(Projects);
  await db.delete(Activities);
  await db.delete(WritingPieces);
  await db.delete(Books);
  await db.delete(Resources);
  await db.delete(Revenue);
  await db.delete(RevenueGoals);
  await db.delete(AITools);

  // Seed Projects
  try {
    const projectsData = await readJSONFile('src/data/projects.json');
    if (projectsData.length > 0) {
      const formattedProjects = projectsData.map((project: any) => ({
        ...project,
        // Map name to title if name exists
        title: project.title || project.name,
        // Remove name field to avoid duplication
        name: undefined,
        // Add default category if missing
        category: project.category || 'other',
        // Add default progress if missing
        progress: project.progress !== undefined ? project.progress : 0,
        // Add default tech stack if missing
        techStack: project.techStack || [],
        // Ensure startDate has a value
        startDate: project.startDate ? formatDate(project.startDate) : getDefaultDate(),
        // Ensure lastUpdated has a value
        lastUpdated: project.lastUpdated ? formatDate(project.lastUpdated) : 
                    (project.startDate ? formatDate(project.startDate) : getDefaultDate()),
        // Remove any activities array as it will be handled separately
        activities: undefined
      }));
      
      await db.insert(Projects).values(formattedProjects);
      console.log(`✅ Inserted ${formattedProjects.length} projects`);
    }
  } catch (error) {
    console.error('Error seeding projects:', error);
  }

  // Seed Activities
  try {
    const activitiesData = await readJSONFile('src/data/activities.json');
    if (activitiesData.length > 0) {
      const formattedActivities = activitiesData.map((activity: any) => ({
        ...activity,
        date: formatDate(activity.date),
        createdAt: formatDate(activity.createdAt || activity.date),
        // Add default visibility if missing
        visibility: activity.visibility || 'private',
      }));
      
      await db.insert(Activities).values(formattedActivities);
      console.log(`✅ Inserted ${formattedActivities.length} activities`);
    }
  } catch (error) {
    console.error('Error seeding activities:', error);
  }

  // Seed WritingPieces
  try {
    const writingData = await readJSONFile('src/data/writing.json');
    if (writingData.length > 0) {
      const formattedWriting = writingData.map((piece: any) => ({
        ...piece,
        createdDate: formatDate(piece.createdDate),
        publishedDate: piece.publishedDate ? formatDate(piece.publishedDate) : null,
        lastUpdated: formatDate(piece.lastUpdated),
      }));
      
      await db.insert(WritingPieces).values(formattedWriting);
      console.log(`✅ Inserted ${formattedWriting.length} writing pieces`);
    }
  } catch (error) {
    console.error('Error seeding writing pieces:', error);
  }

  // Seed Books
  try {
    const booksData = await readJSONFile('src/data/books.json');
    if (booksData.length > 0) {
      const formattedBooks = booksData.map((book: any) => ({
        ...book,
        startedDate: book.startedDate ? formatDate(book.startedDate) : null,
        completedDate: book.completedDate ? formatDate(book.completedDate) : null,
      }));
      
      await db.insert(Books).values(formattedBooks);
      console.log(`✅ Inserted ${formattedBooks.length} books`);
    }
  } catch (error) {
    console.error('Error seeding books:', error);
  }

  // Seed Resources
  try {
    const resourcesData = await readJSONFile('src/data/resources.json');
    if (resourcesData.length > 0) {
      const formattedResources = resourcesData.map((resource: any) => ({
        ...resource,
        dateAdded: formatDate(resource.dateAdded),
        lastAccessed: resource.lastAccessed ? formatDate(resource.lastAccessed) : null,
      }));
      
      await db.insert(Resources).values(formattedResources);
      console.log(`✅ Inserted ${formattedResources.length} resources`);
    }
  } catch (error) {
    console.error('Error seeding resources:', error);
  }

  // Seed Revenue
  try {
    const revenueData = await readJSONFile('src/data/revenue.json');
    if (revenueData.length > 0) {
      const formattedRevenue = revenueData.map((entry: any) => ({
        ...entry,
        date: formatDate(entry.date),
      }));
      
      await db.insert(Revenue).values(formattedRevenue);
      console.log(`✅ Inserted ${formattedRevenue.length} revenue entries`);
    }
  } catch (error) {
    console.error('Error seeding revenue:', error);
  }

  // Seed AI Tools
  try {
    const aiToolsData = await readJSONFile('src/data/ai-tools.json');
    if (aiToolsData.length > 0) {
      const formattedAITools = aiToolsData.map((tool: any) => ({
        ...tool,
        dateCreated: formatDate(tool.dateCreated),
        lastUsed: tool.lastUsed ? formatDate(tool.lastUsed) : null,
      }));
      
      await db.insert(AITools).values(formattedAITools);
      console.log(`✅ Inserted ${formattedAITools.length} AI tools`);
    }
  } catch (error) {
    console.error('Error seeding AI tools:', error);
  }

  console.log('✅ Database seeding complete!');
} 