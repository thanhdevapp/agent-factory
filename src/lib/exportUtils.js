/**
 * AGMon Session Report & Export Engine
 * Generates formatted Markdown and self-contained HTML reports for AI agent sessions.
 */

/**
 * Format duration from ms to readable string (e.g. 2m 15s)
 */
export function formatDuration(ms) {
  if (!ms || isNaN(ms)) return "N/A";
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format timestamp to readable string
 */
export function formatTimestamp(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
  } catch {
    // fallback
  }
  return String(isoString);
}

/**
 * Calculate summary metrics from session and turns
 */
export function extractSessionMetrics(session = {}, turns = []) {
  const toolsCount = {};
  let totalToolCalls = 0;
  let userTurns = 0;
  let assistantTurns = 0;
  const modifiedFiles = new Set();

  for (const turn of turns) {
    if (turn.role === "user") userTurns++;
    if (turn.role === "assistant") assistantTurns++;

    if (Array.isArray(turn.toolCalls)) {
      for (const tc of turn.toolCalls) {
        totalToolCalls++;
        const toolName = tc.name || tc.action || "unknown";
        toolsCount[toolName] = (toolsCount[toolName] || 0) + 1;

        // Detect modified files
        if (
          toolName === "replace_file_content" ||
          toolName === "write_to_file" ||
          toolName === "edit_file"
        ) {
          const filePath = tc.args?.TargetFile || tc.args?.path || tc.args?.file;
          if (filePath) modifiedFiles.add(filePath);
        }
      }
    }
  }

  const tokens = session.tokens || {};
  const totalTokens = (tokens.input || 0) + (tokens.output || 0) + (tokens.cached || 0);

  return {
    userTurns,
    assistantTurns,
    totalToolCalls,
    toolsBreakdown: toolsCount,
    modifiedFiles: Array.from(modifiedFiles),
    totalTokens,
    inputTokens: tokens.input || 0,
    outputTokens: tokens.output || 0,
    cachedTokens: tokens.cached || 0,
  };
}

/**
 * Generate Structured GitHub Flavored Markdown Report
 */
export function generateSessionMarkdown(session = {}, turns = [], options = {}) {
  const {
    includeExecutiveSummary = true,
    includeThinking = true,
    includeToolOutputs = false,
    includeTimestamps = true,
  } = options;

  const s = session || {};
  const metrics = extractSessionMetrics(s, turns);
  const sessionId = s.id || "session";

  let md = `# Session Report: ${sessionId}\n\n`;

  if (includeExecutiveSummary) {
    md += `## Executive Summary\n\n`;
    md += `| Attribute | Details |\n`;
    md += `| :--- | :--- |\n`;
    md += `| **Session ID** | \`${sessionId}\` |\n`;
    md += `| **CLI Source** | ${s.cli ? s.cli.toUpperCase() : "Unknown"} |\n`;
    md += `| **AI Model** | \`${s.model || "Unknown"}\` |\n`;
    md += `| **Duration** | ${formatDuration(s.durationMs)} |\n`;
    md += `| **Started At** | ${s.startedAt ? new Date(s.startedAt).toLocaleString() : "N/A"} |\n`;
    if (s.cwd) md += `| **Working Directory** | \`${s.cwd}\` |\n`;
    md += `| **Total Tokens** | ${metrics.totalTokens.toLocaleString()} (In: ${metrics.inputTokens.toLocaleString()} / Out: ${metrics.outputTokens.toLocaleString()} / Cache: ${metrics.cachedTokens.toLocaleString()}) |\n`;
    md += `| **User Interactions** | ${metrics.userTurns} prompts |\n`;
    md += `| **Tool Calls** | ${metrics.totalToolCalls} executed |\n\n`;

    if (metrics.modifiedFiles.length > 0) {
      md += `### Files Modified\n\n`;
      for (const file of metrics.modifiedFiles) {
        md += `- \`${file}\`\n`;
      }
      md += `\n`;
    }

    if (metrics.totalToolCalls > 0) {
      md += `### Tool Usage Breakdown\n\n`;
      md += `| Tool Name | Invocations |\n`;
      md += `| :--- | :--- |\n`;
      for (const [tool, count] of Object.entries(metrics.toolsBreakdown)) {
        md += `| \`${tool}\` | ${count} |\n`;
      }
      md += `\n`;
    }

    md += `---\n\n`;
  }

  md += `## Conversation & Action Log\n\n`;

  for (let i = 0; i < turns.length; i++) {
    const turn = turns[i];
    const timeStr = includeTimestamps && turn.timestamp ? ` *(${formatTimestamp(turn.timestamp)})*` : "";

    if (turn.role === "user") {
      md += `### User Prompt ${timeStr}\n\n`;
      md += `${turn.content || "*(No message)*"}\n\n`;
    } else {
      md += `### Assistant Turn ${timeStr}\n\n`;

      if (includeThinking && turn.thinking) {
        md += `> **Reasoning / Thought Process:**\n`;
        md += `> ${turn.thinking.trim().replace(/\n/g, "\n> ")}\n\n`;
      }

      if (Array.isArray(turn.toolCalls) && turn.toolCalls.length > 0) {
        md += `#### Tools Executed (${turn.toolCalls.length}):\n\n`;
        for (const tc of turn.toolCalls) {
          const toolName = tc.name || tc.action || "Tool";
          const argsSummary = tc.args ? JSON.stringify(tc.args) : "";
          md += `- **\`${toolName}\`**: \`${argsSummary}\`\n`;

          if (includeToolOutputs && tc.output) {
            md += `  \`\`\`text\n  ${tc.output.trim().replace(/\n/g, "\n  ")}\n  \`\`\`\n`;
          }
        }
        md += `\n`;
      }

      if (turn.content) {
        md += `${turn.content.trim()}\n\n`;
      }
    }

    if (i < turns.length - 1) {
      md += `---\n\n`;
    }
  }

  md += `\n*Report generated by AGMon (Agent Factory & Monitor)*\n`;
  return md;
}

/**
 * Generate Self-Contained HTML Report with Dark Mode and Print/PDF Styling
 */
export function generateSessionHtml(session = {}, turns = [], options = {}) {
  const {
    includeExecutiveSummary = true,
    includeThinking = true,
    includeToolOutputs = false,
    includeTimestamps = true,
  } = options;

  const s = session || {};
  const metrics = extractSessionMetrics(s, turns);
  const sessionId = s.id || "session";

  // Escape helper for HTML
  const escapeHtml = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AGMon Session Report - ${escapeHtml(sessionId)}</title>
  <style>
    :root {
      --bg-primary: #121214;
      --bg-secondary: #1a1a1e;
      --bg-card: #202024;
      --border-color: #2e2e36;
      --text-primary: #f4f4f5;
      --text-secondary: #a1a1aa;
      --text-muted: #71717a;
      --accent-cyan: #06b6d4;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
      --accent-purple: #a855f7;
      --code-bg: #141416;
      --font-family-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --font-family-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-family-ui);
      background-color: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      padding: 32px 20px;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    header {
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
    }

    .header-title h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 6px;
    }

    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: var(--font-family-mono);
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--accent-cyan);
    }

    .btn-print {
      background: var(--accent-cyan);
      color: #000;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: opacity 0.2s;
    }
    .btn-print:hover { opacity: 0.9; }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .metric-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
    }
    .metric-card .label {
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .metric-card .value {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin: 32px 0 16px;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      background: var(--bg-card);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }
    th, td {
      padding: 10px 14px;
      text-align: left;
      font-size: 13px;
      border-bottom: 1px solid var(--border-color);
    }
    th {
      background: var(--bg-secondary);
      color: var(--text-secondary);
      font-weight: 600;
    }
    tr:last-child td { border-bottom: none; }

    .turn-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      margin-bottom: 20px;
      overflow: hidden;
      page-break-inside: avoid;
    }

    .turn-header {
      background: var(--bg-secondary);
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      font-size: 13px;
    }
    .turn-role {
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .turn-role.user { color: var(--accent-cyan); }
    .turn-role.assistant { color: var(--accent-emerald); }
    .turn-time { color: var(--text-muted); font-size: 12px; }

    .turn-body {
      padding: 16px;
      font-size: 14px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .thinking-box {
      margin-bottom: 14px;
      background: #18181b;
      border-left: 3px solid var(--accent-purple);
      padding: 12px 14px;
      border-radius: 0 6px 6px 0;
      font-size: 13px;
      color: #d4d4d8;
    }
    .thinking-box .title {
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      color: var(--accent-purple);
      margin-bottom: 6px;
    }

    .tools-list {
      margin: 12px 0;
      border-top: 1px solid var(--border-color);
      padding-top: 12px;
    }
    .tool-item {
      background: var(--code-bg);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 8px;
      font-size: 12px;
      font-family: var(--font-family-mono);
    }
    .tool-name { color: var(--accent-amber); font-weight: 600; }
    .tool-output {
      margin-top: 6px;
      padding: 6px 8px;
      background: #0d0d0f;
      border-radius: 4px;
      color: #94a3b8;
      overflow-x: auto;
      max-height: 250px;
    }

    footer {
      margin-top: 48px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
    }

    /* Print & PDF optimization */
    @media print {
      body {
        background-color: #ffffff !important;
        color: #111827 !important;
        padding: 0 !important;
      }
      .btn-print, footer { display: none !important; }
      .container { max-width: 100% !important; }
      header { border-bottom: 2px solid #000; }
      .badge { border-color: #d1d5db; color: #111827; background: #f3f4f6; }
      .metric-card, table, .turn-card {
        background: #ffffff !important;
        border-color: #e5e7eb !important;
        color: #111827 !important;
        box-shadow: none !important;
      }
      th { background: #f9fafb !important; color: #374151 !important; }
      .turn-header { background: #f9fafb !important; border-color: #e5e7eb !important; }
      .turn-role.user { color: #0284c7 !important; }
      .turn-role.assistant { color: #059669 !important; }
      .thinking-box {
        background: #f8fafc !important;
        border-left-color: #7c3aed !important;
        color: #334155 !important;
      }
      .tool-item { background: #f8fafc !important; border-color: #e2e8f0 !important; }
      .tool-output { background: #f1f5f9 !important; color: #334155 !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="header-title">
        <h1>AGMon Session Report</h1>
        <div style="margin-top: 6px; display: flex; gap: 8px; align-items: center;">
          <span class="badge">${escapeHtml(sessionId)}</span>
          <span style="font-size: 12px; color: var(--text-muted);">${escapeHtml(s.cli ? s.cli.toUpperCase() : "AGENT")}</span>
        </div>
      </div>
      <button class="btn-print" onclick="window.print()">
        <span>Print to PDF</span>
      </button>
    </header>

    ${
      includeExecutiveSummary
        ? `
    <div class="summary-grid">
      <div class="metric-card">
        <div class="label">AI Model</div>
        <div class="value">${escapeHtml(s.model || "Unknown")}</div>
      </div>
      <div class="metric-card">
        <div class="label">Duration</div>
        <div class="value">${escapeHtml(formatDuration(s.durationMs))}</div>
      </div>
      <div class="metric-card">
        <div class="label">Total Tokens</div>
        <div class="value">${metrics.totalTokens.toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="label">Tool Calls</div>
        <div class="value">${metrics.totalToolCalls}</div>
      </div>
    </div>

    ${
      metrics.modifiedFiles.length > 0
        ? `
      <h2 class="section-title">Files Modified (${metrics.modifiedFiles.length})</h2>
      <table>
        <thead><tr><th>File Path</th></tr></thead>
        <tbody>
          ${metrics.modifiedFiles.map((f) => `<tr><td><code>${escapeHtml(f)}</code></td></tr>`).join("")}
        </tbody>
      </table>
    `
        : ""
    }
    `
        : ""
    }

    <h2 class="section-title">Conversation &amp; Steps (${turns.length})</h2>
    ${turns
      .map((turn) => {
        const isUser = turn.role === "user";
        const roleLabel = isUser ? "User Prompt" : "Assistant Response";
        const roleClass = isUser ? "user" : "assistant";
        const timeFormatted = includeTimestamps && turn.timestamp ? formatTimestamp(turn.timestamp) : "";

        return `
      <div class="turn-card">
        <div class="turn-header">
          <span class="turn-role ${roleClass}">${roleLabel}</span>
          ${timeFormatted ? `<span class="turn-time">${escapeHtml(timeFormatted)}</span>` : ""}
        </div>
        <div class="turn-body">
          ${
            includeThinking && turn.thinking
              ? `
            <div class="thinking-box">
              <div class="title">Reasoning Process</div>
              ${escapeHtml(turn.thinking)}
            </div>
          `
              : ""
          }

          ${
            Array.isArray(turn.toolCalls) && turn.toolCalls.length > 0
              ? `
            <div class="tools-list">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Tools Executed:</div>
              ${turn.toolCalls
                .map(
                  (tc) => `
                <div class="tool-item">
                  <span class="tool-name">${escapeHtml(tc.name || tc.action || "Tool")}</span>
                  ${tc.args ? ` <span style="color: var(--text-muted);">${escapeHtml(JSON.stringify(tc.args))}</span>` : ""}
                  ${
                    includeToolOutputs && tc.output
                      ? `<pre class="tool-output">${escapeHtml(tc.output)}</pre>`
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }

          ${turn.content ? `<div>${escapeHtml(turn.content)}</div>` : ""}
        </div>
      </div>
    `;
      })
      .join("")}

    <footer>
      Generated by AGMon &bull; Realtime AI Agent Office &amp; Activity Visualizer
    </footer>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Trigger client-side file download
 */
export function triggerDownload(filename, content, mimeType = "text/plain") {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text) {
  if (typeof window === "undefined") return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const res = document.execCommand("copy");
      document.body.removeChild(textarea);
      return res;
    }
  } catch (err) {
    console.error("Failed to copy text:", err);
    return false;
  }
}
