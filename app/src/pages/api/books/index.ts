/*
  File: src/pages/api/books/index.ts
  Purpose: API endpoint for listing and creating books
  Dependencies: Uses Astro DB utility functions for CRUD operations
*/

import type { APIRoute } from 'astro';
import { getAllBooks, createBook } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';

export const GET: APIRoute = async ({ request, redirect }) => {
  try {
    // Check if user is authenticated
    const authenticated = isAuthenticated();
    
    // Get all books
    const books = await getAllBooks(authenticated);
    
    return new Response(JSON.stringify(books), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch books' }), {
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
    const bookData = parseFormData(formData);
    
    // Process tags (convert comma-separated string to array)
    if (typeof bookData.tags === 'string') {
      bookData.tags = bookData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
    }
    
    // Process rating
    if (bookData.rating) {
      bookData.rating = parseInt(bookData.rating as string, 10) || 0;
    }
    
    // Process checkbox values
    bookData.isFavorite = bookData.isFavorite === 'on';
    
    // Create the book
    const book = await createBook(bookData);
    
    return redirect(`/books?success=Book added successfully`, 303);
  } catch (error) {
    console.error('Error creating book:', error);
    return redirect(`/books?error=${encodeURIComponent('Failed to create book')}`, 303);
  }
}; 