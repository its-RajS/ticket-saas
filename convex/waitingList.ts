import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { WAITINGLIST_STATUS } from "./constants";

export const getQueuePosition = query({
  args: {
    eventId: v.id("events"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    //? get position for this exact user for this event
    const userEntry = await ctx.db
      .query("waitingList")
      .withIndex("by_user_event", (q) =>
        q.eq("eventId", args.eventId).eq("userId", args.userId)
      )
      .filter((stat) =>
        stat.neq(stat.field("status"), WAITINGLIST_STATUS.EXPIRED)
      )
      .first();

    if (!userEntry) return null;

    //? Peoples ahead
    const peopleAhead = await ctx.db
      .query("waitingList")
      .withIndex("by_event_status", (q) => q.eq("eventId", args.eventId))
      .filter((q) =>
        q.and(
          //* Get all entries brfore this user entry
          q.lt(q.field("_creationTime"), userEntry._creationTime),
          //* Only get entries that are either waiting or offered
          q.or(
            q.eq(q.field("status"), WAITINGLIST_STATUS.WAITING),
            q.eq(q.field("status"), WAITINGLIST_STATUS.OFFERED)
          )
        )
      )
      .collect()
      .then((entries) => entries.length);

    return {
      ...userEntry,
      position: peopleAhead + 1,
    };
  },
});
