import React from "react";
import { Id } from "@/convex/_generated/dataModel";

const ReleaseTicket = ({
  eventId,
  waitingListId,
}: {
  eventId: Id<"events">;
  waitingListId: Id<"waitingList">;
}) => {
  return <div>ReleaseTicket</div>;
};

export default ReleaseTicket;
