-- ============================================================
-- MIGRATION V2 — à exécuter APRÈS schema.sql (SQL Editor Supabase)
-- Ajoute : favoris, préférences d'alerte WhatsApp, salons, listes
-- d'attente, annales, avis, et le journal des notifications envoyées.
-- ============================================================

-- 1. Profil : téléphone + consentement WhatsApp (opt-in obligatoire)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_optin BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_optin_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS alert_prefs JSONB
  DEFAULT '{"opening":true,"j7":true,"j1":true,"sms":false}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cc_grade NUMERIC(5,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS national_grade NUMERIC(5,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS national_is_estimate BOOLEAN DEFAULT true;

-- Création automatique du profil à chaque inscription (Google ou WhatsApp)
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, whatsapp_optin, whatsapp_optin_at)
  VALUES (NEW.id, NEW.phone, NEW.phone IS NOT NULL, CASE WHEN NEW.phone IS NOT NULL THEN now() END)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Favoris (par slug d'école, comme le front)
--    Référence profiles(id) pour permettre la jointure favoris → téléphone
CREATE TABLE IF NOT EXISTS favorites (
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  school_slug TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, school_slug)
);
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own favorites" ON favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. Deadlines rattachées directement à une école + type d'événement
ALTER TABLE deadlines ADD COLUMN IF NOT EXISTS school_slug TEXT;
CREATE INDEX IF NOT EXISTS idx_deadlines_school ON deadlines(school_slug);

-- 4. Journal des notifications (évite les doublons, sert d'audit)
CREATE TABLE IF NOT EXISTS notifications_log (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deadline_id INT REFERENCES deadlines(id) ON DELETE CASCADE,
  trigger     TEXT NOT NULL,         -- 'opening' | 'j7' | 'j1'
  channel     TEXT NOT NULL,         -- 'whatsapp' | 'sms'
  status      TEXT NOT NULL,         -- 'sent' | 'error'
  error       TEXT,
  sent_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, deadline_id, trigger, channel)
);
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;  -- lecture/écriture : service role uniquement

-- 5. Salons communautaires (Realtime)
CREATE TABLE IF NOT EXISTS messages (
  id          BIGSERIAL PRIMARY KEY,
  room        TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author      TEXT NOT NULL,
  body        TEXT NOT NULL CHECK (char_length(body) <= 500),
  hidden      BOOLEAN DEFAULT false,      -- masqué par un modérateur
  reports     INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(room, created_at);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read visible messages" ON messages FOR SELECT USING (hidden = false);
CREATE POLICY "post own messages"     ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Activer le temps réel sur la table :
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 6. Remontées de listes d'attente
CREATE TABLE IF NOT EXISTS waitlist_reports (
  id          BIGSERIAL PRIMARY KEY,
  room        TEXT NOT NULL,
  school      TEXT NOT NULL,
  list_number INT DEFAULT 1,
  rank_called INT NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE waitlist_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read reports" ON waitlist_reports FOR SELECT USING (true);
CREATE POLICY "post reports" ON waitlist_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Banque d'annales (fichiers dans Supabase Storage, bucket "annales")
CREATE TABLE IF NOT EXISTS annales (
  id          SERIAL PRIMARY KEY,
  school_slug TEXT NOT NULL,
  year        INT NOT NULL,
  title_fr    TEXT NOT NULL,
  title_ar    TEXT NOT NULL,
  file_path   TEXT,                 -- chemin dans le bucket
  premium     BOOLEAN DEFAULT false,
  rights_ok   BOOLEAN DEFAULT false,  -- droits de diffusion vérifiés
  created_at  TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE annales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read published annales" ON annales FOR SELECT USING (rights_ok = true);

-- 8. Questions de quiz
CREATE TABLE IF NOT EXISTS quiz_questions (
  id          SERIAL PRIMARY KEY,
  quiz        TEXT NOT NULL,          -- 'maths' | 'tafem' | 'sante'...
  question    TEXT NOT NULL,
  options     JSONB NOT NULL,         -- ["A","B","C","D"]
  answer      INT NOT NULL,
  explanation TEXT,
  premium     BOOLEAN DEFAULT false
);
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read free questions" ON quiz_questions FOR SELECT USING (premium = false);

-- 9. Avis d'anciens étudiants (publiés après modération uniquement)
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  school_slug TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_role TEXT,                   -- 'Étudiant 3ème année', 'Lauréat 2024'
  stars       INT CHECK (stars BETWEEN 1 AND 5),
  body        TEXT NOT NULL,
  approved    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read approved reviews" ON reviews FOR SELECT USING (approved = true);
CREATE POLICY "post own review"       ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
