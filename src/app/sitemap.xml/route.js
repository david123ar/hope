import { adminDB } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snapshot = await adminDB
      .collection("publishers")
      .select() // no fields needed, just doc IDs
      .get();

    const baseUrl = "https://biolynk.shoko.fun";

    const urls = snapshot.docs.map(
      (doc) => `
    <url>
      <loc>${baseUrl}/${doc.id}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls.join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
