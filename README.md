# Maslaki — مسلكي · Orientation après le bac au Maroc

Stack : **Next.js 14 + TailwindCSS + Supabase + Vercel**. Arabe par défaut (RTL), bilingue AR/FR.
Fonctionne en **mode démo sans Supabase** (actualités de départ, favoris et notes dans le navigateur).

## Lancer en local
```bash
npm install
npm run dev        # http://localhost:3000
```
Mettre à jour après une modification poussée sur GitHub : `git pull` puis `npm install`.

## Ce que contient le site
| Rubrique | Page | Données |
|---|---|---|
| Annuaire | `/ecoles`, `/ecoles/[slug]` | `lib/schools.js` — 17 réseaux + 184 établissements (public, privé reconnu, militaire) |
| Simulateur | `/simulateur` | Seuils de présélection 2026 réels, formule de chaque école |
| Concours | `/concours` | `lib/concours.js` — statut calculé automatiquement (ouvert / en cours / à venir) |
| Actualités | `/actualites` | Supabase (table `news`), sinon `lib/news-seed.js` |
| Back-office | `/admin` | Publier, modifier, programmer, supprimer des articles + images |
| Légal | `/confidentialite`, `/mentions-legales`, `/a-propos`, `/contact` | Textes à compléter dans `lib/site.js` |

## Mettre à jour les données
- **Une école** : `lib/schools.js`. Un réseau (ex. ENSA) génère ses établissements via `members`.
- **Un concours** : `lib/concours.js`. Mets `confirmed: true` + la source dès l'annonce officielle. Change `UPDATED_AT`.
- **Une actualité** : depuis `/admin` (aucun code à toucher).

## Activer le back-office des actualités
1. Supabase > SQL Editor : `supabase/schema.sql`, `migration_v2.sql`, puis **`migration_v3_actualites.sql`**.
2. Authentication > Users > Add user (ton email + mot de passe).
3. Exécute les 2 lignes en bas de `migration_v3_actualites.sql` avec ton email → tu deviens admin.
4. Va sur `/admin`, connecte-toi, clique « Importer les 6 articles de départ ».

## Google AdSense
1. Mets le site en ligne sur ton domaine (ex. maslaki.ma) avec les pages légales complétées.
2. Inscris le site sur adsense.google.com. Une fois accepté, renseigne `NEXT_PUBLIC_ADSENSE_CLIENT` (ca-pub-…) et les 3 IDs d'emplacements dans Vercel.
3. `/ads.txt` est généré automatiquement.
4. Dans AdSense > Confidentialité et messages, active le message de consentement (obligatoire pour les visiteurs d'Europe).

## ⚠️ Avant la mise en ligne
- Compléter `SITE.legal` dans `lib/site.js` (éditeur, adresse, email, n° CNDP) et `SITE.url`.
- Déclaration **CNDP** (loi 09-08) avant de collecter téléphones et notes.
- Seuils 2026 issus d'un agrégateur (orientation-chabab.com) : à recouper avec les notes officielles.
- Frais du privé non renseignés volontairement (non vérifiés).
