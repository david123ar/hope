import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDB } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { randomUUID } from "crypto";

/* ============================
   AUTH HELPER
============================ */
async function getUser(session) {
  return session?.user?.username || null;
}

/* ============================
   POST: Add new link
============================ */
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const username = await getUser(session);

  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, url, visible } = await request.json();

    if (!name || !url || typeof visible !== "boolean") {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const docRef = adminDB.collection("links").doc(username);

    const link = {
      id: randomUUID(),
      name,
      url,
      visible,
      position: Date.now(),
    };

    // SAFE: creates doc if missing, appends link, keeps design
    await docRef.set(
      {
        design: "/done.jpeg",
        links: FieldValue.arrayUnion(link),
      },
      { merge: true }
    );

    return NextResponse.json({ message: "Link stored" });
  } catch (error) {
    console.error("POST /links error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ============================
   DELETE: Remove link by id
============================ */
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  const username = await getUser(session);

  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing link ID" }, { status: 400 });
    }

    const docRef = adminDB.collection("links").doc(username);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "No links found" }, { status: 404 });
    }

    const data = snap.data();
    const updatedLinks = (data.links || []).filter(
      (link) => link.id !== id
    );

    await docRef.update({ links: updatedLinks });

    return NextResponse.json({ message: "Link deleted" });
  } catch (error) {
    console.error("DELETE /links error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ============================
   PUT: Update link field
============================ */
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  const username = await getUser(session);

  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, field, value } = await request.json();

    if (!id || !field) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const docRef = adminDB.collection("links").doc(username);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "No links found" }, { status: 404 });
    }

    const data = snap.data();
    const updatedLinks = (data.links || []).map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );

    await docRef.update({ links: updatedLinks });

    return NextResponse.json({ message: "Link updated" });
  } catch (error) {
    console.error("PUT /links error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ============================
   GET: Fetch links + design
============================ */
export async function GET() {
  const session = await getServerSession(authOptions);
  const username = await getUser(session);

  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const docRef = adminDB.collection("links").doc(username);
    const snap = await docRef.get();

    const data = snap.exists
      ? snap.data()
      : { links: [], design: "/done.jpeg" };

    const sortedLinks = (data.links || []).sort(
      (a, b) => b.position - a.position
    );

    return NextResponse.json({
      links: sortedLinks,
      design: data.design || "/done.jpeg",
    });
  } catch (error) {
    console.error("GET /links error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ============================
   PATCH: Update design
============================ */
export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  const username = await getUser(session);

  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { design } = await request.json();

    if (!design) {
      return NextResponse.json(
        { error: "Design not provided" },
        { status: 400 }
      );
    }

    const docRef = adminDB.collection("links").doc(username);

    await docRef.set({ design }, { merge: true });

    return NextResponse.json({ message: "Design updated successfully" });
  } catch (error) {
    console.error("PATCH /links error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
