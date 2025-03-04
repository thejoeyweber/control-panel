# Control Panel - Astro Rebuild

A personal control panel for managing projects, revenue, writing, AI tools, resources, and books. Built with Astro and Tailwind CSS.

## Overview

This is a rebuild of the original Control Panel prototype, using Astro for static site generation and Tailwind CSS for styling. The application provides a personal dashboard for managing various aspects of work and personal projects.

## Features

- **Dashboard:** Overview of key metrics (projects, revenue, writing stats, etc.)
- **Projects Management:** Organize and track the status of various personal projects
- **Revenue Tracking:** Display revenue goals, monthly/annual progress, and transactions
- **Writing Management:** Manage written content with draft/published status
- **AI Tools Library:** Store prompts, templates, and other AI-related utilities
- **Resources Catalog:** Collect external links and references by category
- **Book Tracking:** Maintain a list of books with author, category, and reading status
- **Activity Dashboard:** Aggregate recent actions and logs

## Tech Stack

- [Astro](https://astro.build/) - Static site generator with partial hydration
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- Minimal JavaScript for interactive components
- Simple authentication for private/public content

## Project Structure

```
app/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components
│   ├── layouts/     # Page layouts
│   ├── pages/       # Top-level routes
│   ├── styles/      # Global CSS and Tailwind
│   └── utils/       # Utility functions
├── astro.config.mjs # Astro configuration
└── tailwind.config.js # Tailwind configuration
```

## Development

```bash
# Navigate to the app directory
cd app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Authentication

The app uses a simple authentication mechanism to distinguish between public and private content. In development, a fixed password is used (`controlpanel`). In production, this should be replaced with a proper environment variable.

## Original Prototype

The original prototype is available in the `/prototype` directory for reference during development.
