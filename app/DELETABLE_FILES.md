# Files That Can Be Deleted After Migration

This document lists files that can be safely deleted after the migration to Astro DB is complete and tested.

## Activities Module
- `src/data/activities.ts` - Replaced by Astro DB and utility functions
- `src/data/activities.json` - Data migrated to Astro DB

## Projects Module
- `src/data/projects.ts` - Replaced by Astro DB and utility functions
- `src/data/projects.json` - Data migrated to Astro DB

## Data Files

These JSON data files are no longer needed as the data is now stored in Astro DB:

- `src/data/writing.json`
- `src/data/books.json`
- `src/data/resources.json`
- `src/data/revenue.json`
- `src/data/revenue-goals.json`
- `src/data/ai-tools.json`

## Data Service Files

These TypeScript service files are replaced by the Astro DB utilities:

- `src/data/writing.ts`
- `src/data/books.ts`
- `src/data/resources.ts`
- `src/data/revenue.ts`
- `src/data/revenue-goals.ts`
- `src/data/ai-tools.ts`

## Utility Files

These utility files are no longer needed or have been replaced:

- `src/utils/json.ts` (JSON file handling utilities)
- `src/utils/visibility.ts` (Replaced by visibility handling in db.ts)

## Migration Process

1. Ensure all functionality is working correctly with Astro DB
2. Back up all files listed above
3. Delete the files
4. Test the application thoroughly to ensure no regressions

## Note
Before deleting any files, ensure that:
1. All functionality has been thoroughly tested
2. All data has been successfully migrated to Astro DB
3. No other parts of the application depend on these files
4. You have a backup or version control in case you need to revert 