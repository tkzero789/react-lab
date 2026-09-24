import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type QueryCtx } from "./_generated/server";

/* The upload URL accepts any file type, so the server checks it again */
async function assertImage(ctx: QueryCtx, storageId: Id<"_storage">) {
  const metadata = await ctx.db.system.get("_storage", storageId);
  if (!metadata?.contentType?.startsWith("image/")) {
    throw new ConvexError("Thumbnail must be an image");
  }
}

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

    const exercises = await ctx.db.query("exercises").collect();
    return await Promise.all(
      exercises.map(async (exercise) => ({
        ...exercise,
        thumbnailUrl: exercise.thumbnail
          ? await ctx.storage.getUrl(exercise.thumbnail)
          : null,
      })),
    );
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    muscleGroups: v.array(v.string()),
    personalBest: v.number(),
    thumbnail: v.optional(v.id("_storage")),
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

    if (args.thumbnail) await assertImage(ctx, args.thumbnail);

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
    /* Omit to keep the current image. Send null to remove it. */
    thumbnail: v.optional(v.union(v.id("_storage"), v.null())),
  },
  handler: async (ctx, { id, thumbnail, ...args }) => {
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

    if (thumbnail === undefined) {
      await ctx.db.patch(id, args);
      return;
    }

    if (thumbnail) await assertImage(ctx, thumbnail);
    if (exercise.thumbnail && exercise.thumbnail !== thumbnail) {
      await ctx.storage.delete(exercise.thumbnail);
    }
    /* Convex removes a field when the patch sets it to undefined */
    await ctx.db.patch(id, { ...args, thumbnail: thumbnail ?? undefined });
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

    if (exercise.thumbnail) await ctx.storage.delete(exercise.thumbnail);
    await ctx.db.delete(args.id);
  },
});
