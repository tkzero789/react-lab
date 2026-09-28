/* Budgets for the finance app, with a monthly limit and a per-user cap */

import { ConvexError, v } from "convex/values"
import type { Doc, Id } from "./_generated/dataModel"
import { mutation, query, type QueryCtx } from "./_generated/server"
import { getCurrentUserId } from "./users"
import { MAX_BUDGETS, MAX_NAME_LENGTH } from "../types/finance"

export async function getOwnBudget(
  ctx: QueryCtx,
  userId: Id<"users">,
  id: Id<"budgets">
) {
  const budget = await ctx.db.get(id)
  if (!budget || budget.userId !== userId) {
    throw new ConvexError("Budget not found")
  }
  return budget
}

function cleanBudget(
  args: { name: string; monthlyLimitCents?: number },
  otherBudgets: Doc<"budgets">[]
) {
  const name = args.name.trim()
  if (!name || name.length > MAX_NAME_LENGTH) {
    throw new ConvexError(
      `Budget name must be 1 to ${MAX_NAME_LENGTH} characters`
    )
  }
  if (otherBudgets.some((b) => b.name.toLowerCase() === name.toLowerCase())) {
    throw new ConvexError(`You already have a budget named ${name}`)
  }

  const limit = args.monthlyLimitCents
  if (limit !== undefined && (!Number.isInteger(limit) || limit <= 0)) {
    throw new ConvexError("Monthly limit must be more than zero")
  }
  return { name, monthlyLimitCents: limit }
}

async function listBudgets(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("budgets")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect()
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) return []
    return await listBudgets(ctx, userId)
  },
})

/* Counts every month, because a delete removes the budget from all months */
export const transactionCount = query({
  args: { id: v.id("budgets") },
  handler: async (ctx, { id }) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) return 0
    await getOwnBudget(ctx, userId, id)

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_budget", (q) => q.eq("budgetId", id))
      .collect()
    return transactions.length
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    monthlyLimitCents: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    /* A mutation is a serializable transaction. Two parallel creates cannot both pass this check. */
    const budgets = await listBudgets(ctx, userId)
    if (budgets.length >= MAX_BUDGETS) {
      throw new ConvexError(`You can have up to ${MAX_BUDGETS} budgets`)
    }

    return await ctx.db.insert("budgets", {
      ...cleanBudget(args, budgets),
      userId,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("budgets"),
    name: v.string(),
    /* Omit to remove the limit */
    monthlyLimitCents: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...args }) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")
    await getOwnBudget(ctx, userId, id)

    const otherBudgets = (await listBudgets(ctx, userId)).filter(
      (b) => b._id !== id
    )
    await ctx.db.patch(id, cleanBudget(args, otherBudgets))
  },
})

export const remove = mutation({
  args: {
    id: v.id("budgets"),
    /* Omit to leave the transactions unassigned */
    moveTo: v.optional(v.id("budgets")),
  },
  handler: async (ctx, { id, moveTo }) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")
    await getOwnBudget(ctx, userId, id)
    if (moveTo) {
      if (moveTo === id) {
        throw new ConvexError("Move the transactions to a different budget")
      }
      await getOwnBudget(ctx, userId, moveTo)
    }

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_budget", (q) => q.eq("budgetId", id))
      .collect()
    for (const transaction of transactions) {
      await ctx.db.patch(transaction._id, { budgetId: moveTo })
    }
    await ctx.db.delete(id)
  },
})
