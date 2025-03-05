/*
  File: src/pages/api/activities/index.ts
  Purpose: API endpoint for listing and creating activities
  Dependencies: Uses activities data service for CRUD operations
*/

import type { APIRoute } from 'astro';
import { getAllActivities, createActivity } from '../../../data/activities';
import { parseFormData } from '../../../utils/form';

export const GET: APIRoute = async ({ request, redirect }) => {
  try {
    const activities = await getAllActivities();
    return new Response(JSON.stringify({ activities }), {
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
    const formData = await request.formData();
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
    
    const activity = await createActivity(activityData);
    
    return redirect(`/activity?success=Activity logged successfully`, 303);
  } catch (error) {
    console.error('Error creating activity:', error);
    return redirect(`/activity?error=${encodeURIComponent('Failed to log activity')}`, 303);
  }
}; 