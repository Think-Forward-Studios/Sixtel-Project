import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Real taps from the live Untappd list (May 29, 2026). We have real label
// art for ORNG + Hey Girl Hey; the others fall back to a cream placeholder.
const sampleTaps: {
  name: string;
  brewery: string;
  style: string;
  abv: number;
  image: string | null;
}[] = [
  { name: "Orange Crush", brewery: "Hidden Springs Ale Works", style: "Wheat Beer", abv: 5.2, image: null },
  { name: "ORNG Double IPA", brewery: "Wild Leap Brew Co.", style: "IPA — Hazy", abv: 8.2, image: "/photos/taps/tap-orng.jpg" },
  { name: "Hey Girl Hey!", brewery: "Old Black Bear Brewing Co.", style: "Sour — Berliner Weisse", abv: 4.6, image: "/photos/taps/tap-hey-girl-hey.jpg" },
  { name: "S'mores Stout", brewery: "Martin House Brewing Company", style: "Stout — Imperial", abv: 9.2, image: null },
];

export function TapsTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl text-sixtel-ink md:text-4xl">
            On Tap Right Now
          </h2>
          <p className="mt-2 text-muted-foreground">
            12 rotating taps. Updated as we change the lineup.
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/taps">See all 12 →</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sampleTaps.map((tap) => (
          <Card key={tap.name}>
            <CardHeader>
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-sixtel-cream">
                {tap.image && (
                  <Image
                    src={tap.image}
                    alt={tap.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
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
    </section>
  );
}
