import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

export const getUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new ConvexError("Failed to get URL");
    }
    return url;
  },
});
