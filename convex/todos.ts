import { ConvexError, v } from "convex/values"
import type { Doc, Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import { getCurrentUserId } from "./users"
import { deleteFiles, getFileObject } from "./files"
import { coordinatesInput } from "./schema"
import { getOwnList } from "./todoLists"

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
    coordinates: v.optional(coordinatesInput),
    image: v.optional(v.array(v.id("_storage"))),
    listId: v.optional(v.id("todoLists")),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")
    if (args.listId) await getOwnList(ctx, userId, args.listId)

    return await ctx.db.insert("todos", {
      userId,
      text: args.text,
      status: "todo",
      date: args.date,
      location: args.location,
      coordinates: args.location ? args.coordinates : undefined,
      image: args.image ? args.image : [],
      listId: args.listId,
    })
  },
})

/* Every field is optional, so an autosave sends only the field that changed */
export const update = mutation({
  args: {
    id: v.id("todos"),
    text: v.optional(v.string()),
    date: v.optional(v.number()),
    location: v.optional(v.string()),
    /* Null removes the pin */
    coordinates: v.optional(v.union(coordinatesInput, v.null())),
    image: v.optional(v.array(v.id("_storage"))),
    /* Null takes the todo out of its list */
    listId: v.optional(v.union(v.id("todoLists"), v.null())),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const todo = await ctx.db.get(args.id)
    if (!todo || todo.userId !== userId) {
      throw new ConvexError("Todo not found")
    }
    if (args.listId) await getOwnList(ctx, userId, args.listId)

    if (args.image !== undefined) {
      const kept = new Set<string>(args.image)
      await deleteFiles(
        ctx,
        todo.image.filter((id) => !kept.has(id))
      )
    }

    /* Patch removes a field set to undefined. Send listId and coordinates only when they change. */
    const { id, listId, coordinates, ...fields } = args
    const patch: Partial<Doc<"todos">> = fields
    if (listId !== undefined) patch.listId = listId ?? undefined

    /* The mobile app sends the location on every save. Only new text without a pin drops the old pin. */
    const isNewText =
      args.location !== undefined && args.location !== todo.location
    if (coordinates !== undefined) patch.coordinates = coordinates ?? undefined
    else if (isNewText) patch.coordinates = undefined

    return await ctx.db.patch(id, patch)
  },
})

export const setStatus = mutation({
  args: {
    id: v.id("todos"),
    status: v.union(v.literal("todo"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const todo = await ctx.db.get(args.id)
    if (!todo || todo.userId !== userId) {
      throw new ConvexError("Todo not found")
    }

    return await ctx.db.patch(args.id, { status: args.status })
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

    await deleteFiles(ctx, todo.image)
    await ctx.db.delete(args.id)
  },
})
