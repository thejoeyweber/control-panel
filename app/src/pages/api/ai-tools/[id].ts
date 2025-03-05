/*
  File: src/pages/api/ai-tools/[id].ts
  Purpose: API endpoint for getting, updating, and deleting individual AI tools
  Dependencies: AI tools data service
*/

import type { APIRoute } from 'astro';
import { getAIToolById, updateAITool, deleteAITool } from '../../../data/ai-tools';
import { parseFormData } from '../../../utils/form';

export const GET: APIRoute = async ({ params }) => {
  try {
    // Check if ID is provided
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'AI tool ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Get the AI tool
    const aiTool = await getAIToolById(id);
    
    // Check if AI tool exists
    if (!aiTool) {
      return new Response(JSON.stringify({ error: 'AI tool not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Return the AI tool
    return new Response(JSON.stringify(aiTool), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching AI tool:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch AI tool' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'AI tool ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    const formData = await request.formData();
    const aiToolData = parseFormData(formData);
    
    // Check if this is a DELETE request
    if (aiToolData._method === 'DELETE') {
      // Delete the AI tool
      await deleteAITool(id);
      
      return new Response(JSON.stringify({ message: 'AI tool deleted successfully' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'HX-Redirect': '/ai-library?success=AI+tool+deleted+successfully',
        },
      });
    } else {
      // Process tags from comma-separated string to array
      if (typeof aiToolData.tags === 'string') {
        aiToolData.tags = (aiToolData.tags as string)
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag);
      }
      
      // Convert isFavorite checkbox value to boolean
      aiToolData.isFavorite = !!aiToolData.isFavorite;
      
      // Update the AI tool
      await updateAITool(id, aiToolData);
      
      return new Response(JSON.stringify({ message: 'AI tool updated successfully' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'HX-Redirect': '/ai-library?success=AI+tool+updated+successfully',
        },
      });
    }
  } catch (error) {
    console.error('Error updating AI tool:', error);
    return new Response(JSON.stringify({ error: 'Failed to update AI tool' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': '/ai-library?error=Failed+to+update+AI+tool',
      },
    });
  }
}; 