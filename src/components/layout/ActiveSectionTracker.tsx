"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { SECTION_IDS } from "@/lib/nav";
import { useSetActiveSection } from "@/components/layout/ActiveSectionContext";

// Observes each home-page section and reports the topmost one inside a thin band
// just below the sticky header, so the nav highlights the section you're reading.
// Mounted once in the (persistent) site layout; re-runs on route change so the
// highlight clears when you navigate to a route that has no sections (/join, …).
export function ActiveSectionTracker() {
  const setActive = useSetActiveSection();
  const pathname = usePathname();

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return; // no sections on this route (e.g. /join)

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Topmost section (in nav order) in the band wins; null above the first.
        const active = SECTION_IDS.find((id) => visible.has(id));
        setActive(active ?? null);
      },
      // Band starts 64px down (under the h-16 header) and ends ~45% up the
      // viewport, so a section activates as its heading clears the header.
      { rootMargin: "-64px 0px -55% 0px", threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    // Disconnect + clear on unmount or route change, so a section doesn't stay
    // highlighted after navigating away from the home page.
    return () => {
      observer.disconnect();
      setActive(null);
    };
  }, [setActive, pathname]);

  return null;
}
