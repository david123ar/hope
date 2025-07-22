import BioClient from "@/component/BioClient/BioClient";
import { connectDB } from "@/lib/mongoClient";

// Helper: Capitalize first letter
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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

  const capitalizedUsername = capitalize(userDoc.username);

  return {
    title: `${capitalizedUsername}'s Profile | Bio Link`,
    description: `Check out ${capitalizedUsername}'s profile and explore their top links, content, and more on Bio Link.`,
  };
}

// Page
export default async function BioPage({ params }) {
  const db = await connectDB();
  const param = await params;
  const username = param.id;

  // Get user by username
  const userDoc = await db.collection("users").findOne({ username });

  const capitalizedUsername = capitalize(userDoc.username);

  const user = {
    id: userDoc._id.toString(),
    email: userDoc.email,
    username: capitalizedUsername,
    avatar: userDoc.avatar,
    bio: userDoc.bio || "",
    referredBy: userDoc.referredBy || null,
  };

  // Get publisher by username
  const publisherDoc = await db
    .collection("publishers")
    .findOne({ _id: username });
  const publisher = publisherDoc
    ? {
        id: publisherDoc._id,
        email: publisherDoc.email,
        username: capitalize(publisherDoc.username || username),
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
        username: capitalize(referredDoc.username || user.referredBy),
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
