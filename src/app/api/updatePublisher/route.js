import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
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

    const publisherRef = adminDB.collection("publishers").doc(username);
    const snap = await publisherRef.get();

    if (!snap.exists) {
      return NextResponse.json(
        { message: "Publisher not found" },
        { status: 404 }
      );
    }

    await publisherRef.update({
      adUnit: { id, index, apiKey, scriptUrl, containerId, clickUrl },
    });

    return NextResponse.json({ message: "Ad unit updated successfully" });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
