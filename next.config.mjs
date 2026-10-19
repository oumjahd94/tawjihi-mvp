/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/calendrier", destination: "/concours", permanent: true },
      { source: "/filieres/:slug", destination: "/ecoles", permanent: false }
    ];
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }] }
};
export default nextConfig;
