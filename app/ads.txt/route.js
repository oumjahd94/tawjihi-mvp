// Fichier ads.txt exigé par Google AdSense (servi à https://ton-domaine/ads.txt)
export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // ex. ca-pub-1234567890123456
  const body = client ? `google.com, ${client.replace("ca-", "")}, DIRECT, f08c47fec0942fa0\n` : "# AdSense non configuré\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
