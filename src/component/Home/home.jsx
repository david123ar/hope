"use client";
import React from "react";
import LandingPage from "../Homie/Homie";
import { SessionProvider } from "next-auth/react";

export default function Luke(props) {
  return (
    <div>
      <SessionProvider>
        <LandingPage refer={props.refer}/>
      </SessionProvider>
    </div>
  );
}
