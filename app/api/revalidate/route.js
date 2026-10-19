// Rafraîchit immédiatement les pages actualités après une publication depuis /admin.
// Sécurisé : seul un utilisateur dont le profil a le rôle "admin" peut l'appeler.
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !url || !key) return Response.json({ ok: false }, { status: 401 });

  const db = createClient(url, key, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
  const { data: isAdmin, error } = await db.rpc("is_admin");
  if (error || !isAdmin) return Response.json({ ok: false }, { status: 403 });

  const { slug } = await request.json().catch(() => ({}));
  revalidatePath("/");
  revalidatePath("/actualites");
  if (slug) revalidatePath(`/actualites/${slug}`);
  return Response.json({ ok: true });
}
