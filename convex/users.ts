import { mutation, query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { authComponent } from "./auth";
import { Id } from "./_generated/dataModel";

export async function getCurrentUserId(
  ctx: QueryCtx | MutationCtx,
): Promise<Id<"users"> | null> {
  const authUser = await authComponent.getAuthUser(ctx);
  if (!authUser) return null;
  const user = await ctx.db
    .query("users")
    .withIndex("by_authId", (q) => q.eq("authId", authUser._id))
    .unique();
  if (!user) return null;
  return user._id;
}

export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", authUser._id))
      .unique();

    if (existing) {
      return existing;
    }

    const userId = await ctx.db.insert("users", {
      authId: authUser._id,
      name: authUser.name ?? "",
      email: authUser.email,
      image: authUser.image ?? undefined,
      createdAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_authId", (q) => q.eq("authId", authUser._id))
      .unique();
  },
});
