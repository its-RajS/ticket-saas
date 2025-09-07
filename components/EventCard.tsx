"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function useStorageUrl(storageId: Id<"_storage"> | "undefined") {
  return useQuery(
    api.storage.getUrl,
    storageId !== "undefined" ? { storageId } : "skip"
  );
}

const EventCard = ({ eventId }: { eventId: Id<"events"> }) => {
  const { user } = useUser();
  const router = useRouter();
  const event = useQuery(api.events.getEventById, { eventId });
  const availability = useQuery(api.events.getEventAvailable, { eventId });

  // Debug logging
  useEffect(() => {
    console.log(`EventCard ${eventId} - Event data:`, event);
    console.log(`EventCard ${eventId} - Availability:`, availability);
  }, [eventId, event, availability]);

  //? Signed in user ticket has got?..
  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });

  //? Queue positioning
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  //? ImageUrl
  const imageUrl = useStorageUrl(event?.eventImgId ?? "undefined");

  // Debug image URL
  useEffect(() => {
    console.log(`EventCard ${eventId} - Image URL:`, imageUrl);
  }, [eventId, imageUrl]);

  // FIX: Added more detailed loading states
  if (event === undefined || availability === undefined) {
    console.log(`EventCard ${eventId} - Still loading data...`);
    return (
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  // FIX: Handle case where event is null (not found)
  if (event === null) {
    console.error(`EventCard ${eventId} - Event not found!`);
    return (
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 text-center">
        <p className="text-red-500">Event not found</p>
      </div>
    );
  }

  // FIX: Handle case where availability is null (error)
  if (availability === null) {
    console.error(`EventCard ${eventId} - Availability check failed!`);
    return (
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4">
        <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
        <p className="text-red-500">Error loading availability</p>
      </div>
    );
  }

  const isPastEvent = event.eventDate < Date.now();
  const isEventOwner = user?.id === event.userId;

  console.log(`EventCard ${eventId} - Rendering with data:`, {
    event,
    availability,
    isPastEvent,
  });

  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className={`bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-lg transition-all duration-300 relative cursor-pointer overflow-hidden p-4 ${
        isPastEvent ? "opacity-75 hover:opacity-100" : ""
      }`}
    >
      {/* //! Event Image */}
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={event.name}
            className="w-full h-40 object-cover rounded-t-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      EventCard
    </div>
  );
};

export default EventCard;
