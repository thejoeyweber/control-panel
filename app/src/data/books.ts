/*
  File: src/data/books.ts
  Purpose: Provides book data for the control panel
  Dependencies: Book type from types/index.ts
*/

import type { Book } from '../types';
import { isAuthenticated } from '../utils/auth';
import * as dataUtils from '../utils/data';

// Sample books data
export const books: Book[] = [
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Improvement',
    status: 'completed',
    startedDate: '2023-09-10',
    completedDate: '2023-10-05',
    format: 'physical',
    notes: 'Excellent book on habit formation. Key takeaway: focus on systems, not goals.',
    rating: 5,
    tags: ['productivity', 'habits', 'psychology'],
    coverUrl: 'https://covers.openlibrary.org/b/id/10706949-L.jpg',
    purchaseUrl: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
    visibility: 'public'
  },
  {
    id: 'accelerate',
    title: 'Accelerate: Building and Scaling High Performing Technology Organizations',
    author: 'Nicole Forsgren, Jez Humble, Gene Kim',
    category: 'Technology',
    status: 'reading',
    startedDate: '2023-11-20',
    format: 'ebook',
    tags: ['devops', 'leadership', 'technology'],
    coverUrl: 'https://covers.openlibrary.org/b/id/8765809-L.jpg',
    visibility: 'public'
  },
  {
    id: 'design-everyday-things',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    category: 'Design',
    status: 'completed',
    startedDate: '2023-07-05',
    completedDate: '2023-08-10',
    format: 'physical',
    notes: 'Changed how I think about user experience and product design.',
    rating: 4,
    tags: ['design', 'user-experience', 'psychology'],
    coverUrl: 'https://covers.openlibrary.org/b/id/8232890-L.jpg',
    visibility: 'public'
  },
  {
    id: 'deep-work',
    title: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    category: 'Productivity',
    status: 'to-read',
    format: 'audiobook',
    tags: ['productivity', 'focus', 'work'],
    visibility: 'private'
  },
  {
    id: 'thinking-fast-slow',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Psychology',
    status: 'reading',
    startedDate: '2023-12-01',
    format: 'physical',
    tags: ['psychology', 'decision-making', 'behavioral-economics'],
    coverUrl: 'https://covers.openlibrary.org/b/id/7089298-L.jpg',
    visibility: 'private'
  },
  {
    id: 'pragmatic-programmer',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt, David Thomas',
    category: 'Programming',
    status: 'completed',
    startedDate: '2023-06-15',
    completedDate: '2023-07-20',
    format: 'ebook',
    notes: 'A classic that still holds up today. Great practical advice for software developers.',
    rating: 5,
    tags: ['programming', 'software-development', 'career'],
    coverUrl: 'https://covers.openlibrary.org/b/id/8410975-L.jpg',
    visibility: 'public'
  }
];

/**
 * Get books filtered by visibility
 * @returns Array of books visible to the user
 */
export function getVisibleBooks(): Book[] {
  return dataUtils.getVisibleContent(books, isAuthenticated());
}

/**
 * Get a book by its ID
 * @param id The book ID to find
 * @returns The book or undefined if not found
 */
export function getBookById(id: string): Book | undefined {
  return dataUtils.getItemById(books, id);
}

/**
 * Get book statistics
 * @returns Object containing book statistics
 */
export function getBookStats() {
  const total = books.length;
  
  // Count by status
  const statusCounts = dataUtils.countByProperty(books, 'status');
  
  // Count by category
  const categoryCounts = dataUtils.countByProperty(books, 'category');
  
  // Count by format
  const formatCounts = dataUtils.countByProperty(books, 'format');
  
  // Calculate average rating for read books
  const completedBooks = books.filter(book => book.status === 'completed' && book.rating);
  const totalRating = completedBooks.reduce((sum, book) => sum + (book.rating || 0), 0);
  const averageRating = completedBooks.length > 0 ? 
    (totalRating / completedBooks.length).toFixed(1) : 
    'N/A';
  
  return {
    total,
    reading: statusCounts['reading'] || 0,
    completed: statusCounts['completed'] || 0,
    toRead: statusCounts['to-read'] || 0,
    abandoned: statusCounts['abandoned'] || 0,
    categoryCounts,
    formatCounts,
    averageRating
  };
}

/**
 * Get recently updated books
 * @param limit Number of items to return (default: 5)
 * @returns Array of books sorted by status (reading first) and then by start or completion date
 */
export function getRecentBooks(limit: number = 5): Book[] {
  const visibleBooks = getVisibleBooks();
  
  // Sort with custom sorting logic: reading books first, then by start/completion date
  const sortedBooks = [...visibleBooks].sort((a, b) => {
    // Reading books go first
    if (a.status === 'reading' && b.status !== 'reading') return -1;
    if (a.status !== 'reading' && b.status === 'reading') return 1;
    
    // Then completed books, sorted by completion date
    if (a.status === 'completed' && b.status === 'completed') {
      return new Date(b.completedDate || '').getTime() - new Date(a.completedDate || '').getTime();
    }
    
    // Then sort by started date if available
    if (a.startedDate && b.startedDate) {
      return new Date(b.startedDate).getTime() - new Date(a.startedDate).getTime();
    }
    
    // Fall back to alphabetical by title
    return a.title.localeCompare(b.title);
  });
  
  return sortedBooks.slice(0, limit);
} 