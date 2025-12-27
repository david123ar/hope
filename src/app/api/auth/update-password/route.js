import { adminDB } from "@/lib/firebaseAdmin";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  try {
    const { token, newPassword } = await req.json();

    const usersRef = adminDB.collection("users");
    const query = usersRef
      .where("resetToken", "==", token)
      .where("resetTokenExpiry", ">", new Date());
    const snap = await query.get();

    if (snap.empty)
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 400 }
      );

    const userDoc = snap.docs[0];
    const userData = userDoc.data();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userDoc.ref.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
