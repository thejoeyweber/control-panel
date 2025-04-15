/**
 * @description
 * This file configures the Drizzle ORM database client for PostgreSQL using `postgres`
 * and merges in the schema definitions from multiple files. We store everything in
 * a "schema" object that Drizzle uses for typed querying.
 *
 * Key Exports:
 * - db: The main Drizzle database instance.
 *
 * @notes
 * - We load environment variables from `.env.local` via dotenv.
 * - The "schema" object merges all table definitions so Drizzle can strongly type them.
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { profilesTable, projectsTable, workChunksTable } from "./schema";

config({ path: ".env.local" });

/**
 * schema
 * Combines all table definitions from the schema so Drizzle can strongly type them.
 */
const schema = {
  profiles: profilesTable,
  projects: projectsTable,
  workChunks: workChunksTable
};

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
