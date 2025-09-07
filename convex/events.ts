import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { TICKET_STATUS, WAITINGLIST_STATUS } from "./constants";

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
      console.log(`Fetching event with ID: ${args.eventId}`);
      const event = await ctx.db.get(args.eventId);
      console.log("Event found:", event);
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
      console.log(`Checking availability for event: ${args.eventId}`);
      const event = await ctx.db.get(args.eventId);
      if (!event) {
        console.error("Event not found for availability check");
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

      console.log("Availability result:", result);
      return result;
    } catch (error) {
      console.error("Error checking event availability:", error);
      throw new ConvexError("Failed to check event availability");
    }
  },
});
