/*
  File: src/pages/api/writing/index.ts
  Purpose: API endpoint for listing and creating writing pieces
  Dependencies: Database utility functions for Writing operations
*/

import type { APIRoute } from 'astro';
import { getAllWriting, createWritingPiece } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';

export const GET: APIRoute = async () => {
  try {
    // Check if user is authenticated
    const authenticated = isAuthenticated();

    // Get all writing pieces
    const writings = await getAllWriting(authenticated);
    
    return new Response(JSON.stringify(writings), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching writing pieces:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch writing pieces' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request, redirect }) => {
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

    // Parse form data
    const formData = await request.formData();
    const writingData = parseFormData(formData);
    
    // Create the writing piece
    await createWritingPiece(writingData);
    
    // Redirect back to writing page with success message
    return redirect('/writing?success=Writing piece created successfully', 303);
  } catch (error) {
    console.error('Error creating writing piece:', error);
    return redirect('/writing?error=Failed to create writing piece', 303);
  }
}; 