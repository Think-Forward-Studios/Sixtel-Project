// Single source of truth for the marketing-site navigation. The public site is a
// single-page scroll layout, so every nav item is an in-page anchor to a section
// on the home page (`/#taps`, `/#events`, …). `section` matches the target
// section's DOM id and is what the active-section tracker reports for highlighting.
export type NavLink = { href: string; label: string; section: string };

export const NAV_LINKS: NavLink[] = [
  { href: "/#taps", label: "Taps", section: "taps" },
  { href: "/#events", label: "Events", section: "events" },
  { href: "/#rewards", label: "Rewards", section: "rewards" },
  { href: "/#story", label: "Story", section: "story" },
  { href: "/#visit", label: "Visit", section: "visit" },
];

// Section ids in nav order — consumed by the IntersectionObserver tracker.
export const SECTION_IDS = NAV_LINKS.map((link) => link.section);
