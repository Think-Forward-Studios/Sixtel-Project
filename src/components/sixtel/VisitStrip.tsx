import { MapPin, Phone, Clock } from "lucide-react";

import { VISIT } from "@/lib/site";

export function VisitStrip() {
  return (
    <section className="bg-sixtel-ink text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <MapPin className="size-6" />
          <h3 className="font-heading text-xl">Find us</h3>
          <p className="text-primary-foreground/80">
            {VISIT.addressLine}
            <br />
            {VISIT.cityStateZip}
          </p>
        </div>
        <div className="space-y-3">
          <Clock className="size-6" />
          <h3 className="font-heading text-xl">Hours</h3>
          <p className="text-primary-foreground/80">
            {VISIT.hours.map((h) => (
              <span key={h.days}>
                {h.days}: {h.time}
                <br />
              </span>
            ))}
          </p>
        </div>
        <div className="space-y-3">
          <Phone className="size-6" />
          <h3 className="font-heading text-xl">Reach us</h3>
          <p className="text-primary-foreground/80">
            <a href={VISIT.phoneHref} className="hover:underline">
              {VISIT.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
