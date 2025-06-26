import { NextResponse } from "next/server"; // ✅ Use NextResponse
import { hash } from "bcryptjs";
import { connectDB } from "@/lib/mongoClient";
import { imageData } from "@/data/imageData";
import { adUnits } from "@/ads/adScripts";

const getRandomImage = () => {
  const categories = Object.keys(imageData.hashtags);
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
  const images = imageData.hashtags[randomCategory].images;
  return images[Math.floor(Math.random() * images.length)];
};

const getRandomUnassignedAdUnit = async (publishers) => {
  const assignedAdScriptUrls = await publishers
    .find({}, { projection: { "adUnit.scriptUrl": 1 } })
    .map((p) => p.adUnit?.scriptUrl)
    .toArray();

  const unassignedAdUnits = adUnits.filter(
    (ad) => !assignedAdScriptUrls.includes(ad.scriptUrl)
  );

  if (unassignedAdUnits.length === 0) {
    throw new Error("No available ad units left to assign.");
  }

  return unassignedAdUnits[
    Math.floor(Math.random() * unassignedAdUnits.length)
  ];
};

export async function POST(req) {
  try {
    const db = await connectDB();
    const users = db.collection("users");
    const publishers = db.collection("publishers");

    const { email, username, password, refer } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return NextResponse.json(
        {
          message:
            "Username must be 3–30 characters and contain only letters, numbers, or underscores.",
        },
        { status: 400 }
      );
    }

    const [existingUser, existingUsername] = await Promise.all([
      users.findOne({ email }),
      users.findOne({ username }),
    ]);
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }
    if (existingUsername) {
      return NextResponse.json({ message: "Username already taken" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);
    const avatar = getRandomImage();
    const timeOfJoining = new Date();

    const newUser = {
      email,
      username,
      password: hashedPassword,
      avatar,
      timeOfJoining,
    };

    if (typeof refer === "string" && /^[a-zA-Z0-9_]{3,30}$/.test(refer)) {
      const referrer = await publishers.findOne({ _id: refer });
      if (referrer) {
        newUser.referredBy = refer;
        await publishers.updateOne(
          { _id: refer },
          { $inc: { referralCount: 1 } }
        );
      }
    }

    const userInsertResult = await users.insertOne(newUser);

    const adUnit = await getRandomUnassignedAdUnit(publishers);
    await publishers.insertOne({
      _id: username,
      email,
      adUnit,
      joinedAt: timeOfJoining,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        avatar,
        adUnit,
        userId: userInsertResult.insertedId,
        timeOfJoining,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
