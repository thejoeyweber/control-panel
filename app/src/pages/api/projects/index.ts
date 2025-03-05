/*
  File: src/pages/api/projects/index.ts
  Purpose: Handle project CRUD operations via API endpoints
  Dependencies: Project model and utility functions
*/

import type { APIRoute } from 'astro';
import { projects, saveProject, deleteProject } from '../../../data/projects';
import type { Project } from '../../../types';
import { generateId } from '../../../utils/data';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
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
    const projectId = formData.get('id') as string;
    const id = projectId || generateId();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as 'active' | 'completed' | 'planning' | 'paused';
    const visibility = formData.get('visibility') as 'public' | 'private';
    const startDate = formData.get('startDate') as string;
    const progress = parseInt(formData.get('progress') as string) || 0;
    
    // Process tags and tech stack (comma-separated strings)
    const tagsString = formData.get('tags') as string;
    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    
    const techStackString = formData.get('techStack') as string;
    const techStack = techStackString ? techStackString.split(',').map(tech => tech.trim()).filter(Boolean) : [];
    
    // Optional fields
    const githubUrl = formData.get('githubUrl') as string || '';
    const liveUrl = formData.get('liveUrl') as string || '';
    const notes = formData.get('notes') as string || '';
    
    // Create project object
    const project: Project = {
      id,
      title,
      description,
      category,
      status,
      visibility,
      startDate,
      progress,
      tags,
      techStack,
      githubUrl,
      liveUrl,
      notes,
      lastUpdated: new Date().toISOString().split('T')[0],
      activities: [] // Initialize with empty activities array
    };
    
    // Validate required fields
    if (!title) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Save the project
    const savedProject = await saveProject(project);
    const isNewProject = !projectId;
    
    // Redirect back to projects page with success message
    return redirect(`/projects?success=${encodeURIComponent(title)} ${isNewProject ? 'created' : 'updated'} successfully&action=${isNewProject ? 'create' : 'update'}`, 303);
    
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