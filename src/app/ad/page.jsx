"use client";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { themeStyles, backgroundToTheme } from "@/styles/themeStyles";

const Page = () => {
  const [adVisible, setAdVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("this creator");
  const [adUnit, setAdUnit] = useState(null);
  const [themeKey, setThemeKey] = useState("red"); // ✅ Default to "red"

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("user");
    const themeParam = params.get("theme");
    const uname = params.get("username");

    if (uid) setUserId(uid);
    if (uname) setUsername(uname);

    if (themeParam) {
      const cleanedTheme = themeParam
        .replace("/", "")
        .replace(".jpg", "")
        .replace(".jpeg", "");

      const themeName = backgroundToTheme[cleanedTheme] || cleanedTheme;

      // ✅ fallback to red if invalid
      setThemeKey(themeName in themeStyles ? themeName : "red");
    }

    if (!uid) return;

    fetch(`/api/ad?user=${uid.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setAdUnit(data);
        }
      });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (adUnit?.containerId) {
        const container = document.getElementById(adUnit.containerId);
        if (container?.childNodes.length > 0) {
          setAdVisible(true);
        }
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [adUnit]);

  const activeTheme = themeStyles[themeKey] || themeStyles["red"]; // ✅ guaranteed safe

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: activeTheme.adBg,
        width: "100%",
        height: "90px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        boxShadow: activeTheme.adShadow,
        position: "relative",
      }}
    >
      {adUnit && (
        <>
          <Script
            src={adUnit.scriptUrl}
            strategy="afterInteractive"
            data-cfasync="false"
            async
          />
          <div
            id={adUnit.containerId}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </>
      )}

      {!adVisible && adUnit && (
        <a
          href={adUnit.clickUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: "100%",
            height: "100%",
            color: activeTheme.linkColor,
            fontSize: "14px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            background: activeTheme.linkBg,
            boxShadow: activeTheme.linkShadow,
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            if (activeTheme.linkHoverBg)
              e.currentTarget.style.background = activeTheme.linkHoverBg;
            if (activeTheme.linkHoverShadow)
              e.currentTarget.style.boxShadow = activeTheme.linkHoverShadow;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = activeTheme.linkBg;
            e.currentTarget.style.boxShadow = activeTheme.linkShadow;
          }}
        >
          Click to support {username} 💖
        </a>
      )}
    </div>
  );
};

export default Page;
