/**
 * @file project-resources-schema.ts
 * @description
 * Defines a join table "project_resources" linking the "projects" and "resources" tables.
 *
 * Key columns:
 * - projectId (FK => projects.id)
 * - resourceId (FK => resources.id)
 * - addedAt (timestamp)
 * 
 * Composite primary key: (projectId, resourceId)
 */

import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { projectsTable } from "./projects-schema"
import { resourcesTable } from "./resources-schema"

/**
 * projectResourcesTable
 * Many-to-many relationship between projects and resources.
 */
export const projectResourcesTable = pgTable("project_resources", {
  /**
   * projectId
   * References projects.id
   */
  projectId: uuid("project_id")
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .notNull(),

  /**
   * resourceId
   * References resources.id
   */
  resourceId: uuid("resource_id")
    .references(() => resourcesTable.id, { onDelete: "cascade" })
    .notNull(),

  /**
   * addedAt
   * Timestamp when the resource was linked to the project.
   */
  addedAt: timestamp("added_at").defaultNow().notNull()
}, (table) => {
  return {
    /**
     * composite PK on (projectId, resourceId)
     */
    pk: {
      primaryKey: true,
      columns: [table.projectId, table.resourceId]
    }
  }
}) 