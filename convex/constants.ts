import { TURBOPACK_CLIENT_BUILD_MANIFEST } from "next/dist/shared/lib/constants";
import { Doc } from "./_generated/dataModel";

//? Ticket status
export const TICKET_STATUS: Record<string, Doc<"tickets">["status"]> = {
  VALID: "valid",
  USED: "used",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
} as const;

export const WAITINGLIST_STATUS: Record<string, Doc<"waitingList">["status"]> =
  {
    WAITING: "waiting",
    OFFERED: "offered",
    PURCHASED: "purchased",
    EXPIRED: "expired",
  } as const;

export const DURATION = {
  TICKET_OFFER: 30 * 60 * 1000, //30 min
} as const;
