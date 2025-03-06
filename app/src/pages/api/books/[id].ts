/*
  File: src/pages/api/books/[id].ts
  Purpose: API endpoint for getting, updating, and deleting individual books
  Dependencies: Uses Astro DB utility functions for CRUD operations
*/

import type { APIRoute } from 'astro';
import { getBook, updateBook, deleteBook } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    // Check if user is authenticated
    const authenticated = isAuthenticated();
    
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Book ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const book = await getBook(id, authenticated);
    
    if (!book) {
      return new Response(JSON.stringify({ error: 'Book not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response(JSON.stringify(book), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch book' }), {
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
    
    const { id } = params;
    
    if (!id) {
      return redirect('/books?error=Book ID is required', 303);
    }
    
    const formData = await request.formData();
    
    // Check if this is a DELETE request
    const method = formData.get('_method');
    
    if (method === 'DELETE') {
      await deleteBook(id);
      return redirect('/books?success=Book deleted successfully', 303);
    }
    
    // Otherwise, it's an UPDATE
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
    
    // Update the book
    const book = await updateBook(id, bookData);
    
    return redirect(`/books?success=Book updated successfully`, 303);
  } catch (error) {
    console.error('Error updating book:', error);
    return redirect(`/books?error=${encodeURIComponent('Failed to update book')}`, 303);
  }
}; 