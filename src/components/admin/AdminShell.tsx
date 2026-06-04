import type { AdminProfile } from "@/lib/admin/auth";
import { SidebarNav } from "./SidebarNav";
import { HeaderBar } from "./HeaderBar";

export function AdminShell({
  profile,
  children,
}: {
  profile: AdminProfile;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-secondary/20">
      <SidebarNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <HeaderBar profile={profile} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
