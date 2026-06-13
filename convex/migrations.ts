/**
 * Convex migrations — command reference
 * (runs against the DEV deployment unless you add `--prod`)
 *
 * Run a migration via its dedicated runner (no args needed):
 *   npx convex run migrations:run[function]
 *
 * Run a migration via the generic runner (PowerShell quoting):
 *   npx convex run migrations:run --% "{\"fn\": \"migrations:set[function]\"}"
 *
 * Run against production:
 *   npx convex run migrations:run[function] --prod
 *
 * Run a series of migrations in order:
 *   npx convex run migrations:run --% "{\"fn\": \"migrations:set[function]\", \"next\": [\"migrations:anotherMigration\"]}"
 *
 * Check a migration's status / progress:
 *   npx convex run migrations:run --% "{\"fn\": \"migrations:set[function]\", \"dryRun\": true}"
 *
 * Restart a migration from the beginning (clears saved progress):
 *   npx convex run migrations:run --% "{\"fn\": \"migrations:set[function]\", \"cursor\": null}"
 *
 * Cancel an in-progress migration:
 *   npx convex run migrations:cancel --% "{\"name\": \"migrations:set[function]\"}"
 *
 * After editing the schema/migration, push code so the runner exists:
 *   npx convex dev        (watch mode)   |   npx convex codegen   (one-off)
 *
 * You can also trigger any runner from the Convex dashboard → Functions tab.
 */

import { Migrations } from "@convex-dev/migrations"
import { components, internal } from "./_generated/api"
import { DataModel } from "./_generated/dataModel"

export const migrations = new Migrations<DataModel>(components.migrations)
export const run = migrations.runner()

export const setMigration = migrations.define({
  table: "todos",
  migrateOne: async (ctx, todo) => {
    await ctx.db.patch(todo._id, { location: "2" })
  },
})

export const runSetMigration = migrations.runner(
  internal.migrations.setMigration
)
