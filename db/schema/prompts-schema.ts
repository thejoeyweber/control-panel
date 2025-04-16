/**
 * @file prompts-schema.ts
 * @description
 * Defines a "prompts" table that stores user-defined AI prompts for reuse.
 *
 * Key columns:
 * - id (PK, UUID)
 * - userId (Clerk user ID)
 * - name (short identifier for the prompt)
 * - promptText (the main prompt content)
 * - description (optional text)
 * - variables (jsonb describing placeholders or dynamic parts)
 * - tags (jsonb for classification)
 * - targetAiModel (optional text if user wants to specify model usage)
 * - createdAt, updatedAt
 */

import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core"

export const promptsTable = pgTable("prompts", {
  /**
   * id
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * userId
   * The user who owns this prompt. If prompts can be global, consider making this nullable.
   */
  userId: text("user_id").notNull(),

  /**
   * name
   * A short name for identifying the prompt.
   */
  name: text("name").notNull(),

  /**
   * promptText
   * The actual text content of the AI prompt.
   */
  promptText: text("prompt_text").notNull(),

  /**
   * description
   * Optional description for additional context on usage.
   */
  description: text("description"),

  /**
   * variables
   * JSON describing placeholders or variables the user might fill in.
   */
  variables: jsonb("variables"),

  /**
   * tags
   * JSON array or object for classification or labeling.
   */
  tags: jsonb("tags"),

  /**
   * targetAiModel
   * The model (e.g. "gpt-4") the user might prefer for this prompt.
   */
  targetAiModel: text("target_ai_model"),

  /**
   * createdAt, updatedAt
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertPrompt = typeof promptsTable.$inferInsert
export type SelectPrompt = typeof promptsTable.$inferSelect 