"use client";
import LegalPage from "../../components/LegalPage";
import { SITE } from "../../lib/site";

export default function Page() {
  const L = SITE.legal;
  return (
    <LegalPage
      title={{ fr: "Mentions légales", ar: "الإشعار القانوني" }}
      sections={[
        { h: { fr: "Éditeur du site", ar: "ناشر الموقع" }, p: { fr: `${L.editor}\n${L.address}\nContact : ${L.email}`, ar: `${L.editor}\n${L.address}\nالتواصل: ${L.email}` } },
        { h: { fr: "Hébergement", ar: "الاستضافة" }, p: { fr: L.host, ar: L.host } },
        { h: { fr: "Fiabilité des informations", ar: "موثوقية المعلومات" }, p: { fr: "Maslaki rassemble des informations publiées par les établissements, le ministère et la presse, en citant ses sources. Malgré notre vigilance, seuils, dates et conditions peuvent changer : seules les annonces officielles des établissements font foi. Les dates marquées « à confirmer » sont des estimations.", ar: "يجمع مسلكي معلومات منشورة من طرف المؤسسات والوزارة والصحافة مع ذكر المصادر. قد تتغير العتبات والتواريخ والشروط: الإعلانات الرسمية وحدها المرجع." } },
        { h: { fr: "Propriété intellectuelle", ar: "الملكية الفكرية" }, p: { fr: "Les textes, le design et le logo de Maslaki sont protégés. Les noms et sigles des établissements appartiennent à leurs titulaires respectifs ; Maslaki n'est affilié à aucun établissement.", ar: "النصوص والتصميم وشعار مسلكي محمية. أسماء المؤسسات ورموزها في ملكية أصحابها؛ مسلكي غير تابع لأي مؤسسة." } },
        { h: { fr: "Publicité", ar: "الإشهار" }, p: { fr: "Le site est financé en partie par la publicité (Google AdSense). Les annonces sont signalées comme telles et ne constituent pas une recommandation de Maslaki.", ar: "يمول الموقع جزئيًا بالإشهار. الإعلانات مميزة ولا تعتبر توصية من مسلكي." } }
      ]}
    />
  );
}
