"use client";

import React from "react";

/**
 * FileIcon - Material & VS Code authentic SVG icons for file extensions and folders.
 * Adapted directly from BuilderKit Studio architecture (Icons.tsx).
 * 100% SVG based, zero emoji characters, compliant with strict UI guidelines.
 */
export default function FileIcon({
  filename = "",
  isFolder = false,
  isOpen = false,
  size = 14,
  className = "",
}) {
  const s = size;

  if (isFolder) {
    if (isOpen) {
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 16 16"
          fill="none"
          className={`shrink-0 ${className}`}
        >
          <path
            d="M1.5 3A1.5 1.5 0 0 1 3 1.5h3.293a1.5 1.5 0 0 1 1.06.44l1.207 1.207a.5.5 0 0 0 .354.146H13A1.5 1.5 0 0 1 14.5 4.793V6H3a1.5 1.5 0 0 0-1.42 1.027L.5 11V3a1.5 1.5 0 0 1 1-1.5z"
            fill="#c99e55"
          />
          <path
            d="M2 13.5l1.8-6.2c.16-.54.66-.9 1.22-.9h9.46c.72 0 1.22.68 1.03 1.36l-1.5 5.2a1.5 1.5 0 0 1-1.44 1.04H3.5A1.5 1.5 0 0 1 2 13.5z"
            fill="#e8a838"
          />
        </svg>
      );
    }
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 16 16"
        fill="none"
        className={`shrink-0 ${className}`}
      >
        <path
          d="M1.5 3A1.5 1.5 0 0 1 3 1.5h3.293a1.5 1.5 0 0 1 1.06.44l1.207 1.207a.5.5 0 0 0 .354.146H13A1.5 1.5 0 0 1 14.5 4.793V12A1.5 1.5 0 0 1 13 13.5H3A1.5 1.5 0 0 1 1.5 12V3z"
          fill="#dcb67a"
        />
      </svg>
    );
  }

  const lower = (filename || "").toLowerCase();

  // JavaScript (.js, .jsx, .mjs, .cjs)
  if (lower.endsWith(".js") || lower.endsWith(".jsx") || lower.endsWith(".mjs") || lower.endsWith(".cjs")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#f7df1e" />
        <text
          x="3"
          y="12"
          fill="#000000"
          fontFamily="var(--font-family-ui, system-ui, sans-serif)"
          fontWeight="bold"
          fontSize="9.5"
        >
          {lower.endsWith(".jsx") ? "JSX" : "JS"}
        </text>
      </svg>
    );
  }

  // TypeScript (.ts, .tsx)
  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#3178c6" />
        <text
          x="2.5"
          y="12"
          fill="#ffffff"
          fontFamily="var(--font-family-ui, system-ui, sans-serif)"
          fontWeight="bold"
          fontSize="9.5"
        >
          {lower.endsWith(".tsx") ? "TSX" : "TS"}
        </text>
      </svg>
    );
  }

  // JSON / JSONL
  if (lower.endsWith(".json") || lower.endsWith(".jsonl")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#f1c40f" fillOpacity="0.2" />
        <text
          x="3.5"
          y="12"
          fill="#f1c40f"
          fontFamily="var(--font-family-mono, monospace)"
          fontWeight="bold"
          fontSize="10"
        >
          {"{}"}
        </text>
      </svg>
    );
  }

  // Markdown (.md, .markdown)
  if (lower.endsWith(".md") || lower.endsWith(".markdown")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#519aba" fillOpacity="0.2" />
        <text
          x="2"
          y="11.5"
          fill="#519aba"
          fontFamily="var(--font-family-mono, monospace)"
          fontWeight="bold"
          fontSize="8.5"
        >
          MD
        </text>
      </svg>
    );
  }

  // HTML / Component HTML
  if (lower.endsWith(".html") || lower.endsWith(".htm")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#e44d26" fillOpacity="0.2" />
        <text
          x="1"
          y="11.5"
          fill="#e44d26"
          fontFamily="var(--font-family-mono, monospace)"
          fontWeight="bold"
          fontSize="8"
        >
          &lt;/&gt;
        </text>
      </svg>
    );
  }

  // CSS / SCSS
  if (lower.endsWith(".css") || lower.endsWith(".scss") || lower.endsWith(".sass")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#42a5f5" fillOpacity="0.2" />
        <text
          x="2"
          y="11.5"
          fill="#42a5f5"
          fontFamily="var(--font-family-mono, monospace)"
          fontWeight="bold"
          fontSize="8.5"
        >
          #
        </text>
      </svg>
    );
  }

  // Java
  if (lower.endsWith(".java")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#f89820" fillOpacity="0.2" />
        <text
          x="1.5"
          y="11.5"
          fill="#f89820"
          fontFamily="var(--font-family-ui, sans-serif)"
          fontWeight="bold"
          fontSize="8.5"
        >
          JAVA
        </text>
      </svg>
    );
  }

  // Python (.py)
  if (lower.endsWith(".py")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#3776ab" fillOpacity="0.2" />
        <text
          x="2.5"
          y="11.5"
          fill="#3776ab"
          fontFamily="var(--font-family-mono, monospace)"
          fontWeight="bold"
          fontSize="9"
        >
          PY
        </text>
      </svg>
    );
  }

  // SQL / DDL
  if (lower.endsWith(".sql") || lower.endsWith(".ddl")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#00bcd4" fillOpacity="0.2" />
        <path
          d="M8 2C4.69 2 2 3.12 2 4.5v7C2 12.88 4.69 14 8 14s6-1.12 6-2.5v-7C14 3.12 11.31 2 8 2zm0 1.5c2.76 0 4.5.83 4.5 1s-1.74 1-4.5 1-4.5-.83-4.5-1 1.74-1 4.5-1zm-4.5 3.32c1.07.47 2.68.68 4.5.68s3.43-.21 4.5-.68v1.73c0 .17-1.74 1-4.5 1s-4.5-.83-4.5-1V6.82zm0 3.5c1.07.47 2.68.68 4.5.68s3.43-.21 4.5-.68v1.73c0 .17-1.74 1-4.5 1s-4.5-.83-4.5-1v-1.73z"
          fill="#00bcd4"
        />
      </svg>
    );
  }

  // Images (.png, .jpg, .jpeg, .gif, .webp, .ico, .bmp)
  if (
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".gif") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".ico") ||
    lower.endsWith(".bmp")
  ) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#26a69a" fillOpacity="0.2" stroke="#26a69a" strokeWidth="0.8" />
        <circle cx="5" cy="5.5" r="1.5" fill="#26a69a" />
        <path d="M2.5 13.5l4-5 3.5 4 2-2.5 2 3.5h-11.5z" fill="#26a69a" />
      </svg>
    );
  }

  // SVG Vector
  if (lower.endsWith(".svg")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#ff7043" fillOpacity="0.2" stroke="#ff7043" strokeWidth="0.8" />
        <text
          x="1"
          y="11.5"
          fill="#ff7043"
          fontFamily="var(--font-family-ui, system-ui, sans-serif)"
          fontWeight="bold"
          fontSize="7.5"
        >
          SVG
        </text>
      </svg>
    );
  }

  // Docker
  if (
    lower === "dockerfile" ||
    lower.startsWith("dockerfile.") ||
    lower.endsWith(".dockerfile") ||
    lower.includes("docker-compose")
  ) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#2496ed" fillOpacity="0.2" />
        <path
          d="M13.8 6.8c-.3-.2-.8-.2-1.1 0-.1-.6-.5-1.1-1.1-1.3l-.4-.1-.2.4c-.2.5-.2 1 0 1.5-.4.2-.8.5-1.2.9H2.5c-.3 0-.5.2-.5.5v3.5c0 1.7 1.3 3 3 3h5.2c2.5 0 4.6-1.8 4.8-4.3.4-.6.6-1.3.6-2 0-.8-.4-1.4-1-1.8-.2-.1-.5-.2-.8-.3zM4 6.5h1.5v1.5H4V6.5zm2 0h1.5v1.5H6V6.5zm2 0h1.5v1.5H8V6.5zm2 0h1.5v1.5H10V6.5z"
          fill="#2496ed"
        />
      </svg>
    );
  }

  // Git (.gitignore, .gitattributes, .gitmodules)
  if (lower.startsWith(".git") || lower.includes("git")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#f05032" fillOpacity="0.15" />
        <circle cx="5" cy="5" r="1.5" fill="#f05032" />
        <circle cx="11" cy="5" r="1.5" fill="#f05032" />
        <circle cx="8" cy="11.5" r="1.5" fill="#f05032" />
        <path d="M5 6.5v2a3 3 0 0 0 3 3M11 6.5v2a3 3 0 0 1-3 3" stroke="#f05032" strokeWidth="1.2" fill="none" />
      </svg>
    );
  }

  // YAML / YML
  if (lower.endsWith(".yaml") || lower.endsWith(".yml")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#cb171e" fillOpacity="0.2" />
        <text
          x="1"
          y="11.5"
          fill="#e06c75"
          fontFamily="var(--font-family-ui, system-ui, sans-serif)"
          fontWeight="bold"
          fontSize="7.5"
        >
          YML
        </text>
      </svg>
    );
  }

  // TOML / INI / Conf / Properties
  if (
    lower.endsWith(".toml") ||
    lower.endsWith(".ini") ||
    lower.endsWith(".conf") ||
    lower.endsWith(".cfg") ||
    lower.endsWith(".properties")
  ) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#61afef" fillOpacity="0.2" />
        <circle cx="8" cy="8" r="3" stroke="#61afef" strokeWidth="1.2" fill="none" />
        <circle cx="8" cy="8" r="1" fill="#61afef" />
        <path d="M8 2.5v2M8 11.5v2M2.5 8h2M11.5 8h2" stroke="#61afef" strokeWidth="1.2" />
      </svg>
    );
  }

  // Shell script (.sh, .bash, .zsh)
  if (lower.endsWith(".sh") || lower.endsWith(".bash") || lower.endsWith(".zsh")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#89d185" fillOpacity="0.2" />
        <path d="M4 5l3 3-3 3" stroke="#89d185" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="8.5" y1="11" x2="12" y2="11" stroke="#89d185" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Lock files (package-lock.json, yarn.lock, pnpm-lock.yaml)
  if (lower.includes("lock")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#e5c07b" fillOpacity="0.2" />
        <rect x="4.5" y="7" width="7" height="6" rx="1" fill="#e5c07b" />
        <path d="M6 7V5a2 2 0 1 1 4 0v2" stroke="#e5c07b" strokeWidth="1.2" fill="none" />
      </svg>
    );
  }

  // XML
  if (lower.endsWith(".xml")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#e74c3c" fillOpacity="0.2" />
        <text
          x="1"
          y="11.5"
          fill="#e74c3c"
          fontFamily="var(--font-family-mono, monospace)"
          fontWeight="bold"
          fontSize="8"
        >
          &lt;/&gt;
        </text>
      </svg>
    );
  }

  // Config / Env
  if (lower.startsWith(".env") || lower.includes("config")) {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
        <rect width="16" height="16" rx="2" fill="#9b59b6" fillOpacity="0.2" />
        <circle cx="8" cy="8" r="3.5" stroke="#bb86fc" strokeWidth="1.2" fill="none" />
        <circle cx="8" cy="8" r="1.5" fill="#03dac6" />
      </svg>
    );
  }

  // Default File Icon (Clean document outline)
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M3 2a1 1 0 0 1 1-1h5.5l3.5 3.5V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2z"
        stroke="#858585"
        strokeWidth="1.2"
        fill="#1e1e1e"
      />
      <path d="M9 1v4h4" stroke="#858585" strokeWidth="1.2" />
      <line x1="5" y1="8" x2="11" y2="8" stroke="#858585" strokeWidth="1" strokeLinecap="round" />
      <line x1="5" y1="11" x2="9" y2="11" stroke="#858585" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
