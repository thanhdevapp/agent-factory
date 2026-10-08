/**
 * Helper to launch standalone detached window for AI agent live chat (VS Code "Move into New Window" style)
 */
export function openChatInNewWindow(sessionId) {
  if (typeof window === "undefined") return null;

  const safeId = sessionId ? encodeURIComponent(sessionId) : "";
  const url = safeId ? `/chat?id=${safeId}` : "/chat";
  const windowName = `agmon_chat_${safeId || "main"}`;

  const width = Math.min(1050, (window.screen?.availWidth || 1200) - 60);
  const height = Math.min(880, (window.screen?.availHeight || 900) - 60);
  const left = Math.max(0, Math.floor(((window.screen?.availWidth || 1200) - width) / 2));
  const top = Math.max(0, Math.floor(((window.screen?.availHeight || 900) - height) / 2));

  const features = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    "menubar=no",
    "toolbar=no",
    "location=no",
    "status=no",
    "resizable=yes",
    "scrollbars=yes",
  ].join(",");

  const newWin = window.open(url, windowName, features);
  if (newWin) {
    newWin.focus();
  }
  return newWin;
}
