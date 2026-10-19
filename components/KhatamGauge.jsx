"use client";
import { useEffect, useState } from "react";

// Signature visuelle : jauge en khatam (étoile à 8 branches du zellige).
// value = remplissage 0-100 ; label = texte central (ex. "+1.25").

function starPath(cx, cy, R, r) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return "M" + pts.join("L") + "Z";
}

const D = starPath(50, 50, 44, 34);

export default function KhatamGauge({ value = null, color = "#0E7A5A", size = 88, label, sublabel }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value ?? 0));
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={[label, sublabel].filter(Boolean).join(" ")}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <path d={D} fill={color} fillOpacity=".08" stroke="#E1E7E4" strokeWidth="6" strokeLinejoin="round" />
        {value != null && (
          <path d={D} fill="none" stroke={color} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"
            pathLength="100" strokeDasharray={`${shown} 100`} className="gauge-arc" />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-semibold" style={{ color, fontSize: size * (String(label).length > 4 ? 0.17 : 0.22) }} dir="ltr">{label}</span>
        {sublabel && <span className="mt-1 text-ink-faint" style={{ fontSize: size * 0.11 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

// Logo Maslaki : khatam émeraude, cœur doré
export function KhatamMark({ size = 30, color = "#0E7A5A", core = "#DDB45E" }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <path d={D} fill={color} />
      <path d={starPath(50, 50, 22, 17)} fill={core} />
    </svg>
  );
}

// Jauge prête à l'emploi à partir d'un verdict (lib/scoring)
export function VerdictGauge({ v, meta, size = 76, t }) {
  if (v.tier === "unknown") return <KhatamGauge size={size} value={null} color={meta.color} label={v.range ? `${v.lo}+` : v.lo} sublabel={t({ ar: "عتبة", fr: "seuil" })} />;
  if (v.margin == null) return <KhatamGauge size={size} value={null} color={meta.color} label={v.tier === "open" ? "✓" : "—"} />;
  const label = `${v.margin >= 0 ? "+" : "−"}${Math.abs(v.margin).toFixed(2)}`;
  return <KhatamGauge size={size} value={v.fill} color={meta.color} label={label} sublabel={t({ ar: "نقطة", fr: "pts" })} />;
}
