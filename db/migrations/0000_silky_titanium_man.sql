CREATE TYPE "public"."activity_type" AS ENUM('chunk_completed', 'chunk_modified', 'chunk_created', 'project_updated', 'resource_added', 'prompt_used', 'manual_log');--> statement-breakpoint
CREATE TYPE "public"."feedback_type" AS ENUM('rejected', 'modified', 'accepted');--> statement-breakpoint
CREATE TYPE "public"."generation_source" AS ENUM('ai_suggestion', 'user_created', 'template');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('active', 'paused', 'archived', 'completed');--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('url', 'internal_note');--> statement-breakpoint
CREATE TYPE "public"."rule_source" AS ENUM('user_defined', 'ai_suggested');--> statement-breakpoint
CREATE TYPE "public"."work_chunk_status" AS ENUM('suggested', 'accepted', 'in_progress', 'completed', 'completed_modified', 'deferred', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."membership" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"membership" "membership" DEFAULT 'free' NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"project_type_id" uuid,
	"summary" text NOT NULL,
	"objectives" jsonb,
	"key_outcomes" jsonb,
	"constraints" text,
	"context_notes" text,
	"status" "project_status" DEFAULT 'active' NOT NULL,
	"archived_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"project_vector" varchar(1024),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"notes" text,
	"status" "work_chunk_status" DEFAULT 'suggested' NOT NULL,
	"completed_at" timestamp with time zone NOT NULL,
	"deferred_until" timestamp with time zone NOT NULL,
	"cancellation_reason" text,
	"completion_modification_notes" text,
	"generation_source" "generation_source" DEFAULT 'user_created' NOT NULL,
	"ai_prompt_context" jsonb,
	"ai_model_used" text,
	"feedback_rating" integer NOT NULL,
	"feedback_comments" text,
	"n8n_action_workflow_id" text,
	"n8n_action_parameters" jsonb,
	"chunk_vector" varchar(1024) NOT NULL,
	"sequence_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" "resource_type" NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"description" text,
	"tags" jsonb,
	"resource_vector" varchar(1024) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_resources" (
	"project_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_chunk_resources" (
	"work_chunk_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"prompt_text" text NOT NULL,
	"description" text,
	"variables" jsonb,
	"tags" jsonb,
	"target_ai_model" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_chunk_prompts" (
	"work_chunk_id" uuid NOT NULL,
	"prompt_id" uuid NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"project_id" uuid NOT NULL,
	"rule_text" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"source" "rule_source" DEFAULT 'user_defined' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chunk_feedback_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chunk_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"project_id" uuid NOT NULL,
	"feedback_type" "feedback_type" NOT NULL,
	"rejection_reason" text,
	"modification_details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"project_id" uuid NOT NULL,
	"activity_date" date NOT NULL,
	"activity_type" "activity_type" NOT NULL,
	"related_entity_id" uuid NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_project_type_id_project_types_id_fk" FOREIGN KEY ("project_type_id") REFERENCES "public"."project_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_chunks" ADD CONSTRAINT "work_chunks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_resources" ADD CONSTRAINT "project_resources_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_resources" ADD CONSTRAINT "project_resources_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_chunk_resources" ADD CONSTRAINT "work_chunk_resources_work_chunk_id_work_chunks_id_fk" FOREIGN KEY ("work_chunk_id") REFERENCES "public"."work_chunks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_chunk_resources" ADD CONSTRAINT "work_chunk_resources_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_chunk_prompts" ADD CONSTRAINT "work_chunk_prompts_work_chunk_id_work_chunks_id_fk" FOREIGN KEY ("work_chunk_id") REFERENCES "public"."work_chunks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_chunk_prompts" ADD CONSTRAINT "work_chunk_prompts_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rules" ADD CONSTRAINT "rules_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chunk_feedback_log" ADD CONSTRAINT "chunk_feedback_log_chunk_id_work_chunks_id_fk" FOREIGN KEY ("chunk_id") REFERENCES "public"."work_chunks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chunk_feedback_log" ADD CONSTRAINT "chunk_feedback_log_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_activity_log" ADD CONSTRAINT "daily_activity_log_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;