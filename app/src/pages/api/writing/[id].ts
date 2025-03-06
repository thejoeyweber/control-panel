/*
  File: src/pages/api/writing/[id].ts
  Purpose: API endpoint for getting, updating, and deleting individual writing pieces
  Dependencies: Database utility functions for Writing operations
*/

import type { APIRoute } from 'astro';
import { getWritingPiece, updateWritingPiece, deleteWritingPiece } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    // Check if user is authenticated
    const authenticated = isAuthenticated();

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
    const writing = await getWritingPiece(id, authenticated);
    
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
    // Check if user is authenticated
    if (!isAuthenticated()) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

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
      await deleteWritingPiece(id);
      
      // Redirect back to writing page with success message
      return redirect('/writing?success=Writing deleted successfully', 303);
    }
    
    // Otherwise, this is an UPDATE request
    const writingData = parseFormData(formData);
    
    // Update the writing
    await updateWritingPiece(id, writingData);
    
    // Redirect back to writing page with success message
    return redirect('/writing?success=Writing updated successfully', 303);
  } catch (error) {
    console.error('Error updating writing:', error);
    return redirect('/writing?error=Failed to update writing', 303);
  }
}; 