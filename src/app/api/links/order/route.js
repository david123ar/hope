import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDB } from "@/lib/firebaseAdmin";

/* ============================
   PUT: Reorder links
============================ */
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  const username = session?.user?.username;

  if (!username) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { orderedIds } = await request.json();

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const docRef = adminDB.collection("links").doc(username);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "No links found" },
        { status: 404 }
      );
    }

    const data = snap.data();

    if (!Array.isArray(data.links)) {
      return NextResponse.json(
        { error: "No links found" },
        { status: 404 }
      );
    }

    /* --------------------------------
       Build id → position map
    -------------------------------- */
    const positionMap = new Map(
      orderedIds
        .filter(
          (l) =>
            l &&
            typeof l.id === "string" &&
            typeof l.position === "number"
        )
        .map((l) => [l.id, l.position])
    );

    /* --------------------------------
       Apply new positions
    -------------------------------- */
    const updatedLinks = data.links.map((link) => {
      const newPosition = positionMap.get(link.id);
      return typeof newPosition === "number"
        ? { ...link, position: newPosition }
        : link;
    });

    /* --------------------------------
       Persist changes
    -------------------------------- */
    await docRef.update({ links: updatedLinks });

    return NextResponse.json({
      message: "Link order updated",
    });
  } catch (error) {
    console.error("PUT /links/reorder error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
