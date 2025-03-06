/*
  File: src/pages/api/resources/index.ts
  Purpose: API endpoint for listing and creating resources
  Dependencies: Astro DB utility functions for Resources operations
*/

import type { APIRoute } from 'astro';
import { getAllResources, createResource } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';

export const GET: APIRoute = async () => {
  try {
    // Check if user is authenticated
    const authenticated = isAuthenticated();
    
    // Get all resources
    const resources = await getAllResources(authenticated);
    
    return new Response(JSON.stringify(resources), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch resources' }), {
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
    const resourceData = parseFormData(formData);
    
    // Process tags from comma-separated string to array
    if (typeof resourceData.tags === 'string') {
      resourceData.tags = (resourceData.tags as string)
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    }
    
    // Convert isFavorite checkbox value to boolean
    resourceData.isFavorite = !!resourceData.isFavorite;
    
    // Create the resource
    await createResource(resourceData);
    
    return new Response(JSON.stringify({ message: 'Resource added successfully' }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': '/resources?success=Resource+added+successfully',
      },
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    return new Response(JSON.stringify({ error: 'Failed to create resource' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': '/resources?error=Failed+to+create+resource',
      },
    });
  }
}; 