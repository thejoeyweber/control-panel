# Rebuild & Refactor Plan

## 1. Branching Strategy

- **Create a new branch** (e.g., `refactor-astro`) off of `main`.
- Commit frequently in the new branch to capture progress.
- If the `main` branch has updates, merge or rebase them into `refactor-astro` periodically.
- Maintain a long-running pull request if you like, tracking the entire refactor effort until completion.

## 2. Work Sequencing

### Phase A: Initial Setup

1. **Initialize Astro Project**  
   - Create a new folder or project for Astro + Tailwind.  
   - Confirm “Hello World” builds and deploys properly.

2. **Set Up Core Data Files**  
   - Decide how to store your project data (Markdown, JSON, frontmatter, etc.).  
   - Include a “visibility” field (public/private) for each item.

### Phase B: Incremental Migration

3. **Migrate Layout & CSS**  
   - Port the base layout (header, nav, footer) from your existing code.  
   - Reuse Tailwind config or adapt your design tokens.

4. **Move Each Section in Turn**  
   - Example: Convert “Projects” first. Build an Astro page that reads the projects data.  
   - Then do “Revenue,” “Writing,” “Books,” etc.  
   - Test each section thoroughly before moving on.

5. **Implement Auth (If Needed)**  
   - Simple password login, session cookie, or a minimal serverless function.  
   - Tie it to a check that hides private content if not authenticated.

6. **Refine & Consolidate**  
   - Adjust styling and ensure each page works properly in the new environment.  
   - Avoid dragging over unnecessary old code.

### Phase C: Final Integration & Cleanup

7. **Full Workflow Testing**  
   - Confirm you can see all sections, public vs. private items, etc.  
   - Ensure everything matches your old POC functionality (plus improvements).

8. **Merge to Main**  
   - Once stable, merge `refactor-astro` into `main`.  
   - Optionally squash commits for a cleaner history.

9. **Retire Old Code**  
   - If no longer needed, remove or archive the older proof-of-concept.  
   - Keep it in a separate branch if you want a backup reference.

## 3. Best Practices

- **Small, Focused Commits:** Make incremental changes with descriptive messages.
- **Testing at Each Step:** After migrating a feature, test locally to confirm no regressions.
- **Retain Old POC on Main:** If something goes wrong, you can revert or compare.
- **Iterate Over Sections:** Tackle a page/feature at a time, don’t attempt a “big bang” migration.

## 4. Outcome

Following this plan ensures a **smooth, incremental** rebuild:
- The old site stays stable on `main`.
- The new site evolves in `refactor-astro`, letting you refine each area without risking the original proof-of-concept.
- Once everything is tested and stable, you do a final merge and cut over to the new architecture.
