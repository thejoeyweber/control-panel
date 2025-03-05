/*
  File: src/pages/api/activities/[id].ts
  Purpose: API endpoint for getting, updating, and deleting individual activities
  Dependencies: Uses activities data service for CRUD operations
*/

import type { APIRoute } from 'astro';
import { getActivityById, updateActivity, deleteActivity } from '../../../data/activities';
import { parseFormData } from '../../../utils/form';

export const GET: APIRoute = async ({ params, request }) => {
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
    
    const activity = await getActivityById(id);
    
    if (!activity) {
      return new Response(JSON.stringify({ error: 'Activity not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response(JSON.stringify({ activity }), {
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

export const POST: APIRoute = async ({ params, request, redirect }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return redirect('/activity?error=Activity ID is required', 303);
    }
    
    const formData = await request.formData();
    
    // Check if this is a DELETE request
    const method = formData.get('_method');
    
    if (method === 'DELETE') {
      await deleteActivity(id);
      return redirect('/activity?success=Activity deleted successfully', 303);
    }
    
    // Otherwise, it's an UPDATE
    const activityData = parseFormData(formData);
    
    // Process tags (convert comma-separated string to array)
    if (typeof activityData.tags === 'string') {
      activityData.tags = activityData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
    }
    
    // Convert duration to number if provided
    if (activityData.duration) {
      activityData.duration = parseInt(activityData.duration as string, 10) || 0;
    }
    
    // Update the activity
    const activity = await updateActivity(id, activityData);
    
    if (!activity) {
      return redirect(`/activity?error=${encodeURIComponent('Activity not found')}`, 303);
    }
    
    return redirect(`/activity?success=Activity updated successfully`, 303);
  } catch (error) {
    console.error('Error updating activity:', error);
    return redirect(`/activity?error=${encodeURIComponent('Failed to update activity')}`, 303);
  }
}; 