/*
  File: src/pages/api/writing/[id].ts
  Purpose: API endpoint for getting, updating, and deleting individual writing pieces
  Dependencies: writing data service, form utility
*/

import type { APIRoute } from 'astro';
import { getWritingById, updateWriting, deleteWriting } from '../../../data/writing';
import { parseFormData } from '../../../utils/form';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    // Get writing ID from params
    const { id } = params;
    
    // Check if ID is provided
    if (!id) {
      return new Response(JSON.stringify({ error: 'Writing ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Get writing by ID
    const writing = await getWritingById(id);
    
    // Check if writing exists
    if (!writing) {
      return new Response(JSON.stringify({ error: 'Writing not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Return writing
    return new Response(JSON.stringify(writing), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching writing:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch writing' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ params, request, redirect }) => {
  try {
    // Get writing ID from params
    const { id } = params;
    
    // Check if ID is provided
    if (!id) {
      return new Response(JSON.stringify({ error: 'Writing ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Parse form data
    const formData = await request.formData();
    
    // Check if this is a DELETE request
    const method = formData.get('_method');
    if (method === 'DELETE') {
      // Delete the writing
      await deleteWriting(id);
      
      // Redirect back to writing page with success message
      return redirect('/writing?success=Writing deleted successfully', 303);
    }
    
    // Otherwise, this is an UPDATE request
    const writingData = parseFormData(formData);
    
    // Process tags (convert from comma-separated string to array)
    if (typeof writingData.tags === 'string') {
      writingData.tags = writingData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    }
    
    // Set lastUpdated to current date
    writingData.lastUpdated = new Date().toISOString().split('T')[0];
    
    // Update the writing
    await updateWriting(id, writingData);
    
    // Redirect back to writing page with success message
    return redirect('/writing?success=Writing updated successfully', 303);
  } catch (error) {
    console.error('Error updating writing:', error);
    return redirect('/writing?error=Failed to update writing', 303);
  }
}; 