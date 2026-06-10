import Image from "next/image";
import Markdown from "react-markdown";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type PublicEvent } from "@/lib/events-data";
import { formatEventWhen } from "@/lib/event-schema";

// `unoptimized` so an admin can paste any cover URL/path without configuring
// next.config image domains (same approach as TapCard).
export function EventCard({ event }: { event: PublicEvent }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-secondary">
        {event.coverImagePath ? (
          <Image
            src={event.coverImagePath}
            alt={event.title}
            fill
            unoptimized
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <CardContent className="space-y-3 p-6">
        <p className="text-sm text-muted-foreground">
          {formatEventWhen(event.startsAt)}
        </p>
        <h3 className="font-heading text-xl text-sixtel-ink">{event.title}</h3>
        {event.isMembersOnly && <Badge variant="secondary">Members only</Badge>}
        {event.description && (
          <div className="space-y-1 text-sm text-muted-foreground [&_a]:text-sixtel-copper [&_a]:underline [&_strong]:font-semibold [&_strong]:text-sixtel-ink">
            <Markdown>{event.description}</Markdown>
          </div>
        )}
        {event.externalRsvpUrl && (
          <a
            href={event.externalRsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium text-sixtel-copper underline underline-offset-2"
          >
            RSVP →
          </a>
        )}
      </CardContent>
    </Card>
  );
}
