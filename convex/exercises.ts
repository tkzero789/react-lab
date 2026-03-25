import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserId } from "./users";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("exercises")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    muscleGroups: v.array(v.string()),
    personalBest: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("exercises", { ...args, userId });
  },
});

export const update = mutation({
  args: {
    id: v.id("exercises"),
    name: v.string(),
    muscleGroups: v.array(v.string()),
    personalBest: v.number(),
  },
  handler: async (ctx, { id, ...args }) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const exercise = await ctx.db.get(id);
    if (!exercise || exercise.userId !== userId)
      throw new Error("Not authorized");
    await ctx.db.patch(id, args);
  },
});

export const remove = mutation({
  args: { id: v.id("exercises") },
  handler: async (ctx, { id }) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const exercise = await ctx.db.get(id);
    if (!exercise || exercise.userId !== userId)
      throw new Error("Not authorized");
    // Also remove related workout logs
    const logs = await ctx.db
      .query("workoutLogs")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    for (const log of logs) {
      if (log.exerciseId === id) {
        await ctx.db.delete(log._id);
      }
    }
    await ctx.db.delete(id);
  },
});
