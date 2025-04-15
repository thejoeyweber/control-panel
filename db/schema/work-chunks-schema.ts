/**
 * @description
 * This file defines the schema for the "work_chunks" table using Drizzle ORM.
 * The work_chunks table holds smaller action items or "chunks" of work for each project.
 *
 * Key columns:
 * - id: Unique primary key (UUID).
 * - projectId: References the "projects" table's primary key (cascades on delete).
 * - userId: Repeated user ID for quick filtering of relevant data.
 * - title: Brief title or name for the chunk.
 * - status: Status of the chunk (e.g. "completed", "deferred", "canceled", or in-progress).
 * - notes: Any additional text or notes about the chunk.
 * - createdAt & updatedAt: Timestamps.
 *
 * @notes
 * - We rely on a UUID default for the "id".
 * - The "projectId" references "projects.id" with onDelete: "cascade".
 */

import { pgTable, text, timestamp, uuid as pgUuid } from "drizzle-orm/pg-core"
import { projectsTable } from "./projects-schema"

export const workChunksTable = pgTable("work_chunks", {
  id: pgUuid("id").defaultRandom().primaryKey(),
  projectId: pgUuid("project_id")
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * InsertWorkChunk
 * Represents the data needed to insert a new row into the "work_chunks" table.
 */
export type InsertWorkChunk = typeof workChunksTable.$inferInsert

/**
 * SelectWorkChunk
 * Represents a row that has been selected from the "work_chunks" table.
 */
export type SelectWorkChunk = typeof workChunksTable.$inferSelect 