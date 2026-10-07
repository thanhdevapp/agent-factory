"use client";

import { useEffect, useRef, useState } from "react";

// Pixi owns the canvas element, so it is mounted imperatively and torn down on
// unmount. Data arrives as a prop; the scene reconciles rather than remounting.
export default function OfficeCanvas({ traces = [], onStats, onSelect, selectedId = null }) {
  const hostRef = useRef(null);
  const sceneRef = useRef(null);
  // Latest callbacks/selection without remounting the scene.
  const latest = useRef({ onSelect, selectedId, traces });
  useEffect(() => {
    latest.current = { onSelect, selectedId, traces };
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let disposed = false;
    let handle;
    const host = hostRef.current;

    (async () => {
      try {
        const { mountOfficeScene } = await import("./office-scene");
        if (disposed || !hostRef.current) return;

        // Absolute so a stray sibling can never push the canvas out of the box.
        const canvas = document.createElement("canvas");
        canvas.style.position = "absolute";
        canvas.style.inset = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        hostRef.current.appendChild(canvas);
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
    sceneRef.current?.rebuild?.(traces);
  }, [traces]);

  useEffect(() => {
    sceneRef.current?.setSelected?.(selectedId);
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
