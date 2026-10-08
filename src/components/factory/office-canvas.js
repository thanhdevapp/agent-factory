"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Sparkles, Volume2, VolumeX, Maximize } from "lucide-react";
import { mountOfficeScene } from "./office-scene";
import { SUPPORTER_CHANGE_EVENT } from "@/lib/supporterStore";

export default function OfficeCanvas({
  traces = [],
  onStats,
  onSelect,
  selectedId = null,
  isZenFullscreen = false,
  onToggleZenFullscreen = null,
  soundEnabled = false,
  onToggleSound = null,
}) {
  const hostRef = useRef(null);
  const sceneRef = useRef(null);
  const [zoomPct, setZoomPct] = useState(100);
  const [showToast, setShowToast] = useState(false);
  const latest = useRef({ onSelect, selectedId, traces });

  useEffect(() => {
    latest.current = { onSelect, selectedId, traces };
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    let disposed = false;
    let handle = null;
    const host = hostRef.current;
    if (!host) return undefined;

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 0.2s ease-in-out";
    host.appendChild(canvas);

    (async () => {
      try {
        const mounted = await mountOfficeScene(canvas, latest.current.traces, {
          selectedId: latest.current.selectedId,
          onSelect: (id) => latest.current.onSelect?.(id),
          onZoomChange: (pct) => setZoomPct(pct),
        });

        if (disposed) {
          try {
            mounted?.destroy?.();
          } catch {}
          try {
            canvas.remove();
          } catch {}
          return;
        }

        handle = mounted;
        sceneRef.current = handle;
        canvas.style.opacity = "1";

        // Immediately reconcile in case traces arrived during async init
        if (latest.current.traces && latest.current.traces.length > 0) {
          handle.rebuild?.(latest.current.traces);
        }
      } catch (err) {
        if (!disposed) {
          console.error("[OfficeCanvas] mount failed:", err);
          setError(err?.message || "Failed to start the scene");
        }
      }
    })();

    return () => {
      disposed = true;
      try {
        handle?.destroy?.();
      } catch (e) {
        console.warn("[OfficeCanvas] Cleanup warning:", e);
      }
      sceneRef.current = null;
      try {
        canvas.remove();
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.rebuild?.(traces);
    }
  }, [traces]);

  useEffect(() => {
    const handleSupporterChange = () => {
      if (sceneRef.current) {
        sceneRef.current.rebuild?.(latest.current.traces, true);
      }
    };
    window.addEventListener(SUPPORTER_CHANGE_EVENT, handleSupporterChange);
    return () => window.removeEventListener(SUPPORTER_CHANGE_EVENT, handleSupporterChange);
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setSelected?.(selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    if (!onStats) return undefined;
    const id = setInterval(() => {
      onStats?.({ mounted: Boolean(sceneRef.current) });
    }, 2000);
    return () => clearInterval(id);
  }, [onStats]);

  // Re-fit canvas layout whenever fullscreen mode changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("resize"));
      }
      sceneRef.current?.fit?.();
    }, 60);
    return () => clearTimeout(timer);
  }, [isZenFullscreen]);

  // Toast notification when entering Chill Mode
  useEffect(() => {
    if (isZenFullscreen) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(timer);
    } else {
      setShowToast(false);
    }
  }, [isZenFullscreen]);

  // Global ESC key listener to exit Chill Mode
  useEffect(() => {
    if (!isZenFullscreen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onToggleZenFullscreen?.(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZenFullscreen, onToggleZenFullscreen]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[#080d14] ${
        isZenFullscreen
          ? "!fixed !inset-0 !z-[99] !w-screen !h-screen !rounded-none !border-none"
          : "rounded-xl border border-slate-800 shadow-2xl"
      }`}
    >
      <div ref={hostRef} className="absolute inset-0" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* Chill Mode Entry Toast Banner */}
      {showToast && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-cyan-200 text-xs shadow-2xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Chế độ Chill toàn màn hình · Nhấn <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[10px]">ESC</kbd> hoặc click nút góc trên để thoát</span>
          </div>
        </div>
      )}

      {/* Chill Mode Floating Top Control Bar */}
      {isZenFullscreen && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-slate-800/80 backdrop-blur-md shadow-xl text-xs text-slate-300 select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-medium text-[11px]">Virtual Office · Chill Mode</span>
            <span className="text-[10px] text-slate-400 font-mono">({traces.length} Bots)</span>
          </div>

          <button
            type="button"
            data-testid="exit-zen-fullscreen-btn"
            onClick={() => onToggleZenFullscreen?.(false)}
            title="Thoát chế độ toàn màn hình Chill Mode (ESC)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 text-slate-300 hover:text-white backdrop-blur-md shadow-xl transition-all cursor-pointer text-xs font-medium group"
          >
            <Minimize2 className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px]">Thoát ESC</span>
          </button>
        </div>
      )}

      {/* Floating Canvas Camera Controls */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-lg border border-slate-800/80 bg-slate-950/80 p-1 backdrop-blur-md shadow-xl text-slate-400">
        <button
          onClick={() => sceneRef.current?.zoomOut?.()}
          title="Zoom out"
          className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => sceneRef.current?.reset100?.()}
          title="Reset to 100% (1:1 natural scale)"
          className="px-2 py-1 rounded-md text-[11px] font-mono hover:bg-slate-800 hover:text-slate-200 transition-colors font-semibold text-slate-300 cursor-pointer"
        >
          {zoomPct}%
        </button>
        <button
          onClick={() => sceneRef.current?.zoomIn?.()}
          title="Zoom in"
          className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3.5 bg-slate-800 my-auto" />
        <button
          onClick={() => sceneRef.current?.fit?.()}
          title="Fit to view"
          className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {onToggleZenFullscreen && (
          <>
            <div className="w-[1px] h-3.5 bg-slate-800 my-auto" />
            <button
              type="button"
              data-testid="canvas-camera-zen-fullscreen-btn"
              onClick={() => onToggleZenFullscreen(!isZenFullscreen)}
              title={
                isZenFullscreen
                  ? "Thoát toàn màn hình (ESC)"
                  : "Chế độ Chill toàn màn hình Virtual Office (ESC để thoát)"
              }
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isZenFullscreen
                  ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                  : "hover:bg-slate-800 hover:text-cyan-300 text-slate-400"
              }`}
            >
              {isZenFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Maximize className="w-3.5 h-3.5" />
              )}
            </button>
          </>
        )}

        {onToggleSound && (
          <>
            <div className="w-[1px] h-3.5 bg-slate-800 my-auto" />
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? "Âm thanh: BẬT" : "Âm thanh: TẮT"}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                soundEnabled
                  ? "text-emerald-400 hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
