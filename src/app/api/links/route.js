import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoClient";
import { randomUUID } from "crypto";

// POST: Add a new link and ensure default design exists
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, url, visible } = await request.json();
    if (!name || !url || typeof visible !== "boolean") {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const db = await connectDB();
    const links = db.collection("links");

    // Ensure user document has default design
    const existingUser = await links.findOne({ _id: session.user.username });
    if (!existingUser?.design) {
      await links.updateOne(
        { _id: session.user.username },
        { $set: { design: "/done.jpeg" } },
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

    await links.updateOne(
      { _id: session.user.username },
      {
        $push: {
          links: {
            $each: [link],
            $position: 0, // Insert at top
          },
        },
      },
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
  if (!session?.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    const db = await connectDB();

    await db.collection("links").updateOne(
      { _id: session.user.username },
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
  if (!session?.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, field, value } = await request.json();
    const db = await connectDB();

    await db.collection("links").updateOne(
      { _id: session.user.username, "links.id": id },
      { $set: { [`links.$.${field}`]: value } }
    );

    return NextResponse.json({ message: "Link updated" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Get all links sorted by descending position + design
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDB();
    const doc = await db.collection("links").findOne({ _id: session.user.username });

    // 🔁 Sort in descending order so latest appears first
    const sortedLinks = doc?.links;
    const design = doc?.design || "/done.jpeg";

    return NextResponse.json({ links: sortedLinks, design });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// PATCH: Save selected design
export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { design } = await request.json();
    if (!design) {
      return NextResponse.json({ error: "Design not provided" }, { status: 400 });
    }

    const db = await connectDB();
    await db.collection("links").updateOne(
      { _id: session.user.username },
      { $set: { design } },
      { upsert: true }
    );

    return NextResponse.json({ message: "Design updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
