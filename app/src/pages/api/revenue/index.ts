/*
  File: src/pages/api/revenue/index.ts
  Purpose: API endpoint for listing and creating revenue entries
  Dependencies: Astro DB utility functions for Revenue operations
*/

import type { APIRoute } from 'astro';
import { getAllRevenue, createRevenue } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';

export const GET: APIRoute = async () => {
  try {
    // Check if user is authenticated
    const authenticated = isAuthenticated();
    
    // Get all revenue entries
    const revenue = await getAllRevenue(authenticated);
    
    return new Response(JSON.stringify(revenue), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch revenue' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Parse form data
    const formData = await request.formData();
    const revenueData = parseFormData(formData);
    
    // Create the revenue entry
    await createRevenue(revenueData);
    
    return new Response(JSON.stringify({ message: 'Revenue added successfully' }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': '/revenue?success=Revenue+added+successfully',
      },
    });
  } catch (error) {
    console.error('Error creating revenue:', error);
    return new Response(JSON.stringify({ error: 'Failed to create revenue entry' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': '/revenue?error=Failed+to+create+revenue+entry',
      },
    });
  }
}; 