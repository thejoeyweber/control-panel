feat(db): Migrate Activities module to Astro DB

This commit implements the first phase of migrating from JSON files to Astro DB, focusing on the Activities module as a proof of concept. The changes include:

- Add Astro DB integration and configure database schema
- Create seed script for data migration
- Implement centralized database utility functions
- Update Activities components, pages, and API endpoints
- Add utility files for date formatting and form handling
- Document deletable files and migration summary

This change improves data management, performance, and maintainability by leveraging Astro DB's structured database capabilities instead of flat JSON files.

Next steps:
- Complete migration for remaining data entities
- Test thoroughly before removing legacy code

Related: #123 (replace with actual issue number) 