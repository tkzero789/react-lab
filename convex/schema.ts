import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

const transactionFields = {
  amountCents: v.number(),
  date: v.string(),
  note: v.optional(v.string()),
}

export const expenseInput = v.object({
  ...transactionFields,
  type: v.literal("expense"),
  budgetId: v.optional(v.id("budgets")),
  paymentMethod: v.union(
    v.literal("credit"),
    v.literal("debit"),
    v.literal("cash")
  ),
})

export const incomeInput = v.object({
  ...transactionFields,
  type: v.literal("income"),
})

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),

  // File
  files: defineTable({
    body: v.string(),
    author: v.string(),
    format: v.string(),
  }),

  // Todo
  todos: defineTable({
    userId: v.id("users"),
    status: v.union(v.literal("todo"), v.literal("completed")),
    text: v.string(),
    date: v.number(),
    location: v.string(),
    image: v.array(v.string()),
  }).index("by_user", ["userId"]),

  // Grocery
  dishes: defineTable({
    userId: v.id("users"),
    name: v.string(),
  }).index("by_user", ["userId"]),
  ingredients: defineTable({
    userId: v.id("users"),
    name: v.string(),
    quantity: v.string(),
    price: v.number(),
    checked: v.boolean(),
    dishIds: v.array(v.id("dishes")),
  }).index("by_user", ["userId"]),

  // Workout
  exercises: defineTable({
    userId: v.id("users"),
    name: v.string(),
    muscleGroups: v.array(v.string()),
    personalBest: v.number(),
    thumbnail: v.optional(v.id("_storage")),
  }).index("by_user", ["userId"]),

  workoutLogs: defineTable({
    userId: v.id("users"),
    date: v.string(),
    exerciseId: v.id("exercises"),
    sets: v.array(
      v.object({
        reps: v.number(),
        weight: v.number(),
      })
    ),
  })
    .index("by_user_and_date", ["userId", "date"])
    .index("by_exercise", ["exerciseId"]),

  budgets: defineTable({
    userId: v.id("users"),
    name: v.string(),
    monthlyLimitCents: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  /* The union lets only an expense have a budget and a payment method */
  transactions: defineTable(
    v.union(
      expenseInput.extend({ userId: v.id("users") }),
      incomeInput.extend({ userId: v.id("users") })
    )
  )
    .index("by_user_and_date", ["userId", "date"])
    .index("by_budget", ["budgetId"]),
})
