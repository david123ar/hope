"use client"
import ReferEarn from "@/component/Refer/Refer";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function Referi() {
  return (
    <div>
      <SessionProvider>
        <ReferEarn />
      </SessionProvider>
    </div>
  );
};
