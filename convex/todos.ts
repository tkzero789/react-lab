import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getCurrentUserId } from "./users"

export const list = query({
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) return []

    return await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
  },
})

export const add = mutation({
  args: {
    text: v.string(),
    date: v.number(),
    location: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    return await ctx.db.insert("todos", {
      userId,
      text: args.text,
      status: "todo",
      date: args.date,
      location: args.location,
      url: args.url,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("todos"),
    text: v.string(),
    date: v.number(),
    location: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const todo = await ctx.db.get(args.id)
    if (!todo || todo.userId !== userId) {
      throw new ConvexError("Todo not found")
    }

    return await ctx.db.patch(args.id, {
      text: args.text,
      date: args.date,
      location: args.location,
      url: args.url,
    })
  },
})

export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const todo = await ctx.db.get(args.id)
    if (!todo || todo.userId !== userId) {
      throw new ConvexError("Todo not found")
    }

    await ctx.db.delete(args.id)
  },
})
