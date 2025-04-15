/**
 * @description
 * This file defines the schema for the "projects" table using Drizzle ORM's pgTable helper.
 * The projects table holds basic information about each project a user creates.
 *
 * Key columns:
 * - id: Unique primary key (UUID).
 * - userId: The ID of the user who owns the project.
 * - name: Short name/title for the project.
 * - description: Longer text describing the project, optional.
 * - projectType: Type or category of the project (e.g. "software", "writing").
 * - objectives: Stringified data or JSON text detailing project objectives.
 * - createdAt & updatedAt: Timestamps.
 *
 * @notes
 * - We default the 'id' to a random UUID.
 * - We onUpdate the 'updatedAt' column so it auto-updates on row changes.
 * - The userId must be a valid string referencing the user's Clerk ID, but we do not enforce references at the DB layer here.
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const projectsTable = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  projectType: text("project_type"),
  objectives: text("objectives"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * InsertProject
 * Represents the data needed to insert a new row into the "projects" table.
 */
export type InsertProject = typeof projectsTable.$inferInsert

/**
 * SelectProject
 * Represents a row that has been selected from the "projects" table.
 */
export type SelectProject = typeof projectsTable.$inferSelect 