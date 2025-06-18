import nodemailer from "nodemailer";

export async function POST(request) {
  const body = await request.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // 👈 allow self-signed certs (DEV ONLY)
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "animoon.me@gmail.com", // Your inbox
      subject: `[Contact Form] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return Response.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email error:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
