/*
  File: db/seed.ts
  Purpose: Seed the Astro DB with sample data for testing
  Dependencies: Astro DB models
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

// Helper to generate a unique ID
function generateId(prefix = '') {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

export default async function() {
  console.log('🌱 Seeding database with sample data...');

  // Clear existing data
  await db.delete(Projects);
  await db.delete(Activities);
  await db.delete(WritingPieces);
  await db.delete(Books);
  await db.delete(Resources);
  await db.delete(Revenue);
  await db.delete(RevenueGoals);
  await db.delete(AITools);

  // Sample projects
  const projects = [
    {
      id: generateId('prj'),
      title: 'Control Panel Dashboard',
      description: 'A personal dashboard for managing projects, writing, resources, and AI tools.',
      status: 'active',
      visibility: 'private',
      category: 'Development',
      progress: 75,
      startDate: new Date('2023-12-01'),
      lastUpdated: new Date(),
      githubUrl: 'https://github.com/user/controlpanel',
      liveUrl: 'https://controlpanel.example.com',
      tags: ['astro', 'tailwind', 'dashboard'],
      techStack: ['Astro', 'Tailwind CSS', 'TypeScript'],
      notes: 'Making good progress on the dashboard. Need to add more features.'
    },
    {
      id: generateId('prj'),
      title: 'Blog Redesign',
      description: 'Redesigning my personal blog with a modern look and improved performance.',
      status: 'planning',
      visibility: 'public',
      category: 'Design',
      progress: 25,
      startDate: new Date('2024-01-15'),
      lastUpdated: new Date(),
      githubUrl: '',
      liveUrl: 'https://blog.example.com',
      tags: ['design', 'blog', 'content'],
      techStack: ['Next.js', 'MDX', 'CSS Modules'],
      notes: 'Planning phase complete, working on wireframes.'
    },
    {
      id: generateId('prj'),
      title: 'AI Writing Assistant',
      description: 'Building an AI assistant to help with writing and content creation.',
      status: 'active',
      visibility: 'private',
      category: 'Development',
      progress: 40,
      startDate: new Date('2024-02-01'),
      lastUpdated: new Date(),
      githubUrl: 'https://github.com/user/ai-writer',
      liveUrl: '',
      tags: ['ai', 'nlp', 'productivity'],
      techStack: ['Python', 'OpenAI API', 'Flask'],
      notes: 'Need to improve the prompt engineering for better results.'
    }
  ];
  
  await db.insert(Projects).values(projects);
  console.log(`✅ Inserted ${projects.length} sample projects`);

  // Sample activities
  const activities = [
    {
      id: generateId('act'),
      description: 'Implemented authentication system for the Control Panel',
      type: 'development',
      projectId: projects[0].id,
      date: new Date('2024-01-10'),
      createdAt: new Date('2024-01-10'),
      visibility: 'private',
      tags: ['authentication', 'security']
    },
    {
      id: generateId('act'),
      description: 'Created wireframes for Blog Redesign',
      type: 'design',
      projectId: projects[1].id,
      date: new Date('2024-01-20'),
      createdAt: new Date('2024-01-20'),
      visibility: 'private',
      tags: ['wireframe', 'ux']
    },
    {
      id: generateId('act'),
      description: 'Integrated OpenAI API with the AI Writing Assistant',
      type: 'development',
      projectId: projects[2].id,
      date: new Date('2024-02-05'),
      createdAt: new Date('2024-02-05'),
      visibility: 'private',
      tags: ['api', 'integration']
    },
    {
      id: generateId('act'),
      description: 'Added Astro DB integration to the Control Panel',
      type: 'development',
      projectId: projects[0].id,
      date: new Date(),
      createdAt: new Date(),
      visibility: 'private',
      tags: ['database', 'astro-db']
    }
  ];
  
  await db.insert(Activities).values(activities);
  console.log(`✅ Inserted ${activities.length} sample activities`);

  // Sample writing pieces
  const writingPieces = [
    {
      id: generateId('wrt'),
      title: 'Getting Started with Astro DB',
      summary: 'A guide to setting up and using Astro DB in your projects.',
      content: 'Astro DB is a powerful database solution for Astro applications...',
      status: 'published',
      category: 'Tutorial',
      wordCount: 1500,
      visibility: 'public',
      tags: ['astro', 'database', 'tutorial'],
      createdDate: new Date('2024-01-05'),
      publishedDate: new Date('2024-01-10'),
      lastUpdated: new Date('2024-01-10'),
      externalUrl: 'https://myblog.com/astro-db-guide'
    },
    {
      id: generateId('wrt'),
      title: 'The Future of Web Development',
      summary: 'An exploration of emerging trends in web development.',
      content: 'Web development is evolving rapidly with new frameworks and tools...',
      status: 'draft',
      category: 'Essay',
      wordCount: 2200,
      visibility: 'private',
      tags: ['webdev', 'future', 'trends'],
      createdDate: new Date('2024-02-15'),
      publishedDate: null,
      lastUpdated: new Date('2024-02-20')
    },
    {
      id: generateId('wrt'),
      title: 'Mastering Tailwind CSS',
      summary: 'Learn how to efficiently use Tailwind CSS in your projects.',
      content: 'Tailwind CSS provides a utility-first approach to styling...',
      status: 'published',
      category: 'Tutorial',
      wordCount: 1800,
      visibility: 'public',
      tags: ['css', 'tailwind', 'design'],
      createdDate: new Date('2023-12-01'),
      publishedDate: new Date('2023-12-10'),
      lastUpdated: new Date('2023-12-15')
    }
  ];
  
  await db.insert(WritingPieces).values(writingPieces);
  console.log(`✅ Inserted ${writingPieces.length} sample writing pieces`);

  // Sample books
  const books = [
    {
      id: generateId('bk'),
      title: 'The Pragmatic Programmer',
      author: 'Dave Thomas & Andy Hunt',
      description: 'A guide to becoming a better developer through practical advice and wisdom.',
      status: 'completed',
      category: 'Programming',
      format: 'ebook',
      visibility: 'public',
      rating: 5,
      pageCount: 352,
      startedDate: new Date('2023-09-01'),
      completedDate: new Date('2023-10-15'),
      notes: 'One of the best programming books I\'ve ever read. Great practical advice.',
      tags: ['programming', 'software', 'career']
    },
    {
      id: generateId('bk'),
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'An easy & proven way to build good habits & break bad ones.',
      status: 'reading',
      category: 'Self-Help',
      format: 'physical',
      visibility: 'private',
      rating: 4,
      pageCount: 320,
      startedDate: new Date('2024-01-10'),
      completedDate: null,
      notes: 'Great insights on habit formation and behavior change.',
      tags: ['productivity', 'habits', 'self-improvement']
    },
    {
      id: generateId('bk'),
      title: 'The Design of Everyday Things',
      author: 'Don Norman',
      description: 'A classic exploration of human-centered design.',
      status: 'to-read',
      category: 'Design',
      format: 'audiobook',
      visibility: 'public',
      rating: 0,
      pageCount: 368,
      startedDate: null,
      completedDate: null,
      notes: 'Recommended by several UX designers I respect.',
      tags: ['design', 'ux', 'psychology']
    }
  ];
  
  await db.insert(Books).values(books);
  console.log(`✅ Inserted ${books.length} sample books`);

  // Sample resources
  const resources = [
    {
      id: generateId('res'),
      title: 'Tailwind CSS Documentation',
      description: 'The official documentation for Tailwind CSS.',
      url: 'https://tailwindcss.com/docs',
      type: 'documentation',
      category: 'Development',
      visibility: 'public',
      isFavorite: true,
      tags: ['css', 'tailwind', 'reference'],
      dateAdded: new Date('2023-11-15'),
      lastAccessed: new Date('2024-02-10')
    },
    {
      id: generateId('res'),
      title: 'Astro DB Tutorial Video',
      description: 'A comprehensive tutorial on using Astro DB in your projects.',
      url: 'https://youtube.com/watch?v=astro-db-tutorial',
      type: 'video',
      category: 'Tutorial',
      visibility: 'private',
      isFavorite: true,
      tags: ['astro', 'database', 'tutorial'],
      dateAdded: new Date('2024-01-20'),
      lastAccessed: new Date('2024-01-25')
    },
    {
      id: generateId('res'),
      title: 'UI Design Inspiration Gallery',
      description: 'A collection of beautiful UI designs for inspiration.',
      url: 'https://dribbble.com/collections/ui-inspiration',
      type: 'website',
      category: 'Design',
      visibility: 'public',
      isFavorite: false,
      tags: ['design', 'ui', 'inspiration'],
      dateAdded: new Date('2023-12-05'),
      lastAccessed: new Date('2024-02-15')
    }
  ];
  
  await db.insert(Resources).values(resources);
  console.log(`✅ Inserted ${resources.length} sample resources`);

  // Sample revenue entries
  const revenueEntries = [
    {
      id: generateId('rev'),
      description: 'Built a website for a local business.',
      amount: 2000,
      date: new Date('2024-01-15'),
      status: 'paid',
      type: 'freelance',
      projectId: projects[0].id,
      visibility: 'private'
    },
    {
      id: generateId('rev'),
      description: 'Published an article about Astro.',
      amount: 350,
      date: new Date('2024-02-01'),
      status: 'paid',
      type: 'writing',
      projectId: null,
      visibility: 'private'
    },
    {
      id: generateId('rev'),
      description: 'One-hour consultation on UI improvements.',
      amount: 150,
      date: new Date('2024-02-10'),
      status: 'pending',
      type: 'consulting',
      projectId: projects[1].id,
      visibility: 'private'
    }
  ];
  
  await db.insert(Revenue).values(revenueEntries);
  console.log(`✅ Inserted ${revenueEntries.length} sample revenue entries`);

  // Sample revenue goals
  const revenueGoals = [
    {
      id: generateId('goal'),
      name: 'Monthly Writing Income',
      target: 1000,
      period: 'monthly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      visibility: 'private'
    },
    {
      id: generateId('goal'),
      name: 'Annual Freelance Target',
      target: 24000,
      period: 'yearly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      visibility: 'private'
    }
  ];
  
  await db.insert(RevenueGoals).values(revenueGoals);
  console.log(`✅ Inserted ${revenueGoals.length} sample revenue goals`);

  // Sample AI tools
  const aiTools = [
    {
      id: generateId('ai'),
      name: 'ChatGPT',
      description: 'OpenAI\'s conversational AI model for generating text.',
      prompt: 'Write an article about the future of web development.',
      category: 'Language Model',
      visibility: 'public',
      isFavorite: true,
      tags: ['chatbot', 'writing', 'assistance'],
      dateCreated: new Date('2023-11-10'),
      lastUsed: new Date('2024-02-20'),
      exampleResponse: 'Web development is rapidly evolving with new frameworks and tools...'
    },
    {
      id: generateId('ai'),
      name: 'Midjourney',
      description: 'AI image generation tool for creating artwork and visualizations.',
      prompt: 'Create a futuristic cityscape with flying cars and neon lights.',
      category: 'Image Generation',
      visibility: 'public',
      isFavorite: true,
      tags: ['images', 'art', 'design'],
      dateCreated: new Date('2023-12-05'),
      lastUsed: new Date('2024-01-15'),
      exampleResponse: '[Image URL would appear here]'
    },
    {
      id: generateId('ai'),
      name: 'Claude',
      description: 'Anthropic\'s helpful, harmless, and honest AI assistant.',
      prompt: 'Explain quantum computing to a 10-year-old.',
      category: 'Language Model',
      visibility: 'private',
      isFavorite: false,
      tags: ['chatbot', 'writing', 'research'],
      dateCreated: new Date('2024-01-20'),
      lastUsed: new Date('2024-02-18'),
      exampleResponse: 'Imagine you have a toy that can be in many places at once...'
    }
  ];
  
  await db.insert(AITools).values(aiTools);
  console.log(`✅ Inserted ${aiTools.length} sample AI tools`);

  console.log('✅ Database seeding complete!');
} 