"use client";
import { useT } from "./LangProvider";
import { IconHeart } from "./Icons";
import { useFavorites } from "../lib/store";
import { supabase } from "../lib/supabase";

export default function FavButton({ slug, compact = false }) {
  const t = useT();
  const [favs, setFavs] = useFavorites();
  const on = favs.includes(slug);

  async function toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    setFavs((f) => (f.includes(slug) ? f.filter((x) => x !== slug) : [...f, slug]));
    // Synchro serveur si l'utilisateur est connecté via Supabase
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      const uid = data?.user?.id;
      if (!uid) return;
      if (on) await supabase.from("favorites").delete().match({ user_id: uid, school_slug: slug });
      else await supabase.from("favorites").upsert({ user_id: uid, school_slug: slug });
    }
  }

  const label = on ? t({ ar: "في المفضلة", fr: "Suivie" }) : t({ ar: "تابع هذه المدرسة", fr: "Suivre l'école" });

  return (
    <button onClick={toggle} aria-pressed={on} aria-label={label} title={label}
      className={`inline-flex items-center gap-1.5 rounded-xl border font-semibold transition-colors ${
        compact ? "h-10 w-10 justify-center" : "h-11 px-4 text-sm"
      } ${on ? "bg-coral-soft border-coral/30 text-coral" : "bg-white border-line text-ink-soft hover:text-coral hover:border-coral/40"}`}>
      <IconHeart filled={on} width={18} height={18} />
      {!compact && label}
    </button>
  );
}
