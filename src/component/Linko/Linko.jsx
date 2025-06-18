"use client";
import AddLink from "@/component/AddLink/AddLink";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function Linko() {
  return (
    <div>
      <SessionProvider>
        <AddLink />
      </SessionProvider>
    </div>
  );
}
