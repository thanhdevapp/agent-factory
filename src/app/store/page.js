"use client";

import React from "react";
import SupporterStoreView from "@/components/store/SupporterStoreView";

export default function StorePage() {
  return (
    <div className="flex h-screen w-full bg-[#181818]">
      <SupporterStoreView hideHeader={false} />
    </div>
  );
}
