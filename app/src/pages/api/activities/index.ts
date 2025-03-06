/*
  File: src/pages/api/activities/index.ts
  Purpose: API endpoint for listing and creating activities
  Dependencies: Astro DB utility functions for Activities operations
*/

import type { APIRoute } from 'astro';
import { getAllActivities, createActivity } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';

export const GET: APIRoute = async () => {
  try {
    // Check if user is authenticated
    const authenticated = isAuthenticated();
    
    // Get all activities
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

export const POST: APIRoute = async ({ request, redirect }) => {
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
    
    // Process tags (convert comma-separated string to array)
    if (typeof activityData.tags === 'string') {
      activityData.tags = (activityData.tags as string)
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }
    
    // Create the activity
    await createActivity(activityData);
    
    // Redirect back to the activities page with success message
    return redirect(`/activity?success=Activity created successfully`, 303);
  } catch (error) {
    console.error('Error creating activity:', error);
    return redirect(`/activity?error=Failed to create activity`, 303);
  }
}; 