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
    return NextResponse.json({ error: "Missing date range parameters" }, { status: 400 });
  }

  try {
    // Connect to MongoDB
    const db = await connectDB();

    // Get publisher info
    const publisher = await db.collection("publishers").findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!publisher || !publisher.adUnit?.id) {
      return NextResponse.json({ error: "Publisher or adUnit ID not found" }, { status: 404 });
    }

    const adUnitId = publisher.adUnit.id;

    // Query stats from adStats collection
    const stats = await db.collection("adStats").find({
      adId: adUnitId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).toArray();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("MongoDB adStats fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch stats from DB" }, { status: 500 });
  }
}
