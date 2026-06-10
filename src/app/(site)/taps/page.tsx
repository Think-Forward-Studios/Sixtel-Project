import type { Metadata } from "next";

import { TapCard } from "@/components/sixtel/TapCard";
import { getVisibleTaps } from "@/lib/taps-data";
import { SOCIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "On Tap",
  description:
    "The current tap list, growler & crowler fills, wine slushies, and soft-serve margaritas at Sixtel in Enterprise, Alabama.",
};

const extras = [
  {
    title: "Growler & crowler fills",
    body: "Take your favorite pour home — we fill growlers and seal crowlers to go.",
  },
  {
    title: "Wine slushies",
    body: "Rotating flavors. Recent pours: Green Apple, Hurricane, Mango, Strawberry.",
  },
  {
    title: "Soft-serve margaritas",
    body: "Strawberry and Mango, returning periodically.",
  },
  {
    title: "Craft package",
    body: "A wall of cans and bottles to pick from and take home.",
  },
];

export default async function TapsPage() {
  const taps = await getVisibleTaps();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <h1 className="font-heading text-3xl text-sixtel-ink md:text-4xl">
        On Tap
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Our current lineup, updated as we change it. For check-ins and ratings,
        find us on{" "}
        <a
          href={SOCIALS.untappd}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Untappd
        </a>
        .
      </p>

      {taps.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {taps.map((tap) => (
            <TapCard key={tap.id} tap={tap} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-muted-foreground">
          No taps are listed right now — check back soon.
        </p>
      )}

      <div className="mt-16">
        <h2 className="font-heading text-2xl text-sixtel-ink">More than beer</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {extras.map((item) => (
            <div key={item.title}>
              <h3 className="font-heading text-lg text-sixtel-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
