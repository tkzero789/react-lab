import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_authId", ["authId"])
    .index("by_email", ["email"]),
  dishes: defineTable({
    name: v.string(),
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),
  ingredients: defineTable({
    name: v.string(),
    quantity: v.string(),
    price: v.number(),
    checked: v.boolean(),
    dishIds: v.array(v.id("dishes")),
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),
});
