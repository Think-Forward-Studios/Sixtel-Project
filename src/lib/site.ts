// Canonical contact + hours + socials for Sixtel Bottle & Growler House.
// Single source of truth so VisitStrip, /visit, and other pages stay in sync.

export const VISIT = {
  addressLine: "210 N. Main Street",
  cityStateZip: "Enterprise, AL 36330",
  phone: "(334) 475-2042",
  phoneHref: "tel:+13344752042",
  // A Google Maps search for the real address (no fabricated place ID).
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Sixtel+Bottle+%26+Growler+House+210+N+Main+St+Enterprise+AL+36330",
  hours: [
    { days: "Tue – Thu", time: "12 PM – 8 PM" },
    { days: "Fri – Sat", time: "12 PM – 10 PM" },
    { days: "Sun & Mon", time: "Closed" },
  ],
} as const;

export const SOCIALS = {
  facebook: "https://www.facebook.com/SixtelBottleandGrowlerHouse/",
  instagram: "https://www.instagram.com/sixtelbgh/",
  untappd: "https://untappd.com/v/sixtel-bottle-and-growler-house/8431111",
} as const;
