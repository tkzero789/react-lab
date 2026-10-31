/* Todo lists that group todos, with a per-user cap */

import { ConvexError, v } from "convex/values"
import type { Doc, Id } from "./_generated/dataModel"
import { mutation, query, type QueryCtx } from "./_generated/server"
import { getCurrentUserId } from "./users"
import { LIST_EMOJI, MAX_LIST_NAME_LENGTH, MAX_LISTS } from "../types/todo"

/* Build the regex at runtime because the web tsconfig target does not allow the v flag */
const SINGLE_EMOJI = new RegExp("^\\p{RGI_Emoji}$", "v")

export async function getOwnList(
  ctx: QueryCtx,
  userId: Id<"users">,
  id: Id<"todoLists">
) {
  const list = await ctx.db.get(id)
  if (!list || list.userId !== userId) {
    throw new ConvexError("List not found")
  }
  return list
}

function cleanName(value: string, otherLists: Doc<"todoLists">[]) {
  const name = value.trim()
  if (!name || name.length > MAX_LIST_NAME_LENGTH) {
    throw new ConvexError(
      `List name must be 1 to ${MAX_LIST_NAME_LENGTH} characters`
    )
  }
  if (otherLists.some((l) => l.name.toLowerCase() === name.toLowerCase())) {
    throw new ConvexError(`You already have a list named ${name}`)
  }
  return name
}

function cleanEmoji(value: string) {
  if (!SINGLE_EMOJI.test(value)) {
    throw new ConvexError("List emoji must be one emoji")
  }
  return value
}

async function listLists(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("todoLists")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect()
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) return []
    return await listLists(ctx, userId)
  },
})

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const lists = await listLists(ctx, userId)
    if (lists.length >= MAX_LISTS) {
      throw new ConvexError(`You can have up to ${MAX_LISTS} lists`)
    }

    return await ctx.db.insert("todoLists", {
      userId,
      name: cleanName(args.name, lists),
      emoji: LIST_EMOJI[lists.length % LIST_EMOJI.length],
    })
  },
})

export const rename = mutation({
  args: { id: v.id("todoLists"), name: v.string() },
  handler: async (ctx, { id, name }) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")
    await getOwnList(ctx, userId, id)

    const otherLists = (await listLists(ctx, userId)).filter(
      (l) => l._id !== id
    )
    await ctx.db.patch(id, { name: cleanName(name, otherLists) })
  },
})

export const setEmoji = mutation({
  args: { id: v.id("todoLists"), emoji: v.string() },
  handler: async (ctx, { id, emoji }) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")
    await getOwnList(ctx, userId, id)
    await ctx.db.patch(id, { emoji: cleanEmoji(emoji) })
  },
})

/* The todos stay. They only leave the list. */
export const remove = mutation({
  args: { id: v.id("todoLists") },
  handler: async (ctx, { id }) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")
    await getOwnList(ctx, userId, id)

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_list", (q) => q.eq("listId", id))
      .collect()
    for (const todo of todos) {
      await ctx.db.patch(todo._id, { listId: undefined })
    }
    await ctx.db.delete(id)
  },
})
