import type { Metadata } from "next";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { taps } from "@/lib/taps";
import { SOCIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "On Tap",
  description:
    "Twelve rotating taps, growler & crowler fills, wine slushies, and soft-serve margaritas at Sixtel in Enterprise, Alabama.",
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

export default function TapsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <h1 className="font-heading text-3xl text-sixtel-ink md:text-4xl">
        On Tap
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Twelve rotating taps, updated as we change the lineup. Here&apos;s a
        sample of what&apos;s been pouring — for the exact list right now, check
        our{" "}
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

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {taps.map((tap) => (
          <Card key={tap.name}>
            <CardHeader>
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-sixtel-cream">
                <Image
                  src={tap.image}
                  alt={tap.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <CardTitle className="mt-4 font-heading text-xl text-sixtel-ink">
                {tap.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{tap.brewery}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{tap.style}</Badge>
                <Badge>{tap.abv}% ABV</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
