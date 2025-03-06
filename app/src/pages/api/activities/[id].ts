/*
  File: src/pages/api/activities/[id].ts
  Purpose: API endpoint for getting, updating, and deleting individual activities
  Dependencies: Astro DB utility functions for Activities operations
*/

import type { APIRoute } from 'astro';
import { getActivity, updateActivity, deleteActivity } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
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
    console.error('Error fetching activity:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch activity' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, redirect }) => {
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
    
    const id = params.id;
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
    
    // Process tags (convert comma-separated string to array)
    if (typeof activityData.tags === 'string') {
      activityData.tags = (activityData.tags as string)
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }
    
    const updatedActivity = await updateActivity(id, activityData);
    if (!updatedActivity) {
      return new Response(JSON.stringify({ error: 'Activity not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return redirect(`/activity?success=Activity updated successfully`, 303);
  } catch (error) {
    console.error('Error updating activity:', error);
    return redirect(`/activity?error=Failed to update activity`, 303);
  }
};

export const DELETE: APIRoute = async ({ params, redirect }) => {
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
    
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Activity ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    await deleteActivity(id);
    
    return redirect(`/activity?success=Activity deleted successfully`, 303);
  } catch (error) {
    console.error('Error deleting activity:', error);
    return redirect(`/activity?error=Failed to delete activity`, 303);
  }
}; 