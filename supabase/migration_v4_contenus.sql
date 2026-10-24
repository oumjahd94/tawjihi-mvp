-- ============================================================
-- MIGRATION V4 — Contenus gérés depuis /admin
-- Concours & échéances, seuils, annales, quiz, réglages.
-- À exécuter APRÈS migration_v3_actualites.sql (SQL Editor Supabase).
-- Le fichier peut être relancé sans erreur.
-- ============================================================

-- 1. Concours & échéances
CREATE TABLE IF NOT EXISTS concours (
  id           TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  cat          TEXT NOT NULL DEFAULT 'postbac'
               CHECK (cat IN ('postbac','bac','etranger','bourse','recrutement','resultats')),
  school       TEXT,                       -- slug de l'école ou du réseau (ex. ensa), facultatif
  title_fr     TEXT NOT NULL,
  title_ar     TEXT,
  start_date   DATE,
  end_date     DATE,
  ongoing      BOOLEAN NOT NULL DEFAULT false,  -- "en cours" sans date de fin (listes d'attente…)
  confirmed    BOOLEAN NOT NULL DEFAULT false,  -- date officielle publiée, sinon "à confirmer"
  basis_fr     TEXT,                       -- pourquoi c'est "à confirmer"
  basis_ar     TEXT,
  note_fr      TEXT,
  note_ar      TEXT,
  source_label TEXT,
  source_url   TEXT,
  visible      BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- 2. Seuils corrigés depuis l'admin (remplacent ceux écrits dans le code)
CREATE TABLE IF NOT EXISTS seuils (
  school_slug  TEXT PRIMARY KEY,
  year         INT  NOT NULL CHECK (year BETWEEN 2020 AND 2100),
  by_bac       JSONB NOT NULL DEFAULT '{}'::jsonb,  -- {"SM": 12, "PC": [13.3, 14.8]}
  source_label TEXT NOT NULL,
  source_url   TEXT NOT NULL CHECK (source_url ~ '^https?://'),
  note_fr      TEXT,
  note_ar      TEXT,
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- 3. Quiz chronométrés
CREATE TABLE IF NOT EXISTS quizzes (
  slug        TEXT PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_fr    TEXT NOT NULL,
  title_ar    TEXT,
  seconds     INT  NOT NULL DEFAULT 300 CHECK (seconds BETWEEN 30 AND 7200),
  questions   JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{"q": "...", "options": ["a","b","c","d"], "answer": 1}]
  visible     BOOLEAN NOT NULL DEFAULT true,
  sort        INT NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 4. Banque d'annales
CREATE TABLE IF NOT EXISTS annales (
  id          BIGSERIAL PRIMARY KEY,
  school      TEXT NOT NULL,
  year        INT  NOT NULL CHECK (year BETWEEN 1990 AND 2100),
  title_fr    TEXT NOT NULL,
  title_ar    TEXT,
  file_url    TEXT,      -- sujet (PDF)
  corrige_url TEXT,      -- corrigé (PDF), facultatif
  quiz_slug   TEXT REFERENCES quizzes(slug) ON DELETE SET NULL,
  premium     BOOLEAN NOT NULL DEFAULT false,
  visible     BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 5. Réglages (ex. date de dernière vérification des concours)
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- updated_at automatique (fonction créée en v3)
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['concours','seuils','quizzes','annales','site_settings'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I_touch ON %I', t, t);
    EXECUTE format('CREATE TRIGGER %I_touch BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at()', t, t);
  END LOOP;
END $$;

-- 6. Sécurité : tout le monde lit ce qui est visible, seuls les admins écrivent
ALTER TABLE concours      ENABLE ROW LEVEL SECURITY;
ALTER TABLE seuils        ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE annales       ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public reads concours" ON concours;
CREATE POLICY "public reads concours" ON concours FOR SELECT USING (visible OR public.is_admin());
DROP POLICY IF EXISTS "public reads seuils" ON seuils;
CREATE POLICY "public reads seuils" ON seuils FOR SELECT USING (true);
DROP POLICY IF EXISTS "public reads quizzes" ON quizzes;
CREATE POLICY "public reads quizzes" ON quizzes FOR SELECT USING (visible OR public.is_admin());
DROP POLICY IF EXISTS "public reads annales" ON annales;
CREATE POLICY "public reads annales" ON annales FOR SELECT USING (visible OR public.is_admin());
DROP POLICY IF EXISTS "public reads settings" ON site_settings;
CREATE POLICY "public reads settings" ON site_settings FOR SELECT USING (true);

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['concours','seuils','quizzes','annales','site_settings'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "admins write %s" ON %I', t, t);
    EXECUTE format('CREATE POLICY "admins write %s" ON %I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())', t, t);
  END LOOP;
END $$;

-- 7. Fichiers PDF des annales (bucket public "annales")
INSERT INTO storage.buckets (id, name, public) VALUES ('annales', 'annales', true) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "public read annales files" ON storage.objects;
CREATE POLICY "public read annales files" ON storage.objects FOR SELECT USING (bucket_id = 'annales');
DROP POLICY IF EXISTS "admins upload annales files" ON storage.objects;
CREATE POLICY "admins upload annales files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'annales' AND public.is_admin());
DROP POLICY IF EXISTS "admins update annales files" ON storage.objects;
CREATE POLICY "admins update annales files" ON storage.objects FOR UPDATE USING (bucket_id = 'annales' AND public.is_admin());
DROP POLICY IF EXISTS "admins delete annales files" ON storage.objects;
CREATE POLICY "admins delete annales files" ON storage.objects FOR DELETE USING (bucket_id = 'annales' AND public.is_admin());
