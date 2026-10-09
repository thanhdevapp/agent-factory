import { NextResponse } from "next/server";
import { getProjectScripts } from "@/lib/projectScripts";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetPath = searchParams.get("path") || process.cwd();

    const info = await getProjectScripts(targetPath);
    return NextResponse.json(info);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to load project scripts" },
      { status: 500 }
    );
  }
}
