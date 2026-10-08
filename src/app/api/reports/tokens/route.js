import { NextResponse } from "next/server";
import { getAggregatedTokenReport } from "../../../../lib/tokenAggregator";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "week";
    const startDate = searchParams.get("startDate") || null;
    const endDate = searchParams.get("endDate") || null;
    const granularity = searchParams.get("granularity") || null;
    const providerFilter = searchParams.get("provider") || "all";
    const clientTypeFilter = searchParams.get("clientType") || "all";
    const modelFilter = searchParams.get("model") || "all";
    const projectFilter = searchParams.get("project") || "all";
    const toolFilter = searchParams.get("tool") || "all";
    const hasErrorFilter = searchParams.get("hasError") || "all";
    const minTokens = searchParams.get("minTokens") || null;
    const searchQuery = searchParams.get("search") || null;

    const report = await getAggregatedTokenReport({
      timeRange,
      startDate,
      endDate,
      granularity,
      providerFilter,
      clientTypeFilter,
      modelFilter,
      projectFilter,
      toolFilter,
      hasErrorFilter,
      minTokens,
      searchQuery,
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
