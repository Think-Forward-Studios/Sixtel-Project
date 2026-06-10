import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PublicTap } from "@/lib/taps-data";

// `unoptimized` so an admin can paste any image URL (or local path) without
// configuring next.config image domains. Tap thumbnails are small.
export function TapCard({ tap }: { tap: PublicTap }) {
  return (
    <Card>
      <CardHeader>
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-sixtel-cream">
          {tap.labelImageUrl ? (
            <Image
              src={tap.labelImageUrl}
              alt={tap.name}
              fill
              unoptimized
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <CardTitle className="mt-4 font-heading text-xl text-sixtel-ink">
          {tap.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tap.brewery && (
          <p className="text-sm text-muted-foreground">{tap.brewery}</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {tap.style && <Badge variant="secondary">{tap.style}</Badge>}
          {tap.abvPercent != null && <Badge>{tap.abvPercent}% ABV</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}
