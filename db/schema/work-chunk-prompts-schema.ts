/**
 * @file work-chunk-prompts-schema.ts
 * @description
 * Defines a join table "work_chunk_prompts" linking "work_chunks" to "prompts".
 *
 * Key columns:
 * - workChunkId (FK => work_chunks.id)
 * - promptId (FK => prompts.id)
 * - addedAt (timestamp)
 *
 * Composite primary key: (workChunkId, promptId)
 */

import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { workChunksTable } from "./work-chunks-schema"
import { promptsTable } from "./prompts-schema"

/**
 * workChunkPromptsTable
 * Many-to-many relationship between work chunks and prompts.
 */
export const workChunkPromptsTable = pgTable("work_chunk_prompts", {
  /**
   * workChunkId
   */
  workChunkId: uuid("work_chunk_id")
    .references(() => workChunksTable.id, { onDelete: "cascade" })
    .notNull(),

  /**
   * promptId
   */
  promptId: uuid("prompt_id")
    .references(() => promptsTable.id, { onDelete: "cascade" })
    .notNull(),

  /**
   * addedAt
   */
  addedAt: timestamp("added_at").defaultNow().notNull()
}, (table) => {
  return {
    pk: {
      primaryKey: true,
      columns: [table.workChunkId, table.promptId]
    }
  }
}) 