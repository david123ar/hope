"use client";
import Script from "next/script";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [adVisible, setAdVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [adUnit, setAdUnit] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("user");
    setUserId(uid);

    if (!uid) return;

    fetch(`/api/ad?user=${uid}`)
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

      {!adVisible && (
        <a
          href={adUnit?.clickUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
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
        </a>
      )}
    </div>
  );
};

export default Page;
