/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.js"],
  theme: {
    extend: {
      colors: {
        // Émeraude : réussite, sérieux, identité marocaine
        brand: { 50: "#ECF6F1", 100: "#D2EBDF", 200: "#A6D6C0", 500: "#14936D", 600: "#0E7A5A", 700: "#0B6249", 800: "#084A37", 900: "#06372A", 950: "#03231B" },
        // Or : accent premium, utilisé avec parcimonie
        gold: { 50: "#FBF6E9", 100: "#F5E8C4", 300: "#E6C77E", 400: "#DDB45E", 500: "#C9962E", 700: "#86621A" },
        ink: { DEFAULT: "#11201B", soft: "#4A5A54", faint: "#86948E" },
        paper: "#F4F6F5",
        line: "#E1E7E4",
        amber: { DEFAULT: "#C76A06", soft: "#FCEFDD" },
        coral: { DEFAULT: "#CF3F3F", soft: "#FBE8E8" }
      },
      fontFamily: { sans: ['"Readex Pro"', "Tajawal", "system-ui", "sans-serif"] },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: {
        card: "0 1px 2px rgba(17,32,27,.04), 0 6px 20px -6px rgba(17,32,27,.08)",
        lift: "0 16px 40px -12px rgba(6,55,42,.25)"
      },
      letterSpacing: { tightish: "-0.02em" }
    }
  },
  plugins: []
};
