/**
 * Client-side helper for native terminal & IDE handoff
 */

export async function triggerHandoff({ path, target = "terminal", app }) {
  if (!path) {
    return { success: false, error: "No working directory available" };
  }

  try {
    const res = await fetch("/api/handoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, target, app }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    return data;
  } catch (err) {
    console.warn("[triggerHandoff] Error:", err.message);
    // Fallback: copy path to clipboard for manual paste
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(path);
      } catch {}
    }
    return { success: false, error: err.message, copiedToClipboard: true };
  }
}

let cachedApps = null;

export async function getInstalledHandoffApps() {
  if (cachedApps) return cachedApps;
  try {
    const res = await fetch("/api/handoff");
    if (res.ok) {
      cachedApps = await res.json();
      return cachedApps;
    }
  } catch {
    // fallback
  }
  return {
    terminals: [
      { id: "ghostty", name: "Ghostty", available: true },
      { id: "terminal", name: "Terminal", available: true },
    ],
    editors: [
      { id: "vscode", name: "VS Code", available: true },
      { id: "cursor", name: "Cursor", available: true },
    ],
    defaultTerminal: "ghostty",
    defaultEditor: "vscode",
  };
}
