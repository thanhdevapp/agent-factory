"use client";

import { useEffect, useState } from "react";

export default function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState(null);

  useEffect(() => {
    // 1. Service Worker update listener (PWA)
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      });
    }

    // 2. Version polling from server API (/api/version)
    let initialVersion = null;
    const checkVersion = async () => {
      try {
        const res = await fetch("/api/version");
        if (res.ok) {
          const data = await res.json();
          if (!initialVersion) {
            initialVersion = data.version;
          } else if (data.version && data.version !== initialVersion) {
            setNewVersion(data.version);
            setUpdateAvailable(true);
          }
        }
      } catch {
        // network error
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, 60 * 1000); // Check every 60s
    return () => clearInterval(interval);
  }, []);

  const handleApplyUpdate = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border border-emerald-500/40 bg-slate-900/95 px-4 py-2 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 duration-300">
      <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
      <span className="text-xs text-slate-200">
        🚀 Đã có phiên bản mới {newVersion ? `(${newVersion})` : ""}
      </span>
      <button
        onClick={handleApplyUpdate}
        className="rounded-full bg-emerald-500 hover:bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-950 transition-colors shadow-sm"
      >
        Cập nhật ngay
      </button>
      <button
        onClick={() => setUpdateAvailable(false)}
        className="text-slate-400 hover:text-slate-200 text-xs ml-1"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
