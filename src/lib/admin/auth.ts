import "server-only";

import { redirect } from "next/navigation";

import { getServerAuthClient } from "@/lib/supabase/server-auth";

export type AdminRole = "owner" | "staff";

export type AdminProfile = {
  id: string;
  displayName: string;
  role: AdminRole;
};

/**
 * Loads the current Supabase user and their active admin_profiles row.
 * Returns userId=null when not signed in, and profile=null when signed in but
 * not an active admin (so callers can distinguish the two cases).
 */
async function loadAuth(): Promise<{
  userId: string | null;
  profile: AdminProfile | null;
}> {
  const supabase = await getServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { userId: null, profile: null };

  // RLS: admins can read their own profile via is_active_admin(); the row is
  // scoped by auth.uid() = id anyway.
  const { data } = await supabase
    .from("admin_profiles")
    .select("id, display_name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!data || !data.is_active) return { userId: user.id, profile: null };

  return {
    userId: user.id,
    profile: {
      id: data.id as string,
      displayName: data.display_name as string,
      role: data.role as AdminRole,
    },
  };
}

/** The signed-in user's active admin profile, or null. Safe in any server component. */
export async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  return (await loadAuth()).profile;
}

/**
 * Gate a server component/layout. Redirects to /admin/login when not signed in,
 * and to /admin/login?error=not-admin when signed in but not an active admin.
 * Returns the profile on success.
 */
export async function requireAdmin(): Promise<AdminProfile> {
  const { userId, profile } = await loadAuth();
  if (!userId) redirect("/admin/login");
  if (!profile) redirect("/admin/login?error=not-admin");
  return profile;
}

/** Like requireAdmin, but additionally requires role = 'owner'. */
export async function requireOwner(): Promise<AdminProfile> {
  const profile = await requireAdmin();
  if (profile.role !== "owner") redirect("/admin?error=owner-only");
  return profile;
}
