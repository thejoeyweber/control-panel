/*
  File: src/pages/api/projects/[id].ts
  Purpose: Handle individual project operations (get, update, delete)
  Dependencies: Project model and utility functions
*/

import type { APIRoute } from 'astro';
import { getProjectById, saveProject, deleteProject } from '../../../data/projects';
import type { Project } from '../../../types';

// GET: Fetch a single project by ID
export const GET: APIRoute = async ({ params, request, redirect }) => {
  const id = params.id;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Project ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const project = getProjectById(id);
  
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
export const PUT: APIRoute = async ({ params, request, redirect }) => {
  const id = params.id;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Project ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Get the existing project
    const existingProject = getProjectById(id);
    
    if (!existingProject) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse the request body
    const projectUpdate = await request.json() as Partial<Project>;
    
    // Merge the existing project with the update
    const updatedProject = {
      ...existingProject,
      ...projectUpdate,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    // Save the updated project
    saveProject(updatedProject as Project);
    
    return new Response(JSON.stringify(updatedProject), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE: Remove a project
export const DELETE: APIRoute = async ({ params, redirect }) => {
  const id = params.id;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Project ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const project = getProjectById(id);
    
    if (!project) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Delete the project
    deleteProject(id);
    
    // Redirect to projects page with success message
    return redirect(`/projects?deleted=true&project=${project.title}`, 303);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 