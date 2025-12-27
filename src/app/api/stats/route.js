import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebaseAdmin";

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
    const username = session.user.username;

    // Special case: AnimeArenaX
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

    // Fetch publisher data from Firestore
    const publisherRef = adminDB.collection("publishers").doc(username);
    const snap = await publisherRef.get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "Publisher not found" },
        { status: 404 }
      );
    }

    const publisher = snap.data();

    if (!publisher?.adUnit?.id) {
      return NextResponse.json(
        { error: "Publisher adUnit not found" },
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

    // Inject custom revenue
    if (
      ["Roromoazoro", "Hanimereels2", "kiml"].includes(username) &&
      json.items?.length
    ) {
      json.items = json.items.map((item) => {
        // Inject for 2025-07-03
        if (
          item.date === "2025-07-03" &&
          ["Roromoazoro", "kiml"].includes(username)
        ) {
          const impressions = item.impression || 33;
          const revenue = 1.134;
          const cpm = (revenue / impressions) * 1000;
          const ctr = impressions > 0 ? (item.clicks / impressions) * 100 : 0;

          return {
            ...item,
            impression: impressions,
            revenue,
            cpm: parseFloat(cpm.toFixed(3)),
            ctr: parseFloat(ctr.toFixed(3)),
          };
        }

        // Inject for 2025-07-12
        if (item.date === "2025-07-12" && username === "Hanimereels2") {
          const impressions = 568;
          const revenue = 1.3;
          const cpm = (revenue / impressions) * 1000;
          const ctr = impressions > 0 ? (item.clicks / impressions) * 100 : 0;

          return {
            ...item,
            impression: impressions,
            revenue,
            cpm: parseFloat(cpm.toFixed(3)),
            ctr: parseFloat(ctr.toFixed(3)),
          };
        }

        // Inject for 2025-07-13
        if (item.date === "2025-07-13" && username === "Hanimereels2") {
          const impressions = item.impression || 100;
          const revenue = 0.965;
          const cpm = (revenue / impressions) * 1000;
          const ctr = impressions > 0 ? (item.clicks / impressions) * 100 : 0;

          return {
            ...item,
            impression: impressions,
            revenue,
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
