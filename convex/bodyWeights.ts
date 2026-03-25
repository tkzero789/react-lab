import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserId } from "./users";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("bodyWeights")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const upsert = mutation({
  args: {
    date: v.string(),
    weight: v.number(),
  },
  handler: async (ctx, { date, weight }) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db
      .query("bodyWeights")
      .withIndex("by_userId_date", (q) =>
        q.eq("userId", userId).eq("date", date),
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { weight });
      return existing._id;
    }
    return await ctx.db.insert("bodyWeights", { date, weight, userId });
  },
});

export const remove = mutation({
  args: { id: v.id("bodyWeights") },
  handler: async (ctx, { id }) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const entry = await ctx.db.get(id);
    if (!entry || entry.userId !== userId) throw new Error("Not authorized");
    await ctx.db.delete(id);
  },
});
