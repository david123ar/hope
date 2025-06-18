"use client";
import React, { useState } from "react";
import "./contact.css"; // optional if you want external styling
import { SessionProvider } from "next-auth/react";
import Navbar from "@/component/Navbar/Navbar";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    setLoading(false);

    if (res.ok) {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      alert(result.error || "Failed to send message.");
    }
  };

  return (
    <>
      <SessionProvider>
        <Navbar />
        <div className="contact-wrapper">
          <div className="contact-container">
            <h2>Contact Us</h2>
            <p className="subtitle">
              Have questions or feedback? Send us a message!
            </p>

            <form onSubmit={handleSubmit} className="contact-form">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />

              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />

              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject of your message"
                required
              />

              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                required
              ></textarea>

              <button type="submit">Send Message</button>
              {submitted && (
                <p className="success-msg">
                  Thank you! Your message has been sent.
                </p>
              )}
            </form>
          </div>
        </div>
      </SessionProvider>
    </>
  );
};
