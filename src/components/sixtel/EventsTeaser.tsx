import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { events } from "@/lib/events";

export function EventsTeaser() {
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

      <div className="grid gap-6 md:grid-cols-3">
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
                className={event.fit === "contain" ? "object-contain" : "object-cover"}
              />
            </div>
            <CardContent className="space-y-3 p-6">
              <p className="text-sm text-muted-foreground">{event.date}</p>
              <h3 className="font-heading text-xl text-sixtel-ink">
                {event.title}
              </h3>
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
