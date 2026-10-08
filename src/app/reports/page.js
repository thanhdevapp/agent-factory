"use client";

import React from "react";
import TokenReportView from "../../components/reports/TokenReportView";
import Link from "next/link";
import { Bot, ArrowLeft } from "lucide-react";

export default function ReportsPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#181818] flex flex-col">
      {/* Mini top bar for standalone route navigation */}
      <header className="h-[36px] bg-[#1e1e1e] border-b border-[#2b2b2b] px-4 flex items-center justify-between shrink-0 select-none">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Virtual Office</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-white">AGMon</span>
          <span>· Token Analytics Suite</span>
        </div>
      </header>

      {/* Report View */}
      <div className="flex-1 overflow-hidden">
        <TokenReportView />
      </div>
    </main>
  );
}
