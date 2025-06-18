import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoClient";
import { randomUUID } from "crypto";

// POST: Add a new link and ensure default design exists
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, url, visible } = await request.json();
    if (!name || !url || typeof visible !== "boolean") {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const db = await connectDB();
    const users = db.collection("links");

    // Ensure user document has default design
    const existingUser = await users.findOne({ _id: session.user.id });
    if (!existingUser?.design) {
      await users.updateOne(
        { _id: session.user.id },
        { $set: { design: "/done.jpg" } },
        { upsert: true }
      );
    }

    const link = {
      id: randomUUID(),
      name,
      url,
      visible,
      position: Date.now(),
    };

    await users.updateOne(
      { _id: session.user.id },
      { $push: { links: link } },
      { upsert: true }
    );

    return NextResponse.json({ message: "Link stored" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a link by id
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    const db = await connectDB();

    await db.collection("links").updateOne(
      { _id: session.user.id },
      { $pull: { links: { id } } }
    );

    return NextResponse.json({ message: "Link deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update a specific field of a specific link
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, field, value } = await request.json();
    const db = await connectDB();

    await db.collection("links").updateOne(
      { _id: session.user.id, "links.id": id },
      { $set: { [`links.$.${field}`]: value } }
    );

    return NextResponse.json({ message: "Link updated" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Get all links sorted by position + design
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDB();
    const doc = await db.collection("links").findOne({ _id: session.user.id });

    const sortedLinks = doc?.links?.sort((a, b) => a.position - b.position) || [];
    const design = doc?.design || "/done.jpg";

    return NextResponse.json({ links: sortedLinks, design });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Save selected design
export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { design } = await request.json();
    if (!design) {
      return NextResponse.json({ error: "Design not provided" }, { status: 400 });
    }

    const db = await connectDB();
    await db.collection("links").updateOne(
      { _id: session.user.id },
      { $set: { design } },
      { upsert: true }
    );

    return NextResponse.json({ message: "Design updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
