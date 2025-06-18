import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongoClient";
import { hash } from "bcryptjs";
import { ObjectId } from "mongodb";

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

    // Validate email uniqueness (if updating email)
    if (email) {
      const db = await connectDB();
      const users = db.collection("users");
      const existingEmail = await users.findOne({ email });

      if (existingEmail && existingEmail._id.toString() !== userId) {
        return new Response(
          JSON.stringify({ message: "Email is already in use" }),
          { status: 400 }
        );
      }
      updateData.email = email;
    }

    // Validate and assign username if provided
    if (username) updateData.username = username;

    // Validate and assign avatar if provided
    if (avatar) updateData.avatar = avatar;

    if (bio !== undefined) updateData.bio = bio;

    // Validate and hash password if provided
    if (password && password.trim() !== "") {
      updateData.password = await hash(password, 10);
    }

    // Return early if no updates were requested
    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ message: "No changes detected" }), {
        status: 400,
      });
    }

    // Update user in the database
    const db = await connectDB();
    const users = db.collection("users");

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      // Send back only the updated fields
      const updatedResponse = {
        message: "Profile updated successfully",
        updated: {},
      };

      if (updateData.username)
        updatedResponse.updated.username = updateData.username;
      if (updateData.email) updatedResponse.updated.email = updateData.email;
      if (updateData.avatar) updatedResponse.updated.avatar = updateData.avatar;

      return new Response(JSON.stringify(updatedResponse), { status: 200 });
    }

    return new Response(JSON.stringify({ message: "No changes were made" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message || "An error occurred" }),
      { status: 500 }
    );
  }
}
