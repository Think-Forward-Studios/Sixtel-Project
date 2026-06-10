import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/sixtel/EventCard";
import { getUpcomingEvents } from "@/lib/events-data";

export async function EventsTeaser() {
  const events = await getUpcomingEvents(3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl text-sixtel-ink md:text-4xl">
            What&apos;s Coming Up
          </h2>
          <p className="mt-2 text-muted-foreground">
            Live music, releases, trivia, and members-only nights.
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/events">All events →</Link>
        </Button>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No upcoming events posted right now — follow us for what&apos;s next.
        </p>
      )}
    </section>
  );
}
