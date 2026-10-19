-- ============================================================
-- DONNÉES D'EXEMPLE (seed) — à exécuter APRÈS schema.sql
-- ⚠️ Seuils et dates à VÉRIFIER : ce sont des exemples réalistes
-- pour tester le site, pas des données officielles.
-- ============================================================

INSERT INTO bac_types (code, label_fr, label_ar) VALUES
 ('SM',  'Sciences Mathématiques',            'علوم رياضية'),
 ('PC',  'Sciences Physiques (PC)',           'علوم فيزيائية'),
 ('SVT', 'Sciences de la Vie et de la Terre', 'علوم الحياة والأرض'),
 ('ECO', 'Sciences Économiques',              'علوم اقتصادية'),
 ('LET', 'Lettres et Sciences Humaines',      'آداب وعلوم إنسانية');

INSERT INTO cities (name_fr, name_ar, region_fr) VALUES
 ('Rabat',   'الرباط',   'Rabat-Salé-Kénitra'),
 ('Kénitra', 'القنيطرة', 'Rabat-Salé-Kénitra'),
 ('Settat',  'سطات',     'Casablanca-Settat');

INSERT INTO domains (slug, label_fr, label_ar, icon) VALUES
 ('sante',      'Santé',        'الصحة',    '🩺'),
 ('ingenierie', 'Ingénierie',   'الهندسة',  '⚙️'),
 ('commerce',   'Commerce',     'التجارة',  '📊');

INSERT INTO institutions (slug, name_fr, name_ar, acronym, type, city_id) VALUES
 ('fmp-rabat',    'Faculté de Médecine et de Pharmacie de Rabat', 'كلية الطب والصيدلة بالرباط', 'FMP',  'public', 1),
 ('ensa-kenitra', 'École Nationale des Sciences Appliquées de Kénitra', 'المدرسة الوطنية للعلوم التطبيقية القنيطرة', 'ENSA', 'public', 2),
 ('encg-settat',  'École Nationale de Commerce et de Gestion de Settat', 'المدرسة الوطنية للتجارة والتسيير سطات', 'ENCG', 'public', 3);

INSERT INTO programs (slug, institution_id, domain_id, name_fr, name_ar, level, duration_years, diploma_fr, annual_fees_min, annual_fees_max, language_teaching, reality_check_fr, is_published) VALUES
 ('medecine-rabat',   1, 1, 'Médecine générale', 'الطب العام', 'post-bac', 7, 'Doctorat en médecine', 0, 0, 'FR',
  '7 années exigeantes, internat difficile. Forte demande mais concentration urbaine des postes.', true),
 ('ensa-kenitra-gi',  2, 2, 'Génie Informatique', 'هندسة المعلوميات', 'post-bac', 5, 'Diplôme d''ingénieur d''État', 0, 0, 'FR',
  'Marché de l''emploi très favorable. Les 2 années de prépa intégrée sont intenses.', true),
 ('encg-settat',      3, 3, 'Gestion / Commerce', 'التسيير والتجارة', 'post-bac', 5, 'Diplôme ENCG', 0, 0, 'FR',
  'Concours TAFEM sélectif après présélection. Bonne insertion, forte concurrence entre lauréats.', true);

-- Seuils sur 2 années → permet d'afficher la tendance
INSERT INTO admission_thresholds (program_id, bac_type_id, year, threshold, selection_mode, verified_at) VALUES
 (1, 1, 2025, 17.05, 'seuil+concours', now()),
 (1, 1, 2026, 17.20, 'seuil+concours', now()),
 (1, 2, 2026, 17.60, 'seuil+concours', now()),
 (1, 3, 2026, 17.90, 'seuil+concours', now()),
 (2, 1, 2025, 14.90, 'seuil', now()),
 (2, 1, 2026, 15.10, 'seuil', now()),
 (2, 2, 2026, 15.80, 'seuil', now()),
 (2, 3, 2026, 16.20, 'seuil', now()),
 (3, 1, 2026, 14.00, 'seuil+concours', now()),
 (3, 2, 2026, 14.30, 'seuil+concours', now()),
 (3, 4, 2026, 14.80, 'seuil+concours', now());

INSERT INTO competitions (slug, name_fr, name_ar, year) VALUES
 ('tafem-2026', 'Concours TAFEM (ENCG)', 'مباراة ولوج المدارس الوطنية للتجارة والتسيير', 2026);

INSERT INTO program_competitions (program_id, competition_id) VALUES (3, 1);

INSERT INTO deadlines (competition_id, program_id, kind, label_fr, label_ar, due_date, verified_at) VALUES
 (NULL, 2, 'inscription_fin', 'Clôture des candidatures ENSA (Tawjihi)', 'آخر أجل للترشح لولوج ENSA', '2026-07-25', now()),
 (1, NULL, 'epreuve_ecrite', 'Épreuve écrite du TAFEM', 'الاختبار الكتابي لمباراة TAFEM', '2026-07-28', now()),
 (NULL, 1, 'resultats_presel', 'Résultats de présélection médecine', 'نتائج الانتقاء الأولي للطب', '2026-08-02', now());

INSERT INTO careers (slug, title_fr, title_ar, salary_junior_min, salary_junior_max, market_demand) VALUES
 ('medecin-generaliste', 'Médecin généraliste', 'طبيب عام', 8000, 15000, 'forte'),
 ('developpeur',         'Développeur logiciel', 'مطور برمجيات', 7000, 12000, 'forte'),
 ('auditeur',            'Auditeur / Contrôleur de gestion', 'مدقق حسابات', 6000, 10000, 'moyenne');

INSERT INTO program_careers (program_id, career_id) VALUES (1,1), (2,2), (3,3);
