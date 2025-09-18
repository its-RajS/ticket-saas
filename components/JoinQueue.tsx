"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import React from "react";
import { toast } from "sonner";
import Spinner from "./Spinner";

const JoinQueue = ({
  eventId,
  userId,
}: {
  eventId: Id<"events">;
  userId: Id<"users">;
}) => {
  const joinQueue = useMutation(api.events.joinWaitingList);
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId,
  });
  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId,
  });
  const availability = useQuery(api.events.getEventAvailable, {
    eventId,
  });

  const event = useQuery(api.events.getEventById, { eventId });

  const isEventOwner = event?.userId === userId;

  const handleJoinQueue = async () => {
    try {
      const res = await joinQueue({ userId, eventId });
      if (res?.success) {
        toast.success("Successfully joined waiting list", {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (
        error instanceof ConvexError &&
        error.message.includes("joined the waiting list too many times")
      ) {
        toast.warning(
          "You have already joined the waiting list too many times",
          {
            duration: 5000,
            position: "top-center",
          }
        );
      } else {
        toast.error("Oops, something went wrong", {
          description: "Failed to join the queue. Please try again.",
          duration: 5000,
          position: "top-center",
        });
      }
    }
  };

  if (queuePosition === undefined || availability === undefined || !event) {
    return <Spinner />;
  }

  //* The user have a ticket for the event
  if (userTicket) return null;

  const isPastEvent = event?.eventDate < Date.now();

  return <div>JoinQueue</div>;
};

export default JoinQueue;
