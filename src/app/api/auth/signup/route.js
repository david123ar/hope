import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectDB } from "@/lib/mongoClient";
import { imageData } from "@/data/imageData";

const getRandomImage = () => {
  const categories = Object.keys(imageData.hashtags);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const images = imageData.hashtags[randomCategory].images;
  return images[Math.floor(Math.random() * images.length)];
};

export async function POST(req) {
  try {
    const db = await connectDB();
    const users = db.collection("users");
    const publishers = db.collection("publishers");

    const { email, username, password, refer, captchaToken } = await req.json();

    if (!email || !username || !password || !captchaToken) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return NextResponse.json({
        message: "Username must be 3–30 characters and contain only letters, numbers, or underscores.",
      }, { status: 400 });
    }

    // ✅ Verify reCAPTCHA with Google
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const params = new URLSearchParams();
    params.append("secret", process.env.RECAPTCHA_SECRET_KEY);
    params.append("response", captchaToken);

    const captchaVerify = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const captchaResult = await captchaVerify.json();
    if (!captchaResult.success) {
      return NextResponse.json({ message: "Failed CAPTCHA verification" }, { status: 400 });
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

    // ✅ Referral logic
    if (typeof refer === "string" && /^[a-zA-Z0-9_]{3,30}$/.test(refer)) {
      const referrer = await publishers.findOne({ _id: refer });
      if (referrer) {
        newUser.referredBy = refer;
        await publishers.updateOne({ _id: refer }, { $inc: { referralCount: 1 } });
      }
    }

    const userInsertResult = await users.insertOne(newUser);

    const adUnit = {
      id: "",
      index: "",
      scriptUrl: "",
      containerId: "",
      clickUrl: "",
    };

    await publishers.insertOne({
      _id: username,
      email,
      adUnit,
      joinedAt: timeOfJoining,
    });

    return NextResponse.json({
      message: "User registered successfully",
      avatar,
      adUnit,
      userId: userInsertResult.insertedId,
      timeOfJoining,
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
