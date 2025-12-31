"use client";
import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import Social from "./Social";
import Action from "./Action";
import "./NavCss/nav.css";
import Link from "next/link";
import NavSidebar from "../NavSidebar/NavSidebar";
import { useSession } from "next-auth/react";
import Profilo from "../Profilo/Profilo";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import { usePathname } from "next/navigation";

export default function Navbar({
  lang,
  refer,
  selectL,
  theme = "lime", // 👈 theme control
}) {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profiIsOpen, setProfiIsOpen] = useState(false);
  const [logIsOpen, setLogIsOpen] = useState(false);

  const { data: session } = useSession();
  const pathname = usePathname();

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon";

  const firstSegment = pathname.split("/")[1] || "home";
  const activeLabel =
    firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 5);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`navbar-root theme-${theme}`}>
      {profiIsOpen && (
        <Profilo
          setProfiIsOpen={setProfiIsOpen}
          profiIsOpen={profiIsOpen}
          refer={refer}
        />
      )}

      {logIsOpen && (
        <SignInSignUpModal
          logIsOpen={logIsOpen}
          setLogIsOpen={setLogIsOpen}
          refer={refer}
        />
      )}

      <NavSidebar
        sidebarIsOpen={sidebarIsOpen}
        setSidebarIsOpen={setSidebarIsOpen}
        lang={lang}
        selectL={selectL}
        refer={refer}
      />

      <div className={`nav-1 ${isScrolled ? "darkio" : ""}`}>
        <div className="nav-in">
          <div onClick={() => setSidebarIsOpen(true)} className="barr">
            <FaBars size={22} />
          </div>

          <Link href={`/${refer ? `?refer=${refer}` : ``}`}>
            <div className="logo-container">
              <div className="logo-icon" />
              <div className="logo-text">{siteName}</div>
            </div>
          </Link>

          <div className="social-links">
            <span className="route-pill active">{activeLabel}</span>
          </div>

          <div className="nav-action">
            <Action lang={lang} refer={refer} selectL={selectL} />
          </div>
        </div>

        <div className="nav-end">
          {session ? (
            <img
              src={session.user.avatar}
              className="profile-ico"
              onClick={() => setProfiIsOpen(true)}
              alt="profile"
            />
          ) : (
            <div className="nav-log" onClick={() => setLogIsOpen(true)}>
              Login
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
