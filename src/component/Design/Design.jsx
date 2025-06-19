"use client";
import React, { useEffect, useState } from "react";
import "./design.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useSession } from "next-auth/react";
import Share from "../Share/Share";

export default function Design(props) {
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const [user, setUser] = useState("");
  const [bio, setBio] = useState("");
  const [visibleLinks, setVisibleLinks] = useState({});
  const [newAvatar, setNewAvatar] = useState("");
  const [links, setLinks] = useState([]);
  const [selectedlink, setSelectedLink] = useState("/done.jpg");
  const [isView, setIsView] = useState(false);

  const backgrounds = [
    "/done.jpg",
    "/design1.jpeg",
    "/design2.jpeg",
    "/design3.jpeg",
    "/design4.jpeg",
    "/design5.jpeg",
    "/design6.jpeg",
    "/design8.jpeg",
    "/design9.jpeg",
    "/design10.jpeg",
    "/design11.jpeg",
    "/design12.jpeg",
    "/design13.jpeg",
    "/design14.jpeg",
  ];

  useEffect(() => {
    if (session?.user) {
      setUser(session.user.username || "");
      setBio(session.user.bio || "");
      setNewAvatar(session.user.avatar || "");
    }
  }, [session]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch("/api/links");
        const data = await res.json();

        if (data.links) {
          setLinks(data.links);
          const visibilityMap = {};
          data.links.forEach((link) => {
            visibilityMap[link.id] = link.visible ?? true;
          });
          setVisibleLinks(visibilityMap);
        }

        if (data.design) {
          setSelectedLink(data.design);
        }
      } catch (error) {
        console.error("Failed to fetch links:", error);
      }
    };

    fetchLinks();
  }, []);

  const handleDesignChange = async (bg) => {
    try {
      setSelectedLink(bg);
      const res = await fetch("/api/links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design: bg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save design");
    } catch (err) {
      console.error("Failed to update design:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="oit">
        <div className={`oit-in ${isView ? "hidde" : "activa"}`}>
          <div className="otil">
            <div className="oit-tip">Designs</div>
          </div>

          <div className="oitt">
            <div className="oit-tit">Designs</div>
            <div className="outii" onClick={() => setIsView(true)}>
              <div className="out-lit">
                <FaEye />
              </div>{" "}
              <div className="out-lit">View</div>
            </div>
          </div>

          <div className="design-gallery">
            {backgrounds.map((bg, index) => (
              <div
                className="inn-1lite"
                key={index}
                onClick={() => handleDesignChange(bg)}
              >
                <img
                  src={bg}
                  alt={`design-${index}`}
                  className="background-image"
                />
                <div className="text-over">
                  <div className="banner-wrapper">
                    <div className="linko-lite">
                      <div className="link-lite"></div>
                      <div className="link-lite"></div>
                      <div className="link-lite"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Share
              ShareUrl={`https://biolynk.shoko.fun/${session?.user?.id}${
                props.refer ? `?refer=${props.refer}` : `?refer=weebhideout`
              }`}
            />
          </div>
        </div>

        <div className={`oit-3 ${isView ? "activa" : "hidde"}`}>
          <div className="otil">
            <div className="oit-tip">Preview</div>
          </div>

          <div className="oitt">
            <div className="oit-tit">Preview</div>
            <div className="outii" onClick={() => setIsView(false)}>
              <div className="out-lit">
                <FaEyeSlash />
              </div>
              <div className="out-lit">Hide</div>
            </div>
          </div>

          <div className="inn-1">
            <img
              src={selectedlink}
              alt="background"
              className="background-image"
            />

            <div className="text-over">
              <div className="banner-wrapper">
                <div className="banner-ad">
                  <iframe
                    src={`/ad?user=${session?.user?.id}`}
                    title="Ad Banner"
                    style={{
                      width: "100%",
                      height: "90px",
                      border: "none",
                      overflow: "hidden",
                    }}
                    scrolling="no"
                  />
                </div>

                <div className="poster">
                  <img src={newAvatar} alt="poster" />
                </div>
                <div className="user">{user || "username"}</div>
                <div className="bio">{bio || "bio"}</div>
                <div className="linko">
                  {links
                    .filter((link) => visibleLinks[link.id] !== false)
                    .map((link, index) => (
                      <div key={index}>
                        <a
                          href={link.url}
                          className="link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.name}
                        </a>
                      </div>
                    ))}
                </div>
              </div>

              <div className="banner-ad2">
                <iframe
                  src="/ad"
                  title="Ad Banner"
                  style={{
                    width: "100%",
                    height: "90px",
                    border: "none",
                    overflow: "hidden",
                  }}
                  scrolling="no"
                />
              </div>
            </div>
          </div>

          <Share
            ShareUrl={`https://biolynk.shoko.fun/${session?.user?.id}${
              props.refer ? `?refer=${props.refer}` : `?refer=weebhideout`
            }`}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
