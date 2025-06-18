import { hash } from "bcryptjs";
import { connectDB } from "@/lib/mongoClient";
import { imageData } from "@/data/imageData";
import { adUnits } from "@/ads/adScripts";
import { ObjectId } from "mongodb";

const getRandomImage = () => {
  const categories = Object.keys(imageData.hashtags);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
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

  return unassignedAdUnits[Math.floor(Math.random() * unassignedAdUnits.length)];
};

export async function POST(req) {
  try {
    const db = await connectDB();
    const users = db.collection("users");
    const publishers = db.collection("publishers");

    const { email, username, password, refer } = await req.json();

    if (!email || !username || !password) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "Email already in use" }, { status: 400 });
    }

    const existingUsername = await users.findOne({ username });
    if (existingUsername) {
      return Response.json({ message: "Username already taken" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);
    const avatar = getRandomImage();
    const timeOfJoining = new Date();

    // Prepare user object
    const newUser = {
      email,
      username,
      password: hashedPassword,
      avatar,
      timeOfJoining,
    };

    // If refer is a valid ObjectId string, include it
    if (typeof refer === "string" && ObjectId.isValid(refer)) {
      newUser.referredBy = new ObjectId(refer);
    }

    // Insert user and get inserted ID
    const userInsertResult = await users.insertOne(newUser);
    const userId = userInsertResult.insertedId;

    // Assign an ad unit
    const adUnit = await getRandomUnassignedAdUnit(publishers);

    // Insert publisher with same ID
    await publishers.insertOne({
      _id: userId,
      email,
      username,
      adUnit,
      joinedAt: timeOfJoining,
    });

    return Response.json(
      {
        message: "User registered successfully",
        avatar,
        adUnit,
        userId,
        timeOfJoining,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
