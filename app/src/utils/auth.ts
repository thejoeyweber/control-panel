/*
  File: src/utils/auth.ts
  Purpose: Provides utilities for authentication and content visibility
  Dependencies: None
*/

/**
 * Check if the current user is authenticated
 * This is a simple placeholder that will be expanded later with actual session-based auth
 */
export function isAuthenticated(): boolean {
  // In a browser context, check if we have a token or auth state
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authenticated') === 'true';
  }
  
  // During SSR, assume not authenticated for safety
  return false;
}

/**
 * Return visible content based on authentication status
 * @param allContent The complete set of content items
 * @returns Filtered content based on auth status
 */
export function getVisibleContent<T extends { visibility?: string }>(allContent: T[]): T[] {
  const authenticated = isAuthenticated();
  
  // If authenticated, return all content
  if (authenticated) {
    return allContent;
  }
  
  // Otherwise, return only public content
  return allContent.filter(item => item.visibility === 'public');
}

/**
 * Login function (placeholder)
 * @param password The password to check
 * @returns Whether login was successful
 */
export function login(password: string): boolean {
  // This is a placeholder - in production use environment variables
  // and proper password storage/comparison
  // For development, we use a simple password
  const PLACEHOLDER_PASSWORD = 'controlpanel'; // Replace with env var later
  
  if (password === PLACEHOLDER_PASSWORD) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authenticated', 'true');
    }
    return true;
  }
  return false;
}

/**
 * Logout function
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authenticated');
  }
} 