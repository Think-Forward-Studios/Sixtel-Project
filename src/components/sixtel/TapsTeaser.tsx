import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Real taps from the live Untappd list (May 29, 2026).
// Label images drop in during Block 5.
const sampleTaps = [
  { name: "Orange Crush", brewery: "Hidden Springs Ale Works", style: "Wheat Beer", abv: 5.2 },
  { name: "ORNG Double IPA", brewery: "Wild Leap Brew Co.", style: "IPA — Hazy", abv: 8.2 },
  { name: "Hey Girl Hey!", brewery: "Old Black Bear Brewing Co.", style: "Sour — Berliner Weisse", abv: 4.6 },
  { name: "S'mores Stout", brewery: "Martin House Brewing Company", style: "Stout — Imperial", abv: 9.2 },
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
              {/* Label image placeholder — real label art drops in during Block 5 */}
              <div className="aspect-square w-full rounded-md bg-sixtel-cream" />
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
