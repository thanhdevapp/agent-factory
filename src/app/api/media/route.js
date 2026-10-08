import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export const dynamic = "force-dynamic";

const MIME_MAP = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".bmp": "image/bmp",
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let targetPath = searchParams.get("path");

    if (!targetPath) {
      return new NextResponse("Missing path parameter", { status: 400 });
    }

    // Strip "file://" prefix if present
    targetPath = targetPath.replace(/^file:\/\//, "");

    // If relative path, resolve against process.cwd()
    let resolvedPath = path.isAbsolute(targetPath)
      ? path.normalize(targetPath)
      : path.resolve(process.cwd(), targetPath);

    // Extension check
    const ext = path.extname(resolvedPath).toLowerCase();
    const mime = MIME_MAP[ext];
    if (!mime) {
      return new NextResponse("Unsupported media type", { status: 415 });
    }

    // Security check: Must reside within cwd, or within ~/.gemini, or ~/.claude, or /Volumes
    const homeDir = os.homedir();
    const cwd = process.cwd();
    const isAllowed =
      resolvedPath.startsWith(cwd) ||
      resolvedPath.startsWith(path.join(homeDir, ".gemini")) ||
      resolvedPath.startsWith(path.join(homeDir, ".claude")) ||
      resolvedPath.startsWith("/Volumes");

    if (!isAllowed) {
      return new NextResponse("Access forbidden", { status: 403 });
    }

    const fileBuffer = await fs.readFile(resolvedPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=3600, immutable",
      },
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      return new NextResponse("File not found", { status: 404 });
    }
    return new NextResponse(err.message, { status: 500 });
  }
}
