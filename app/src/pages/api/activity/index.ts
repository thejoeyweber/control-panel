/*
  File: src/pages/api/activity/index.ts
  Purpose: API endpoint for listing and creating activities
  Dependencies: Uses Astro DB utility functions for Activities operations
*/

import type { APIRoute } from 'astro';
import { getAllActivities, createActivity } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';

export const GET: APIRoute = async () => {
  try {
    // Check if user is authenticated
    const authenticated = isAuthenticated();
    
    const activities = await getAllActivities(authenticated);
    return new Response(JSON.stringify(activities), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch activities' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
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
          'Content-Type': 'application/json'
        }
      });
    }
    
    const formData = await request.formData();
    const activityData = parseFormData(formData);
    
    // Process tags if they exist
    if (typeof activityData.tags === 'string') {
      activityData.tags = (activityData.tags as string)
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }
    
    const newActivity = await createActivity(activityData);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Activity logged successfully',
      activity: newActivity 
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': '/activity?success=Activity logged successfully'
      }
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to log activity' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'HX-Redirect': '/activity?error=Failed to log activity'
      }
    });
  }
}; 