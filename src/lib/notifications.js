// Web Notification API Helper for AGMon Desktop Push Notifications

export function isNotificationSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function isNotificationsEnabled() {
  if (!isNotificationSupported()) return false;
  const stored = localStorage.getItem("agmon_notifications_enabled");
  return stored === "true" && Notification.permission === "granted";
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return false;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      localStorage.setItem("agmon_notifications_enabled", "true");
      return true;
    } else {
      localStorage.setItem("agmon_notifications_enabled", "false");
      return false;
    }
  } catch {
    return false;
  }
}

export async function toggleNotifications() {
  if (!isNotificationSupported()) return false;

  if (Notification.permission !== "granted") {
    return await requestNotificationPermission();
  }

  const current = isNotificationsEnabled();
  const next = !current;
  localStorage.setItem("agmon_notifications_enabled", next ? "true" : "false");
  return next;
}

let lastNotificationTime = 0;
const NOTIFICATION_COOLDOWN_MS = 3000; // prevent notification spamming

export function notifyAgentDone(account = "Agent Desk", summary = "Task completed successfully.") {
  if (!isNotificationsEnabled()) return;

  const now = Date.now();
  if (now - lastNotificationTime < NOTIFICATION_COOLDOWN_MS) return;
  lastNotificationTime = now;

  try {
    const n = new Notification(`✅ Task Complete: ${account}`, {
      body: summary,
      icon: "/icons/icon-192x192.png",
      tag: `done-${account}`,
    });

    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    // ignore notification errors
  }
}

export function notifyAgentAlert(account = "Agent Desk", reason = "Runaway loop detected!") {
  if (!isNotificationsEnabled()) return;

  const now = Date.now();
  if (now - lastNotificationTime < NOTIFICATION_COOLDOWN_MS) return;
  lastNotificationTime = now;

  try {
    const n = new Notification(`⚠️ AGMon Alert: ${account}`, {
      body: reason,
      icon: "/icons/icon-192x192.png",
      tag: `alert-${account}`,
    });

    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    // ignore
  }
}
