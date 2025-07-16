"use client";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { themeStyles, backgroundToTheme } from "@/styles/themeStyles";

const Page = () => {
  const [adVisible, setAdVisible] = useState(false);
  const [themeKey, setThemeKey] = useState("red"); // ✅ Default is "red"

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get("theme");

    if (themeParam) {
      const cleanedTheme = themeParam
        .replace("/", "")
        .replace(".jpg", "")
        .replace(".jpeg", "");

      const themeName = backgroundToTheme[cleanedTheme] || cleanedTheme;

      // If valid theme, set it, else fall back to "red"
      setThemeKey(themeName in themeStyles ? themeName : "red");
    }

    const timeout = setTimeout(() => {
      const adContainer = document.getElementById(
        "container-0edc04a5374d9021ce8e6b9f5bb01d53"
      );
      if (adContainer?.childNodes.length > 0) {
        setAdVisible(true);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const activeTheme = themeStyles[themeKey];

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
        position: "relative",
        boxShadow: activeTheme.adShadow,
      }}
    >
      <Script
        src="//scrupulousyet.com/33a497c32aa8ecfffc3d4653d57e37f4/invoke.js"
        strategy="afterInteractive"
        data-cfasync="false"
        async
      />
      <div
        id="container-33a497c32aa8ecfffc3d4653d57e37f4"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      {!adVisible && (
        <div
          style={{
            width: "100%",
            height: "100%",
            color: activeTheme.linkColor,
            fontSize: "14px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: activeTheme.linkBg,
            boxShadow: activeTheme.linkShadow,
            transition: "all 0.3s ease",
          }}
        >
          Click to support Biolynk 💖
        </div>
      )}
    </div>
  );
};

export default Page;
