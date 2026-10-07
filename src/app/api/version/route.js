import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    return NextResponse.json({
      version: pkg.version || "0.1.0",
      uptime: Math.round(process.uptime()),
      timestamp: Date.now(),
    });
  } catch {
    return NextResponse.json({
      version: "0.1.0",
      uptime: Math.round(process.uptime()),
      timestamp: Date.now(),
    });
  }
}
