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
      .withIndex("by_userId", (q) => q.eq("userId", userId))
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
      .withIndex("by_userId_date", (q) =>
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

    const logId = await ctx.db.insert("workoutLogs", { ...args, userId });

    // Auto-update personal best if any set weight exceeds it
    const exercise = await ctx.db.get(args.exerciseId);
    if (exercise) {
      const maxWeight = Math.max(...args.sets.map((s) => s.weight));
      if (maxWeight > exercise.personalBest) {
        await ctx.db.patch(args.exerciseId, { personalBest: maxWeight });
      }
    }

    return logId;
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

    // Auto-update personal best
    const exercise = await ctx.db.get(log.exerciseId);
    if (exercise) {
      const maxWeight = Math.max(...sets.map((s) => s.weight));
      if (maxWeight > exercise.personalBest) {
        await ctx.db.patch(log.exerciseId, { personalBest: maxWeight });
      }
    }
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
