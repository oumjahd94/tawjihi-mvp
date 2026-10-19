"use client";
import LegalPage from "../../components/LegalPage";
import { SITE } from "../../lib/site";

export default function Page() {
  return (
    <LegalPage
      title={{ fr: "Contact", ar: "اتصل بنا" }}
      intro={{ fr: "Une erreur dans une fiche, une date à ajouter, un partenariat ? Écris-nous.", ar: "خطأ في بطاقة، تاريخ لإضافته، شراكة؟ راسلنا." }}
      sections={[
        { h: { fr: "Par email", ar: "عبر البريد الإلكتروني" }, p: { fr: SITE.legal.email, ar: SITE.legal.email } },
        { h: { fr: "Établissements", ar: "المؤسسات" }, p: { fr: "Vous représentez une école et souhaitez corriger ou compléter votre fiche ? Envoyez-nous le lien vers votre source officielle.", ar: "تمثلون مؤسسة وترغبون في تصحيح بطاقتكم؟ أرسلوا لنا رابط المصدر الرسمي." } }
      ]}
    />
  );
}
