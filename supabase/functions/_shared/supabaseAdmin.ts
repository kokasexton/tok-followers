import { createClient, type SupabaseClient, type User } from 'npm:@supabase/supabase-js@2';

/** Service-role client. SUPABASE_* env vars are injected into every edge function. */
export function adminClient(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/** Resolve the calling user from the request's Authorization header. */
export async function requireUser(req: Request): Promise<User | null> {
  const auth = req.headers.get('Authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const admin = adminClient();
  const { data, error } = await admin.auth.getUser(token);
  if (error) return null;
  return data.user ?? null;
}
