import type { Metadata } from "next";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { events } from "@/lib/events";
import { SOCIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Trivia, tap takeovers, wine slushie flights, and members-only nights at Sixtel in Enterprise, Alabama.",
};

export default function EventsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <h1 className="font-heading text-3xl text-sixtel-ink md:text-4xl">
        What&apos;s Coming Up
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Trivia, releases, slushie flights, and members-only nights. These run
        regularly — follow us on{" "}
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

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {events.map((event) => (
          <Card key={event.title} className="overflow-hidden">
            <div
              className={`relative aspect-video ${
                event.fit === "contain" ? "bg-sixtel-ink" : "bg-secondary"
              }`}
            >
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className={
                  event.fit === "contain" ? "object-contain" : "object-cover"
                }
              />
            </div>
            <CardContent className="space-y-3 p-6">
              <p className="text-sm text-muted-foreground">{event.date}</p>
              <h2 className="font-heading text-xl text-sixtel-ink">
                {event.title}
              </h2>
              {event.membersOnly && (
                <Badge variant="secondary">Members only</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
