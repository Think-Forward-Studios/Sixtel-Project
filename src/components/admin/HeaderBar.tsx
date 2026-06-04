import { Badge } from "@/components/ui/badge";
import type { AdminProfile } from "@/lib/admin/auth";

export function HeaderBar({ profile }: { profile: AdminProfile }) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-6 py-3">
      <p className="text-sm text-muted-foreground">
        Welcome,{" "}
        <span className="font-medium text-foreground">
          {profile.displayName}
        </span>
      </p>
      <Badge
        variant={profile.role === "owner" ? "default" : "secondary"}
        className="capitalize"
      >
        {profile.role}
      </Badge>
    </header>
  );
}
