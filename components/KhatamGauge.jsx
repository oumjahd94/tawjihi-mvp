"use client";
import { useEffect, useState } from "react";

// Signature visuelle du site : une jauge en forme de khatam
// (étoile à 8 branches du zellige) qui se remplit selon la probabilité.

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

export default function KhatamGauge({ value = null, color = "#2F45D0", size = 88, label, sublabel }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value ?? 0));
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={value != null ? `${value}%` : label}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <path d={D} fill={color} fillOpacity=".07" stroke="#E3E5EF" strokeWidth="6" strokeLinejoin="round" />
        {value != null && (
          <path
            d={D} fill="none" stroke={color} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"
            pathLength="100" strokeDasharray={`${shown} 100`} className="gauge-arc"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        {value != null ? (
          <span className="font-bold" style={{ color, fontSize: size * 0.24 }} dir="ltr">{value}<span style={{ fontSize: size * 0.13 }}>%</span></span>
        ) : (
          <span className="font-bold" style={{ color, fontSize: size * 0.15 }}>{label}</span>
        )}
        {sublabel && <span className="mt-1 text-ink-faint" style={{ fontSize: size * 0.11 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

// Version mini, utilisée pour le logo
export function KhatamMark({ size = 28, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <path d={D} fill={color} />
      <circle cx="50" cy="50" r="13" fill="#E8970A" />
    </svg>
  );
}
