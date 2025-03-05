/*
  File: src/pages/api/revenue/index.ts
  Purpose: API endpoint for listing and creating revenue entries
  Dependencies: Revenue data service
*/

import type { APIRoute } from 'astro';
import { getAllRevenue, createRevenue } from '../../../data/revenue';
import { parseFormData } from '../../../utils/form';

export const GET: APIRoute = async () => {
  try {
    const revenue = await getAllRevenue();
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
    const formData = await request.formData();
    const revenueData = parseFormData(formData);
    
    // Parse amount to number
    if (revenueData.amount) {
      revenueData.amount = parseFloat(revenueData.amount as string);
    }
    
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