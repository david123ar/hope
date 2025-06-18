"use client";
import React, { useState } from "react";
import { FaChevronLeft, FaComments, FaHome } from "react-icons/fa";
import Link from "next/link";
import "./nav-sidebar.css";
import Actions from "../Navbar/Action";
import { FaCircleInfo, FaSackDollar } from "react-icons/fa6";
import { MdPayments, MdPeopleAlt } from "react-icons/md";
import { SiCssdesignawards } from "react-icons/si";
import { IoIosContact } from "react-icons/io";
import { IoLink, IoStatsChartSharp } from "react-icons/io5";
export default function NavSidebar(props) {
  return (
    <div
      className="navigation-sidebar f-poppins"
      style={{ zIndex: props.sidebarIsOpen ? 100 : -1 }}
      onClick={() => props.setSidebarIsOpen(false)}
    >
      <div
        className="navigation-list d-flex"
        style={{
          transform: props.sidebarIsOpen
            ? "translateX(280px)"
            : "translateX(-280px)",
        }}
      >
        <div className="button-group d-flex-fd-column">
          <div
            className="d-flex a-center j-center close-menu"
            style={{ width: "60%" }}
            onClick={() => props.setSidebarIsOpen()}
          >
            <FaChevronLeft size={12} />
            Close Menu
          </div>
          {/* <div className="action-grop">
            <Actions
              isInSidebar={true}
              data={props.data}
              lang={props.lang}
              refer={props.refer}
              selectL={props.selectL}
            />
          </div>

          <a href="/" className="d-flex a-center j-center">
            <FaComments size={14} />
            Community
          </a> */}
        </div>

        <div className="navigation-link-list">
          <ul>
            <li>
              <Link
                href={`/home${props.refer ? `?refer=${props.refer}` : ``}`}
                className="lupe"
              >
                <div>
                  <FaHome />
                </div>
                <div>Home</div>
              </Link>
            </li>
            <li>
              <Link
                href={`/earning${
                  props.refer ? `?refer=${props.refer}` : ``
                }`}
                className="lupe"
              >
                <div>
                  <IoStatsChartSharp />
                </div>
                <div>Track Earning</div>
              </Link>
            </li>
            <li>
              <Link
                href={`/payment${props.refer ? `?refer=${props.refer}` : ``}`}
                className="lupe"
              >
                <div>
                  <FaSackDollar />
                </div>
                <div>Payments</div>
              </Link>
            </li>
            <li>
              <Link
                href={`/payment-information${props.refer ? `?refer=${props.refer}` : ``}`}
                className="lupe"
              >
                {/* <MdPeopleAlt /> */}
                <div>
                  <MdPayments />
                </div>
                <div>Payment Information</div>
              </Link>
            </li>
            <li>
              <Link
                href={`/refer-earn${props.refer ? `?refer=${props.refer}` : ``}`}
                className="lupe"
              >
                <div>
                  <MdPeopleAlt />
                </div>
                <div>Refer&Earn</div>
              </Link>
            </li>
            <li>
              <Link
                href={`/design${props.refer ? `?refer=${props.refer}` : ``}`}
                className="lupe"
              >
                <div>
                  <SiCssdesignawards />
                </div>
                <div>Design</div>
              </Link>
            </li>
            <li>
              <Link
                href={`/contact${props.refer ? `?refer=${props.refer}` : ``}`}
                className="lupe"
              >
                <div>
                  <IoIosContact />
                </div>
                <div>Contact</div>
              </Link>
            </li>
            <li>
              <Link
                href={`/help${props.refer ? `?refer=${props.refer}` : ``}`}
                className="lupe"
              >
                <div>
                  <FaCircleInfo />
                </div>
                <div>Help</div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
