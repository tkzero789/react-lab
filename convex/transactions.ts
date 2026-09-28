/* Income and expense transactions for the finance app */

import { ConvexError, v, type Infer } from "convex/values"
import type { Id } from "./_generated/dataModel"
import { mutation, query, type MutationCtx } from "./_generated/server"
import { getOwnBudget } from "./budgets"
import { expenseInput, incomeInput } from "./schema"
import { getCurrentUserId } from "./users"
import { MAX_NOTE_LENGTH } from "../types/finance"

const MONTH_PATTERN = /^\d{4}-\d{2}$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const transactionInput = v.union(expenseInput, incomeInput)

async function cleanTransaction(
  ctx: MutationCtx,
  userId: Id<"users">,
  input: Infer<typeof transactionInput>
) {
  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    throw new ConvexError("Amount must be more than zero")
  }
  if (!DATE_PATTERN.test(input.date)) {
    throw new ConvexError("Date must use the yyyy-MM-dd format")
  }

  const note = input.note?.trim() || undefined
  if (note && note.length > MAX_NOTE_LENGTH) {
    throw new ConvexError(`Note must be ${MAX_NOTE_LENGTH} characters or less`)
  }

  if (input.type === "expense" && input.budgetId) {
    await getOwnBudget(ctx, userId, input.budgetId)
  }
  return { ...input, note, userId }
}

async function getOwnTransaction(
  ctx: MutationCtx,
  userId: Id<"users">,
  id: Id<"transactions">
) {
  const transaction = await ctx.db.get(id)
  if (!transaction || transaction.userId !== userId) {
    throw new ConvexError("Transaction not found")
  }
  return transaction
}

export const listByMonth = query({
  args: { month: v.string() },
  handler: async (ctx, { month }) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) return []
    if (!MONTH_PATTERN.test(month)) {
      throw new ConvexError("Month must use the yyyy-MM format")
    }

    /* Dates are yyyy-MM-dd strings, so every day of the month sorts inside this range */
    return await ctx.db
      .query("transactions")
      .withIndex("by_user_and_date", (q) =>
        q
          .eq("userId", userId)
          .gte("date", `${month}-01`)
          .lte("date", `${month}-31`)
      )
      .order("desc")
      .collect()
  },
})

export const add = mutation({
  args: { transaction: transactionInput },
  handler: async (ctx, { transaction }) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    return await ctx.db.insert(
      "transactions",
      await cleanTransaction(ctx, userId, transaction)
    )
  },
})

export const update = mutation({
  args: { id: v.id("transactions"), transaction: transactionInput },
  handler: async (ctx, { id, transaction }) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")
    await getOwnTransaction(ctx, userId, id)

    /* Replace, not patch. A change to income must remove budgetId and paymentMethod. */
    await ctx.db.replace(id, await cleanTransaction(ctx, userId, transaction))
  },
})

export const remove = mutation({
  args: { ids: v.array(v.id("transactions")) },
  handler: async (ctx, { ids }) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    for (const id of ids) {
      await getOwnTransaction(ctx, userId, id)
      await ctx.db.delete(id)
    }
  },
})

export const setBudget = mutation({
  args: {
    ids: v.array(v.id("transactions")),
    /* Omit to unassign */
    budgetId: v.optional(v.id("budgets")),
  },
  handler: async (ctx, { ids, budgetId }) => {
    const userId = await getCurrentUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")
    if (budgetId) await getOwnBudget(ctx, userId, budgetId)

    for (const id of ids) {
      const transaction = await getOwnTransaction(ctx, userId, id)
      if (transaction.type !== "expense") {
        throw new ConvexError("Only an expense can have a budget")
      }
      await ctx.db.patch(id, { budgetId })
    }
  },
})
