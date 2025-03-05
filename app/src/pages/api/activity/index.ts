/*
  File: src/pages/api/activity/index.ts
  Purpose: API endpoint for listing and creating activities
  Dependencies: Uses activity.ts data service
*/

import type { APIRoute } from 'astro';
import { getAllActivities, createActivity } from '../../../data/activities';
import { parseFormData } from '../../../utils/form';

export const GET: APIRoute = async () => {
  try {
    const activities = await getAllActivities();
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
    const formData = await request.formData();
    const activityData = parseFormData(formData);
    
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