import BioClient from "@/component/BioClient/BioClient";
import { connectDB } from "@/lib/mongoClient";

// Metadata
export async function generateMetadata({ params }) {
  const db = await connectDB();
  const param = await params;

  const userDoc = await db.collection("users").findOne({ username: param.id });

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

// Page
export default async function BioPage({ params }) {
  const db = await connectDB();
  const param = await params;
  const username = param.id;

  // Get user by username
  const userDoc = await db.collection("users").findOne({ username });

  const user = {
    id: userDoc._id.toString(),
    email: userDoc.email,
    username: userDoc.username,
    avatar: userDoc.avatar,
    bio: userDoc.bio || "",
    referredBy: userDoc.referredBy || null,
  };

  // Get publisher by username (since now _id = username in publishers)
  const publisherDoc = await db
    .collection("publishers")
    .findOne({ _id: username });
  const publisher = publisherDoc
    ? {
        id: publisherDoc._id,
        email: publisherDoc.email,
        username: publisherDoc.username || username,
        adUnit: publisherDoc.adUnit,
        joinedAt: publisherDoc.joinedAt,
      }
    : null;

  // Referred publisher (if exists)
  let referredPublisher = null;
  if (user.referredBy) {
    const referredDoc = await db
      .collection("publishers")
      .findOne({ _id: user.referredBy });

    if (referredDoc) {
      referredPublisher = {
        id: referredDoc._id,
        username: referredDoc.username || user.referredBy,
        email: referredDoc.email,
        adUnit: referredDoc.adUnit,
        joinedAt: referredDoc.joinedAt,
      };
    }
  }

  // Get links and design
  const linksDoc = await db.collection("links").findOne({ _id: username });
  const links = linksDoc?.links || [];
  const design = linksDoc?.design || "";

  return (
    <BioClient
      user={user}
      publisher={publisher}
      referredPublisher={referredPublisher}
      links={links}
      design={design}
    />
  );
}
