import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoClient";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ available: false, message: "Username is required" }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();
    const isValid = /^[a-zA-Z0-9_-]{3,32}$/.test(cleanUsername);
    if (!isValid) {
      return NextResponse.json({ available: false, message: "Invalid username format" }, { status: 400 });
    }

    const db = await connectDB();
    const user = await db.collection("users").findOne({ username: cleanUsername });

    return NextResponse.json({
      available: !user,
      message: user ? "This BioLynk is already claimed" : "Username is available",
    });
  } catch (error) {
    console.error("Check username API error:", error);
    return NextResponse.json({ available: false, message: "Internal Server Error" }, { status: 500 });
  }
}
