"use client";

import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { XCircleIcon } from "lucide-react";

const ReleaseTicket = ({
  eventId,
  waitingListId,
}: {
  eventId: Id<"events">;
  waitingListId: Id<"waitingList">;
}) => {
  const [isReading, setIsReading] = useState(false);
  const releaseTicket = useMutation(api.waitingList.releaseTicket);

  const handleRelease = async () => {
    if (!confirm("Are you sure you want to release this ticket?")) return;

    try {
      setIsReading(true);
      await releaseTicket({ eventId, waitingListId });
      toast.success("Ticket released successfully", {
        position: "top-right",
      });
    } catch (error) {
      console.log("Error releasing ticket:", error);
      toast.error("Error releasing ticket", {
        position: "top-right",
      });
    } finally {
      setIsReading(false);
    }
  };

  return (
    <Button
      onClick={handleRelease}
      disabled={isReading}
      className="w-full flex items-center justify-center gap-2 py-2 px-4 mt-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed "
    >
      <XCircleIcon className="w-5 h-5" />
      {isReading ? "Releasing..." : "Release Ticket"}
    </Button>
  );
};

export default ReleaseTicket;
