/**
 * @file project-types-schema.ts
 * @description
 * Defines the "project_types" table for categorizing projects by type (e.g. "writing", "software").
 *
 * Key columns:
 * - id (PK, UUID)
 * - name (unique text)
 * - description (optional text)
 * - icon (optional text)
 * - createdAt, updatedAt
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

/**
 * projectTypesTable
 * Holds possible categories or "types" of projects.
 */
export const projectTypesTable = pgTable("project_types", {
  /**
   * id
   * Primary key, UUID.
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * name
   * Name of this project type (e.g. "research", "writing").
   */
  name: text("name").notNull(),

  /**
   * description
   * Optional text describing this project type more thoroughly.
   */
  description: text("description"),

  /**
   * icon
   * Optional string referencing an icon name or URL for the type.
   */
  icon: text("icon"),

  /**
   * createdAt
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * updatedAt
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * InsertProjectType
 * For inserting rows into "project_types".
 */
export type InsertProjectType = typeof projectTypesTable.$inferInsert

/**
 * SelectProjectType
 * For selecting rows from "project_types".
 */
export type SelectProjectType = typeof projectTypesTable.$inferSelect 