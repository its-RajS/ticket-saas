"use client";
import React from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useStorageUrl } from "@/components/StoreImage";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import { CalendarDays, MapPin, Ticket, Users } from "lucide-react";

const EventPage = () => {
  const { user } = useUser();
  const params = useParams();
  const event = useQuery(api.events.getEventById, {
    eventId: params.id as Id<"events">,
  });
  const availability = useQuery(api.events.getEventAvailable, {
    eventId: params.id as Id<"events">,
  });
  const imageUrl = useStorageUrl(event?.eventImgId || "undefined");

  if (!event || !availability) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Event Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Event Image */}
          {imageUrl && (
            <div className="aspect-[21/9] relative w-full">
              <Image
                src={imageUrl}
                alt={event?.name || "Event Image"}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Event Content */}
          <div className="p-8">
            <div className="grid grid-col lg:grid-cols-2 gap-12">
              {/* //* Left Col */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {event?.name}
                  </h1>
                  <p className="mt-4 text-lg text-gray-600">
                    {event?.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {/* //? Date */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Date</span>
                    </div>
                    <p className="text-gray-900">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                  {/* //? Location */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div>
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-gray-900">{event?.location}</p>
                  </div>
                  {/* //? Tickets */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Ticket className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Price</span>
                    </div>
                    <p className="text-gray-900">${event?.price.toFixed(2)}</p>
                  </div>
                  {/* //? Avaibility */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">
                        Available Seats
                      </span>
                    </div>
                    <p className="text-gray-900">
                      {availability?.totalTickets -
                        availability?.purchasedTickets}{" "}
                      / {availability?.totalTickets} left
                    </p>
                  </div>
                </div>
                {/* //* Additional event info */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Event Information
                  </h3>
                  <ul className="space-y-2 text-blue-700 list-disc list-inside">
                    <li>Please arrive 30 minutes before the event starts</li>
                    <li>Tickets are non-refundable</li>
                    <li>Age restriction: 18+</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
