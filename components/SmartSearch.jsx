"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "./LangProvider";
import { IconSearch, IconArrow } from "./Icons";
import { search } from "../lib/search";

const PLACEHOLDERS = [
  { ar: "ماذا تريد أن تدرس؟ مثلًا: الطب", fr: "Que veux-tu étudier ? ex. médecine" },
  { ar: "عن أي مدرسة تبحث؟ مثلًا: ENSA", fr: "Quelle école cherches-tu ? ex. ENSA" },
  { ar: "مهنة تحلم بها؟ مثلًا: صحفي", fr: "Un métier qui te fait rêver ? ex. journaliste" }
];

export default function SmartSearch({ large = false }) {
  const t = useT();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [ph, setPh] = useState(0);
  const box = useRef(null);

  const results = useMemo(() => search(q), [q]);

  useEffect(() => {
    const id = setInterval(() => setPh((p) => (p + 1) % PLACEHOLDERS.length), 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function go(r) {
    if (!r) return;
    setOpen(false);
    router.push(r.href);
  }

  function onKey(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); results.length ? go(results[cursor]) : router.push("/ecoles"); }
    else if (e.key === "Escape") setOpen(false);
  }

  return (
    <div ref={box} className="relative w-full">
      <label className={`flex items-center gap-3 bg-white rounded-2xl shadow-lift ring-1 ring-black/5 ${large ? "px-5 h-16" : "px-4 h-12"}`}>
        <IconSearch className="text-ink-faint shrink-0" width={large ? 24 : 20} height={large ? 24 : 20} />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setCursor(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder={t(PLACEHOLDERS[ph])}
          className={`flex-1 bg-transparent outline-none text-ink placeholder:text-ink-faint ${large ? "text-lg" : ""}`}
          role="combobox" aria-expanded={open && results.length > 0} aria-controls="search-results" aria-autocomplete="list"
        />
      </label>

      {open && q.trim() && (
        <ul id="search-results" role="listbox"
          className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-lift ring-1 ring-black/5 overflow-hidden text-ink text-start">
          {results.length === 0 && (
            <li className="px-5 py-4 text-ink-soft text-sm">
              {t({ ar: "لا نتيجة. جرّب اسم مدرسة أو مجال (هندسة، صحة…)", fr: "Aucun résultat. Essaie un nom d'école ou un domaine (ingénierie, santé…)" })}
            </li>
          )}
          {results.map((r, i) => (
            <li key={r.href} role="option" aria-selected={i === cursor}>
              <button onMouseEnter={() => setCursor(i)} onClick={() => go(r)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-start ${i === cursor ? "bg-majorelle-soft" : ""}`}>
                <span className={`shrink-0 min-w-[3.25rem] text-center rounded-lg px-2 py-1 text-xs font-bold ${r.kind === "school" ? "bg-majorelle text-white" : "bg-paper text-ink-soft"}`}>
                  {r.badge}
                </span>
                <span className="flex-1 truncate">{t(r)}</span>
                <IconArrow width={16} height={16} className="text-ink-faint rtl:rotate-180" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
