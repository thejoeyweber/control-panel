/**
 * @file enums.ts
 * @description
 * This file defines all custom PostgreSQL enums used throughout the expanded schema.
 * We use Drizzle's pgEnum helper to implement typed enum columns in our tables.
 *
 * @dependencies
 * - drizzle-orm/pg-core for pgEnum
 *
 * @notes
 * - Each enum is exported so it can be used wherever needed.
 * - We'll reference these enums in the table definitions for statuses, sources, etc.
 */

import { pgEnum } from "drizzle-orm/pg-core"

/**
 * projectStatusEnum
 * Represents the current status of a project (active, paused, archived, completed).
 */
export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "paused",
  "archived",
  "completed"
])

/**
 * workChunkStatusEnum
 * Represents the status of a work chunk (suggested, accepted, in_progress, completed, etc.).
 */
export const workChunkStatusEnum = pgEnum("work_chunk_status", [
  "suggested",
  "accepted",
  "in_progress",
  "completed",
  "completed_modified",
  "deferred",
  "canceled"
])

/**
 * generationSourceEnum
 * Indicates how a chunk was generated (AI suggestion, user-created, template).
 */
export const generationSourceEnum = pgEnum("generation_source", [
  "ai_suggestion",
  "user_created",
  "template"
])

/**
 * ruleSourceEnum
 * Indicates the origin of a rule (user_defined, ai_suggested).
 */
export const ruleSourceEnum = pgEnum("rule_source", ["user_defined", "ai_suggested"])

/**
 * feedbackTypeEnum
 * Denotes the kind of feedback a user gave for chunk suggestions (rejected, modified, accepted).
 */
export const feedbackTypeEnum = pgEnum("feedback_type", [
  "rejected",
  "modified",
  "accepted"
])

/**
 * resourceTypeEnum
 * Classifies the resource as either a URL or internal note, etc.
 */
export const resourceTypeEnum = pgEnum("resource_type", ["url", "internal_note"])

/**
 * activityTypeEnum
 * Logs which type of activity occurred for daily activity tracking.
 */
export const activityTypeEnum = pgEnum("activity_type", [
  "chunk_completed",
  "chunk_modified",
  "chunk_created",
  "project_updated",
  "resource_added",
  "prompt_used",
  "manual_log"
]) 