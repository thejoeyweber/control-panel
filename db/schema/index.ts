/**
 * @description
 * This file serves as a central export index for all Drizzle ORM schema definitions.
 * We import each table definition from its respective file and export them so
 * the rest of the app can reference them conveniently.
 *
 * Currently we have:
 * - profilesTable
 * - projectsTable
 * - workChunksTable
 */

export * from "./profiles-schema";
export * from "./projects-schema";
export * from "./work-chunks-schema";
