/**
 * @file rules-schema.ts
 * @description
 * Defines a "rules" table that stores user/AI rules for influencing future suggestions.
 *
 * Key columns:
 * - id (PK, UUID)
 * - userId
 * - projectId (nullable FK => projects.id)
 * - ruleText (the actual rule string)
 * - isActive (boolean)
 * - source (enum => ruleSourceEnum)
 * - createdAt, updatedAt
 */

import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core"
import { projectsTable } from "./projects-schema"
import { ruleSourceEnum } from "./enums"

export const rulesTable = pgTable("rules", {
  /**
   * id
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * userId
   * The user who created/owns the rule.
   */
  userId: text("user_id").notNull(),

  /**
   * projectId
   * If the rule is project-specific, references that project. Otherwise, can be null for global rules.
   */
  projectId: uuid("project_id")
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .notNull()
    .$type(),

  /**
   * ruleText
   * The textual representation of the rule.
   */
  ruleText: text("rule_text").notNull(),

  /**
   * isActive
   * Whether this rule is currently active or not.
   */
  isActive: boolean("is_active").default(true).notNull(),

  /**
   * source
   * Whether the rule came from user-defined or AI-suggested.
   */
  source: ruleSourceEnum("source").default("user_defined").notNull(),

  /**
   * createdAt, updatedAt
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertRule = typeof rulesTable.$inferInsert
export type SelectRule = typeof rulesTable.$inferSelect 