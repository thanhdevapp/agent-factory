"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Maximize2, ImageIcon } from "lucide-react";
import CodeBlock from "./CodeBlock.js";
import MermaidBlock from "./MermaidBlock.js";
import DiffViewer from "./DiffViewer.js";
import ArtifactPreview from "./ArtifactPreview.js";

function resolveImageSrc(src) {
  if (!src) return "";
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  // Local path or file:// URI -> route through local media API
  return `/api/media?path=${encodeURIComponent(src)}`;
}

export default function MarkdownRenderer({ content = "", onImageClick }) {
  if (!content) return null;

  return (
    <div className="chat-markdown text-[var(--text-main)] text-[var(--font-size-ui)] leading-relaxed break-words font-sans">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img({ src, alt, ...props }) {
            const resolved = resolveImageSrc(src);
            return (
              <span className="inline-block my-2 max-w-full group">
                <span
                  onClick={() => onImageClick?.({ src: resolved, alt: alt || "Image preview" })}
                  className="relative inline-block cursor-pointer overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-chat-code)] shadow-md transition-all hover:border-[var(--accent-secondary)] hover:shadow-xl"
                  title="Click to view popup preview"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolved}
                    alt={alt || "Image preview"}
                    className="max-h-80 max-w-full rounded-lg object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                    loading="lazy"
                    {...props}
                  />
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/80 px-2 py-0.5 text-[10px] text-slate-200 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 shadow border border-slate-700/60 font-mono">
                    <Maximize2 className="h-3 w-3 text-cyan-400" />
                    <span>View Image</span>
                  </span>
                </span>
                {alt && (
                  <span className="block mt-1 text-center text-[11px] text-[var(--text-muted)] italic">
                    {alt}
                  </span>
                )}
              </span>
            );
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const lang = match ? match[1].toLowerCase() : "";
            const textContent = String(children).replace(/\n$/, "");

            if (!inline && (match || textContent.includes("\n"))) {
              // 1. Mermaid diagrams
              if (lang === "mermaid") {
                return <MermaidBlock code={textContent} />;
              }

              // 2. Git Diff
              if (lang === "diff") {
                return <DiffViewer diffText={textContent} />;
              }

              // 3. HTML / SVG Artifact Sandbox Preview
              if ((lang === "html" || lang === "svg") && (
                textContent.includes("<!DOCTYPE") || 
                textContent.includes("<html") || 
                textContent.includes("<svg") ||
                textContent.includes("<body") ||
                textContent.length > 80
              )) {
                return (
                  <ArtifactPreview 
                    htmlCode={textContent} 
                    title={lang === "svg" ? "SVG Vector Graphic" : "HTML Interactive Artifact"} 
                  />
                );
              }

              return (
                <CodeBlock
                  language={lang || "text"}
                  code={textContent}
                />
              );
            }

            // Check if inline code represents an image file
            const cleanPath = textContent.trim();
            const isImageFile = /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(cleanPath);

            if (isImageFile) {
              const resolved = resolveImageSrc(cleanPath);
              return (
                <button
                  type="button"
                  onClick={() => onImageClick?.({ src: resolved, alt: cleanPath })}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 rounded bg-[var(--bg-chat-user)] hover:brightness-110 border border-[var(--border-chat-user)] text-[var(--accent-secondary)] font-mono text-[11px] transition-all cursor-pointer group shadow-sm"
                  title="Click to preview image in popup"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[var(--accent-secondary)] shrink-0 transition-transform group-hover:scale-110" />
                  <span className="underline decoration-[var(--border-chat-user)]">{cleanPath}</span>
                  <Maximize2 className="w-3 h-3 text-[var(--accent-secondary)] opacity-60 group-hover:opacity-100" />
                </button>
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded bg-[var(--bg-chat-code)] text-[var(--accent-secondary)] font-mono text-[12px] border border-[var(--border-subtle)]"
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ href, children }) {
            // If link points to an image file, allow clicking to view in lightbox!
            const isImageLink = /\.(png|jpe?g|gif|webp|svg|bmp)(\?.*)?$/i.test(href || "");

            if (isImageLink) {
              const resolved = resolveImageSrc(href);
              return (
                <span
                  onClick={() => onImageClick?.({ src: resolved, alt: String(children) || "Image link" })}
                  className="cursor-pointer text-[var(--accent-secondary)] underline decoration-[var(--accent-secondary)]/40 hover:decoration-[var(--accent-secondary)] hover:brightness-110 font-medium transition-colors inline-flex items-center gap-1.5"
                  title="Click to view image"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[var(--accent-secondary)] shrink-0" />
                  <span>{children}</span>
                </span>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[var(--accent-secondary)] underline decoration-[var(--accent-secondary)]/40 hover:decoration-[var(--accent-secondary)] hover:brightness-110 transition-colors"
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="my-3 overflow-x-auto rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)]">
                <table className="min-w-full divide-y divide-[var(--border-subtle)] text-left text-xs">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="px-3 py-2 font-semibold text-[var(--text-bright)] bg-[var(--bg-card-inner)]">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-3 py-2 border-t border-[var(--border-subtle)] text-[var(--text-main)]">
                {children}
              </td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-2 border-l-2 border-[var(--accent-primary)] pl-3 italic text-[var(--text-muted)] text-xs">
                {children}
              </blockquote>
            );
          },
          ul({ children }) {
            return <ul className="my-2 list-disc list-inside space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="my-2 list-decimal list-inside space-y-1">{children}</ol>;
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
          h1({ children }) {
            return <h1 className="text-lg font-bold text-[var(--text-bright)] my-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-base font-semibold text-[var(--text-bright)] my-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-sm font-semibold text-[var(--text-bright)] my-1.5">{children}</h3>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
