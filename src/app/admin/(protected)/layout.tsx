import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin · Sixtel",
};

// Gates every protected admin route. requireAdmin() redirects to /admin/login
// (or ?error=not-admin) when the caller isn't an active admin, so anything
// rendered below is guaranteed an admin. The proxy also gates at the edge.
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdmin();
  return <AdminShell profile={profile}>{children}</AdminShell>;
}
