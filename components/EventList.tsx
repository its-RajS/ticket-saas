"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import Spinner from "./Spinner";
import { CalendarRangeIcon, Ticket } from "lucide-react";
import EventCard from "./EventCard";
import DebugEvents from "./DebugEvents"; // Add this import

const EventList = () => {
  const events = useQuery(api.events.getEvents);

  console.log("Events data:", events);

  if (!events) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  const upcomingEvents = events
    .filter((event) => event.eventDate > Date.now())
    .sort((a, b) => a.eventDate - b.eventDate);

  const pastEvents = events
    .filter((event) => event.eventDate <= Date.now())
    .sort((a, b) => b.eventDate - a.eventDate);

  console.log("Upcoming events:", upcomingEvents);
  console.log("Past events:", pastEvents);

  return (
    <div className="max-w-screen mx-auto px-4 py-12 sm:px-6 lg:px-8 ">
      {/* //*Header */}
      <div className="flex items-center justify-between mb-8 ">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Upcoming Events
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Discover & book exciting events happening near you.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 ">
          <div className="flex items-center gap-2 text-gray-600 ">
            <CalendarRangeIcon className="w-5 h-5" />
            <span className="font-medium">
              {upcomingEvents.length} Upcoming events
            </span>
          </div>
        </div>
      </div>

      {/* Add debug component here */}
      {/* <DebugEvents /> */}

      {/* //! Upcoming events */}
      {upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 ">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-gray-50 rounded-lg p-12 mb-12 ">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4 " />
          <h3 className="text-gray-900 font-medium text-lg ">
            No upcoming events
          </h3>
          <p className="text-gray-600 mt-1">
            Check back later for more events!
          </p>
        </div>
      )}
      {pastEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 ">
          {pastEvents.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
