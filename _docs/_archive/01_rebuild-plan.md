# Rebuild & Refactor Plan

## 1. Branching Strategy

- **Create a new branch** (e.g., `refactor-astro`) off of `main`.  
  ✅ *Branch created and code migrated.*  
- Commit frequently in the new branch to capture progress.  
- If the `main` branch has updates, merge or rebase them into `refactor-astro` periodically.  
- Maintain a long-running pull request if you like, tracking the entire refactor effort until completion.

## 2. Work Sequencing

### Phase A: Initial Setup
1. **Initialize Astro Project**  
   ✅ *Done. You have an Astro project in `/app/` with Tailwind configured.*

2. **Set Up Core Data Files**  
   ✅ *Done. You have `projects.ts`, `books.ts`, `resources.ts`, `revenue.ts`, `writing.ts`, and more.*

### Phase B: Incremental Migration
3. **Migrate Layout & CSS**  
   ✅ *Done. `BaseLayout.astro` and `global.css` are in place with Tailwind utilities.*

4. **Move Each Section in Turn**  
   ✅ *Done. You now have pages for `projects`, `revenue`, `writing`, `ai-library`, `resources`, `books`, plus an `activity-dashboard` page.*

5. **Implement Auth (If Needed)**  
   ✅ *A simple `login.astro` and localStorage-based check exist in `utils/auth.ts`. Working placeholder done.*

6. **Refine & Consolidate**  
   ⚠️ *In progress. You have consistent styling, but some UI functionality (e.g., “Add” buttons, partial filter logic) still needs hooking up. Ongoing refinements remain.*

### Phase C: Final Integration & Cleanup
7. **Full Workflow Testing**  
   - *Next Steps*: Thoroughly exercise each page (projects, revenue, writing, etc.), verify filters, login gating, and that navigation is smooth.  
   - Ensure the `private-content` sections correctly show/hide with auth.  
   - Some “Add” or “Log Activity” buttons do not fully persist data yet — consider storing user entries (in localStorage or a simple JSON flow) for full test coverage.

8. **Merge to Main**  
   - *Once testing is satisfactory,* merge the `refactor-astro` branch or open a PR to integrate changes back to `main`.

9. **Retire Old Code**  
   - *Decide whether to remove `prototype/` or keep it for archival.*  
   - A typical approach is to tag the prototype or keep it in a separate branch for historical reference.

## 3. Best Practices
- **Small, Focused Commits:** Keep each new feature or fix in a dedicated commit/branch.  
- **Test as You Go:** Since it’s a personal app, a quick local test after each feature suffices.  
- **Iterate on UI & Data:** If you decide to add more dynamic forms (e.g., “Add Project”), ensure consistent data handling in one place (either localStorage or a small serverless DB).

## 4. Outcome
- You have a fully migrated Astro + Tailwind site with all main sections.  
- Authentication is in place (albeit minimal).  
- Next, focus on hooking up “Add” or “Edit” forms, real filtering, finishing the QA pass, and merging to main.  
