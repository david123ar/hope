import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { adminDB } from "@/lib/firebaseAdmin";
import { compare } from "bcryptjs";
import { imageData } from "@/data/imageData";

/* ============================
   Helpers
============================ */
const getRandomImage = () => {
  const categories = Object.keys(imageData.hashtags);
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
  const images = imageData.hashtags[randomCategory].images;
  return images[Math.floor(Math.random() * images.length)];
};

export const authOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // ✅ USERNAME AS DOC ID
        const userRef = adminDB
          .collection("users")
          .doc(credentials.username);

        const snap = await userRef.get();
        if (!snap.exists) {
          throw new Error("User not found");
        }

        const user = snap.data();

        // ✅ PASSWORD CHECK
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // ✅ ENSURE AVATAR
        const avatar = user.avatar || getRandomImage();
        if (!user.avatar) {
          await userRef.update({ avatar });
        }

        // ✅ RETURN USER (IMPORTANT)
        return {
          id: credentials.username, // MUST EXIST
          email: user.email,
          username: user.username,
          avatar,
          bio: user.bio || "",
          timeOfJoining: user.timeOfJoining,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.avatar = user.avatar;
        token.bio = user.bio;
        token.timeOfJoining = user.timeOfJoining;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        username: token.username,
        avatar: token.avatar,
        bio: token.bio,
        timeOfJoining: token.timeOfJoining,
      };
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
