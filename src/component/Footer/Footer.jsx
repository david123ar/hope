"use client";
import React from "react";
import "./footer.css";
import SocialLinks from "../Navbar/Social";
import Link from "next/link";

export default function Footer({
  refer,
  theme = "lime", // 👈 theme control
}) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon";

  return (
    <footer className={`footer-container theme-${theme}`}>
      {/* TOP BORDER / SEPARATOR */}
      <div className="footer-separator" />

      <div className="logo-social-links d-flex">
        <div className="main-element">
          <Link href={`/${refer ? `?refer=${refer}` : ``}`}>
            <div className="logo-container">
              <div className="logo-icon" />
              <div className="logo-text">{siteName}</div>
            </div>
          </Link>
        </div>

        <SocialLinks />
      </div>

      <div className="copyright-text">
        <p>&copy; {siteName} — All rights reserved.</p>
      </div>
    </footer>
  );
}
