"use client";

import React from "react";
import MarkdownRenderer from "../chat/MarkdownRenderer";

export default function MarkdownPreview({
  content = "",
  filePath = "",
  className = "",
}) {
  return (
    <div
      className={`h-full w-full overflow-y-auto bg-[#1e1e1e] p-6 lg:p-8 select-text ${className}`}
    >
      <div className="max-w-4xl mx-auto bg-[#1e1e1e] pb-16">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}
