import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("dishes").collect();
  },
});

export const add = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dishes", { name: args.name });
  },
});

// Remove dish reference from all ingredients
export const remove = mutation({
  args: { id: v.id("dishes") },
  handler: async (ctx, args) => {
    const ingredients = await ctx.db.query("ingredients").collect();
    for (const ingredient of ingredients) {
      if (ingredient.dishIds.includes(args.id)) {
        await ctx.db.patch(ingredient._id, {
          dishIds: ingredient.dishIds.filter((id) => id !== args.id),
        });
      }
    }
    await ctx.db.delete(args.id);
  },
});
