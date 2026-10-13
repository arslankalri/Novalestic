import { supabase } from '@/integrations/supabase/client';

/** Returns true only for a signed-in user that has an admin/partner role row (checked by the database). */
export async function hasAdminAccess(): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;
  const { data, error } = await supabase.rpc('novalestic_has_admin_access');
  return !error && data === true;
}
