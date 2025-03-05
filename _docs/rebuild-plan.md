# Rebuild & Refactor Plan

## 1. Branching Strategy

- **Create a new branch** (e.g., `refactor-astro`) off of `main`.
- Commit frequently in the new branch to capture progress.
- If the `main` branch has updates, merge or rebase them into `refactor-astro` periodically.
- Maintain a long-running pull request if you like, tracking the entire refactor effort until completion.

## 2. Work Sequencing

### Phase A: Initial Setup

1. **Initialize Astro Project**  
   ✅ **Completed**: You have an Astro project in the `/app/` directory with a working Tailwind setup.

2. **Set Up Core Data Files**  
   ✅ **Completed**: The `projects.ts` file (and `visibility` fields) is in place. This serves as your core example data.  

### Phase B: Incremental Migration

3. **Migrate Layout & CSS**  
   ✅ **Completed**: You have `BaseLayout.astro` and a global Tailwind configuration in `global.css`.

4. **Move Each Section in Turn**  
   ✅ **Completed**: Pages for `projects`, `revenue`, `writing`, `ai-library`, `resources`, and `books` exist, each pulling from or referencing appropriate placeholders.

5. **Implement Auth (If Needed)**  
   ✅ **Completed** (basic version): Simple password-protected login with `localStorage` and a placeholder password (`controlpanel`).

6. **Refine & Consolidate**  
   ⚠️ **Ongoing**: The codebase is in good shape, but you may still want to refine UI consistency, reorganize data files (e.g., for writing or revenue data), and unify the public/private content logic.

### Phase C: Final Integration & Cleanup

7. **Full Workflow Testing**  
   - **Next Step**: Ensure all pages (dashboard, projects, revenue, etc.) work as expected.  
   - Verify logging in/out properly toggles `private-content`.  
   - Confirm data filtering (e.g., for projects) works consistently.

8. **Merge to Main**  
   - **Upcoming**: After thorough testing, merge the `refactor-astro` branch (if you haven’t already).  
   - Optionally squash commits for a cleaner history.

9. **Retire Old Code**  
   - **Upcoming**: You still have a `prototype/` directory; decide whether to remove or archive it.  
   - Keep in a separate branch if you want a historical reference.

## 3. Best Practices

- **Small, Focused Commits:** Continue to keep commits granular with descriptive messages.
- **Testing at Each Step:** After adding new features, verify they don’t break existing pages.
- **Iterate Over Sections:** As you add more data (e.g., writing, revenue), keep the approach consistent.

## 4. Outcome

Following this plan has given you:
- A working Astro + Tailwind site with all major sections in place.
- Basic authentication for private vs. public content.
- Next, focus on finalizing data/feature completeness, testing, and deployment to your chosen static host.

