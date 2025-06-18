import { connectDB } from "@/lib/mongoClient";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user");

    if (!userId || !ObjectId.isValid(userId)) {
      return new Response(JSON.stringify({ error: "Invalid or missing user ID" }), { status: 400 });
    }

    const db = await connectDB();
    const publishers = db.collection("publishers");

    const publisher = await publishers.findOne({ _id: new ObjectId(userId) });

    if (!publisher || !publisher.adUnit) {
      return new Response(JSON.stringify({ error: "Ad not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(publisher.adUnit), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error in /api/ad:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
