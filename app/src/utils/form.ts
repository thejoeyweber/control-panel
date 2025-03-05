/*
  File: src/utils/form.ts
  Purpose: Utility functions for handling form data
  Dependencies: None
*/

/**
 * Parses FormData into a plain JavaScript object
 * @param formData - The FormData object to parse
 * @returns A plain JavaScript object with form values
 */
export function parseFormData(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of formData.entries()) {
    // Skip the _method field used for HTTP method override
    if (key === '_method') continue;
    
    // Handle file inputs separately
    if (value instanceof File) {
      if (value.size > 0) {
        result[key] = value;
      }
      continue;
    }
    
    // Handle empty strings as null for optional fields
    if (value === '') {
      result[key] = null;
      continue;
    }
    
    // Handle checkbox values
    if (key.endsWith('[]')) {
      const cleanKey = key.substring(0, key.length - 2);
      if (!result[cleanKey]) {
        result[cleanKey] = [];
      }
      (result[cleanKey] as unknown[]).push(value);
      continue;
    }
    
    // Handle regular form values
    result[key] = value;
  }
  
  return result;
} 