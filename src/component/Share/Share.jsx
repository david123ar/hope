"use client";
import React, { useEffect, useState } from "react";
import "./Share.css";
import share from "../../../public/share.gif";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaXTwitter } from "react-icons/fa6";
import {
  FaFacebookF,
  FaGetPocket,
  FaLine,
  FaLinkedinIn,
  FaPinterest,
  FaRedditAlien,
  FaShareAlt,
  FaTelegram,
  FaTumblr,
  FaViber,
  FaWhatsapp,
} from "react-icons/fa";
import {
  MdAlternateEmail,
  MdEmail,
  MdContentCopy,
  MdCheckCircle,
} from "react-icons/md";
import { SlSocialVkontakte } from "react-icons/sl";
import {
  SiHatenabookmark,
  SiInstapaper,
  SiLivejournal,
  SiOdnoklassniki,
  SiWorkplace,
} from "react-icons/si";
import {
  EmailShareButton,
  FacebookShareButton,
  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  VKShareButton,
  ViberShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

export default function Share({ ShareUrl, arise }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render each share button with icon and label
  const ShareButton = ({ Component, icon: Icon, label, componentName }) => (
    <Component url={ShareUrl}>
      <div className="shareDic">
        <div className={componentName}>
          <Icon size={24} />
        </div>

        <div style={{ fontSize: 11, marginTop: 4 }}>{label}</div>
      </div>
    </Component>
  );

  const [truncatedUrl, setTruncatedUrl] = useState(ShareUrl);

  useEffect(() => {
    const updateUrl = () => {
      setTruncatedUrl(
        window.innerWidth < 500 ? ShareUrl.slice(0, 25) + "..." : ShareUrl
      );
    };

    updateUrl(); // Run once on load
    window.addEventListener("resize", updateUrl);
    return () => window.removeEventListener("resize", updateUrl);
  }, [ShareUrl]);

  return (
    <>
      <div className="share-app">
        {/* <img
          src="https://i.postimg.cc/d34WWyNQ/share-icon.gif"
          alt="Share Anime"
          className="w-[60px] h-auto rounded-full max-[1024px]:w-[40px]"
        /> */}

        <div className="btnio">
          <div
            className="secoi"
            style={{
              margin: "0 auto", // Center horizontally
              textAlign: "center", // Center text inside
              maxWidth: "600px", // Optional: limit width for better layout
              width: "100%", // Responsive width
            }}
          >
            <p style={{ fontSize: "1rem", color: "#fff", marginBottom: "8px" }}>
              Copy the link below and add it to your{" "}
              <span style={{ color: "#00f2fe", fontWeight: 500 }}>
                Instagram bio
              </span>{" "}
              to{" "}
              <span style={{ color: "#22c55e", fontWeight: 600 }}>
                start earning
              </span>
            </p>
            <code
              style={{
                display: "block",
                backgroundColor: "#1e293b",
                color: "#00f2fe",
                borderRadius: "8px",
                fontSize: "0.9rem",
                wordBreak: "break-all",
                padding: "8px",
              }}
            >
              {truncatedUrl}
            </code>
          </div>
        </div>

        <div className="btnio">
          <button onClick={handleCopy} className="copy-btn">
            {copied ? (
              <>
                <MdCheckCircle />
                <span className="button-text large-screen-only">Copied</span>
              </>
            ) : (
              <>
                <MdContentCopy />
                <span className="button-text large-screen-only">Copy</span>
              </>
            )}
          </button>

          <button onClick={() => setOpen(true)} className="share-btn">
            <FaShareAlt />
            <span className="button-text large-screen-only">Share</span>
          </button>

          <Link
            href={ShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-btn"
          >
            <FiExternalLink />
            <span className="button-text large-screen-only">Visit</span>
          </Link>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="share-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="share-modal"
              initial={{ scale: 0.8, y: "-50%", opacity: 0 }}
              animate={{ scale: 1, y: "-50%", opacity: 1 }}
              exit={{ scale: 0.8, y: "-50%", opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Share via</h2>
              <div className="share-grid">
                <ShareButton
                  Component={WhatsappShareButton}
                  icon={FaWhatsapp}
                  label="WhatsApp"
                  componentName="WhatsappShareButton"
                />
                <ShareButton
                  Component={FacebookShareButton}
                  icon={FaFacebookF}
                  label="Facebook"
                  componentName="FacebookShareButton"
                />
                <ShareButton
                  Component={TelegramShareButton}
                  icon={FaTelegram}
                  label="Telegram"
                  componentName="TelegramShareButton"
                />
                <ShareButton
                  Component={RedditShareButton}
                  icon={FaRedditAlien}
                  label="Reddit"
                  componentName="RedditShareButton"
                />
                <ShareButton
                  Component={TwitterShareButton}
                  icon={FaXTwitter}
                  label="Twitter"
                  componentName="TwitterShareButton"
                />
                <ShareButton
                  Component={EmailShareButton}
                  icon={MdEmail}
                  label="Email"
                  componentName="EmailShareButton"
                />
                <ShareButton
                  Component={HatenaShareButton}
                  icon={SiHatenabookmark}
                  label="Hatena"
                  componentName="HatenaShareButton"
                />
                <ShareButton
                  Component={InstapaperShareButton}
                  icon={SiInstapaper}
                  label="Instapaper"
                  componentName="InstapaperShareButton"
                />
                <ShareButton
                  Component={LineShareButton}
                  icon={FaLine}
                  label="Line"
                  componentName="LineShareButton"
                />
                <ShareButton
                  Component={LinkedinShareButton}
                  icon={FaLinkedinIn}
                  label="LinkedIn"
                  componentName="LinkedinShareButton"
                />
                <ShareButton
                  Component={LivejournalShareButton}
                  icon={SiLivejournal}
                  label="LiveJournal"
                  componentName="LivejournalShareButton"
                />
                <ShareButton
                  Component={MailruShareButton}
                  icon={MdAlternateEmail}
                  label="Mail.ru"
                  componentName="MailruShareButton"
                />
                <ShareButton
                  Component={OKShareButton}
                  icon={SiOdnoklassniki}
                  label="Odnoklassniki"
                  componentName="OKShareButton"
                />
                <ShareButton
                  Component={PinterestShareButton}
                  icon={FaPinterest}
                  label="Pinterest"
                  componentName="PinterestShareButton"
                />
                <ShareButton
                  Component={PocketShareButton}
                  icon={FaGetPocket}
                  label="Pocket"
                  componentName="PocketShareButton"
                />
                <ShareButton
                  Component={TumblrShareButton}
                  icon={FaTumblr}
                  label="Tumblr"
                  componentName="TumblrShareButton"
                />
                <ShareButton
                  Component={ViberShareButton}
                  icon={FaViber}
                  label="Viber"
                  componentName="ViberShareButton"
                />
                <ShareButton
                  Component={VKShareButton}
                  icon={SlSocialVkontakte}
                  label="VK"
                  componentName="VKShareButton"
                />
                <ShareButton
                  Component={WorkplaceShareButton}
                  icon={SiWorkplace}
                  label="Workplace"
                  componentName="WorkplaceShareButton"
                />
              </div>
              <button className="close-modal" onClick={() => setOpen(false)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
