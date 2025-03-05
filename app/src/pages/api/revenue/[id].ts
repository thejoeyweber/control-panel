/*
  File: src/pages/api/revenue/[id].ts
  Purpose: API endpoint for getting, updating, and deleting individual revenue entries
  Dependencies: Revenue data service
*/

import type { APIRoute } from 'astro';
import { getRevenueById, updateRevenue, deleteRevenue } from '../../../data/revenue';
import { parseFormData } from '../../../utils/form';

export const GET: APIRoute = async ({ params }) => {
  try {
    // Check if ID is provided
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Revenue ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Get the revenue entry
    const revenue = await getRevenueById(id);
    
    // Check if revenue exists
    if (!revenue) {
      return new Response(JSON.stringify({ error: 'Revenue entry not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Return the revenue entry
    return new Response(JSON.stringify(revenue), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch revenue entry' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Revenue ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    const formData = await request.formData();
    const revenueData = parseFormData(formData);
    
    // Check if this is a DELETE request
    if (revenueData._method === 'DELETE') {
      // Delete the revenue entry
      await deleteRevenue(id);
      
      return new Response(JSON.stringify({ message: 'Revenue entry deleted successfully' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'HX-Redirect': '/revenue?success=Revenue+entry+deleted+successfully',
        },
      });
    } else {
      // Parse amount to number
      if (revenueData.amount) {
        revenueData.amount = parseFloat(revenueData.amount as string);
      }
      
      // Update the revenue entry
      await updateRevenue(id, revenueData);
      
      return new Response(JSON.stringify({ message: 'Revenue entry updated successfully' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'HX-Redirect': '/revenue?success=Revenue+entry+updated+successfully',
        },
      });
    }
  } catch (error) {
    console.error('Error updating revenue:', error);
    return new Response(JSON.stringify({ error: 'Failed to update revenue entry' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': '/revenue?error=Failed+to+update+revenue+entry',
      },
    });
  }
}; 