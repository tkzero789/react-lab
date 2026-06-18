import { ConvexError, v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import { getCurrentUserId } from "./users"
import { getFileObject } from "./files"

export const list = query({
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) return []

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()

    return await Promise.all(
      todos.map(async (todo) => {
        const imageObject = await Promise.all(
          todo.image.map((item) => getFileObject(ctx, item as Id<"_storage">))
        )

        return {
          ...todo,
          imageObject,
        }
      })
    )
  },
})

export const add = mutation({
  args: {
    text: v.string(),
    date: v.number(),
    location: v.string(),
    url: v.string(),
    image: v.optional(v.array(v.id("_storage"))),
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
      image: args.image ? args.image : [],
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
    image: v.optional(v.array(v.id("_storage"))),
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
      ...(args.image !== undefined && { image: args.image }),
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
