/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Bleu Majorelle : couleur de marque, iconique et 100 % marocaine
        majorelle: { DEFAULT: "#2F45D0", deep: "#1C2B95", soft: "#E9ECFC" },
        ink: { DEFAULT: "#0D1330", soft: "#4A5070", faint: "#8A8FA8" },
        paper: "#F4F5FA",
        line: "#E3E5EF",
        // Couleurs de verdict (jauges)
        mint: { DEFAULT: "#0E9F77", soft: "#E3F6F0" },
        saffron: { DEFAULT: "#E8970A", soft: "#FDF3DF" },
        coral: { DEFAULT: "#DE4747", soft: "#FCE8E8" }
      },
      fontFamily: {
        sans: ['"Readex Pro"', "Tajawal", "system-ui", "sans-serif"]
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: {
        card: "0 1px 2px rgba(13,19,48,.04), 0 4px 16px rgba(13,19,48,.05)",
        lift: "0 8px 30px rgba(13,19,48,.12)"
      }
    }
  },
  plugins: []
};
