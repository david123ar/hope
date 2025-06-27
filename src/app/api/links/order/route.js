import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoClient";

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const db = await connectDB();
    const collection = db.collection("links");

    const userDoc = await collection.findOne({ _id: session.user.username });
    if (!userDoc || !Array.isArray(userDoc.links)) {
      return NextResponse.json({ error: "No links found" }, { status: 404 });
    }

    const positionMap = new Map(orderedIds.map((l) => [l.id, l.position]));

    const updatedLinks = userDoc.links.map((link) => {
      const newPosition = positionMap.get(link.id);
      return typeof newPosition === "number"
        ? { ...link, position: newPosition }
        : link;
    });

    await collection.updateOne(
      { _id: session.user.username },
      { $set: { links: updatedLinks } }
    );

    return NextResponse.json({ message: "Link order updated" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
