# 02_buildplan.md

Below is a proposed build plan grouping the recommended refactors and updates into four medium-sized batches of work. Each group should represent a cohesive set of changes suitable for a single or small series of Git commits. The goal is to move toward a lean, database-backed application without the file-based JSON approach, remove duplicated code, and maintain a straightforward Astro-friendly architecture.

---

## 1. Introduce a Minimal SQLite Database & Remove LocalStorage

**Goals:**
- Eliminate the JSON-file approach (and localStorage usage for `projects`) and switch to a single, consistent data layer using SQLite.
- Establish the foundation so that all entities (`activities`, `books`, `writing`, `resources`, `revenue`, etc.) can query the same DB.

**Steps:**
1. **Create `src/db/index.ts`:**
   - Use something like `better-sqlite3` (lightweight) or another minimal approach.
   - Initialize a `db` instance that either creates or opens a `.sqlite` file.
   - Provide basic migration or schema setup (even if it’s a simple “CREATE TABLE IF NOT EXISTS …” logic).

2. **Refactor `projects.ts`:**  
   - Remove the localStorage-based logic.  
   - Instead, define a “Projects” table, columns matching the `Project` interface.  
   - Implement basic CRUD in a new `projects.ts` that queries SQLite.

3. **Delete (or rename) the local `projects.json` fallback** (if any) to avoid confusion.  
   - The local default data can become a short seed script that inserts a few rows on first run.

4. **Define a short seed script** (e.g. `scripts/seed.ts` or run logic in `db/index.ts`) if you want initial test data.  

**Outcome:**
- A minimal DB approach is in place, with `projects` as the first fully migrated entity.  
- No code uses localStorage for data.  
- Astro continues to run as normal, but now the “Projects” data is in SQLite.

---

## 2. Unify & Migrate Other Entities from JSON to the Database

**Goals:**
- One by one, remove the file-based read/write approach for `activities`, `books`, `resources`, `revenue`, and `writing`.
- Consolidate “writing-pieces.json” vs. “writing.json” into a single “Writing” table.

**Steps:**
1. **Create tables** in SQLite for each resource:
   - `activities`, `books`, `resources`, `revenue`, `writing` (final name).
   - Each table has columns that mirror the type definitions. Also include an `id` primary key column (e.g., `INTEGER PRIMARY KEY AUTOINCREMENT` or a `UUID` if that’s your preference).

2. **Refactor each `*.ts` data service** (like `activities.ts`) to:
   - Import `db` from `src/db/index.ts`.
   - Implement each function (`getAll…`, `create…`, `update…`, `delete…`) as SQL queries or query-builder calls.
   - Remove `fs` usage and `ensureDataFileExists()` calls.

3. **Merge “writing” and “writing-pieces”**:
   - Decide on final fields (title, summary, content, etc.).
   - Migrate all references to a single table (`writing`), removing the duplicated `.json`.

4. **Remove the old JSON files** for these entities, or keep them only as “seed” data (a small subset) if you want a “seed script” to populate the DB initially.

**Outcome:**
- All data is stored in SQLite. Each entity is consistent with the same approach.  
- No more file-based read/write logic remains in `src/data/`.

---

## 3. Consolidate Stats & Search Logic + Clean Up Duplicates

**Goals:**
- Eliminate repeated “stats” or “search” logic that previously loaded entire JSON in memory.
- Convert them to either minimal SQL queries or a short function that queries the DB directly.

**Steps:**
1. **Stats**:
   - Each resource’s `getXStats()` can be replaced by SQL count queries. For example:
     ```sql
     SELECT status, COUNT(*) as count FROM books GROUP BY status;
     ```
   - Return these in the shape your front-end expects (e.g. `byStatus: { reading: x, completed: y }`).

2. **Search**:
   - Where you previously did an in-memory filter or “.includes()” approach, switch to a simple `LIKE` or `INSTR()` in SQL if it suffices:
     ```sql
     SELECT * FROM writing WHERE title LIKE '%' || ? || '%'
     ```
   - If you ever want advanced searching, consider FTS (Full-Text Search) in SQLite.

3. **Remove duplicates**:
   - For instance, unify `api/activity/` vs. `api/activities/` into a single route.  
   - Rename or remove any leftover “pieces” vs. “writing” duplication.

4. **Decide on how to handle “Tags”**:
   - If you want advanced queries (like “all resources with tag=foo”), you might create a separate `tags` table (or a pivot table if multi-tag).  
   - If you just store them as a delimited string, you can still do a partial search in SQL. (Either approach is fine, but commit to one for consistency.)

**Outcome:**
- “Stats” and “search” are handled neatly. No giant data loads.  
- The code is smaller because repeated logic is replaced by short, direct queries.

---

## 4. Final Housekeeping & Best Practice Alignments

**Goals:**
- Ensure the app structure follows Astro best practices (server code in serverish files, minimal client JS).
- Keep code minimal, with an eye on future expansions if you ever allow multiple users or advanced features.

**Steps:**
1. **Optional micro-ORM**:
   - If desired, integrate a small library like Kysely or Drizzle so you can write TypeScript queries.  
   - Or do raw SQL—either is fine, but pick one to keep the code uniform.

2. **Add Input Validation**:
   - Use a small schema validator (like zod) in the API routes to sanitize user form input.  
   - This ensures no harmful or malformed data hits the DB.

3. **Remove unused or placeholder files**:
   - If `prototype/` or `activities.json` remain with no references, delete them.  
   - Keep your final data seeding (if any) in a single “seed script” or `db/seed.sql`.

4. **(If relevant)** Start an Auth Flow for multi-user:
   - If you might expand later, consider a simple user table now.  
   - Otherwise, keep it single-user but easily pivot if you do multi-user down the line.

**Outcome:**
- The project is tidy, consistent, and clearly separated:  
  - **`db/`** for database connections + migrations.  
  - **`src/data/*.ts`** for domain logic with minimal duplication.  
  - **API routes** for HTTP endpoints.  
  - Unused JSON + localStorage code is removed.

---

## Summary

By following these four batches of work, you’ll end up with a **compact, maintainable** codebase that:

1. Uses **SQLite** (a single, local file) for consistent storage, no partial JSON reads.  
2. Has a unified, minimal data layer that **removes** duplication.  
3. Keeps “stats” and “search” in the DB so your code is smaller and queries more efficient.  
4. Aligns with **Astro** best practices (server code on the server, minimal on the client).  
5. Is ready to scale or pivot to Postgres and multi-user features if/when you choose.

That should keep the code lean while still being robust and future-friendly.
