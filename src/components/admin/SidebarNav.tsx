import Link from "next/link";
import {
  LayoutDashboardIcon,
  BeerIcon,
  CalendarDaysIcon,
  MegaphoneIcon,
  ImageIcon,
  LogOutIcon,
} from "lucide-react";

// Dashboard is live now; the rest light up in Sprints 1–4.
const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/taps", label: "Taps", icon: BeerIcon },
  { href: "/admin/events", label: "Events", icon: CalendarDaysIcon },
  { href: "/admin/announcements", label: "Announcements", icon: MegaphoneIcon },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
];

export function SidebarNav() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-background">
      <div className="border-b border-border px-5 py-4">
        <p className="font-heading text-lg text-sixtel-ink">Sixtel</p>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Admin
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Sign out posts to the route handler (no client JS needed). */}
      <form
        action="/admin/auth/signout"
        method="post"
        className="border-t border-border p-3"
      >
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOutIcon className="size-4 shrink-0" />
          Sign out
        </button>
      </form>
    </aside>
  );
}
