"use client";
import Design from "@/component/Design/Design";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function Desin() {
  return (
    <div>
      <SessionProvider>
        <Design />
      </SessionProvider>
    </div>
  );
};
