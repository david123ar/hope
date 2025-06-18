import BioClient from "@/component/BioClient/BioClient";
import { connectDB } from "@/lib/mongoClient";
import { ObjectId } from "mongodb";

export async function generateMetadata({ params }) {
  const db = await connectDB();
  const userDoc = await db.collection("users").findOne({ _id: new ObjectId(params.id) });

  if (!userDoc) {
    return {
      title: "User Not Found | Bio Link",
      description: "The requested creator profile does not exist on Bio Link.",
    };
  }

  return {
    title: `${userDoc.username}'s Profile | Bio Link`,
    description: `Check out ${userDoc.username}'s profile and explore their top links, content, and more on Bio Link.`,
  };
}


export default async function BioPage({ params }) {
  const db = await connectDB();
  const userId = params.id;

  // Fetch user document
  const userDoc = await db.collection("users").findOne({ _id: new ObjectId(userId) });

  if (!userDoc) {
    return <div>User not found</div>;
  }

  const user = {
    id: userDoc._id.toString(),
    email: userDoc.email,
    username: userDoc.username,
    avatar: userDoc.avatar,
    bio: userDoc.bio || "",
    referredBy: userDoc.referredBy || null,
  };

  // Fetch the user's own publisher doc
  const publisherDoc = await db.collection("publishers").findOne({ _id: new ObjectId(userId) });
  const publisher = publisherDoc
    ? {
        id: publisherDoc._id.toString(),
        email: publisherDoc.email,
        username: publisherDoc.username,
        adUnit: publisherDoc.adUnit,
        joinedAt: publisherDoc.joinedAt,
      }
    : null;

  // Fetch referredBy publisher doc (if exists)
  let referredPublisher = null;
  if (userDoc.referredBy) {
    const referredDoc = await db
      .collection("publishers")
      .findOne({ _id: new ObjectId(userDoc.referredBy) });

    if (referredDoc) {
      referredPublisher = {
        id: referredDoc._id.toString(),
        username: referredDoc.username,
        email: referredDoc.email,
        adUnit: referredDoc.adUnit,
        joinedAt: referredDoc.joinedAt,
      };
    }
  }

  // Fetch links
  const linksDoc = await db.collection("links").findOne({ _id: userId });
  const links = linksDoc?.links || [];
  const design = linksDoc?.design || "";

  return (
    <BioClient
      user={user}
      publisher={publisher}
      referredPublisher={referredPublisher} // ✅ Pass separately
      links={links}
      design={design}
    />
  );
}
