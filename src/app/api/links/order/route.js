import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoClient";

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderedIds } = await request.json();
    const db = await connectDB();

    const userDoc = await db.collection("links").findOne({ _id: session.user.id });
    if (!userDoc) {
      return NextResponse.json({ error: "No links found" }, { status: 404 });
    }

    // Update positions based on orderedIds
    const updatedLinks = userDoc.links.map(link => {
      const match = orderedIds.find(l => l.id === link.id);
      return match ? { ...link, position: match.position } : link;
    });

    await db.collection("links").updateOne(
      { _id: session.user.id },
      { $set: { links: updatedLinks } }
    );

    return NextResponse.json({ message: "Order updated" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
