import { getAllLiveTraces, getProvidersFromTraces } from "../../../../lib/watchers/watcherManager.js";
import { generateMockTraces, mockProviderDescriptors, MOCK_PRESETS } from "../../../../lib/mockTraces.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "live";
  const mockPreset = searchParams.get("mockPreset") || searchParams.get("preset");
  const hours = Number(searchParams.get("hours") || 24);
  const maxAgeMs = Math.max(1, hours) * 60 * 60 * 1000;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isAlive = true;

      const send = (data) => {
        if (!isAlive) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          isAlive = false;
        }
      };

      const pushUpdate = async () => {
        if (!isAlive) return;

        if (source === "mock" || mockPreset) {
          const presetConfig = MOCK_PRESETS[mockPreset] || MOCK_PRESETS.cases;
          const traces = generateMockTraces({
            count: presetConfig.agents,
            errorRatio: presetConfig.errorRatio,
            cases: !!presetConfig.cases,
            seed: 42,
          });
          const providers = mockProviderDescriptors(traces);
          send({ traces, providers, timestamp: Date.now(), mode: "mock", preset: mockPreset || "cases" });
          return;
        }

        // Live Mode
        try {
          const liveTraces = await getAllLiveTraces(false, maxAgeMs);
          const providers = getProvidersFromTraces(liveTraces);
          send({
            traces: liveTraces,
            providers,
            timestamp: Date.now(),
            mode: "live",
            activeAgents: liveTraces.filter((t) => t.state === "streaming" || t.state === "pending").length,
          });
        } catch (err) {
          console.error("[SSE] Failed to fetch live traces:", err);
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
    },
  });
}
