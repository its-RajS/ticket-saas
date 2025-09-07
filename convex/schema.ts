import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    totalTickets: v.number(),
    location: v.string(),
    eventDate: v.number(), // Unix timestamp in milliseconds
    userId: v.string(),
    eventImgId: v.optional(v.id("_storage")),
    is_cancelled: v.optional(v.boolean()),
    // Additional fields that might be useful
    remainingTickets: v.optional(v.number()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  }),

  //! Tickets table to store ticket purchases
  tickets: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    purchaseDate: v.number(), // Unix timestamp in milliseconds
    quantity: v.number(),
    totalPrice: v.number(),
    userPaymentId: v.optional(v.string()),
    status: v.union(
      v.literal("valid"),
      v.literal("used"),
      v.literal("refunded"),
      v.literal("cancelled")
    ),
  })
    .index("by_eventId", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_paymentId", ["userPaymentId"])
    .index("by_user_event", ["userId", "eventId"]),

  //! Waiting List
  waitingList: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    status: v.union(
      v.literal("waiting"),
      v.literal("offered"),
      v.literal("purchased"),
      v.literal("expired")
    ),
    offerExpireAt: v.optional(v.number()),
  })
    .index("by_event_status", ["eventId", "status"])
    .index("by_user_event", ["eventId", "userId"])
    .index("by_user", ["userId"]),

  // Users table to store user information
  users: defineTable({
    userId: v.string(), // Clerk user ID
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    stripeConnectId: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"]),
});
