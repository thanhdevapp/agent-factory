import { getLiveTraceSnapshot, getCachedTraceSnapshot, getProvidersFromTraces } from "@/lib/watchers/watcherManager.js";
import { generateMockTraces, mockProviderDescriptors, MOCK_PRESETS } from "@/lib/mockTraces.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "live";
  const mockPreset = searchParams.get("mockPreset") || searchParams.get("preset");
  const rawHours = searchParams.get("hours");
  let hours = 24;
  if (rawHours !== null) {
    if (rawHours === "0" || rawHours === "all") {
      hours = 0;
    } else {
      const parsedHours = Number(rawHours);
      if (!Number.isNaN(parsedHours) && parsedHours >= 0) {
        hours = parsedHours;
      }
    }
  }
  const maxAgeMs = hours > 0 ? hours * 60 * 60 * 1000 : Infinity;

  const rawLimit = searchParams.get("limit") || searchParams.get("top");
  let limit = 20;
  if (rawLimit !== null) {
    if (rawLimit === "0" || rawLimit === "all") {
      limit = 0;
    } else {
      const parsedLimit = Number(rawLimit);
      if (!Number.isNaN(parsedLimit) && parsedLimit >= 0) {
        limit = parsedLimit;
      }
    }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isAlive = true;

      // Immediate handshake comment to unblock browser EventSource onopen
      try {
        controller.enqueue(encoder.encode(": connected\n\n"));
      } catch {
        isAlive = false;
      }

      const send = (data) => {
        if (!isAlive) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          isAlive = false;
        }
      };

      // Send immediate cached snapshot if available so the UI renders in 0ms!
      if (source === "live" && !mockPreset) {
        const cached = getCachedTraceSnapshot(limit);
        if (cached && cached.traces.length > 0) {
          const providers = getProvidersFromTraces(cached.traces);
          send({
            traces: cached.traces,
            totalCount: cached.totalCount,
            providers,
            errors: cached.errors,
            timestamp: Date.now(),
            mode: "live",
            activeAgents: cached.traces.filter((t) => t.state === "streaming" || t.state === "pending").length,
          });
        }
      }

      const pushUpdate = async () => {
        if (!isAlive) return;

        if (source === "mock" || mockPreset) {
          const presetConfig = MOCK_PRESETS[mockPreset] || MOCK_PRESETS.cases;
          const rawTraces = generateMockTraces({
            count: presetConfig.agents,
            errorRatio: presetConfig.errorRatio,
            cases: !!presetConfig.cases,
            preset: mockPreset,
            seed: 42,
          });
          const totalCount = rawTraces.length;
          const traces = (limit > 0 && limit < totalCount) ? rawTraces.slice(0, limit) : rawTraces;
          const providers = mockProviderDescriptors(traces);
          send({
            traces,
            totalCount,
            providers,
            timestamp: Date.now(),
            mode: "mock",
            preset: mockPreset || "cases",
            activeAgents: traces.filter((t) => t.state === "streaming" || t.state === "pending").length,
          });
          return;
        }

        // Live Mode
        try {
          const { traces, totalCount, errors } = await getLiveTraceSnapshot(false, maxAgeMs, limit);
          const providers = getProvidersFromTraces(traces);
          send({
            traces,
            totalCount,
            providers,
            errors,
            timestamp: Date.now(),
            mode: "live",
            activeAgents: traces.filter((t) => t.state === "streaming" || t.state === "pending").length,
          });
        } catch (err) {
          console.error("[SSE] Failed to fetch live traces:", err);
          send({
            traces: [],
            totalCount: 0,
            providers: [],
            errors: [{ source: "telemetry", message: err.message || "Failed to read live traces" }],
            timestamp: Date.now(),
            mode: "live",
            activeAgents: 0,
          });
        }
      };

      // Initial push
      await pushUpdate();

      // Poll interval: 1.5 seconds for fresh log watcher updates
      const interval = setInterval(async () => {
        if (!isAlive) {
          clearInterval(interval);
          return;
        }
        await pushUpdate();
      }, 1500);

      request.signal.addEventListener("abort", () => {
        isAlive = false;
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // ignore
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Content-Encoding": "none",
    },
  });
}
