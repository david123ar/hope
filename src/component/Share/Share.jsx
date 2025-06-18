"use client";
import React, { useState } from "react";
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

  return (
    <>
      <div className="share-app">
        {/* <img
          src="https://i.postimg.cc/d34WWyNQ/share-icon.gif"
          alt="Share Anime"
          className="w-[60px] h-auto rounded-full max-[1024px]:w-[40px]"
        /> */}
        <div className="btnio">
          <div className="secoi">
            Share your
            <span className="primary">
              {arise || process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"}
            </span>
            to Social Media
          </div>
        </div>
        <div className="btnio">
          <button onClick={handleCopy} className="copy-btn">
            {copied ? (
              <>
                <MdCheckCircle size={22} />
                <span className="button-text large-screen-only">Copied</span>
              </>
            ) : (
              <>
                <MdContentCopy size={22} />
                <span className="button-text large-screen-only">Copy</span>
              </>
            )}{" "}
          </button>
          <button onClick={() => setOpen(true)} className="share-btn">
            <FaShareAlt size={20} />
            <span className="button-text large-screen-only">Share</span>
          </button>
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
