/*
  File: src/pages/api/resources/[id].ts
  Purpose: API endpoint for getting, updating, and deleting individual resources
  Dependencies: Astro DB utility functions for Resources operations
*/

import type { APIRoute } from 'astro';
import { getResource, updateResource, deleteResource } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';

export const GET: APIRoute = async ({ params }) => {
  try {
    // Check if ID is provided
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Resource ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Check if user is authenticated
    const authenticated = isAuthenticated();
    
    // Get the resource
    const resource = await getResource(id, authenticated);
    
    // Check if resource exists
    if (!resource) {
      return new Response(JSON.stringify({ error: 'Resource not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Return the resource
    return new Response(JSON.stringify(resource), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch resource' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request, params }) => {
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
    
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Resource ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    const formData = await request.formData();
    const resourceData = parseFormData(formData);
    
    // Check if this is a DELETE request
    if (resourceData._method === 'DELETE') {
      // Delete the resource
      await deleteResource(id);
      
      return new Response(JSON.stringify({ message: 'Resource deleted successfully' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'HX-Redirect': '/resources?success=Resource+deleted+successfully',
        },
      });
    } else {
      // Process tags from comma-separated string to array
      if (typeof resourceData.tags === 'string') {
        resourceData.tags = (resourceData.tags as string)
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag);
      }
      
      // Convert isFavorite checkbox value to boolean
      resourceData.isFavorite = !!resourceData.isFavorite;
      
      // Update the resource
      await updateResource(id, resourceData);
      
      return new Response(JSON.stringify({ message: 'Resource updated successfully' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'HX-Redirect': `/resource/${id}?success=Resource+updated+successfully`,
        },
      });
    }
  } catch (error) {
    console.error('Error updating resource:', error);
    return new Response(JSON.stringify({ error: 'Failed to update resource' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': `/resources?error=Failed+to+update+resource`,
      },
    });
  }
}; 