import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("ingredients").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    quantity: v.string(),
    price: v.number(),
    dishIds: v.array(v.id("dishes")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ingredients", {
      name: args.name,
      quantity: args.quantity,
      price: args.price,
      checked: false,
      dishIds: args.dishIds,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("ingredients"),
    name: v.string(),
    quantity: v.string(),
    price: v.number(),
    dishIds: v.array(v.id("dishes")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      quantity: args.quantity,
      price: args.price,
      dishIds: args.dishIds,
    });
  },
});

export const toggleChecked = mutation({
  args: { id: v.id("ingredients") },
  handler: async (ctx, args) => {
    const ingredient = await ctx.db.get(args.id);
    if (!ingredient) return;
    await ctx.db.patch(args.id, { checked: !ingredient.checked });
  },
});

export const remove = mutation({
  args: { id: v.id("ingredients") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const removeAll = mutation({
  handler: async (ctx) => {
    const ingredients = await ctx.db.query("ingredients").collect();
    for (const ingredient of ingredients) {
      await ctx.db.delete(ingredient._id);
    }
    const dishes = await ctx.db.query("dishes").collect();
    for (const dish of dishes) {
      await ctx.db.delete(dish._id);
    }
  },
});
