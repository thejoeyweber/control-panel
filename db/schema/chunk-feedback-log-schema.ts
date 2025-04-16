/**
 * @file chunk-feedback-log-schema.ts
 * @description
 * Defines a "chunk_feedback_log" table for capturing user feedback about chunk suggestions.
 *
 * Key columns:
 * - id (PK, UUID)
 * - chunkId (FK => work_chunks.id)
 * - userId
 * - projectId (FK => projects.id)
 * - feedbackType (enum => feedbackTypeEnum)
 * - rejectionReason (text)
 * - modificationDetails (text)
 * - createdAt
 */

import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"
import { workChunksTable } from "./work-chunks-schema"
import { projectsTable } from "./projects-schema"
import { feedbackTypeEnum } from "./enums"

export const chunkFeedbackLogTable = pgTable("chunk_feedback_log", {
  /**
   * id
   * PK
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * chunkId
   * If the feedback references a particular chunk suggestion.
   */
  chunkId: uuid("chunk_id")
    .references(() => workChunksTable.id, { onDelete: "cascade" })
    .notNull(),

  /**
   * userId
   * The user giving the feedback.
   */
  userId: text("user_id").notNull(),

  /**
   * projectId
   * The project to which this chunk belongs.
   */
  projectId: uuid("project_id")
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .notNull(),

  /**
   * feedbackType
   * e.g. "rejected", "modified", or "accepted"
   */
  feedbackType: feedbackTypeEnum("feedback_type").notNull(),

  /**
   * rejectionReason
   * If feedbackType = rejected, store reason.
   */
  rejectionReason: text("rejection_reason"),

  /**
   * modificationDetails
   * If feedbackType = modified, store how or why chunk was changed.
   */
  modificationDetails: text("modification_details"),

  /**
   * createdAt
   */
  createdAt: timestamp("created_at").defaultNow().notNull()
})

export type InsertChunkFeedbackLog = typeof chunkFeedbackLogTable.$inferInsert
export type SelectChunkFeedbackLog = typeof chunkFeedbackLogTable.$inferSelect 