"use client";
import React, { useState } from "react";
import { FaComments, FaHome, FaRandom } from "react-icons/fa";
import { PiBroadcastFill } from "react-icons/pi";
import { BsBroadcast } from "react-icons/bs";
import "./NavCss/action.css";
import Link from "next/link";
import { FaCircleInfo, FaSackDollar } from "react-icons/fa6";
import { MdPayments, MdPeopleAlt } from "react-icons/md";
import { SiCssdesignawards } from "react-icons/si";
import { IoIosContact } from "react-icons/io";
import { IoLink, IoStatsChartSharp } from "react-icons/io5";
// import { useLanguage } from "@/context/LanguageContext";

const Action = (props) => {
  // const { language, toggleLanguage } = useLanguage();
  const selectedLang = props.selectL || "EN";

  const toggle = () => {
    if (selectedLang === "EN") {
      // setSelectedLang("JP");
      // toggleLanguage("JP");
      props.lang("JP");
    }
    if (selectedLang === "JP") {
      // setSelectedLang("EN");
      // toggleLanguage("EN");
      props.lang("EN");
    }
  };
  return (
    <div className={`action-comb ${props.isInSidebar ? "action-new-c" : ""}`}>
      <Link
        href={`/home${props.refer ? `?refer=${props.refer}` : ``}`}
        className="action-bloc"
      >
        <div className="action-ico">
          <FaHome />
        </div>
        <div>Home</div>
      </Link>
      <Link
        href={`/earning${props.refer ? `?refer=${props.refer}` : ``}`}
        className={`action-bloc ${props.isInSidebar ? "action-bS" : ""}`}
      >
        <div className={`action-ico ${props.isInSidebar ? "action-iS" : ""}`}>
          <IoStatsChartSharp />
        </div>
        <div>Track Earning</div>
      </Link>

      <Link
        href={`/payment${props.refer ? `?refer=${props.refer}` : ``}`}
        className={`action-bloc ${props.isInSidebar ? "action-bS" : ""}`}
      >
        <div className={`action-ico ${props.isInSidebar ? "action-iS" : ""}`}>
          <FaSackDollar />
        </div>
        <div>Payment</div>
      </Link>

      <Link
        href={`/payment-information${
          props.refer ? `?refer=${props.refer}` : ``
        }`}
        className={`action-bloc ${
          props.isInSidebar ? "action-bS" : ""
        } specialo`}
      >
        <div className={`action-ico ${props.isInSidebar ? "action-iS" : ""}`}>
          <MdPayments />
        </div>
        <div>Payment Infomation</div>
      </Link>

      <Link
        href={`/refer-earn${props.refer ? `?refer=${props.refer}` : ``}`}
        className={`action-bloc ${props.isInSidebar ? "action-bS" : ""} `}
      >
        <div className={`action-ico ${props.isInSidebar ? "action-iS" : ""} `}>
          <MdPeopleAlt />
        </div>
        <div>Refer&Earn</div>
      </Link>

      <Link
        href={`/design${props.refer ? `?refer=${props.refer}` : ``}`}
        className={`action-bloc ${props.isInSidebar ? "action-bS" : ""}`}
      >
        <div className={`action-ico ${props.isInSidebar ? "action-iS" : ""}`}>
          <SiCssdesignawards />
        </div>
        <div>Design</div>
      </Link>

      {/* <div
        className={`action-bloc ${
          props.isInSidebar ? "action-bS" : ""
        } special-C`}
      >
        <div className={`action-ico ${props.isInSidebar ? "action-iS" : ""}`}>
          <button
            className={`engJ ${selectedLang === "EN" ? "selEJ" : ""}`}
            onClick={() => toggle()}
          >
            EN
          </button>
          <button
            className={`JpE ${selectedLang === "JP" ? "selEJ" : ""}`}
            onClick={() => toggle()}
          >
            JP
          </button>
        </div>
        <div>Anime Name</div>
      </div> */}

      {!props.isInSidebar && (
        <Link
          href={`/contact${props.refer ? `?refer=${props.refer}` : ``}`}
          className="action-bloc specialo"
        >
          <div className="action-ico">
            <IoIosContact />
          </div>
          <div>Contact</div>
        </Link>
      )}

      <Link
        href={`/help${props.refer ? `?refer=${props.refer}` : ``}`}
        className="action-bloc specialo"
      >
        <div className="action-ico ">
          <FaCircleInfo />
        </div>
        <div>Help</div>
      </Link>
    </div>
  );
};

export default Action;
