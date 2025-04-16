/**
 * @file work-chunk-resources-schema.ts
 * @description
 * Defines a join table "work_chunk_resources" linking "work_chunks" and "resources".
 *
 * Key columns:
 * - workChunkId (FK => work_chunks.id)
 * - resourceId (FK => resources.id)
 * - addedAt (timestamp)
 *
 * Composite primary key: (workChunkId, resourceId)
 */

import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { workChunksTable } from "./work-chunks-schema"
import { resourcesTable } from "./resources-schema"

/**
 * workChunkResourcesTable
 * Many-to-many relationship between work chunks and resources.
 */
export const workChunkResourcesTable = pgTable("work_chunk_resources", {
  /**
   * workChunkId
   * References work_chunks.id
   */
  workChunkId: uuid("work_chunk_id")
    .references(() => workChunksTable.id, { onDelete: "cascade" })
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
   * Timestamp of linking the resource to the chunk.
   */
  addedAt: timestamp("added_at").defaultNow().notNull()
}, (table) => {
  return {
    /**
     * composite PK on (workChunkId, resourceId)
     */
    pk: {
      primaryKey: true,
      columns: [table.workChunkId, table.resourceId]
    }
  }
}) 