import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { adminDB } from "@/lib/firebaseAdmin";
import { hash } from "bcryptjs";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // Validate session and user
    if (!session || !session.user || !session.user.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 403,
      });
    }

    const body = await req.json();
    const { userId, email, username, password, avatar, bio } = body;

    // Ensure the user is updating their own data
    if (session.user.id !== userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 403,
      });
    }

    const updateData = {};

    const userRef = adminDB.collection("users").doc(userId);
    const snap = await userRef.get();

    if (!snap.exists) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const currentUser = snap.data();

    // Validate email uniqueness (if updating email)
    if (email) {
      const emailQuery = await adminDB
        .collection("users")
        .where("email", "==", email)
        .get();

      if (!emailQuery.empty) {
        const docWithEmail = emailQuery.docs[0];
        if (docWithEmail.id !== userId) {
          return new Response(
            JSON.stringify({ message: "Email is already in use" }),
            { status: 400 }
          );
        }
      }

      updateData.email = email;
    }

    if (username) updateData.username = username;
    if (avatar) updateData.avatar = avatar;
    if (bio !== undefined) updateData.bio = bio;

    if (password && password.trim() !== "") {
      updateData.password = await hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ message: "No changes detected" }), {
        status: 400,
      });
    }

    // Update user in Firestore
    await userRef.update(updateData);

    // Return only updated fields
    const updatedResponse = {
      message: "Profile updated successfully",
      updated: {},
    };

    if (updateData.username) updatedResponse.updated.username = updateData.username;
    if (updateData.email) updatedResponse.updated.email = updateData.email;
    if (updateData.avatar) updatedResponse.updated.avatar = updateData.avatar;
    if (updateData.bio !== undefined) updatedResponse.updated.bio = updateData.bio;

    return new Response(JSON.stringify(updatedResponse), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message || "An error occurred" }),
      { status: 500 }
    );
  }
}
