import EventList from "@/components/EventList";
import Header from "@/components/Header";
import SyncUserWithConvex from "@/components/SyncUserWithConvex";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Header />
      <SyncUserWithConvex />
      <EventList />
    </div>
  );
}
