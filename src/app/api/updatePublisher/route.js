import { connectDB } from "@/lib/mongoClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const db = await connectDB();
    const publishers = db.collection("publishers");
    const { username, adUnit } = await req.json();

    if (!username || !adUnit) {
      return NextResponse.json(
        { message: "Username and adUnit are required" },
        { status: 400 }
      );
    }

    const { scriptUrl, containerId, clickUrl, apiKey, id, index } = adUnit;

    if (!scriptUrl || !containerId || !clickUrl || !apiKey) {
      return NextResponse.json(
        { message: "All adUnit fields must be filled" },
        { status: 400 }
      );
    }

    const result = await publishers.updateOne(
      { _id: username },
      {
        $set: {
          adUnit: {
            id,
            index,
            apiKey,
            scriptUrl,
            containerId,
            clickUrl,
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to update adUnit. Publisher not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Ad unit updated successfully" });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
