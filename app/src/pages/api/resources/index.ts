/*
  File: src/pages/api/resources/index.ts
  Purpose: API endpoint for listing and creating resources
  Dependencies: Uses resources data service for CRUD operations
*/

import type { APIRoute } from 'astro';
import { getAllResources, createResource } from '../../../data/resources';
import { parseFormData } from '../../../utils/form';

export const GET: APIRoute = async ({ request, redirect }) => {
  try {
    const resources = await getAllResources();
    return new Response(JSON.stringify({ resources }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch resources' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
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
    
    const resource = await createResource(resourceData);
    
    return redirect(`/resources?success=Resource added successfully`, 303);
  } catch (error) {
    console.error('Error creating resource:', error);
    return redirect(`/resources?error=${encodeURIComponent('Failed to create resource')}`, 303);
  }
}; 