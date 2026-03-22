import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserId } from "./users";

export const list = query({
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    return await ctx.db
      .query("dishes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const add = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    return await ctx.db.insert("dishes", { name: args.name, userId });
  },
});

export const remove = mutation({
  args: { id: v.id("dishes") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    const dish = await ctx.db.get(args.id);
    if (!dish || dish.userId !== userId) return;

    const ingredients = await ctx.db
      .query("ingredients")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
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
