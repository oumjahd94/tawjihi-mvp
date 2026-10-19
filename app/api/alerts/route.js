// ============================================================
// ALERTES WHATSAPP AUTOMATIQUES — exécuté chaque jour par Vercel Cron
// (voir vercel.json). Pour chaque échéance qui ouvre aujourd'hui,
// tombe dans 7 jours ou demain, on prévient les élèves qui suivent l'école.
//
// Prérequis (variables d'environnement Vercel) :
//   SUPABASE_SERVICE_ROLE_KEY   clé serveur (JAMAIS côté navigateur)
//   WHATSAPP_TOKEN              token Meta WhatsApp Cloud API
//   WHATSAPP_PHONE_NUMBER_ID    ID du numéro WhatsApp Business
//   WHATSAPP_TEMPLATE           nom du template approuvé par Meta (ex. "rappel_deadline")
//   CRON_SECRET                 secret partagé avec Vercel Cron
// ============================================================
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (n) => { const d = new Date(); d.setUTCDate(d.getUTCDate() + n); return iso(d); };

async function sendWhatsApp(to, params) {
  const res = await fetch(`https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to.replace("+", ""),
      type: "template",
      // Les messages proactifs DOIVENT passer par un template validé par Meta
      template: {
        name: process.env.WHATSAPP_TEMPLATE || "rappel_deadline",
        language: { code: "ar" },
        components: [{ type: "body", parameters: params.map((text) => ({ type: "text", text })) }]
      }
    })
  });
  if (!res.ok) throw new Error(`WhatsApp ${res.status}: ${await res.text()}`);
}

export async function GET(request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !process.env.WHATSAPP_TOKEN) {
    return Response.json({ error: "missing configuration" }, { status: 500 });
  }
  const db = createClient(url, key, { auth: { persistSession: false } });

  // Quelles échéances déclenchent un message aujourd'hui ?
  const windows = [
    { trigger: "opening", date: iso(new Date()), kinds: ["inscription_debut", "open"] },
    { trigger: "j7", date: addDays(7), kinds: ["inscription_fin", "close"] },
    { trigger: "j1", date: addDays(1), kinds: ["inscription_fin", "close", "epreuve_ecrite", "exam"] }
  ];

  let sent = 0, skipped = 0, errors = 0;

  for (const w of windows) {
    const { data: deadlines } = await db.from("deadlines")
      .select("id, label_ar, label_fr, due_date, kind, school_slug")
      .eq("due_date", w.date).in("kind", w.kinds).not("school_slug", "is", null);

    for (const d of deadlines || []) {
      const { data: followers } = await db.from("favorites")
        .select("user_id, profiles!inner(phone, whatsapp_optin, alert_prefs)")
        .eq("school_slug", d.school_slug);

      for (const f of followers || []) {
        const p = f.profiles;
        if (!p?.phone || !p.whatsapp_optin || p.alert_prefs?.[w.trigger] === false) { skipped++; continue; }

        // Déjà envoyé ? (contrainte UNIQUE sur le journal)
        const { error: dup } = await db.from("notifications_log")
          .insert({ user_id: f.user_id, deadline_id: d.id, trigger: w.trigger, channel: "whatsapp", status: "pending" });
        if (dup) { skipped++; continue; }

        try {
          await sendWhatsApp(p.phone, [d.label_ar, d.due_date]);
          await db.from("notifications_log").update({ status: "sent" })
            .match({ user_id: f.user_id, deadline_id: d.id, trigger: w.trigger, channel: "whatsapp" });
          sent++;
        } catch (e) {
          await db.from("notifications_log").update({ status: "error", error: String(e.message).slice(0, 500) })
            .match({ user_id: f.user_id, deadline_id: d.id, trigger: w.trigger, channel: "whatsapp" });
          errors++;
        }
      }
    }
  }

  return Response.json({ ok: true, sent, skipped, errors });
}
