import BioClient from "@/component/BioClient/BioClient";
import { adminDB } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";

/* =======================
   Helpers
======================= */

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function serializeTimestamp(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") {
    return ts.toDate().toISOString();
  }
  return null;
}

/* =======================
   Metadata
======================= */

export async function generateMetadata({ params }) {
  const username = params.id;

  const userSnap = await adminDB
    .collection("users")
    .doc(username)
    .get();

  if (!userSnap.exists) {
    return {
      title: "User Not Found | Bio Link",
      description: "The requested creator profile does not exist on Bio Link.",
    };
  }

  const user = userSnap.data();
  const name = capitalize(user.username || username);

  return {
    title: `${name}'s Profile | Bio Link`,
    description: `Check out ${name}'s profile and explore their top links, content, and more on Bio Link.`,
  };
}

/* =======================
   Page
======================= */

export default async function BioPage({ params }) {
  const username = params.id;

  /* --------------------------------
     Parallel Firestore reads
  -------------------------------- */
  const [userSnap, publisherSnap, linksSnap] = await Promise.all([
    adminDB.collection("users").doc(username).get(),
    adminDB.collection("publishers").doc(username).get(),
    adminDB.collection("links").doc(username).get(),
  ]);

  /* -------- User -------- */
  if (!userSnap.exists) {
    notFound();
  }

  const userDoc = userSnap.data();

  const user = {
    id: userSnap.id,
    email: userDoc.email,
    username: capitalize(userDoc.username || username),
    avatar: userDoc.avatar,
    bio: userDoc.bio || "",
    referredBy: userDoc.referredBy || null,
  };

  /* -------- Publisher -------- */
  const publisher = publisherSnap.exists
    ? {
        id: publisherSnap.id,
        email: publisherSnap.data().email,
        username: capitalize(
          publisherSnap.data().username || username
        ),
        adUnit: publisherSnap.data().adUnit || null,
        joinedAt: serializeTimestamp(
          publisherSnap.data().joinedAt
        ),
      }
    : null;

  /* -------- Referred Publisher -------- */
  let referredPublisher = null;

  if (user.referredBy) {
    const referredSnap = await adminDB
      .collection("publishers")
      .doc(user.referredBy)
      .get();

    if (referredSnap.exists) {
      referredPublisher = {
        id: referredSnap.id,
        username: capitalize(
          referredSnap.data().username || user.referredBy
        ),
        email: referredSnap.data().email,
        adUnit: referredSnap.data().adUnit || null,
        joinedAt: serializeTimestamp(
          referredSnap.data().joinedAt
        ),
      };
    }
  }

  /* -------- Links & Design -------- */
  const linksData = linksSnap.exists ? linksSnap.data() : {};
  const links = Array.isArray(linksData.links)
    ? linksData.links
    : [];
  const design = linksData.design || "";

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
