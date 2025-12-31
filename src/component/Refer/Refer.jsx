"use client";
import React, { useState } from "react";
import "./referEarn.css";
import { SessionProvider, useSession } from "next-auth/react";
import Navbar from "@/component/Navbar/Navbar";

export default function ReferEarn() {
  const { data: session, status } = useSession();
  const referralUrl = `https://henpro.fun/?ref=${session?.user?.username}`; // Replace dynamically as needed
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>

      <Navbar theme="aurora" />
      <div className="refer-wrapper">
        <div className="refer-container">
          <h2>Refer & Earn</h2>
          <p className="subtitle">
            Share your unique referral link and earn{" "}
            <strong>extra ad revenue</strong> when your referrals sign up and
            start using the platform.
          </p>

          <div className="refer-box">
            <label htmlFor="referral">Your Referral Link</label>
            <div className="referral-field">
              <input type="text" id="referral" value={referralUrl} readOnly />
              <button onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="reward-info">
            <h3>💰 More Earnings from Your Referrals, More You Earn</h3>
            <p>
              The more your referred users earn through ad revenue, the higher
              your earnings will be too. It’s a win-win — grow your network,
              grow your income!
            </p>
          </div>

          <p className="note">
            Share your referral link on WhatsApp, Telegram, social media, or
            email. The more you refer, the more you earn.
          </p>
        </div>
      </div>

    </>
  );
}
