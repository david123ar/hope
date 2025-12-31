"use client";

import React, { useEffect, useState } from "react";
import "./bio.css";
import { themeStyles, backgroundToTheme } from "@/styles/themeStyles";

const BioClient = ({ user, publisher, referredPublisher, links, design }) => {
  const [visibleLinks, setVisibleLinks] = useState({});
  const [openedSlab, setOpenedSlab] = useState(null);
  const [copiedSlab, setCopiedSlab] = useState(null);

  useEffect(() => {
    const visibilityMap = {};
    links.forEach((link) => {
      visibilityMap[link.id] = link.visible ?? true;
    });
    setVisibleLinks(visibilityMap);
  }, [links]);

  const designName = design?.split("/").pop()?.split(".")[0];
  const themeKey = backgroundToTheme[designName] || "redWhiteBlack";
  const theme = themeStyles[themeKey];

  // 🔥 newest on top, oldest bottom
  // 🔥 newest on top, oldest at bottom
  const orderedLinks = [...links]
    .filter((link) => visibleLinks[link.id] !== false)
    .sort((a, b) => b.position - a.position);


  const handleSlabClick = async (link) => {
    // First click → reveal URL
    if (openedSlab !== link.id) {
      setOpenedSlab(link.id);
      setCopiedSlab(null);
      return;
    }

    // Second click → copy
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedSlab(link.id);
      setTimeout(() => setCopiedSlab(null), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="bio-page">
        <img
          src={design || "/done.jpeg"}
          alt="background"
          className="bio-background"
        />

        <div className="bio-content">
          {/* TOP AD */}
          <div
            className="bio-ad ad-top"
            style={{
              background: theme.adBg,
              boxShadow: theme.adShadow,
            }}
          >
            <iframe
              src={`/ad?user=${user.username}&theme=${design}`}
              title="Top Ad"
              scrolling="no"
            />
          </div>

          {/* AVATAR */}
          <div
            className="bio-avatar"
            style={{
              border: `3px solid ${theme.avatarBorder}`,
              boxShadow: theme.avatarShadow,
            }}
          >
            <img src={user.avatar} alt="avatar" />
          </div>

          {/* USERNAME */}
          <div
            className="bio-username"
            style={{
              background: theme.usernameBg,
              color: theme.usernameColor,
              boxShadow: theme.usernameShadow,
            }}
          >
            {user.username}
          </div>

          {/* BIO */}
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

          {/* SLABS */}
          <div className="bio-links">
            {orderedLinks.map((link) => (
              <div
                key={link.id}
                className="bio-link"
                onClick={() => handleSlabClick(link)}
                style={{
                  background: theme.linkBg,
                  color: theme.linkColor,
                  boxShadow: theme.linkShadow,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {openedSlab === link.id ? (
                  copiedSlab === link.id ? (
                    "Copied!"
                  ) : (
                    link.url
                  )
                ) : (
                  link.name
                )}
              </div>
            ))}
          </div>

          {/* BOTTOM ADS */}
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
            />
            {user.referredBy && (
              <iframe
                src={`/ad?user=${user.referredBy}&theme=${design}`}
                title="Ref Ad"
                scrolling="no"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioClient;
