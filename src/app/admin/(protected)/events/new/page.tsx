import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { EventForm } from "../EventForm";

export const metadata: Metadata = {
  title: "New event · Sixtel Admin",
};

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-sixtel-ink"
        >
          <ArrowLeftIcon className="size-4" /> Back to events
        </Link>
        <h1 className="mt-2 font-heading text-2xl text-sixtel-ink">New event</h1>
      </div>
      <EventForm event={null} />
    </div>
  );
}
