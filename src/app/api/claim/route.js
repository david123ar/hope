import { adminDB } from "@/lib/firebaseAdmin";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username)
      return new Response(
        JSON.stringify({ available: false, message: "Username is required" }),
        { status: 400 }
      );

    const cleanUsername = username.trim().toLowerCase();
    if (!/^[a-zA-Z0-9_-]{3,32}$/.test(cleanUsername))
      return new Response(
        JSON.stringify({
          available: false,
          message: "Invalid username format",
        }),
        { status: 400 }
      );

    const usersRef = adminDB.collection("users");
    const query = usersRef.where("username", "==", cleanUsername);
    const snap = await query.get();

    return new Response(
      JSON.stringify({
        available: snap.empty,
        message: snap.empty
          ? "Username is available"
          : "This username is already claimed",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ available: false, message: error.message }),
      { status: 500 }
    );
  }
};
