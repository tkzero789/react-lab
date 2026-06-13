import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),

  // Todo
  todos: defineTable({
    userId: v.id("users"),
    status: v.union(v.literal("todo"), v.literal("completed")),
    text: v.string(),
    date: v.optional(v.number()),
    location: v.string(),
    url: v.string(),
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
  }),

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
  }).index("by_user_and_date", ["userId", "date"]),
})
