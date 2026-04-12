import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

// export const setNameUnset = migrations.define({
//   table: "todos",
//   migrateOne: async (ctx, todo) => {
//     await ctx.db.patch(todo._id, { name: undefined });
//   },
// });

// export const runSetNameUnset = migrations.runner(
//   internal.migrations.setNameUnset,
// );
