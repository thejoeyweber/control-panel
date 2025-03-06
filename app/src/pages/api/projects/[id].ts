/*
  File: src/pages/api/projects/[id].ts
  Purpose: Handle individual project operations (get, update, delete)
  Dependencies: Astro DB utility functions for Projects operations
*/

import type { APIRoute } from 'astro';
import { getProject, updateProject, deleteProject } from '../../../utils/db';
import { isAuthenticated } from '../../../utils/auth';
import type { Project } from '../../../types';

// GET: Fetch a single project by ID
export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Project ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Check if user is authenticated
  const authenticated = isAuthenticated();
  
  const project = await getProject(id, authenticated);
  
  if (!project) {
    return new Response(JSON.stringify({ error: 'Project not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify(project), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

// PUT: Update a project
export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Project ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if the project exists
    const existingProject = await getProject(id, true);
    
    if (!existingProject) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse the request body
    const projectUpdate = await request.json();
    
    // Update the project in the database
    const updatedProject = await updateProject(id, projectUpdate);
    
    return new Response(JSON.stringify(updatedProject), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return new Response(JSON.stringify({ error: 'Failed to update project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE: Remove a project
export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Project ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if the project exists
    const project = await getProject(id, true);
    
    if (!project) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Delete the project
    await deleteProject(id);
    
    return new Response(JSON.stringify({ message: 'Project deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 