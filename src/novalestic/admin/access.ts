import { supabase } from "@/integrations/supabase/client";

/** Server-checked: reads the caller's own role row (RLS scoped to auth.uid()). */
export async function hasAdminAccess(): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return false;
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  return !error && !!data;
}
