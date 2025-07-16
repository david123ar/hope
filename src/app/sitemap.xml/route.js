import { connectDB } from "@/lib/mongoClient";

export async function GET() {
  const db = await connectDB();

  const publishers = await db
    .collection("publishers")
    .find({}, { projection: { _id: 1 } })
    .toArray();

  const baseUrl = "https://biolynk.shoko.fun";

  const urls = publishers.map(
    (pub) => `
    <url>
      <loc>${baseUrl}/${pub._id}</loc>
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
    },
  });
}
