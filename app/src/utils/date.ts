/*
  File: src/utils/date.ts
  Purpose: Utility functions for date formatting and manipulation
  Dependencies: None
*/

/**
 * Format a date string or Date object to a human-readable format
 * @param date - The date to format
 * @param includeTime - Whether to include the time in the formatted string
 * @returns Formatted date string
 */
export function formatDate(date: string | Date | null | undefined, includeTime = false): string {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return d.toLocaleDateString('en-US', options);
}

/**
 * Format a date for input fields (YYYY-MM-DD)
 * @param date - The date to format
 * @returns Formatted date string for input fields
 */
export function formatDateForInput(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toISOString().split('T')[0];
}

/**
 * Combine date and time strings into a single Date object
 * @param dateStr - The date string (YYYY-MM-DD)
 * @param timeStr - The time string (HH:MM)
 * @returns Combined Date object
 */
export function combineDateAndTime(dateStr: string, timeStr?: string): Date {
  const date = new Date(dateStr);
  
  if (timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    date.setHours(hours || 0);
    date.setMinutes(minutes || 0);
  }
  
  return date;
}

/**
 * Get the current date as a string in YYYY-MM-DD format
 * @returns Current date string
 */
export function getCurrentDateString(): string {
  return formatDateForInput(new Date());
}

/**
 * Calculate the difference in days between two dates
 * @param date1 - The first date
 * @param date2 - The second date (defaults to current date)
 * @returns Number of days between the dates
 */
export function daysBetween(date1: Date | string, date2: Date | string = new Date()): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Convert to UTC to avoid timezone issues
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
} 