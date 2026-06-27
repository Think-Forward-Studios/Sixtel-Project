"use client";

import Link from "next/link";

import { NAV_LINKS } from "@/lib/nav";
import { useActiveSection } from "@/components/layout/ActiveSectionContext";

// Desktop nav for the single-page site. Reads the active section from context and
// highlights the matching link (copper) as you scroll.
export function DesktopNav() {
  const active = useActiveSection();
  return (
    <nav className="hidden gap-6 md:flex">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.section}
          href={link.href}
          data-active={active === link.section}
          className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground data-[active=true]:text-sixtel-copper"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
