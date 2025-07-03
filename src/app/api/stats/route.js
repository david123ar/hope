import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongoClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "Missing date range parameters" },
      { status: 400 }
    );
  }

  try {
    const db = await connectDB();
    const username = session.user.username;

    // ✅ Special case: AnimeArenaX uses its own API key and domain ID
    if (username === "AnimeArenaX") {
      const apiKey = "47e883e8ed4e810c158f9dc6937f4fd0";
      const domainId = "3943648";
      const url = `https://api3.adsterratools.com/publisher/stats.json?start_date=${start}&finish_date=${end}&group_by=date&domain=${domainId}`;

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "X-API-Key": apiKey,
        },
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: "Failed to fetch Adsterra stats" },
          { status: res.status }
        );
      }

      const json = await res.json();
      return NextResponse.json(json);
    }

    // ✅ Fetch publisher data by username (_id = username)
    const publisher = await db.collection("publishers").findOne({
      _id: username,
    });

    if (!publisher || !publisher.adUnit?.id) {
      return NextResponse.json(
        { error: "Publisher or adUnit not found" },
        { status: 404 }
      );
    }

    const adUnitId = publisher.adUnit.id;
    const apiKey = "f7becce758687baa0a1fd8e200e2d4e4";
    const url = `https://api3.adsterratools.com/publisher/stats.json?start_date=${start}&finish_date=${end}&group_by=date&domain=${adUnitId}`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-API-Key": apiKey,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Adsterratools stats" },
        { status: res.status }
      );
    }

    const json = await res.json();

    // 🎁 Inject $1.134 revenue ONLY for 2025-07-03 for selected users
    if (
      ["Roromoazoro", "Hanimereels2", "kiml"].includes(username) &&
      json.items?.length
    ) {
      json.items = json.items.map((item) => {
        if (item.date === "2025-07-03") {
          const impressions = item.impression || 33;
          const revenue = 1.134;
          const cpm = (revenue / impressions) * 1000;
          const ctr = impressions > 0 ? (item.clicks / impressions) * 100 : 0;

          return {
            ...item,
            impression: impressions,
            revenue: revenue,
            cpm: parseFloat(cpm.toFixed(3)),
            ctr: parseFloat(ctr.toFixed(3)),
          };
        }
        return item;
      });
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
