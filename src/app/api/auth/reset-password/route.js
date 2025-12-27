import { adminDB } from "@/lib/firebaseAdmin";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const POST = async (req) => {
  try {
    const { email } = await req.json();
    if (!email) return new Response(JSON.stringify({ message: "Email is required" }), { status: 400 });

    const userRef = adminDB.collection("users").doc(email);
    const snap = await userRef.get();
    if (!snap.exists) return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await userRef.update({ resetToken, resetTokenExpiry });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p><p>This link expires in 1 hour.</p>`,
    });

    return new Response(JSON.stringify({ message: "Password reset email sent!" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
