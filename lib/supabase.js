import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si les clés ne sont pas encore configurées, l'app bascule
// automatiquement sur les données de démonstration (lib/demoData.js).
export const supabase = url && key ? createClient(url, key) : null;
