"use client";

import React, { useEffect, useState } from "react";
import "./bio.css";
import { themeStyles, backgroundToTheme } from "@/styles/themeStyles"; // Adjust path if needed

const BioClient = ({ user, publisher, referredPublisher, links, design }) => {
  const [visibleLinks, setVisibleLinks] = useState({});

  useEffect(() => {
    const visibilityMap = {};
    links.forEach((link) => {
      visibilityMap[link.id] = link.visible ?? true;
    });
    setVisibleLinks(visibilityMap);
  }, [links]);

  const designName = design?.split("/").pop()?.split(".")[0]; // "done" from "/done.jpg"
  const themeKey = backgroundToTheme[designName] || "redWhiteBlack";
  const theme = themeStyles[themeKey];

  return (
    <div className="page-wrapper">
      <div className="bio-page">
        <img
          src={design || "/done.jpeg"}
          alt="background"
          className="bio-background"
        />

        <div className="bio-content">
          {/* Top Ad */}
          <div
            className="bio-ad ad-top"
            style={{
              background: theme.adBg,
              boxShadow: theme.adShadow,
            }}
          >
            <iframe
              src={`/ad?user=${user.username}&theme=${design}&username=${user.username}`}
              title="Top Ad"
              scrolling="no"
              style={{ width: "100%", height: "90px", border: "none" }}
            />
          </div>

          {/* Avatar */}
          <div
            className="bio-avatar"
            style={{
              border: `3px solid ${theme.avatarBorder}`,
              boxShadow: theme.avatarShadow,
              background: "#000",
            }}
          >
            <img
              src={
                user.username === "AnimeArenaX"
                  ? "https://instagram.fjai5-1.fna.fbcdn.net/v/t51.2885-19/465591634_511004775257746_5916888551466613309_n.jpg?stp=dst-jpg_s320x320_tt6&_nc_ht=instagram.fjai5-1.fna.fbcdn.net&_nc_cat=1&_nc_oc=Q6cZ2QGcRvUeARmmbRtLfI5_dqyWc0wz2u2lrbHFQteLblyd2xhvdz8gRN5hrM0Ojw6O8sE&_nc_ohc=UkgvYx1gEGMQ7kNvwEaLtvU&_nc_gid=xYj4u_evZ1KF-YZrFfa4Xw&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfMR7Eb5uxWF7fnr1RkFmHuNd2TK2lyxrv-XLmLHFBG6MA&oe=6867EA92&_nc_sid=8b3546" ||
                    "/arenax.jpg"
                  : user.avatar
              }
              alt="avatar"
            />
          </div>

          {/* Username */}
          <div
            className="bio-username"
            style={{
              background: theme.usernameBg,
              color: theme.usernameColor,
              boxShadow: theme.usernameShadow,
            }}
          >
            {user.username || "username"}
          </div>

          {/* Description */}
          <div
            className="bio-description"
            style={{
              background: theme.descriptionBg,
              color: theme.descriptionColor,
              boxShadow: theme.descriptionShadow,
            }}
          >
            {user.bio || "bio"}
          </div>

          {/* Links */}
          <div
            className="bio-links"
            style={{
              scrollbarColor: `${theme.scrollbarThumb} transparent`,
            }}
          >
            {links
              .filter((link) => visibleLinks[link.id] !== false)
              .map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="bio-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: theme.linkBg,
                    color: theme.linkColor,
                    boxShadow: theme.linkShadow,
                    border: "1px solid rgba(255,255,255,0.3)",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme.linkHoverBg;
                    e.currentTarget.style.boxShadow = theme.linkHoverShadow;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = theme.linkBg;
                    e.currentTarget.style.boxShadow = theme.linkShadow;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {link.name}
                </a>
              ))}
          </div>

          {/* Bottom Ads */}
          <div
            className="bio-ad ad-bottom"
            style={{
              background: theme.adBg,
              boxShadow: theme.adShadow,
            }}
          >
            <iframe
              src={`/ad2?theme=${design}`}
              title="Bottom Ad"
              scrolling="no"
              style={{ width: "100%", height: "90px", border: "none" }}
            />
            {user.referredBy && (
              <iframe
                src={`/ad?user=${user.referredBy}&theme=${design}`}
                title="Ref Ad"
                scrolling="no"
                style={{ width: "100%", height: "90px", border: "none" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioClient;
