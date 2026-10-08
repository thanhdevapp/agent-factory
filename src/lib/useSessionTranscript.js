"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export function useSessionTranscript(sessionId, isActive = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollTimerRef = useRef(null);
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef(null);

  const fetchTranscript = useCallback(async () => {
    if (!sessionId || isFetchingRef.current) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    isFetchingRef.current = true;
    try {
      const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}/transcript`, {
        signal: abortControllerRef.current.signal,
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [sessionId]);

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    fetchTranscript();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchTranscript]);

  // Visibility-aware polling when active
  useEffect(() => {
    if (!isActive || !sessionId) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchTranscript();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    pollTimerRef.current = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchTranscript();
      }
    }, 2000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isActive, sessionId, fetchTranscript]);

  // Export Markdown function
  const exportMarkdown = useCallback(() => {
    if (!data || !data.turns) return;

    const s = data.session || {};
    let md = `# Conversation Transcript: ${s.id || sessionId}\n\n`;
    md += `- **CLI:** ${s.cli || "Unknown"}\n`;
    md += `- **Model:** ${s.model || "Unknown"}\n`;
    md += `- **Started:** ${s.startedAt || "N/A"}\n`;
    if (s.cwd) md += `- **Directory:** ${s.cwd}\n`;
    if (s.tokens) {
      md += `- **Tokens:** In ${s.tokens.input} | Out ${s.tokens.output} | Cached ${s.tokens.cached}\n`;
    }
    md += `\n---\n\n`;

    for (const turn of data.turns) {
      if (turn.role === "user") {
        md += `### User (${turn.timestamp || ""})\n\n`;
        md += `${turn.content}\n\n`;
      } else {
        md += `### Assistant (${turn.timestamp || ""})\n\n`;
        if (turn.thinking) {
          md += `> **Thinking:**\n> ${turn.thinking.replace(/\n/g, "\n> ")}\n\n`;
        }
        if (Array.isArray(turn.toolCalls) && turn.toolCalls.length > 0) {
          md += `#### Executed Tools:\n`;
          for (const tc of turn.toolCalls) {
            md += `- **[${tc.type.toUpperCase()}] ${tc.name}**: \`${JSON.stringify(tc.args)}\`\n`;
            if (tc.output) {
              md += `  \`\`\`\n  ${tc.output.trim().replace(/\n/g, "\n  ")}\n  \`\`\`\n`;
            }
          }
          md += `\n`;
        }
        if (turn.content) {
          md += `${turn.content}\n\n`;
        }
      }
      md += `---\n\n`;
    }

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sessionId}-transcript.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, sessionId]);

  return {
    data,
    session: data?.session,
    turns: data?.turns || [],
    loading,
    error,
    refresh: fetchTranscript,
    exportMarkdown,
  };
}
