"use client";

import { useEffect, useRef, useState } from "react";
import { mountOfficeScene } from "./office-scene";

export default function OfficeCanvas({ traces = [], onStats, onSelect, selectedId = null }) {
  const hostRef = useRef(null);
  const sceneRef = useRef(null);
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
    </div>
  );
}
