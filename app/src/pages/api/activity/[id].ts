/*
  File: src/pages/api/activity/[id].ts
  Purpose: API endpoint for getting, updating, and deleting individual activities
  Dependencies: Uses Astro DB utility functions for Activities operations
*/

import type { APIRoute } from 'astro';
import { getActivity, updateActivity, deleteActivity } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Activity ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if user is authenticated
    const authenticated = isAuthenticated();

    const activity = await getActivity(id, authenticated);
    if (!activity) {
      return new Response(JSON.stringify({ error: 'Activity not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify(activity), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(`Error fetching activity:`, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch activity' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request, params }) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Activity ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const formData = await request.formData();
    const activityData = parseFormData(formData);
    
    // Check for _method field for DELETE operations
    const method = formData.get('_method')?.toString().toUpperCase();
    
    if (method === 'DELETE') {
      await deleteActivity(id);
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Activity deleted successfully' 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'HX-Redirect': '/activity?success=Activity deleted successfully'
        }
      });
    }
    
    // Otherwise, update the activity
    const updatedActivity = await updateActivity(id, activityData);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Activity updated successfully',
      activity: updatedActivity 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': '/activity?success=Activity updated successfully'
      }
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to update activity' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': '/activity?error=Failed to update activity'
      }
    });
  }
}; 