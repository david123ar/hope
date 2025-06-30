import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongoClient";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
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

    // ✅ If username is AnimeArenaX, use Adsterratools API
    if (session.user.username === "AnimeArenaX") {
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

    // 🌐 Fetch publisher from DB for all other users
    const publisher = await db.collection("publishers").findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!publisher || !publisher.adUnit?.id) {
      return NextResponse.json({ error: "Publisher or adUnit not found" }, { status: 404 });
    }

    const adUnitId = publisher.adUnit.id;

    const stats = await db.collection("adStats").find({
      adId: adUnitId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).toArray();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
