import type { Metadata } from "next";
import { MapPin, Clock, Phone } from "lucide-react";

import { VISIT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit",
  description:
    "Find Sixtel Bottle & Growler House at 210 N. Main Street, Enterprise, AL — hours, directions, and phone.",
};

export default function VisitPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <h1 className="font-heading text-3xl text-sixtel-ink md:text-4xl">
        Visit
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Come have a pint while you decide what to take home. We&apos;re on Main
        Street in downtown Enterprise.
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-3">
        <div className="space-y-3">
          <MapPin className="size-6 text-sixtel-copper" />
          <h2 className="font-heading text-xl text-sixtel-ink">Find us</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {VISIT.addressLine}
            <br />
            {VISIT.cityStateZip}
          </p>
          <a
            href={VISIT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline underline-offset-2"
          >
            Get directions
          </a>
        </div>

        <div className="space-y-3">
          <Clock className="size-6 text-sixtel-copper" />
          <h2 className="font-heading text-xl text-sixtel-ink">Hours</h2>
          <ul className="space-y-1 text-sm leading-relaxed text-muted-foreground">
            {VISIT.hours.map((h) => (
              <li key={h.days}>
                <span className="text-foreground">{h.days}:</span> {h.time}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Phone className="size-6 text-sixtel-copper" />
          <h2 className="font-heading text-xl text-sixtel-ink">Reach us</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <a href={VISIT.phoneHref} className="hover:underline">
              {VISIT.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
