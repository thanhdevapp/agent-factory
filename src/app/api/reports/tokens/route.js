import { NextResponse } from "next/server";
import { getAggregatedTokenReport } from "../../../../lib/tokenAggregator";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "week";
    const providerFilter = searchParams.get("provider") || "all";
    const modelFilter = searchParams.get("model") || "all";
    const projectFilter = searchParams.get("project") || "all";

    const report = await getAggregatedTokenReport({
      timeRange,
      providerFilter,
      modelFilter,
      projectFilter,
    });

    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    console.error("[api/reports/tokens] Aggregation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate token report", message: error.message },
      { status: 500 }
    );
  }
}
