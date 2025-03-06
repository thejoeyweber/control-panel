/*
  File: src/pages/api/ai-tools/index.ts
  Purpose: API endpoint for listing and creating AI tools
  Dependencies: Astro DB utility functions for AI Tools operations
*/

import type { APIRoute } from 'astro';
import { getAllAITools, createAITool } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';

export const GET: APIRoute = async () => {
  try {
    // Check if user is authenticated
    const authenticated = isAuthenticated();
    
    // Get all AI tools
    const aiTools = await getAllAITools(authenticated);
    
    return new Response(JSON.stringify(aiTools), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching AI tools:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch AI tools' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Parse form data
    const formData = await request.formData();
    const aiToolData = parseFormData(formData);
    
    // Process tags from comma-separated string to array
    if (typeof aiToolData.tags === 'string') {
      aiToolData.tags = (aiToolData.tags as string)
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    }
    
    // Convert isFavorite checkbox value to boolean
    aiToolData.isFavorite = !!aiToolData.isFavorite;
    
    // Create the AI tool
    await createAITool(aiToolData);
    
    return new Response(JSON.stringify({ message: 'AI tool added successfully' }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': '/ai-library?success=AI+tool+added+successfully',
      },
    });
  } catch (error) {
    console.error('Error creating AI tool:', error);
    return new Response(JSON.stringify({ error: 'Failed to create AI tool' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': '/ai-library?error=Failed+to+create+AI+tool',
      },
    });
  }
}; 