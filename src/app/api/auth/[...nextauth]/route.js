import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongoClient";
import { compare } from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";
import { imageData } from "@/data/imageData"; // Import imageData

const getRandomImage = () => {
  const categories = Object.keys(imageData.hashtags);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const images = imageData.hashtags[randomCategory].images;
  return images[Math.floor(Math.random() * images.length)];
};

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
        avatar: { label: "Avatar", type: "text" },
        bio: { label: "Bio", type: "text" }, // 🔥 Add bio
        profileUpdate: { label: "Profile Update", type: "checkbox" },
      },
      async authorize(credentials) {
        const db = await connectDB();
        const users = db.collection("users");

        // Profile update flow
        if (credentials.profileUpdate === "true") {
          const user = await users.findOne({ email: credentials.email });
          if (!user) throw new Error("User not found");

          const updatedUser = {
            email: credentials.email,
            username: credentials.username || user.username,
            avatar: credentials.avatar || user.avatar,
            bio: credentials.bio || user.bio, // 🔥 Add bio
          };

          await users.updateOne(
            { email: credentials.email },
            { $set: updatedUser }
          );

          const avatar = updatedUser.avatar || getRandomImage();

          return {
            id: user._id,
            email: updatedUser.email,
            username: updatedUser.username,
            avatar,
            bio: updatedUser.bio,
            timeOfJoining: user.timeOfJoining,
          };
        }

        // Standard login
        const user = await users.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid credentials");

        const avatar = user.avatar || getRandomImage();

        if (!user.avatar) {
          await users.updateOne(
            { email: credentials.email },
            { $set: { avatar } }
          );
        }

        return {
          id: user._id,
          email: user.email,
          username: user.username,
          avatar,
          bio: user.bio || "", // 🔥 Include bio
          timeOfJoining: user.timeOfJoining,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.avatar = user.avatar;
        token.bio = user.bio || "";
        token.timeOfJoining = user.timeOfJoining;
        token.email = user.email;
      }

      if (trigger === "update" && session) {
        if (session.username) token.username = session.username;
        if (session.avatar) token.avatar = session.avatar;
        if (session.bio !== undefined) token.bio = session.bio; // 🔥 Allow bio update
        if (session.email) token.email = session.email;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.avatar = token.avatar;
      session.user.bio = token.bio || ""; // 🔥 Send bio to client
      session.user.timeOfJoining = token.timeOfJoining;
      session.user.email = token.email;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
