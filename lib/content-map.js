// Conversion entre les lignes de la base (Supabase) et le format utilisé par le site.
// Utilisé côté serveur (lecture) et dans /admin (import des données du code).

const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };
const orNull = (v) => (v === undefined || v === "" ? null : v);

/* ---------- Concours ---------- */
export function rowToConcours(r) {
  return {
    id: r.id, cat: r.cat, school: r.school || null,
    fr: r.title_fr, ar: r.title_ar || r.title_fr,
    start: r.start_date || null, end: r.end_date || null,
    ongoing: !!r.ongoing, confirmed: !!r.confirmed,
    basis: r.basis_fr ? { fr: r.basis_fr, ar: r.basis_ar || r.basis_fr } : null,
    note_fr: r.note_fr || null, note_ar: r.note_ar || r.note_fr || null,
    source: r.source_url ? { label: r.source_label || host(r.source_url), url: r.source_url } : null
  };
}

export function concoursToRow(c) {
  return {
    id: c.id, cat: c.cat, school: orNull(c.school),
    title_fr: c.fr, title_ar: orNull(c.ar),
    start_date: orNull(c.start), end_date: orNull(c.end),
    ongoing: !!c.ongoing, confirmed: !!c.confirmed,
    basis_fr: orNull(c.basis?.fr), basis_ar: orNull(c.basis?.ar),
    note_fr: orNull(c.note_fr), note_ar: orNull(c.note_ar),
    source_label: orNull(c.source?.label), source_url: orNull(c.source?.url),
    visible: true
  };
}

/* ---------- Seuils ---------- */
// Une ligne "seuils" sans aucune valeur = seuil masqué (non publié).
export function rowToSeuil(r) {
  const byBac = r.by_bac || {};
  if (!Object.keys(byBac).length) return null;
  return {
    year: r.year, byBac,
    source: { label: r.source_label || host(r.source_url), url: r.source_url },
    note_fr: r.note_fr || null, note_ar: r.note_ar || r.note_fr || null
  };
}

/* ---------- Quiz ---------- */
export function rowsToQuizzes(rows) {
  return Object.fromEntries(rows.map((r) => [r.slug, { fr: r.title_fr, ar: r.title_ar || r.title_fr, seconds: r.seconds, questions: r.questions || [] }]));
}

export function quizToRow(slug, q, sort = 0) {
  return { slug, title_fr: q.fr, title_ar: orNull(q.ar), seconds: q.seconds, questions: q.questions, visible: true, sort };
}

/* ---------- Annales ---------- */
export function rowToAnnale(r) {
  return {
    id: r.id, school: r.school, year: r.year, fr: r.title_fr, ar: r.title_ar || r.title_fr,
    premium: !!r.premium, quiz: r.quiz_slug || null, file_url: r.file_url || null, corrige_url: r.corrige_url || null
  };
}

export function annaleToRow(a) {
  return {
    school: a.school, year: a.year, title_fr: a.fr, title_ar: orNull(a.ar),
    premium: !!a.premium, quiz_slug: orNull(a.quiz), file_url: orNull(a.file_url), corrige_url: orNull(a.corrige_url), visible: true
  };
}
