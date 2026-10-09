/**
 * AGMon AI Factory - Desktop Companion Bridge
 * Provides seamless integration with Tauri 2.0 native window APIs,
 * Docked screen-bottom mode, always-on-top, and native desktop notifications.
 */

export function isTauri() {
  if (typeof window === "undefined") return false;
  return Boolean(window.__TAURI_INTERNALS__ || window.__TAURI__);
}

// Dynamic module resolver that doesn't trigger static bundler warnings
const safeImport = async (moduleName) => {
  try {
    return await new Function("m", "return import(m)")(moduleName);
  } catch {
    return null;
  }
};

/**
 * Toggles between Full Factory window and Docked Screen-Bottom Bar mode
 */
export async function toggleDockedMode(enableDocked = null) {
  if (!isTauri()) {
    // Web fallback: dispatch custom event for web-based docked simulation
    const nextState =
      enableDocked !== null
        ? enableDocked
        : !document.body.classList.contains("docked-mode");
    if (nextState) {
      document.body.classList.add("docked-mode");
    } else {
      document.body.classList.remove("docked-mode");
    }
    window.dispatchEvent(
      new CustomEvent("agmon-docked-toggled", { detail: { isDocked: nextState } })
    );
    return nextState;
  }

  try {
    const tauriWindow = await safeImport("@tauri-apps/api/window");
    const tauriDpi = await safeImport("@tauri-apps/api/dpi");
    if (!tauriWindow || !tauriDpi) return false;

    const appWindow = tauriWindow.getCurrentWindow();

    if (enableDocked) {
      await appWindow.setSize(new tauriDpi.PhysicalSize(1920, 160));
      await appWindow.setAlwaysOnTop(true);
      return true;
    } else {
      await appWindow.setAlwaysOnTop(false);
      await appWindow.setSize(new tauriDpi.PhysicalSize(1280, 840));
      return false;
    }
  } catch (err) {
    console.warn("[DesktopBridge] Failed to toggle native window mode:", err);
    return false;
  }
}

/**
 * Sends a native desktop notification
 */
export async function sendDesktopNotification(title, body) {
  if (isTauri()) {
    try {
      const notifPlugin = await safeImport("@tauri-apps/plugin-notification");
      if (notifPlugin?.sendNotification) {
        notifPlugin.sendNotification({ title, body });
        return true;
      }
    } catch (e) {
      // Fallback below
    }
  }

  // Web Notification API fallback
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
      return true;
    } else if (Notification.permission !== "denied") {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        new Notification(title, { body, icon: "/favicon.ico" });
        return true;
      }
    }
  }

  return false;
}

