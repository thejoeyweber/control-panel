/*
  File: src/pages/api/books/[id].ts
  Purpose: API endpoint for getting, updating, and deleting individual books
  Dependencies: Uses books data service for CRUD operations
*/

import type { APIRoute } from 'astro';
import { getBookById, updateBook, deleteBook } from '../../../data/books';
import { parseFormData } from '../../../utils/form';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Book ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const book = await getBookById(id);
    
    if (!book) {
      return new Response(JSON.stringify({ error: 'Book not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response(JSON.stringify({ book }), {
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
    
    if (!book) {
      return redirect(`/books?error=${encodeURIComponent('Book not found')}`, 303);
    }
    
    return redirect(`/books?success=Book updated successfully`, 303);
  } catch (error) {
    console.error('Error updating book:', error);
    return redirect(`/books?error=${encodeURIComponent('Failed to update book')}`, 303);
  }
}; 