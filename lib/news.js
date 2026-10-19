// Lecture des actualités : Supabase si configuré, sinon articles de départ.
// Utilisable côté serveur (pages SEO) comme côté client.
import { createClient } from "@supabase/supabase-js";
import { NEWS_SEED } from "./news-seed";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const db = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

const bySeed = () => [...NEWS_SEED].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.published_at.localeCompare(a.published_at));

export async function listNews(limit = 50) {
  if (!db) return bySeed().slice(0, limit);
  const { data, error } = await db.from("news")
    .select("slug, category, title_fr, title_ar, excerpt_fr, excerpt_ar, cover_url, published_at, pinned")
    .eq("status", "published").lte("published_at", new Date().toISOString())
    .order("pinned", { ascending: false }).order("published_at", { ascending: false }).limit(limit);
  if (error || !data?.length) return bySeed().slice(0, limit);
  return data;
}

export async function getNews(slug) {
  if (db) {
    const { data } = await db.from("news").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
    if (data) return data;
  }
  return NEWS_SEED.find((n) => n.slug === slug) || null;
}
