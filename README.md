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
| Back-office | `/admin` | Actualités, concours, seuils, annales (PDF) et quiz, sans toucher au code |
| Légal | `/confidentialite`, `/mentions-legales`, `/a-propos`, `/contact` | Textes à compléter dans `lib/site.js` |

## Mettre à jour les données
Tout se fait depuis **`/admin`** :
- **Actualités** : publier, programmer, mettre à la une.
- **Concours** : ajouter une échéance, la marquer confirmée avec sa source, la dupliquer pour l'année suivante. « Mis à jour le… » suit tes modifications (ou le bouton « Tout est vérifié aujourd'hui »).
- **Seuils** : corriger le seuil d'une école ou d'un réseau (source obligatoire). La fiche école et le simulateur suivent.
- **Annales** : déposer les PDF (sujet, corrigé) et les relier à un quiz.
- **Quiz** : créer et modifier les questions.

Restent dans le code : la liste des écoles (`lib/schools.js`) et les textes fixes. Tant qu'une rubrique est vide dans la base, le site affiche les données du code ; le bouton « Importer » de chaque onglet les copie dans la base.

## Activer le back-office
1. Supabase > SQL Editor, dans l'ordre : `schema.sql`, `migration_v2.sql`, `migration_v3_actualites.sql`, **`migration_v4_contenus.sql`**.
2. Authentication > Users > Add user (ton email + mot de passe).
3. Exécute les 2 lignes en bas de `migration_v3_actualites.sql` avec ton email → tu deviens admin.
4. Va sur `/admin`, connecte-toi, puis dans chaque onglet clique « Importer ». Pour les annales, importe d'abord les quiz.

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
