import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useStorageUrl(storageId: Id<"_storage"> | "undefined") {
  return useQuery(
    api.storage.getUrl,
    storageId !== "undefined" ? { storageId } : "skip"
  );
}
