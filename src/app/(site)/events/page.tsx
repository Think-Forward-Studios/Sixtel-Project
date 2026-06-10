import type { Metadata } from "next";

import { EventCard } from "@/components/sixtel/EventCard";
import { getPublishedEvents } from "@/lib/events-data";
import { SOCIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Trivia, tap takeovers, wine slushie flights, and members-only nights at Sixtel in Enterprise, Alabama.",
};

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <h1 className="font-heading text-3xl text-sixtel-ink md:text-4xl">
        What&apos;s Coming Up
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Trivia, releases, slushie flights, and members-only nights. Follow us on{" "}
        <a
          href={SOCIALS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Facebook
        </a>{" "}
        for exact dates and one-offs.
      </p>

      {events.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-muted-foreground">
          No events are posted right now — check back soon.
        </p>
      )}
    </section>
  );
}
