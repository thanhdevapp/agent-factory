"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { mountOfficeScene } from "./office-scene";

export default function OfficeCanvas({ traces = [], onStats, onSelect, selectedId = null }) {
  const hostRef = useRef(null);
  const sceneRef = useRef(null);
  const [zoomPct, setZoomPct] = useState(100);
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
    host.appendChild(canvas);

    (async () => {
      try {
        const mounted = await mountOfficeScene(canvas, latest.current.traces, {
          selectedId: latest.current.selectedId,
          onSelect: (id) => latest.current.onSelect?.(id),
          onZoomChange: (pct) => setZoomPct(pct),
        });

        if (disposed) {
          mounted.destroy?.();
          canvas.remove();
          return;
        }

        handle = mounted;
        sceneRef.current = handle;

        // Immediately reconcile in case traces arrived during async init
        if (latest.current.traces && latest.current.traces.length > 0) {
          handle.rebuild?.(latest.current.traces);
        }
      } catch (err) {
        console.error("[OfficeCanvas] mount failed:", err);
        setError(err?.message || "Failed to start the scene");
      }
    })();

    return () => {
      disposed = true;
      handle?.destroy?.();
      sceneRef.current = null;
      host?.replaceChildren();
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.rebuild?.(traces);
    }
  }, [traces]);

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

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-800 bg-[#080d14] shadow-2xl">
      <div ref={hostRef} className="absolute inset-0" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* Floating Canvas Camera Controls */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-lg border border-slate-800/80 bg-slate-950/80 p-1 backdrop-blur-md shadow-xl text-slate-400">
        <button
          onClick={() => sceneRef.current?.zoomOut?.()}
          title="Thu nhỏ để xem không gian rộng hơn (Zoom out)"
          className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => sceneRef.current?.reset100?.()}
          title="Tỷ lệ chuẩn 100% (1:1 tự nhiên, không phóng to)"
          className="px-2 py-1 rounded-md text-[11px] font-mono hover:bg-slate-800 hover:text-slate-200 transition-colors font-semibold text-slate-300 cursor-pointer"
        >
          {zoomPct}%
        </button>
        <button
          onClick={() => sceneRef.current?.zoomIn?.()}
          title="Phóng to (Zoom in)"
          className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3.5 bg-slate-800 my-auto" />
        <button
          onClick={() => sceneRef.current?.fit?.()}
          title="Vừa vặn màn hình (Fit view)"
          className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
