-- ============================================================
-- MIGRATION V3 — Actualités + back-office admin
-- À exécuter APRÈS schema.sql et migration_v2.sql (SQL Editor Supabase)
-- ============================================================

-- 1. Fonction "est-ce que l'utilisateur connecté est admin ?"
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- 2. SÉCURITÉ : empêcher un utilisateur de se donner lui-même le rôle admin.
--    (La politique "own profile" de schema.sql autorise la modification de son
--    propre profil, y compris la colonne role : ce trigger ferme la faille.)
--    Depuis le SQL Editor (pas de JWT), la modification reste possible.
CREATE OR REPLACE FUNCTION public.protect_profile_role() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() IN ('anon', 'authenticated') AND NOT public.is_admin() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.role := 'eleve';
    ELSIF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Modification du rôle interdite';
    END IF;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS profiles_protect_role ON profiles;
CREATE TRIGGER profiles_protect_role BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- 3. Table des actualités
CREATE TABLE IF NOT EXISTS news (
  id           BIGSERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category     TEXT NOT NULL DEFAULT 'orientation'
               CHECK (category IN ('concours','resultats','bourses','etranger','orientation','recrutement')),
  title_fr     TEXT NOT NULL,
  title_ar     TEXT,
  excerpt_fr   TEXT,
  excerpt_ar   TEXT,
  body_fr      TEXT NOT NULL DEFAULT '',
  body_ar      TEXT,
  cover_url    TEXT,
  source_label TEXT,
  source_url   TEXT,
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  pinned       BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  author_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(status, published_at DESC);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
DROP TRIGGER IF EXISTS news_touch ON news;
CREATE TRIGGER news_touch BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads published news" ON news FOR SELECT
  USING (status = 'published' AND published_at <= now());
CREATE POLICY "admins read all news" ON news FOR SELECT USING (public.is_admin());
CREATE POLICY "admins insert news" ON news FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "admins update news" ON news FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete news" ON news FOR DELETE USING (public.is_admin());

-- 4. Images des articles (Supabase Storage, bucket public "news")
INSERT INTO storage.buckets (id, name, public) VALUES ('news', 'news', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "public read news images" ON storage.objects FOR SELECT USING (bucket_id = 'news');
CREATE POLICY "admins upload news images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'news' AND public.is_admin());
CREATE POLICY "admins update news images" ON storage.objects FOR UPDATE USING (bucket_id = 'news' AND public.is_admin());
CREATE POLICY "admins delete news images" ON storage.objects FOR DELETE USING (bucket_id = 'news' AND public.is_admin());

-- ============================================================
-- 5. TE DONNER LE RÔLE ADMIN (une seule fois)
--    a) Supabase > Authentication > Users > "Add user" : ton email + mot de passe
--    b) Remplace l'email ci-dessous puis exécute ces deux lignes :
-- ============================================================
-- INSERT INTO profiles (id) SELECT id FROM auth.users WHERE email = 'TON_EMAIL@exemple.com' ON CONFLICT (id) DO NOTHING;
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'TON_EMAIL@exemple.com');
