"use client";
import LegalPage from "../../components/LegalPage";

export default function Page() {
  return (
    <LegalPage
      title={{ fr: "À propos de Maslaki", ar: "من نحن" }}
      intro={{ fr: "Maslaki (« mon parcours ») aide les élèves marocains et leurs parents à choisir leur orientation après le bac, avec des informations claires, à jour et sourcées.", ar: "مسلكي يساعد التلاميذ المغاربة وأسرهم على اختيار توجيههم بعد الباك بمعلومات واضحة ومحينة وموثقة." }}
      sections={[
        { h: { fr: "Notre mission", ar: "مهمتنا" }, p: { fr: "Rassembler en un seul endroit toutes les écoles du Maroc, les seuils de présélection, les concours en cours et l'actualité de l'orientation, en arabe et en français, gratuitement.", ar: "جمع كل مدارس المغرب وعتبات الانتقاء والمباريات الجارية ومستجدات التوجيه في مكان واحد، بالعربية والفرنسية، مجانًا." } },
        { h: { fr: "Nos principes", ar: "مبادئنا" }, p: { fr: "• Chaque date et chaque seuil sont accompagnés de leur source.\n• Ce qui n'est pas confirmé est clairement indiqué comme tel.\n• Nous ne sommes affiliés à aucune école : aucun établissement ne paie pour être mieux classé.", ar: "• كل تاريخ وعتبة مرفقان بمصدرهما.\n• ما لم يتأكد بعد نشير إليه بوضوح.\n• لسنا تابعين لأي مدرسة." } }
      ]}
    />
  );
}
