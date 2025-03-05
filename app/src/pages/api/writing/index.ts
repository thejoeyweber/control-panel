/*
  File: src/pages/api/writing/index.ts
  Purpose: API endpoint for listing and creating writing pieces
  Dependencies: writing data service, form utility
*/

import type { APIRoute } from 'astro';
import { getAllWriting, createWriting } from '../../../data/writing';
import { parseFormData } from '../../../utils/form';

export const GET: APIRoute = async () => {
  try {
    // Get all writing pieces
    const writings = await getAllWriting();
    
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
    // Parse form data
    const formData = await request.formData();
    const writingData = parseFormData(formData);
    
    // Process tags (convert from comma-separated string to array)
    if (typeof writingData.tags === 'string') {
      writingData.tags = writingData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    }
    
    // Create the writing piece
    await createWriting(writingData);
    
    // Redirect back to writing page with success message
    return redirect('/writing?success=Writing piece created successfully', 303);
  } catch (error) {
    console.error('Error creating writing piece:', error);
    return redirect('/writing?error=Failed to create writing piece', 303);
  }
}; 