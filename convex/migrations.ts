/**
 * Convex migrations — command reference
 * (runs against the DEV deployment unless add `--prod`)
 *
 * Run a migration via its dedicated runner (no args needed):
 *   npx convex run migrations:runsetMigration
 *
 * Run a migration via the generic runner (PowerShell quoting):
 *   npx convex run migrations:run --% "{\"fn\": \"migrations:setMigration\"}"
 *
 * Run against production:
 *   npx convex run migrations:runsetMigration --prod
 *
 * Run a series of migrations in order:
 *   npx convex run migrations:run --% "{\"fn\": \"migrations:setMigration\", \"next\": [\"migrations:anotherMigration\"]}"
 *
 * Check a migration's status / progress:
 *   npx convex run migrations:run --% "{\"fn\": \"migrations:setMigration\", \"dryRun\": true, \"reset\": true}"
 *
 * Restart a migration from the beginning (clears saved progress):
 *   npx convex run migrations:run --% "{\"fn\": \"migrations:setMigration\", \"cursor\": null}"
 *
 * Cancel an in-progress migration:
 *   npx convex run migrations:cancel --% "{\"name\": \"migrations:setMigration\"}"
 *
 * After editing the schema/migration, push code so the runner exists:
 *   npx convex dev        (watch mode)   |   npx convex codegen   (one-off)
 **/

import { Migrations } from "@convex-dev/migrations"
import { components, internal } from "./_generated/api"
import { DataModel } from "./_generated/dataModel"

export const migrations = new Migrations<DataModel>(components.migrations)
export const run = migrations.runner()

export const setMigration = migrations.define({
  table: "todos",
  migrateOne: async (ctx, todo) => {
    await ctx.db.patch("todos", todo._id, { text: "" })
  },
})

export const runSetMigration = migrations.runner(
  internal.migrations.setMigration
)
