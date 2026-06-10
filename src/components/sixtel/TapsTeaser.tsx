import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TapCard } from "@/components/sixtel/TapCard";
import { getVisibleTaps } from "@/lib/taps-data";

export async function TapsTeaser() {
  const taps = await getVisibleTaps();
  const featured = taps.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl text-sixtel-ink md:text-4xl">
            On Tap Right Now
          </h2>
          <p className="mt-2 text-muted-foreground">
            Rotating taps. Updated as we change the lineup.
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/taps">See the full list →</Link>
        </Button>
      </div>

      {featured.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tap) => (
            <TapCard key={tap.id} tap={tap} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Tap list coming soon.</p>
      )}
    </section>
  );
}
