"use client";

import React, { useEffect, useState } from "react";
import "./bio.css";

const BioClient = ({ user, publisher, referredPublisher, links, design }) => {
  const [visibleLinks, setVisibleLinks] = useState({});
  const [selectedDesign, setSelectedDesign] = useState(design || "");

  useEffect(() => {
    const visibilityMap = {};
    links.forEach((link) => {
      visibilityMap[link.id] = link.visible ?? true;
    });
    setVisibleLinks(visibilityMap);
  }, [links]);

  return (
    <div className="page-wrapper">
      <div className="bio-page">
        <img
          src={selectedDesign || "/done.jpg"}
          alt="background"
          className="bio-background"
        />

        <div className="bio-content">
          <div className="bio-ad ad-top">
            <iframe
              src={`/ad?user=${user.id}`}
              title="Top Ad"
              style={{
                width: "100%",
                height: "90px",
                border: "none",
                overflow: "hidden",
              }}
              scrolling="no"
            />
          </div>

          <div className="bio-avatar">
            <img src={user.avatar} alt="avatar" />
          </div>

          <div className="bio-username">{user.username || "username"}</div>
          <div className="bio-description">{user.bio || "bio"}</div>

          <div className="bio-links">
            {links
              .filter((link) => visibleLinks[link.id] !== false)
              .map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="bio-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.name}
                </a>
              ))}
          </div>

          {user.referredBy ? (
            <div className="bio-ad ad-bottom">
              <iframe
                src="/ad2"
                title="Bottom Ad"
                style={{
                  width: "100%",
                  height: "90px",
                  border: "none",
                  overflow: "hidden",
                }}
                scrolling="no"
              />
              <iframe
                src={`/ad?user=${user.referredBy}`}
                title="Top Ad"
                style={{
                  width: "100%",
                  height: "90px",
                  border: "none",
                  overflow: "hidden",
                }}
                scrolling="no"
              />
            </div>
          ) : (
            <div className="bio-ad ad-bottom">
              <iframe
                src="/ad2"
                title="Bottom Ad"
                style={{
                  width: "100%",
                  height: "90px",
                  border: "none",
                  overflow: "hidden",
                }}
                scrolling="no"
              />
            </div>
          )}

          {/* {publisher && (
          <div className="bio-publisher-info">
            <p><strong>Publisher:</strong> {publisher.username}</p>
            <p><strong>Ad Unit ID:</strong> {publisher.adUnit?.id}</p>
          </div>
        )} */}
        </div>
      </div>
    </div>
  );
};

export default BioClient;
