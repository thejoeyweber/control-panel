/**
 * @file daily-activity-log-schema.ts
 * @description
 * Defines a "daily_activity_log" table for tracking user activity on specific dates.
 *
 * Key columns:
 * - id (PK, UUID)
 * - userId
 * - projectId
 * - activityDate (DATE)
 * - activityType (enum => activityTypeEnum)
 * - relatedEntityId (uuid, optional)
 * - notes (optional text)
 * - createdAt
 *
 * This helps measure user engagement, daily streaks, and cross-project patterns.
 */

import { pgTable, uuid, text, date, timestamp } from "drizzle-orm/pg-core"
import { projectsTable } from "./projects-schema"
import { activityTypeEnum } from "./enums"

export const dailyActivityLogTable = pgTable("daily_activity_log", {
  /**
   * id
   * PK
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * userId
   * The user performing the activity.
   */
  userId: text("user_id").notNull(),

  /**
   * projectId
   * The project this activity is associated with. If not specific to any project, can be null.
   */
  projectId: uuid("project_id")
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .notNull()
    .$type(),

  /**
   * activityDate
   * The specific date (no time) on which the user performed some action.
   */
  activityDate: date("activity_date").notNull(),

  /**
   * activityType
   * e.g. chunk_completed, chunk_created, project_updated, etc.
   */
  activityType: activityTypeEnum("activity_type").notNull(),

  /**
   * relatedEntityId
   * Optionally track the ID of a chunk, resource, or other entity that was acted upon.
   */
  relatedEntityId: uuid("related_entity_id").notNull().$type(),

  /**
   * notes
   * Additional info about the activity.
   */
  notes: text("notes"),

  /**
   * createdAt
   */
  createdAt: timestamp("created_at").defaultNow().notNull()
})

export type InsertDailyActivityLog = typeof dailyActivityLogTable.$inferInsert
export type SelectDailyActivityLog = typeof dailyActivityLogTable.$inferSelect 