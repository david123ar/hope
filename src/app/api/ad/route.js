import { adminDB } from "@/lib/firebaseAdmin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user");

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing user ID" }), {
        status: 400,
      });
    }

    const docRef = adminDB.collection("publishers").doc(userId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return new Response(JSON.stringify({ error: "Ad not found" }), {
        status: 404,
      });
    }

    const publisher = docSnap.data();

    if (!publisher?.adUnit) {
      return new Response(JSON.stringify({ error: "Ad not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(publisher.adUnit), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error in /api/ad:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
