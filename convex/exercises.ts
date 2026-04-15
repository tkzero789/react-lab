import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.query("exercises").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    muscleGroups: v.array(v.string()),
    personalBest: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("exercises", {
      ...args,
      userId: user._id,
    });
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
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) {
      throw new ConvexError("User not found");
    }

    const exercise = await ctx.db.get(id);
    if (!exercise || exercise.userId !== user._id) {
      throw new ConvexError("Exercise not found or not owned by any user");
    }

    await ctx.db.patch(id, args);
  },
});

export const remove = mutation({
  args: { id: v.id("exercises") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) {
      throw new ConvexError("User not found");
    }

    const exercise = await ctx.db.get(args.id);
    if (!exercise || exercise.userId !== user._id) {
      throw new ConvexError("Exercise not found or not owned by any user");
    }

    const logs = await ctx.db.query("workoutLogs").collect();
    for (const log of logs) {
      if (log.exerciseId === args.id) {
        await ctx.db.delete(log._id);
      }
    }

    await ctx.db.delete(args.id);
  },
});
