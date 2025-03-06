feat(projects): Migrate Projects module to Astro DB

This commit migrates the Projects module from JSON file-based storage to Astro DB.
The migration includes updates to database schema, utility functions, API endpoints,
and UI components to work with the new database structure.

Key changes:
- Add Projects table to Astro DB schema in db/config.ts
- Add Project-related database operations to src/utils/db.ts
- Update Projects API endpoints to use Astro DB
- Update Projects page and components to work with the new data structure
- Update individual Project page to fetch data from Astro DB
- Improve relationship between Projects and Activities
- Add better error handling and null checks throughout the module
- Enhance UI components with improved filtering and sorting

This migration is part of the larger effort to move all data storage to Astro DB
with Turso as the database provider.

Related: #issue-number (if applicable) 