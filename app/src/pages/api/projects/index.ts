/*
  File: src/pages/api/projects/index.ts
  Purpose: Handle project CRUD operations via API endpoints
  Dependencies: Astro DB utility functions for Projects operations
*/

import type { APIRoute } from 'astro';
import { getAllProjects, createProject, deleteProject } from '../../../utils/db';
import { parseFormData } from '../../../utils/form';
import { isAuthenticated } from '../../../utils/auth';
import type { Project } from '../../../types';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const formData = await request.formData();
    const _method = formData.get('_method');
    
    // Handle DELETE method override
    if (_method === 'DELETE') {
      const id = formData.get('id') as string;
      if (!id) {
        return new Response(JSON.stringify({ error: 'Project ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      await deleteProject(id);
      
      // Redirect back to projects page with success message
      return redirect(`/projects?success=Project deleted successfully&action=delete`, 303);
    }
    
    // Process project data from form
    const projectData = parseFormData(formData);
    
    // Process tags and tech stack (comma-separated strings)
    if (typeof projectData.tags === 'string') {
      projectData.tags = (projectData.tags as string)
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    }
    
    if (typeof projectData.techStack === 'string') {
      projectData.techStack = (projectData.techStack as string)
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech);
    }
    
    // Validate required fields
    if (!projectData.title) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Save the project using the database utility
    const savedProject = await createProject(projectData);
    const isNewProject = !projectData.id;
    
    // Redirect back to projects page with success message
    return redirect(`/projects?success=${encodeURIComponent(projectData.title as string)} ${isNewProject ? 'created' : 'updated'} successfully&action=${isNewProject ? 'create' : 'update'}`, 303);
    
  } catch (error) {
    console.error('Error processing project:', error);
    return new Response(JSON.stringify({ error: 'Failed to process project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// GET handler to return all projects
export const GET: APIRoute = async () => {
  try {
    // Check if user is authenticated
    const authenticated = isAuthenticated();
    
    // Get all projects
    const projects = await getAllProjects(authenticated);
    
    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch projects' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 