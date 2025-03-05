/*
  File: src/data/books.ts
  Purpose: Data service for books with CRUD operations
  Dependencies: fs for file operations, uuid for ID generation
*/

import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Book } from '../types';

// Define the path to the books data file
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'books.json');

/**
 * Ensures the data file exists, creates it with empty array if it doesn't
 */
async function ensureDataFileExists(): Promise<void> {
  try {
    await fs.access(dataFilePath);
  } catch (error) {
    // File doesn't exist, create it with an empty array
    await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
  }
}

/**
 * Get all books
 * @returns {Promise<Book[]>} Array of all books
 */
export async function getAllBooks(): Promise<Book[]> {
  await ensureDataFileExists();
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Get books by category
 * @param {string} category - The category to filter by
 * @returns {Promise<Book[]>} Array of books in the specified category
 */
export async function getBooksByCategory(category: string): Promise<Book[]> {
  const books = await getAllBooks();
  return books.filter(book => book.category === category);
}

/**
 * Get books by status
 * @param {string} status - The status to filter by
 * @returns {Promise<Book[]>} Array of books with the specified status
 */
export async function getBooksByStatus(status: string): Promise<Book[]> {
  const books = await getAllBooks();
  return books.filter(book => book.status === status);
}

/**
 * Get a book by ID
 * @param {string} id - The ID of the book to retrieve
 * @returns {Promise<Book|null>} The book or null if not found
 */
export async function getBookById(id: string): Promise<Book | null> {
  const books = await getAllBooks();
  return books.find(book => book.id === id) || null;
}

/**
 * Create a new book
 * @param {Partial<Book>} bookData - The book data
 * @returns {Promise<Book>} The created book
 */
export async function createBook(bookData: Partial<Book>): Promise<Book> {
  await ensureDataFileExists();
  
  const books = await getAllBooks();
  
  // Create a new book with default values and provided data
  const newBook: Book = {
    id: uuidv4(),
    title: '',
    author: '',
    category: '',
    status: 'to-read',
    format: 'physical',
    tags: [],
    rating: 0,
    visibility: 'private',
    ...bookData
  };
  
  // Add the new book to the array
  books.push(newBook);
  
  // Save the updated books array
  await fs.writeFile(dataFilePath, JSON.stringify(books, null, 2));
  
  return newBook;
}

/**
 * Update an existing book
 * @param {string} id - The ID of the book to update
 * @param {Partial<Book>} bookData - The updated book data
 * @returns {Promise<Book|null>} The updated book or null if not found
 */
export async function updateBook(id: string, bookData: Partial<Book>): Promise<Book | null> {
  await ensureDataFileExists();
  
  const books = await getAllBooks();
  
  // Find the index of the book to update
  const index = books.findIndex(book => book.id === id);
  
  // If the book doesn't exist, return null
  if (index === -1) {
    return null;
  }
  
  // Update the book with the provided data
  books[index] = {
    ...books[index],
    ...bookData,
    id // Ensure ID doesn't change
  };
  
  // Save the updated books array
  await fs.writeFile(dataFilePath, JSON.stringify(books, null, 2));
  
  return books[index];
}

/**
 * Delete a book
 * @param {string} id - The ID of the book to delete
 * @returns {Promise<boolean>} True if the book was deleted, false if not found
 */
export async function deleteBook(id: string): Promise<boolean> {
  await ensureDataFileExists();
  
  const books = await getAllBooks();
  
  // Find the index of the book to delete
  const index = books.findIndex(book => book.id === id);
  
  // If the book doesn't exist, return false
  if (index === -1) {
    return false;
  }
  
  // Remove the book from the array
  books.splice(index, 1);
  
  // Save the updated books array
  await fs.writeFile(dataFilePath, JSON.stringify(books, null, 2));
  
  return true;
}

/**
 * Search books by query
 * @param {string} query - The search query
 * @returns {Promise<Book[]>} Array of books matching the query
 */
export async function searchBooks(query: string): Promise<Book[]> {
  const books = await getAllBooks();
  const lowerQuery = query.toLowerCase();
  
  return books.filter(book => 
    book.title.toLowerCase().includes(lowerQuery) ||
    book.author.toLowerCase().includes(lowerQuery) ||
    book.category.toLowerCase().includes(lowerQuery) ||
    book.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    (book.notes && book.notes.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get book statistics
 * @returns {Promise<Object>} Object containing book statistics
 */
export async function getBookStats(): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byFormat: Record<string, number>;
  completedThisYear: number;
  averageRating: number;
  topTags: { tag: string; count: number }[];
}> {
  const books = await getAllBooks();
  
  // Count books by status
  const byStatus: Record<string, number> = {};
  books.forEach(book => {
    byStatus[book.status] = (byStatus[book.status] || 0) + 1;
  });
  
  // Count books by category
  const byCategory: Record<string, number> = {};
  books.forEach(book => {
    if (book.category) {
      byCategory[book.category] = (byCategory[book.category] || 0) + 1;
    }
  });
  
  // Count books by format
  const byFormat: Record<string, number> = {};
  books.forEach(book => {
    byFormat[book.format] = (byFormat[book.format] || 0) + 1;
  });
  
  // Count completed books this year
  const currentYear = new Date().getFullYear();
  const completedThisYear = books.filter(book => {
    if (book.status === 'completed' && book.completedDate) {
      const completedYear = new Date(book.completedDate).getFullYear();
      return completedYear === currentYear;
    }
    return false;
  }).length;
  
  // Calculate average rating for completed books
  const completedBooks = books.filter(book => book.status === 'completed' && book.rating > 0);
  const totalRating = completedBooks.reduce((sum, book) => sum + book.rating, 0);
  const averageRating = completedBooks.length > 0 ? totalRating / completedBooks.length : 0;
  
  // Count tag occurrences
  const tagCounts: Record<string, number> = {};
  books.forEach(book => {
    book.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  // Convert tag counts to array and sort by count
  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
  
  return {
    total: books.length,
    byStatus,
    byCategory,
    byFormat,
    completedThisYear,
    averageRating,
    topTags
  };
}

/**
 * Create an empty book for form initialization
 * @returns {Book} An empty book with default values
 */
export function createEmptyBook(): Book {
  return {
    id: '',
    title: '',
    author: '',
    category: '',
    status: 'to-read',
    format: 'physical',
    tags: [],
    rating: 0,
    visibility: 'private'
  };
} 