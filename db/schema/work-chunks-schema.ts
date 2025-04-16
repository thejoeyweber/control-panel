/**
 * @file work-chunks-schema.ts
 * @description
 * Defines the schema for the "work_chunks" table with new columns and enumerations.
 *
 * Key columns:
 * - id (PK, UUID)
 * - projectId (FK referencing "projects.id")
 * - userId (Clerk user ID)
 * - title (short text describing the chunk)
 * - status (enum from workChunkStatusEnum)
 * - notes (free-form notes)
 * - completedAt (timestamp when chunk was completed, if completed)
 * - deferredUntil (timestamp if chunk was deferred)
 * - cancellationReason (text if chunk was canceled)
 * - completionModificationNotes (text if chunk was completed in a modified form)
 * - generationSource (enum from generationSourceEnum)
 * - aiPromptContext (jsonb storing AI context used to generate chunk)
 * - aiModelUsed (text storing which AI model was used, e.g. "gpt-4")
 * - feedbackRating (optional numeric rating user gave after chunk completion)
 * - feedbackComments (text for user feedback notes)
 * - n8nActionWorkflowId (optional for referencing an n8n workflow)
 * - n8nActionParameters (jsonb for the workflow parameters)
 * - chunkVector (varchar for vector usage)
 * - sequenceOrder (optional integer to define chunk ordering)
 * - createdAt, updatedAt
 *
 * @notes
 * - For existing data, you'll need a custom migration to handle your old columns/fields.
 */

import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  varchar,
  integer
} from "drizzle-orm/pg-core"
import { projectsTable } from "./projects-schema"
import { workChunkStatusEnum, generationSourceEnum } from "./enums"

/**
 * workChunksTable
 * Holds individual, small "work chunks" for each project.
 */
export const workChunksTable = pgTable("work_chunks", {
  /**
   * id
   * Primary key (UUID).
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * projectId
   * References the "projects" table (cascades on delete).
   */
  projectId: uuid("project_id")
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .notNull(),

  /**
   * userId
   * The user who owns this chunk (should match the project owner).
   */
  userId: text("user_id").notNull(),

  /**
   * title
   * A short descriptive label for the chunk.
   */
  title: text("title").notNull(),

  /**
   * notes
   * Additional detail about the chunk that doesn't go in the title.
   */
  notes: text("notes"),

  /**
   * status
   * Enum from workChunkStatusEnum (suggested, accepted, in_progress, etc.).
   */
  status: workChunkStatusEnum("status").default("suggested").notNull(),

  /**
   * completedAt
   * Timestamp for when a chunk was completed, if applicable.
   */
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().$type(),

  /**
   * deferredUntil
   * If a chunk was deferred, you can set a date to revisit it.
   */
  deferredUntil: timestamp("deferred_until", { withTimezone: true }).notNull().$type(),

  /**
   * cancellationReason
   * If canceled, store the reason.
   */
  cancellationReason: text("cancellation_reason"),

  /**
   * completionModificationNotes
   * If the user modifies chunk details before completion, store how or why.
   */
  completionModificationNotes: text("completion_modification_notes"),

  /**
   * generationSource
   * Tracks how this chunk was created (AI suggestion, user, or template).
   */
  generationSource: generationSourceEnum("generation_source")
    .default("user_created")
    .notNull(),

  /**
   * aiPromptContext
   * JSON object with any relevant AI prompt data that generated this chunk.
   */
  aiPromptContext: jsonb("ai_prompt_context"),

  /**
   * aiModelUsed
   * If AI was used, store which model (e.g. "gpt-4").
   */
  aiModelUsed: text("ai_model_used"),

  /**
   * feedbackRating
   * Optional user rating for this chunk (1-5, 1-10, or any scale).
   */
  feedbackRating: integer("feedback_rating").notNull().$type(),

  /**
   * feedbackComments
   * Any textual feedback from the user after finishing the chunk.
   */
  feedbackComments: text("feedback_comments"),

  /**
   * n8nActionWorkflowId
   * If an n8n workflow is triggered by this chunk, we can store an ID reference.
   */
  n8nActionWorkflowId: text("n8n_action_workflow_id"),

  /**
   * n8nActionParameters
   * Parameters for the n8n workflow if relevant.
   */
  n8nActionParameters: jsonb("n8n_action_parameters"),

  /**
   * chunkVector
   * Optional vector for advanced AI usage or semantic search.
   */
  chunkVector: varchar("chunk_vector", { length: 1024 }).notNull().$type(),

  /**
   * sequenceOrder
   * Optional numeric order if you want to order chunks sequentially.
   */
  sequenceOrder: integer("sequence_order").notNull().$type(),

  /**
   * createdAt
   * Auto-populated creation timestamp.
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * updatedAt
   * Auto-updated on row changes.
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * InsertWorkChunk
 * For inserting a new row into "work_chunks".
 */
export type InsertWorkChunk = typeof workChunksTable.$inferInsert

/**
 * SelectWorkChunk
 * For selecting (retrieving) a row from "work_chunks".
 */
export type SelectWorkChunk = typeof workChunksTable.$inferSelect 