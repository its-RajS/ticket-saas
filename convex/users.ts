import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get the current user
export const updateUser = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    //? Checl if user exists
    const existUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existUser) {
      await ctx.db.patch(existUser._id, {
        name: args.name,
        email: args.email,
      });
      return existUser._id;
    }

    //? Create a new user if not exists
    if (!existUser) {
      const newUser = await ctx.db.insert("users", {
        userId: args.userId,
        name: args.name,
        email: args.email,
        stripeConnectId: undefined,
      });
      return newUser;
    }
  },
});