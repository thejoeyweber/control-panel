/**
 * @file resources-schema.ts
 * @description
 * Defines the "resources" table to store user-specific resources such as URLs, notes, etc.
 *
 * Key columns:
 * - id (PK, UUID)
 * - userId (Clerk user ID)
 * - type (enum from resourceTypeEnum)
 * - name (text title for the resource)
 * - content (actual link or note body)
 * - description (optional text)
 * - tags (jsonb for storing an array of tags)
 * - resourceVector (optional vector for advanced search)
 * - createdAt, updatedAt
 */

import { pgTable, uuid, text, timestamp, jsonb, varchar } from "drizzle-orm/pg-core"
import { resourceTypeEnum } from "./enums"

/**
 * resourcesTable
 * A central library of user-defined resources that can be linked to projects or work chunks.
 */
export const resourcesTable = pgTable("resources", {
  /**
   * id
   * Primary key (UUID).
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * userId
   * The user who owns this resource. If resources can be global, make this nullable.
   */
  userId: text("user_id").notNull(),

  /**
   * type
   * The resource type (url, internal_note, etc.).
   */
  type: resourceTypeEnum("type").notNull(),

  /**
   * name
   * A short label for the resource.
   */
  name: text("name").notNull(),

  /**
   * content
   * The actual URL, note, or other textual content.
   */
  content: text("content").notNull(),

  /**
   * description
   * Optional longer description about the resource.
   */
  description: text("description"),

  /**
   * tags
   * JSON array or object to store resource tags for grouping/search.
   */
  tags: jsonb("tags"),

  /**
   * resourceVector
   * Optional vector for advanced AI or semantic search usage.
   */
  resourceVector: varchar("resource_vector", { length: 1024 }).notNull().$type(),

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
 * InsertResource
 */
export type InsertResource = typeof resourcesTable.$inferInsert

/**
 * SelectResource
 */
export type SelectResource = typeof resourcesTable.$inferSelect 