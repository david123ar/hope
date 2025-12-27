import { adminDB } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { hash } from "bcryptjs";
import { imageData } from "@/data/imageData";
import { adUnits } from "@/ads/adScripts";

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

const getRandomUnassignedAdUnit = async () => {
  const snap = await adminDB.collection("publishers").get();

  const used = snap.docs
    .map((d) => d.data()?.adUnit?.scriptUrl)
    .filter(Boolean);

  const available = adUnits.filter(
    (ad) => !used.includes(ad.scriptUrl)
  );

  if (!available.length) {
    throw new Error("No available ad units");
  }

  return available[Math.floor(Math.random() * available.length)];
};

/* ============================
   POST
============================ */

export const POST = async (req) => {
  try {
    const { email, username, password, refer } = await req.json();

    if (!email || !username || !password) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return new Response(
        JSON.stringify({ message: "Invalid username format" }),
        { status: 400 }
      );
    }

    /* ============================
       USERNAME = DOC ID
    ============================ */

    const userRef = adminDB.collection("users").doc(username);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      return new Response(
        JSON.stringify({ message: "Username already taken" }),
        { status: 400 }
      );
    }

    /* ============================
       EMAIL UNIQUENESS CHECK
    ============================ */

    const emailSnap = await adminDB
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!emailSnap.empty) {
      return new Response(
        JSON.stringify({ message: "Email already in use" }),
        { status: 400 }
      );
    }

    /* ============================
       CREATE USER
    ============================ */

    const hashedPassword = await hash(password, 10);
    const avatar = getRandomImage();
    const timeOfJoining = new Date();

    const userData = {
      email,
      username,
      password: hashedPassword,
      avatar,
      bio: "",
      timeOfJoining,
    };

    /* ============================
       REFERRAL
    ============================ */

    if (refer && typeof refer === "string") {
      const refRef = adminDB.collection("publishers").doc(refer);
      const refSnap = await refRef.get();

      if (refSnap.exists) {
        userData.referredBy = refer;
        await refRef.update({
          referralCount: FieldValue.increment(1),
        });
      }
    }

    await userRef.set(userData);

    /* ============================
       PUBLISHER + AD UNIT
    ============================ */

    const adUnit = await getRandomUnassignedAdUnit();

    await adminDB
      .collection("publishers")
      .doc(username)
      .set({
        email,
        username,
        adUnit,
        joinedAt: timeOfJoining,
        referralCount: 0,
      });

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        username,
        avatar,
        adUnit,
        timeOfJoining,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      { status: 500 }
    );
  }
};
