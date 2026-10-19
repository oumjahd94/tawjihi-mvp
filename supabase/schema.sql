-- ============================================================
-- SCHÉMA DE BASE DE DONNÉES — PLATEFORME D'ORIENTATION MAROC
-- PostgreSQL / Supabase
-- Version MVP — pensé pour : simulateur de seuils, fiches
-- filières, calendrier de deadlines, alertes, bilingue AR/FR
-- ============================================================

-- ------------------------------------------------------------
-- 1. RÉFÉRENTIELS DE BASE
-- ------------------------------------------------------------

-- Types de baccalauréat (Sciences Maths A/B, PC, SVT, Éco, Lettres...)
CREATE TABLE bac_types (
    id          SERIAL PRIMARY KEY,
    code        TEXT UNIQUE NOT NULL,          -- ex: 'SM-A', 'PC', 'SVT', 'ECO'
    label_fr    TEXT NOT NULL,                 -- 'Sciences Mathématiques A'
    label_ar    TEXT NOT NULL                  -- 'علوم رياضية أ'
);

-- Villes (pour filtrer par proximité — critère majeur des familles)
CREATE TABLE cities (
    id          SERIAL PRIMARY KEY,
    name_fr     TEXT NOT NULL,
    name_ar     TEXT NOT NULL,
    region_fr   TEXT,
    region_ar   TEXT
);

-- Domaines d'études (Ingénierie, Santé, Commerce, Droit...)
CREATE TABLE domains (
    id          SERIAL PRIMARY KEY,
    slug        TEXT UNIQUE NOT NULL,          -- 'ingenierie', 'sante'
    label_fr    TEXT NOT NULL,
    label_ar    TEXT NOT NULL,
    icon        TEXT                            -- emoji ou nom d'icône
);

-- ------------------------------------------------------------
-- 2. ÉTABLISSEMENTS ET FILIÈRES (le cœur du produit)
-- ------------------------------------------------------------

CREATE TABLE institutions (
    id            SERIAL PRIMARY KEY,
    slug          TEXT UNIQUE NOT NULL,        -- 'ensa-kenitra' (pour URL SEO)
    name_fr       TEXT NOT NULL,
    name_ar       TEXT NOT NULL,
    acronym       TEXT,                        -- 'ENSA', 'ENCG'
    type          TEXT NOT NULL CHECK (type IN ('public','prive','semi-public')),
    city_id       INT REFERENCES cities(id),
    website       TEXT,
    address       TEXT,
    logo_url      TEXT,
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Une "filière" = un programme précis dans un établissement précis.
-- Ex : "Génie Informatique — ENSA Kénitra" et "Génie Informatique — ENSA Agadir"
-- sont 2 lignes distinctes (seuils et frais différents).
CREATE TABLE programs (
    id                 SERIAL PRIMARY KEY,
    slug               TEXT UNIQUE NOT NULL,   -- 'genie-informatique-ensa-kenitra'
    institution_id     INT NOT NULL REFERENCES institutions(id),
    domain_id          INT REFERENCES domains(id),
    name_fr            TEXT NOT NULL,
    name_ar            TEXT NOT NULL,
    level              TEXT NOT NULL CHECK (level IN
                         ('post-bac','bac+2','bac+3','licence','master','doctorat','formation-pro')),
    duration_years     NUMERIC(2,1),           -- 3, 5, 2.5...
    diploma_fr         TEXT,                   -- 'Diplôme d''ingénieur d''État'
    diploma_ar         TEXT,
    annual_fees_min    INT DEFAULT 0,          -- en DH, 0 = gratuit/public
    annual_fees_max    INT DEFAULT 0,
    language_teaching  TEXT,                   -- 'FR', 'AR', 'FR/EN'...
    description_fr     TEXT,
    description_ar     TEXT,
    reality_check_fr   TEXT,                   -- section "réalité terrain" (différenciateur)
    reality_check_ar   TEXT,
    is_published       BOOLEAN DEFAULT false,  -- workflow de validation avant mise en ligne
    created_at         TIMESTAMPTZ DEFAULT now(),
    updated_at         TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- 3. SEUILS HISTORIQUES (le carburant du simulateur)
-- ------------------------------------------------------------

-- Un seuil par programme, par année, par type de bac.
-- L'historique multi-années permet d'afficher la tendance
-- ("le seuil monte de 0.5 pt/an") — personne ne le fait proprement.
CREATE TABLE admission_thresholds (
    id             SERIAL PRIMARY KEY,
    program_id     INT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    bac_type_id    INT NOT NULL REFERENCES bac_types(id),
    year           INT NOT NULL,               -- 2024, 2025, 2026
    threshold      NUMERIC(5,2),               -- ex: 15.43 (NULL si sur concours pur)
    selection_mode TEXT NOT NULL CHECK (selection_mode IN
                     ('seuil','concours','seuil+concours','dossier','ouvert')),
    notes_fr       TEXT,                       -- 'Seuil 1ère liste ; liste d''attente à 14.80'
    notes_ar       TEXT,
    source_url     TEXT,                       -- traçabilité = crédibilité
    verified_at    TIMESTAMPTZ,                -- date de vérification par l'équipe
    UNIQUE (program_id, bac_type_id, year)
);

-- ------------------------------------------------------------
-- 4. CONCOURS ET DEADLINES (la raison du succès de Tawjihnet)
-- ------------------------------------------------------------

CREATE TABLE competitions (
    id             SERIAL PRIMARY KEY,
    slug           TEXT UNIQUE NOT NULL,       -- 'cnc-2027', 'tafem-2027'
    name_fr        TEXT NOT NULL,
    name_ar        TEXT NOT NULL,
    year           INT NOT NULL,
    description_fr TEXT,
    description_ar TEXT,
    official_url   TEXT
);

-- Lien N-N : un concours (ex. CNC) ouvre l'accès à plusieurs programmes
CREATE TABLE program_competitions (
    program_id     INT REFERENCES programs(id) ON DELETE CASCADE,
    competition_id INT REFERENCES competitions(id) ON DELETE CASCADE,
    PRIMARY KEY (program_id, competition_id)
);

-- Chaque échéance datée (inscription, épreuve écrite, oral, résultats...)
CREATE TABLE deadlines (
    id             SERIAL PRIMARY KEY,
    -- une deadline appartient soit à un concours, soit directement à un programme
    competition_id INT REFERENCES competitions(id) ON DELETE CASCADE,
    program_id     INT REFERENCES programs(id) ON DELETE CASCADE,
    kind           TEXT NOT NULL CHECK (kind IN
                     ('inscription_debut','inscription_fin','epreuve_ecrite',
                      'oral','resultats_presel','resultats_finaux','liste_attente','autre')),
    label_fr       TEXT NOT NULL,              -- 'Clôture des inscriptions en ligne'
    label_ar       TEXT NOT NULL,
    due_date       DATE NOT NULL,
    due_time       TIME,                       -- si heure limite précise
    source_url     TEXT,
    verified_at    TIMESTAMPTZ,
    CHECK (competition_id IS NOT NULL OR program_id IS NOT NULL)
);

CREATE INDEX idx_deadlines_date ON deadlines(due_date);

-- ------------------------------------------------------------
-- 5. DÉBOUCHÉS ET MÉTIERS
-- ------------------------------------------------------------

CREATE TABLE careers (
    id             SERIAL PRIMARY KEY,
    slug           TEXT UNIQUE NOT NULL,
    title_fr       TEXT NOT NULL,
    title_ar       TEXT NOT NULL,
    salary_junior_min  INT,                    -- DH/mois, débutant
    salary_junior_max  INT,
    salary_senior_min  INT,                    -- DH/mois, 10+ ans
    salary_senior_max  INT,
    market_demand  TEXT CHECK (market_demand IN ('forte','moyenne','faible','saturee')),
    description_fr TEXT,
    description_ar TEXT
);

CREATE TABLE program_careers (
    program_id  INT REFERENCES programs(id) ON DELETE CASCADE,
    career_id   INT REFERENCES careers(id) ON DELETE CASCADE,
    PRIMARY KEY (program_id, career_id)
);

-- ------------------------------------------------------------
-- 6. UTILISATEURS ET ALERTES (Supabase Auth gère auth.users)
-- ------------------------------------------------------------

CREATE TABLE profiles (
    id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role          TEXT DEFAULT 'eleve' CHECK (role IN ('eleve','parent','conseiller','admin')),
    bac_type_id   INT REFERENCES bac_types(id),
    bac_year      INT,                          -- année d'obtention (prévue)
    avg_grade     NUMERIC(5,2),                 -- moyenne générale (pour le simulateur)
    regional_grade NUMERIC(5,2),                -- note du régional
    city_id       INT REFERENCES cities(id),
    lang_pref     TEXT DEFAULT 'ar' CHECK (lang_pref IN ('ar','fr')),
    created_at    TIMESTAMPTZ DEFAULT now()
);

-- Programmes suivis par l'utilisateur → base des alertes deadlines
CREATE TABLE followed_programs (
    profile_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
    program_id  INT REFERENCES programs(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (profile_id, program_id)
);

-- File d'alertes à envoyer (email / WhatsApp plus tard)
CREATE TABLE alerts (
    id          SERIAL PRIMARY KEY,
    profile_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
    deadline_id INT REFERENCES deadlines(id) ON DELETE CASCADE,
    channel     TEXT DEFAULT 'email' CHECK (channel IN ('email','whatsapp','push')),
    send_at     TIMESTAMPTZ NOT NULL,          -- ex: J-7 et J-1 avant la deadline
    sent_at     TIMESTAMPTZ,
    UNIQUE (profile_id, deadline_id, send_at)
);

-- ------------------------------------------------------------
-- 7. RÉSULTATS DU SIMULATEUR (analytics produit)
-- ------------------------------------------------------------

-- Chaque simulation anonyme ou liée à un compte : or pur pour
-- comprendre votre audience ET pour vendre des leads qualifiés
-- aux écoles privées (phase 2, avec consentement explicite).
CREATE TABLE simulations (
    id           BIGSERIAL PRIMARY KEY,
    profile_id   UUID REFERENCES profiles(id),  -- NULL si anonyme
    bac_type_id  INT REFERENCES bac_types(id),
    avg_grade    NUMERIC(5,2),
    city_id      INT REFERENCES cities(id),
    results      JSONB,                         -- programmes retournés + scores
    created_at   TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- 8. VUES UTILES
-- ------------------------------------------------------------

-- Vue du simulateur : dernier seuil connu par programme × bac
CREATE VIEW v_latest_thresholds AS
SELECT DISTINCT ON (t.program_id, t.bac_type_id)
       t.program_id, t.bac_type_id, t.year, t.threshold, t.selection_mode
FROM admission_thresholds t
ORDER BY t.program_id, t.bac_type_id, t.year DESC;

-- Deadlines à venir (pour la page calendrier)
CREATE VIEW v_upcoming_deadlines AS
SELECT d.*, c.name_fr AS competition_fr, c.name_ar AS competition_ar,
       p.name_fr AS program_fr, p.name_ar AS program_ar
FROM deadlines d
LEFT JOIN competitions c ON c.id = d.competition_id
LEFT JOIN programs p     ON p.id = d.program_id
WHERE d.due_date >= CURRENT_DATE
ORDER BY d.due_date;

-- ------------------------------------------------------------
-- 9. SÉCURITÉ SUPABASE (Row Level Security)
-- ------------------------------------------------------------

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE followed_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations       ENABLE ROW LEVEL SECURITY;

-- Chacun ne voit et ne modifie que ses propres données
CREATE POLICY "own profile"  ON profiles
    FOR ALL USING (auth.uid() = id);
CREATE POLICY "own follows"  ON followed_programs
    FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own alerts"   ON alerts
    FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own sims"     ON simulations
    FOR ALL USING (auth.uid() = profile_id OR profile_id IS NULL);

-- Les tables de contenu (programs, thresholds, deadlines...) restent
-- en lecture publique via l'API anon, écriture réservée au rôle admin
-- (à configurer dans le dashboard Supabase).

-- ------------------------------------------------------------
-- REQUÊTE TYPE DU SIMULATEUR
-- "Avec un bac PC et 13.5 de moyenne, qu'est-ce qui est atteignable ?"
-- ------------------------------------------------------------
-- SELECT p.name_fr, i.name_fr AS ecole, ci.name_fr AS ville,
--        lt.threshold, lt.year,
--        CASE
--          WHEN lt.threshold IS NULL THEN 'concours'
--          WHEN 13.5 >= lt.threshold THEN 'atteignable'
--          WHEN 13.5 >= lt.threshold - 0.5 THEN 'limite'
--          ELSE 'difficile'
--        END AS verdict
-- FROM programs p
-- JOIN institutions i        ON i.id = p.institution_id
-- LEFT JOIN cities ci        ON ci.id = i.city_id
-- JOIN v_latest_thresholds lt ON lt.program_id = p.id
-- JOIN bac_types b           ON b.id = lt.bac_type_id AND b.code = 'PC'
-- WHERE p.is_published = true
-- ORDER BY verdict, lt.threshold DESC;
