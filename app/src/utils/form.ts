/*
  File: src/utils/form.ts
  Purpose: Utility functions for handling form data
  Dependencies: None
*/

/**
 * Parse form data into a structured object
 * @param formData - The FormData object to parse
 * @returns An object with form values
 */
export function parseFormData(formData: FormData): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of formData.entries()) {
    // Skip special form fields like _method
    if (key.startsWith('_')) continue;
    
    // Handle file inputs separately
    if (value instanceof File) {
      if (value.size > 0) {
        result[key] = value;
      }
      continue;
    }
    
    // Convert empty strings to null
    if (value === '') {
      result[key] = null;
      continue;
    }
    
    // Try to convert numeric strings to numbers
    if (typeof value === 'string' && !isNaN(Number(value)) && !isNaN(parseFloat(value))) {
      // Check if it's an ID field (keep as string)
      if (key === 'id' || key.endsWith('Id')) {
        result[key] = value;
      } else {
        result[key] = parseFloat(value);
      }
      continue;
    }
    
    // Handle boolean values
    if (value === 'true') {
      result[key] = true;
      continue;
    }
    
    if (value === 'false') {
      result[key] = false;
      continue;
    }
    
    // Default: keep as is
    result[key] = value;
  }
  
  return result;
}

/**
 * Validate form data against a schema
 * @param data - The data to validate
 * @param schema - The validation schema
 * @returns An object with validation results
 */
export function validateFormData(
  data: Record<string, any>,
  schema: Record<string, { required?: boolean; type?: string; min?: number; max?: number }>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Check required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[field] = `${field} is required`;
      continue;
    }
    
    // Skip further validation if value is empty and not required
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    // Type validation
    if (rules.type) {
      switch (rules.type) {
        case 'number':
          if (typeof value !== 'number' && isNaN(Number(value))) {
            errors[field] = `${field} must be a number`;
          }
          break;
        case 'string':
          if (typeof value !== 'string') {
            errors[field] = `${field} must be a string`;
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors[field] = `${field} must be a boolean`;
          }
          break;
        case 'date':
          if (isNaN(new Date(value).getTime())) {
            errors[field] = `${field} must be a valid date`;
          }
          break;
      }
    }
    
    // Min/max validation for numbers and string lengths
    if (typeof value === 'number' || typeof value === 'string') {
      if (rules.min !== undefined) {
        const size = typeof value === 'number' ? value : value.length;
        if (size < rules.min) {
          errors[field] = `${field} must be at least ${rules.min} ${typeof value === 'number' ? '' : 'characters'}`;
        }
      }
      
      if (rules.max !== undefined) {
        const size = typeof value === 'number' ? value : value.length;
        if (size > rules.max) {
          errors[field] = `${field} must be at most ${rules.max} ${typeof value === 'number' ? '' : 'characters'}`;
        }
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
} 