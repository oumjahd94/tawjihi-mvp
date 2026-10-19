"use client";
import { YEARS } from "../lib/data";
import { project } from "../lib/scoring";

// Historique des seuils sur 5 ans + seuil projeté + note de l'élève
export default function ThresholdChart({ series, score = null, height = 220, t }) {
  const proj = project(series);
  const all = [...series, proj.next, ...(score != null ? [score] : [])];
  const min = Math.floor(Math.min(...all) - 0.5);
  const max = Math.ceil(Math.max(...all) + 0.5);
  const W = 600, H = height, pl = 34, pr = 14, pt = 14, pb = 24;
  const xs = [...YEARS, YEARS[YEARS.length - 1] + 1];
  const x = (i) => pl + (i * (W - pl - pr)) / (xs.length - 1);
  const y = (v) => pt + ((max - v) * (H - pt - pb)) / (max - min);
  const line = series.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
  const last = series.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" dir="ltr" role="img"
      aria-label={t({ ar: "تطور العتبات خلال 5 سنوات", fr: "Évolution des seuils sur 5 ans" })}>
      {[min, (min + max) / 2, max].map((v) => (
        <g key={v}>
          <line x1={pl} x2={W - pr} y1={y(v)} y2={y(v)} stroke="#E3E5EF" />
          <text x={pl - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#8A8FA8">{v.toFixed(1)}</text>
        </g>
      ))}
      {score != null && (
        <g>
          <line x1={pl} x2={W - pr} y1={y(score)} y2={y(score)} stroke="#0D1330" strokeDasharray="2 4" strokeWidth="1.5" />
          <text x={pl + 6} y={y(score) - 7} textAnchor="start" fontSize="11" fontWeight="700" fill="#0D1330"
            stroke="#fff" strokeWidth="4" paintOrder="stroke">
            {t({ ar: "نقطتك", fr: "Ta note" })} {score.toFixed(2)}
          </text>
        </g>
      )}
      <path d={line} fill="none" stroke="#2F45D0" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={`M${x(last)},${y(series[last])}L${x(last + 1)},${y(proj.next)}`} stroke="#2F45D0" strokeWidth="2" strokeDasharray="4 4" />
      {series.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#fff" stroke="#2F45D0" strokeWidth="2" />)}
      <circle cx={x(last + 1)} cy={y(proj.next)} r="4" fill="#E8970A" />
      {xs.map((yr, i) => (
        <text key={yr} x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill={i === xs.length - 1 ? "#E8970A" : "#8A8FA8"} fontWeight={i === xs.length - 1 ? 700 : 400}>
          {i === xs.length - 1 ? `${yr}*` : yr}
        </text>
      ))}
    </svg>
  );
}
