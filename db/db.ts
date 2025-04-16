/**
 * @file db.ts
 * @description
 * Configures the Drizzle ORM database client for PostgreSQL using the "postgres" library.
 * Imports the entire schema from our "db/schema" files, including newly added tables.
 *
 * @notes
 * - "Never generate migrations" is part of the project rules, so we only define schema here.
 * - When referencing the table objects in code, we can use `db.schema.[tableName]`.
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

/**
 * Import all tables from "db/schema/index"
 */
import {
  profilesTable,
  projectTypesTable,
  projectsTable,
  workChunksTable,
  resourcesTable,
  projectResourcesTable,
  workChunkResourcesTable,
  promptsTable,
  workChunkPromptsTable,
  rulesTable,
  chunkFeedbackLogTable,
  dailyActivityLogTable
} from "./schema";

config({ path: ".env.local" });

/**
 * Combine tables into a single 'schema' object for Drizzle.
 */
const schema = {
  profiles: profilesTable,
  projectTypes: projectTypesTable,
  projects: projectsTable,
  workChunks: workChunksTable,
  resources: resourcesTable,
  projectResources: projectResourcesTable,
  workChunkResources: workChunkResourcesTable,
  prompts: promptsTable,
  workChunkPrompts: workChunkPromptsTable,
  rules: rulesTable,
  chunkFeedbackLog: chunkFeedbackLogTable,
  dailyActivityLog: dailyActivityLogTable
};

/**
 * Connect to PostgreSQL using environment variable `DATABASE_URL`.
 * Use drizzle for typed queries/mutations.
 */
const client = postgres(process.env.DATABASE_URL!);

/**
 * db
 * The main Drizzle database instance, exposing typed queries to all tables in 'schema'.
 */
export const db = drizzle(client, { schema });
