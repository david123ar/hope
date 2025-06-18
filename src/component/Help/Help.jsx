"use client";
import React from "react";
import "./help.css";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/component/Navbar/Navbar";

export default function Help() {
  return (
    <>
      <SessionProvider>
        <Navbar />
        <div className="help-wrapper">
          <div className="help-container">
            <h1>Help Center</h1>
            <p className="subtitle">We’re working on something awesome.</p>
            <div className="coming-soon">Coming Soon</div>
            <p className="help-note">
              In the meantime, you can use our{" "}
              <Link href="/contact">Contact Page</Link> to reach out.
            </p>
          </div>
        </div>
      </SessionProvider>
    </>
  );
}
