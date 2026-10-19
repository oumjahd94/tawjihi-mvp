"use client";
import LegalPage from "../../components/LegalPage";
import { SITE } from "../../lib/site";

export default function Page() {
  const L = SITE.legal;
  return (
    <LegalPage
      title={{ fr: "Politique de confidentialité", ar: "سياسة الخصوصية" }}
      intro={{ fr: "Maslaki respecte ta vie privée. Cette page explique quelles données sont collectées, pourquoi, et comment exercer tes droits, conformément à la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.", ar: "يحترم مسلكي حياتك الخاصة. توضح هذه الصفحة المعطيات التي نجمعها ولماذا وكيف تمارس حقوقك، طبقًا للقانون رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي." }}
      sections={[
        { h: { fr: "Responsable du traitement", ar: "المسؤول عن المعالجة" }, p: { fr: `${L.editor}\n${L.address}\nContact : ${L.email}\nDéclaration CNDP : ${L.cndp}`, ar: `${L.editor}\n${L.address}\nالتواصل: ${L.email}\nالتصريح لدى اللجنة الوطنية لمراقبة حماية المعطيات: ${L.cndp}` } },
        { h: { fr: "Données collectées", ar: "المعطيات المجمعة" }, p: { fr: "• Sans compte : tes notes, ton type de bac, tes écoles suivies et ta langue sont enregistrés uniquement dans ton navigateur (stockage local), pas sur nos serveurs.\n• Avec un compte : ton nom ou ton numéro de téléphone (connexion Google ou WhatsApp), tes écoles suivies et tes préférences d'alerte.\n• Communauté : les messages que tu publies dans les salons.", ar: "• بدون حساب: نقطك ونوع الباك والمدارس المتابعة واللغة تحفظ فقط في متصفحك.\n• بحساب: اسمك أو رقم هاتفك، المدارس المتابعة وتفضيلات التنبيه.\n• المجتمع: الرسائل التي تنشرها في الصالونات." } },
        { h: { fr: "Finalités", ar: "الأغراض" }, p: { fr: "Afficher ton espace personnel, t'envoyer les alertes que tu as demandées (WhatsApp, SMS), faire fonctionner la communauté et mesurer l'audience du site. Nous ne vendons jamais tes données.", ar: "عرض فضائك الشخصي، إرسال التنبيهات التي طلبتها، تشغيل المجتمع وقياس الزيارات. لا نبيع معطياتك أبدًا." } },
        { h: { fr: "Publicité et cookies (Google AdSense)", ar: "الإشهار وملفات تعريف الارتباط" }, p: { fr: "Maslaki affiche des publicités via Google AdSense. Google et ses partenaires utilisent des cookies pour diffuser des annonces en fonction de tes visites sur ce site et sur d'autres sites. Tu peux désactiver la publicité personnalisée dans les paramètres des annonces Google (adssettings.google.com). Plus d'informations : policies.google.com/technologies/ads.", ar: "يعرض مسلكي إعلانات عبر Google AdSense. تستخدم Google وشركاؤها ملفات تعريف الارتباط لعرض إعلانات حسب زياراتك. يمكنك تعطيل الإعلانات المخصصة عبر adssettings.google.com." } },
        { h: { fr: "Mineurs", ar: "القاصرون" }, p: { fr: "Une grande partie de notre public est mineure. Les élèves de moins de 18 ans doivent avoir l'accord d'un parent pour créer un compte. Aucune donnée personnelle (téléphone, adresse) n'est autorisée dans les salons publics.", ar: "جزء كبير من جمهورنا قاصر. يجب على التلاميذ دون 18 سنة الحصول على موافقة أحد الوالدين لإنشاء حساب. لا يسمح بنشر أي معطيات شخصية في الصالونات." } },
        { h: { fr: "Hébergement et sous-traitants", ar: "الاستضافة والمتعاقدون" }, p: { fr: "Site hébergé par Vercel ; base de données Supabase ; messages WhatsApp via Meta. Ces prestataires peuvent traiter des données hors du Maroc, dans le cadre prévu par la loi 09-08.", ar: "الموقع مستضاف لدى Vercel، قاعدة البيانات Supabase، رسائل واتساب عبر Meta." } },
        { h: { fr: "Durée de conservation", ar: "مدة الاحتفاظ" }, p: { fr: "Les données de compte sont conservées tant que le compte est actif, puis supprimées dans un délai de 12 mois après la dernière connexion.", ar: "تحفظ معطيات الحساب ما دام نشطًا، ثم تحذف خلال 12 شهرًا بعد آخر اتصال." } },
        { h: { fr: "Tes droits", ar: "حقوقك" }, p: { fr: `Tu disposes d'un droit d'accès, de rectification et d'opposition (articles 7, 8 et 9 de la loi 09-08). Écris-nous à ${L.email}. Tu peux aussi saisir la CNDP (www.cndp.ma).`, ar: `لك الحق في الولوج والتصحيح والتعرض (المواد 7 و8 و9 من القانون 09-08). راسلنا على ${L.email}، ويمكنك أيضًا اللجوء إلى اللجنة الوطنية (www.cndp.ma).` } }
      ]}
    />
  );
}
