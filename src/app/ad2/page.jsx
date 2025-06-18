"use client";
import Script from "next/script";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [adVisible, setAdVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const adContainer = document.getElementById(
        "container-0edc04a5374d9021ce8e6b9f5bb01d53"
      );
      if (adContainer?.childNodes.length > 0) {
        setAdVisible(true);
      }
    }, 1500); // Allow more time for ad to load

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: "#1a1a1a",
        width: "100%",
        height: "90px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Script
        src="//abackdamstubborn.com/0edc04a5374d9021ce8e6b9f5bb01d53/invoke.js"
        strategy="afterInteractive"
        data-cfasync="false"
        async
      /> 
      <div
        id="container-0edc04a5374d9021ce8e6b9f5bb01d53"
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
            color: "#fdbd73",
            fontSize: "14px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Click to support Henpro 💖
        </div>
      )}
    </div>
  );
};

export default Page;
