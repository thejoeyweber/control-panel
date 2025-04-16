/**
 * @file projects-schema.ts
 * @description
 * This file defines the schema for the "projects" table using Drizzle ORM.
 * It has been updated to incorporate new columns and an enum-based status.
 *
 * Key columns:
 * - id (PK, UUID, default random)
 * - userId (Clerk user ID)
 * - projectTypeId (FK referencing "project_types.id")
 * - summary (brief description replacing old "description")
 * - objectives (JSON text for project objectives)
 * - keyOutcomes (JSON text for key outcomes or deliverables)
 * - constraints (text describing constraints)
 * - contextNotes (text for additional notes)
 * - status (enum, uses projectStatusEnum)
 * - archivedAt, completedAt (timestamps for archival/completion)
 * - projectVector (vector, optional, for advanced AI usage)
 * - createdAt, updatedAt (timestamps)
 *
 * @notes
 * - If you have old data in "description" or "project_type" columns, you must migrate it manually.
 * - Drizzle can generate new migrations, but handle data carefully if you have an existing DB.
 */

import { pgTable, text, timestamp, uuid, jsonb, varchar } from "drizzle-orm/pg-core"
import { projectStatusEnum } from "./enums"
import { projectTypesTable } from "./project-types-schema"

/**
 * projectsTable:
 * The main table for user-created projects.
 */
export const projectsTable = pgTable("projects", {
  /**
   * id
   * Primary key (UUID) for each project.
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * userId
   * The user who owns this project (Clerk user ID).
   */
  userId: text("user_id").notNull(),

  /**
   * projectTypeId
   * References the "project_types" table to categorize the project.
   * If you prefer optional project types, make it nullable.
   */
  projectTypeId: uuid("project_type_id")
    .references(() => projectTypesTable.id, { onDelete: "set null" })
    .$type(),

  /**
   * summary
   * A short textual summary or title for the project.
   */
  summary: text("summary").notNull(),

  /**
   * objectives
   * JSON text with an array or object of project objectives.
   */
  objectives: jsonb("objectives"),

  /**
   * keyOutcomes
   * JSON text describing the project's key deliverables or outcomes.
   */
  keyOutcomes: jsonb("key_outcomes"),

  /**
   * constraints
   * Any constraints or restrictions for this project.
   */
  constraints: text("constraints"),

  /**
   * contextNotes
   * Additional context or notes that do not fit in constraints or objectives.
   */
  contextNotes: text("context_notes"),

  /**
   * status
   * Enum referencing the projectStatusEnum (active, paused, archived, completed).
   */
  status: projectStatusEnum("status").default("active").notNull(),

  /**
   * archivedAt
   * Timestamp for when the project was archived (if status=archived).
   */
  archivedAt: timestamp("archived_at", { withTimezone: true }),

  /**
   * completedAt
   * Timestamp for when the project was completed (if status=completed).
   */
  completedAt: timestamp("completed_at", { withTimezone: true }),

  /**
   * projectVector
   * Optional vector for advanced AI indexing (via Supabase vector extension).
   * If not using vector, you can omit this or keep it for future usage.
   */
  projectVector: varchar("project_vector", { length: 1024 }),

  /**
   * createdAt
   * Auto-populated creation timestamp.
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * updatedAt
   * Auto-updated timestamp on row changes.
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * InsertProject
 * Represents data needed to insert a new row into "projects".
 */
export type InsertProject = typeof projectsTable.$inferInsert

/**
 * SelectProject
 * Represents a row from the "projects" table.
 */
export type SelectProject = typeof projectsTable.$inferSelect 