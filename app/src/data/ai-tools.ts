/*
  File: src/data/ai-tools.ts
  Purpose: Provides AI tools and prompts data for the control panel
  Dependencies: AITool type from types/index.ts
*/

import type { AITool } from '../types';
import { isAuthenticated } from '../utils/auth';
import * as dataUtils from '../utils/data';

// Sample AI tools data
export const aiTools: AITool[] = [
  {
    id: 'weekly-report',
    name: 'Weekly Status Report Generator',
    description: 'Generates a structured weekly report based on accomplishments and plans.',
    prompt: `Create a comprehensive weekly status report with the following sections:
1. Accomplishments: [List your key accomplishments]
2. Challenges: [Describe any challenges faced]
3. Next Steps: [List your planned tasks for next week]
4. Blockers: [Note any blockers requiring attention]

Format this professionally with clear section headings, bullet points, and brief explanations.`,
    category: 'Professional',
    tags: ['reports', 'productivity', 'work'],
    dateCreated: '2023-10-15',
    lastUsed: '2023-12-01',
    isFavorite: true,
    visibility: 'public'
  },
  {
    id: 'blog-outline',
    name: 'Technical Blog Post Outline',
    description: 'Creates a detailed outline for technical blog posts or tutorials.',
    prompt: `Create a detailed outline for a technical blog post on the topic of [TOPIC]. Include:

1. An engaging introduction section that explains why this topic matters
2. 3-5 main sections with descriptive headings (not just "Section 1")
3. For each main section, include 2-3 subsections or key points to cover
4. A practical example or code sample section
5. A conclusion that summarizes key takeaways

The outline should be comprehensive enough that I can easily fill in the content.`,
    category: 'Writing',
    tags: ['blog', 'content-creation', 'outlines'],
    dateCreated: '2023-09-20',
    lastUsed: '2023-11-15',
    isFavorite: true,
    visibility: 'public'
  },
  {
    id: 'code-review',
    name: 'Code Review Assistant',
    description: 'Helps conduct thorough code reviews by providing a comprehensive checklist.',
    prompt: `Review the following [CODE SNIPPET/FILE] for:

1. Bugs and logic errors
2. Edge cases that aren't handled
3. Performance concerns
4. Security vulnerabilities
5. Maintainability and code organization
6. Adherence to best practices for the language/framework
7. Suggestions for improvement with code examples

For each issue found, provide:
- The specific line number(s)
- A clear explanation of the issue
- A suggested fix with example code
- The potential impact of not fixing it`,
    category: 'Development',
    tags: ['code-review', 'programming', 'quality'],
    dateCreated: '2023-11-05',
    lastUsed: '2023-12-05',
    exampleResponse: 'Issue at lines 45-48: The function doesn\'t handle empty input arrays, which could lead to errors...',
    isFavorite: false,
    visibility: 'private'
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes Transformer',
    description: 'Converts rough meeting notes into structured, actionable summaries.',
    prompt: `Transform the following rough meeting notes into a structured, professional summary:

[INSERT ROUGH NOTES]

Please organize the output with these sections:
1. Meeting Details (date, participants, purpose)
2. Key Discussion Points (bulleted list)
3. Decisions Made (clearly stated)
4. Action Items (with owner and deadline if specified)
5. Next Steps

Make it concise but comprehensive, focusing on the most important information.`,
    category: 'Professional',
    tags: ['meetings', 'productivity', 'notes'],
    dateCreated: '2023-08-15',
    lastUsed: '2023-11-28',
    isFavorite: false,
    visibility: 'private'
  },
  {
    id: 'project-readme',
    name: 'Project README Generator',
    description: 'Creates comprehensive README files for GitHub projects.',
    prompt: `Create a comprehensive README.md file for my project with the following details:

Project Name: [NAME]
Project Description: [BRIEF DESCRIPTION]
Technologies Used: [LIST OF TECHNOLOGIES]
Key Features: [LIST OF FEATURES]

Please structure the README with these sections:
- Title and description
- Installation instructions
- Usage examples with code snippets
- Features with brief explanations
- API documentation (if applicable)
- Contributing guidelines
- License information

Use proper Markdown formatting with headings, code blocks, lists, and emphasis where appropriate.`,
    category: 'Development',
    tags: ['documentation', 'github', 'open-source'],
    dateCreated: '2023-10-10',
    lastUsed: '2023-11-05',
    isFavorite: true,
    visibility: 'public'
  },
  {
    id: 'client-proposal',
    name: 'Client Proposal Template',
    description: 'Generates professional project proposals for client work.',
    prompt: `Create a professional project proposal for the following client project:

Client: [CLIENT NAME]
Project: [PROJECT NAME]
Budget Range: [BUDGET RANGE]
Timeline: [TIMELINE]
Requirements: [KEY REQUIREMENTS]

The proposal should include:
1. Executive Summary
2. Problem Statement
3. Proposed Solution
4. Detailed Scope of Work
5. Methodologies and Technologies
6. Timeline with milestones
7. Cost Breakdown
8. Terms and Conditions
9. Next Steps

Use professional business language and format it in a way that builds confidence in my abilities to deliver this project.`,
    category: 'Business',
    tags: ['clients', 'proposals', 'business-development'],
    dateCreated: '2023-11-15',
    lastUsed: '2023-12-02',
    isFavorite: false,
    visibility: 'private'
  }
];

/**
 * Get AI tools filtered by visibility
 * @returns Array of AI tools visible to the user
 */
export function getVisibleAITools(): AITool[] {
  return dataUtils.getVisibleContent(aiTools, isAuthenticated());
}

/**
 * Get an AI tool by its ID
 * @param id The AI tool ID to find
 * @returns The AI tool or undefined if not found
 */
export function getAIToolById(id: string): AITool | undefined {
  return dataUtils.getItemById(aiTools, id);
}

/**
 * Get AI tool statistics
 * @returns Object containing AI tool statistics
 */
export function getAIToolStats() {
  const total = aiTools.length;
  
  // Count by category
  const categoryCounts = dataUtils.countByProperty(aiTools, 'category');
  
  // Count favorites
  const favorites = aiTools.filter(tool => tool.isFavorite).length;
  
  // Get all unique tags
  const tags = new Set<string>();
  aiTools.forEach(tool => {
    tool.tags.forEach(tag => tags.add(tag));
  });
  
  return {
    total,
    categoryCounts,
    favorites,
    uniqueTags: tags.size
  };
}

/**
 * Get favorite AI tools
 * @returns Array of favorite AI tools
 */
export function getFavoriteAITools(): AITool[] {
  return getVisibleAITools().filter(tool => tool.isFavorite);
}

/**
 * Get AI tools by category
 * @param category The category to filter by
 * @returns Array of AI tools in the specified category
 */
export function getAIToolsByCategory(category: string): AITool[] {
  return getVisibleAITools().filter(
    tool => tool.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get recently used AI tools
 * @param limit Number of tools to return
 * @returns Array of recently used AI tools
 */
export function getRecentlyUsedAITools(limit: number = 5): AITool[] {
  const toolsWithLastUsed = getVisibleAITools().filter(tool => tool.lastUsed);
  return dataUtils.sortByDate(toolsWithLastUsed, 'lastUsed').slice(0, limit);
} 