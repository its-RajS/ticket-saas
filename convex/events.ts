import { ConvexError, v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { DURATION, TICKET_STATUS, WAITINGLIST_STATUS } from "./constants";
import { api, internal } from "./_generated/api";

export const getEvents = query({
  args: {},
  handler: async (ctx) => {
    try {
      console.log("Fetching events from database...");
      const events = await ctx.db
        .query("events")
        .filter((event) => event.neq(event.field("is_cancelled"), true))
        .collect();

      console.log(`Found ${events.length} events:`, events);
      return events;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw new ConvexError("Failed to fetch events");
    }
  },
});

export const getEventById = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    try {
      const event = await ctx.db.get(args.eventId);
      return event;
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      throw new ConvexError("Event not found");
    }
  },
});

export const getEventAvailable = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    try {
      const event = await ctx.db.get(args.eventId);
      if (!event) {
        throw new ConvexError("Event not found");
      }

      // total no. of purchased tickets
      const purchasedTickets = await ctx.db
        .query("tickets")
        .filter((ticket) => ticket.eq(ticket.field("eventId"), args.eventId))
        .collect()
        .then(
          (tickets) =>
            tickets.filter(
              (ticket) =>
                ticket.status === TICKET_STATUS.VALID ||
                ticket.status === TICKET_STATUS.USED
            ).length
        );

      // total no. of valid offered tickets
      const nowTime = Date.now();
      const validOfferedTickets = await ctx.db
        .query("waitingList")
        .withIndex("by_event_status", (ticket) =>
          ticket
            .eq("eventId", args.eventId)
            .eq("status", WAITINGLIST_STATUS.OFFERED)
        )
        .collect()
        .then(
          (tickets) =>
            tickets.filter(
              (ticket) => ticket.offerExpireAt && ticket.offerExpireAt > nowTime
            ).length
        );

      const totalReserved = purchasedTickets + validOfferedTickets;
      const result = {
        isSold: totalReserved >= event.totalTickets,
        totalTickets: event.totalTickets,
        purchasedTickets,
        validOfferedTickets,
        remainingTickets: Math.max(0, event.totalTickets - totalReserved),
      };
      return result;
    } catch (error) {
      throw new ConvexError("Failed to check event availability");
    }
  },
});

export const joinWaitingList = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      //? Check weather the user is already in the waiting list
      const existingUser = await ctx.db
        .query("waitingList")
        .withIndex("by_user_event", (q) =>
          q.eq("eventId", args.eventId).eq("userId", args.userId)
        )
        .filter((q) => q.neq(q.field("status"), WAITINGLIST_STATUS.EXPIRED))
        .first();

      //? Dont allow if user is already in the waiting list
      if (existingUser) {
        throw new ConvexError("Already in the waiting list for this event");
      }
      //? verify the event exists
      const event = await ctx.db.get(args.eventId);
      if (!event) {
        throw new ConvexError("Event not found");
      }

      //? check avaibility
      const { remainingTickets } = await ctx.runQuery(
        api.events.getEventAvailable,
        {
          eventId: args.eventId,
        }
      );

      if (remainingTickets > 0) {
        //? tickets are available, create an offer entry
        const waitingListId = await ctx.db.insert("waitingList", {
          eventId: args.eventId,
          userId: args.userId,
          status: WAITINGLIST_STATUS.OFFERED, //* Mark as offered
          offerExpireAt: Date.now() + DURATION.TICKET_OFFER,
        });

        //! Schedule a job to expire the offer afterthe expireTime
        await ctx.scheduler.runAfter(
          DURATION.TICKET_OFFER,
          internal.waitingList.expireOffer,
          {
            waitingListId,
            eventId: args.eventId,
          }
        );
        return {
          success: true,
          status: WAITINGLIST_STATUS.OFFERED,
          message: `Ticket offered - ${DURATION.TICKET_OFFER / 60000} min to purchase`,
          waitingListId,
        };
      } else {
        // NO tickets available add to awaiting list
        await ctx.db.insert("waitingList", {
          eventId: args.eventId,
          userId: args.userId,
          status: WAITINGLIST_STATUS.WAITING, //* Mark as waiting
        });
        return {
          success: true,
          status: WAITINGLIST_STATUS.WAITING,
          message: "Added to waiting list - check queue position",
        };
      }
    } catch (error) {
      throw new ConvexError("Failed to check event availability");
    }
  },
});
