import { MapPin, Phone, Clock } from "lucide-react";

export function VisitStrip() {
  return (
    <section className="bg-sixtel-ink text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <MapPin className="size-6" />
          <h3 className="font-heading text-xl">Find us</h3>
          <p className="text-primary-foreground/80">
            210 N. Main Street
            <br />
            Enterprise, AL 36330
          </p>
        </div>
        <div className="space-y-3">
          <Clock className="size-6" />
          <h3 className="font-heading text-xl">Hours</h3>
          <p className="text-primary-foreground/80">
            Tue–Thu: 12 PM – 8 PM
            <br />
            Fri–Sat: 12 PM – 10 PM
            <br />
            Sun &amp; Mon: Closed
          </p>
        </div>
        <div className="space-y-3">
          <Phone className="size-6" />
          <h3 className="font-heading text-xl">Reach us</h3>
          <p className="text-primary-foreground/80">
            <a href="tel:+13344752042" className="hover:underline">
              (334) 475-2042
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
