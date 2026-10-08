import { NextResponse } from "next/server";
import { getSessionTranscript } from "../../../../../lib/parsers/transcriptParser.js";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const rawId = params?.id;

    if (!rawId || typeof rawId !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing session ID parameter" },
        { status: 400 }
      );
    }

    // Security regex validation
    if (!/^[a-zA-Z0-9_-]{4,64}$/.test(rawId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const cliHint = searchParams.get("cli") || "";

    const transcriptData = await getSessionTranscript(rawId, cliHint);

    return NextResponse.json(transcriptData, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err) {
    const msg = err.message || "Failed to retrieve transcript";
    const status = msg.includes("not found") ? 404 : msg.includes("traversal") || msg.includes("Invalid") ? 400 : 500;

    return NextResponse.json(
      { ok: false, error: msg },
      { status }
    );
  }
}
