# Tawjihi — Plateforme d'orientation post-bac (Maroc) · v2

Stack : **Next.js 14 + TailwindCSS + Supabase + Vercel**. Arabe par défaut (RTL), bilingue AR/FR.
Le site fonctionne **immédiatement en mode démo** (sans Supabase) : données dans `lib/data.js`,
favoris / notes / profil stockés dans le navigateur.

## Le parcours élève en 5 étapes

| Étape | Page | Ce qu'elle fait |
|---|---|---|
| 1. Découvrir | `/` et `/test` | Recherche intelligente FR/AR (auto-complétion, tolère accents et graphies arabes) + test d'orientation RIASEC en 10 questions |
| 2. Évaluer | `/simulateur`, `/ecoles`, `/ecoles/[slug]` | Notes régional 25 % / CC 25 % / national 50 %, jauge de probabilité par école à partir des seuils des 5 dernières années (régression + incertitude), formule propre à chaque école, fiches écoles claires |
| 3. S'organiser | `/espace`, `/calendrier` | Connexion Google ou WhatsApp, écoles suivies, calendrier personnalisé, réglages d'alertes |
| 4. Se préparer | `/preparation` | Quiz chronométrés (mobile-first) + banque d'annales (gratuit / premium) |
| 5. S'entraider | `/communaute` | Salons par filière (temps réel avec Supabase), remontées des listes d'attente, filtre anti-données perso |

## Lancer en local

```bash
npm install
npm run dev        # http://localhost:3000
```

## Brancher Supabase

1. SQL Editor : exécuter `supabase/schema.sql`, puis `supabase/seed.sql`, puis **`supabase/migration_v2.sql`** (nouvelles tables : favoris, messages, listes d'attente, annales, avis, journal des notifications).
2. Copier `.env.local.example` → `.env.local` et remplir les 2 clés `NEXT_PUBLIC_…`.
3. Connexion Google : Supabase > Authentication > Providers > Google (créer un client OAuth dans Google Cloud Console).
4. Connexion WhatsApp : Supabase > Authentication > Providers > Phone, avec Twilio (WhatsApp activé). Payant à l'usage.

## Alertes WhatsApp automatiques

`app/api/alerts/route.js` tourne chaque jour à 8h (UTC) via `vercel.json`. Il prévient les élèves
qui suivent une école : à l'ouverture des inscriptions, 7 jours avant et la veille de la clôture.

Prérequis :
- Un compte **WhatsApp Business Platform** (Meta) et un **template de message approuvé** (`rappel_deadline`, 2 variables : libellé + date). Les messages proactifs sans template sont refusés par Meta.
- Variables serveur dans Vercel : `SUPABASE_SERVICE_ROLE_KEY`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TEMPLATE`, `CRON_SECRET`.
- Les deadlines en base doivent avoir `school_slug` renseigné.

## Changer le nom de la marque

Un seul fichier : `lib/site.js`.

## ⚠️ Avant la mise en ligne publique

- **Données** : tous les seuils, dates, frais et salaires de `lib/data.js` sont des ordres de grandeur de démo. À remplacer par des données vérifiées et sourcées.
- **Avis** : les avis actuels sont fictifs et étiquetés comme tels. Ne publiez que de vrais avis, modérés (`reviews.approved`).
- **Annales** : vérifier les droits de diffusion de chaque sujet avant publication (`annales.rights_ok`).
- **CNDP / loi 09-08** : déclaration obligatoire avant de collecter téléphones et notes. Public souvent mineur → consentement parental à prévoir.
- **Communauté** : modération humaine indispensable (signalements, masquage `messages.hidden`).
- **Coût WhatsApp** : facturé par conversation par Meta ; prévoir un budget avant d'ouvrir les alertes à grande échelle.
