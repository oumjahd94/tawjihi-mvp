/** @type {import('next').NextConfig} */
const nextConfig = {
  // L'ancienne route /filieres redirige vers les nouvelles fiches écoles
  async redirects() {
    return [{ source: "/filieres/:slug", destination: "/ecoles", permanent: false }];
  }
};
export default nextConfig;
