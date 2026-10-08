"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Maximize2, ImageIcon } from "lucide-react";
import CodeBlock from "./CodeBlock.js";

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
    <div className="chat-markdown text-slate-200 text-sm leading-relaxed break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img({ src, alt, ...props }) {
            const resolved = resolveImageSrc(src);
            return (
              <span className="inline-block my-2 max-w-full group">
                <span
                  onClick={() => onImageClick?.({ src: resolved, alt: alt || "Image preview" })}
                  className="relative inline-block cursor-pointer overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950 shadow-md transition-all hover:border-cyan-500/70 hover:shadow-cyan-500/10 hover:shadow-xl"
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
                  <span className="block mt-1 text-center text-[11px] text-slate-400 italic">
                    {alt}
                  </span>
                )}
              </span>
            );
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const textContent = String(children).replace(/\n$/, "");

            if (!inline && (match || textContent.includes("\n"))) {
              return (
                <CodeBlock
                  language={match ? match[1] : "text"}
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
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-mono text-[11px] transition-all cursor-pointer group shadow-sm"
                  title="Click to preview image in popup"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="underline decoration-cyan-500/40">{cleanPath}</span>
                  <Maximize2 className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100" />
                </button>
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded bg-slate-800/90 text-cyan-300 font-mono text-[12px] border border-slate-700/50"
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
                  className="cursor-pointer text-cyan-400 underline decoration-cyan-500/40 hover:decoration-cyan-400 hover:text-cyan-300 font-medium transition-colors inline-flex items-center gap-1.5"
                  title="Click to view image"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{children}</span>
                </span>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-cyan-400 underline decoration-cyan-500/40 hover:decoration-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="my-3 overflow-x-auto rounded-lg border border-slate-700/80 bg-slate-900/60">
                <table className="min-w-full divide-y divide-slate-800 text-left text-xs">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="px-3 py-2 font-semibold text-slate-300 bg-slate-800/60">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-3 py-2 border-t border-slate-800/60 text-slate-300">
                {children}
              </td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-2 border-l-2 border-cyan-500/60 pl-3 italic text-slate-400 text-xs">
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
            return <h1 className="text-lg font-bold text-slate-100 my-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-base font-semibold text-slate-100 my-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-sm font-semibold text-slate-200 my-1.5">{children}</h3>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
