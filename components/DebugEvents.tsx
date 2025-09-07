"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const DebugEvents = () => {
  const events = useQuery(api.events.getEvents);

  return (
    <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg mt-4">
      <h3 className="font-bold text-yellow-800">Debug Info:</h3>
      <p>Total events in database: {events?.length || 0}</p>
      {events && events.length > 0 && (
        <div className="mt-2">
          <h4 className="font-semibold">Event IDs:</h4>
          <ul className="text-sm">
            {events.map((event) => (
              <li key={event._id}>
                - {event._id}: {event.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DebugEvents;
