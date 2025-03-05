/*
  File: src/pages/api/resources/[id].ts
  Purpose: API endpoint for getting, updating, and deleting individual resources
  Dependencies: Uses resources data service for CRUD operations
*/

import type { APIRoute } from 'astro';
import { getResourceById, updateResource, deleteResource } from '../../../data/resources';
import { parseFormData } from '../../../utils/form';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Resource ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const resource = await getResourceById(id);
    
    if (!resource) {
      return new Response(JSON.stringify({ error: 'Resource not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response(JSON.stringify({ resource }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch resource' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ params, request, redirect }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return redirect('/resources?error=Resource ID is required', 303);
    }
    
    const formData = await request.formData();
    
    // Check if this is a DELETE request
    const method = formData.get('_method');
    
    if (method === 'DELETE') {
      await deleteResource(id);
      return redirect('/resources?success=Resource deleted successfully', 303);
    }
    
    // Otherwise, it's an UPDATE
    const resourceData = parseFormData(formData);
    
    // Process tags (convert comma-separated string to array)
    if (typeof resourceData.tags === 'string') {
      resourceData.tags = resourceData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
    }
    
    // Process checkbox values
    resourceData.isFavorite = resourceData.isFavorite === 'on';
    
    // Update the resource
    const resource = await updateResource(id, resourceData);
    
    if (!resource) {
      return redirect(`/resources?error=${encodeURIComponent('Resource not found')}`, 303);
    }
    
    return redirect(`/resources?success=Resource updated successfully`, 303);
  } catch (error) {
    console.error('Error updating resource:', error);
    return redirect(`/resources?error=${encodeURIComponent('Failed to update resource')}`, 303);
  }
}; 