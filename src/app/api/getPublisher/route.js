import { connectDB } from "@/lib/mongoClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ message: "Username is required" }, { status: 400 });
  }

  try {
    const db = await connectDB();
    const publishers = db.collection("publishers");

    const publisher = await publishers.findOne({ _id: username });

    if (!publisher) {
      return NextResponse.json({ message: "Publisher not found" }, { status: 404 });
    }

    return NextResponse.json({
      adUnit: publisher.adUnit || {},
    });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
