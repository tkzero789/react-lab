import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),

  // Todo
  todos: defineTable({
    text: v.optional(v.string()),
    userId: v.id("users"),
  }),

  // Grocery
  dishes: defineTable({
    name: v.string(),
    userId: v.id("users"),
  }),
  ingredients: defineTable({
    name: v.string(),
    quantity: v.string(),
    price: v.number(),
    checked: v.boolean(),
    dishIds: v.array(v.id("dishes")),
    userId: v.id("users"),
  }),

  // Workout
  exercises: defineTable({
    name: v.string(),
    muscleGroups: v.array(v.string()),
    personalBest: v.number(),
    userId: v.id("users"),
  }),

  workoutLogs: defineTable({
    date: v.string(),
    exerciseId: v.id("exercises"),
    sets: v.array(
      v.object({
        reps: v.number(),
        weight: v.number(),
      }),
    ),
    userId: v.id("users"),
  }),
});
