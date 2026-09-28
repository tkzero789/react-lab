import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserId } from "./users";

const setValidator = v.object({
  reps: v.number(),
  weight: v.number(),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("workoutLogs")
      .withIndex("by_user_and_date", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const listByDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("workoutLogs")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", userId).eq("date", date),
      )
      .collect();
  },
});

export const add = mutation({
  args: {
    date: v.string(),
    exerciseId: v.id("exercises"),
    sets: v.array(setValidator),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const exercise = await ctx.db.get(args.exerciseId);
    if (!exercise || exercise.userId !== userId) {
      throw new Error("Not authorized");
    }

    return await ctx.db.insert("workoutLogs", { ...args, userId });
  },
});

export const update = mutation({
  args: {
    id: v.id("workoutLogs"),
    sets: v.array(setValidator),
  },
  handler: async (ctx, { id, sets }) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const log = await ctx.db.get(id);
    if (!log || log.userId !== userId) throw new Error("Not authorized");
    await ctx.db.patch(id, { sets });
  },
});

export const remove = mutation({
  args: { id: v.id("workoutLogs") },
  handler: async (ctx, { id }) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const log = await ctx.db.get(id);
    if (!log || log.userId !== userId) throw new Error("Not authorized");
    await ctx.db.delete(id);
  },
});
