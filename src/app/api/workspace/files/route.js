import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export const dynamic = "force-dynamic";

const IGNORED_NAMES = new Set([
  "node_modules",
  ".next",
  ".git",
  ".DS_Store",
  ".turbo",
  ".vercel",
]);

function isPathAllowed(resolvedPath) {
  const homeDir = os.homedir();
  const cwd = process.cwd();
  return (
    resolvedPath.startsWith(cwd) ||
    resolvedPath.startsWith(path.join(homeDir, ".gemini")) ||
    resolvedPath.startsWith(path.join(homeDir, ".claude")) ||
    resolvedPath.startsWith("/Volumes")
  );
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let targetPath = searchParams.get("path") || process.cwd();

    // Strip file:// prefix
    targetPath = targetPath.replace(/^file:\/\//, "");

    // Resolve path
    const resolvedPath = path.isAbsolute(targetPath)
      ? path.normalize(targetPath)
      : path.resolve(process.cwd(), targetPath);

    if (!isPathAllowed(resolvedPath)) {
      return NextResponse.json(
        { error: "Access forbidden outside workspace/allowed paths" },
        { status: 403 }
      );
    }

    const stat = await fs.stat(resolvedPath);
    if (!stat.isDirectory()) {
      return NextResponse.json(
        { error: "Target path is not a directory" },
        { status: 400 }
      );
    }

    const dirEntries = await fs.readdir(resolvedPath, { withFileTypes: true });

    const entries = [];
    for (const entry of dirEntries) {
      if (IGNORED_NAMES.has(entry.name)) continue;

      const fullPath = path.join(resolvedPath, entry.name);
      const isDirectory = entry.isDirectory();
      let size = 0;
      let mtime = null;

      try {
        const itemStat = await fs.stat(fullPath);
        size = itemStat.size;
        mtime = itemStat.mtime.toISOString();
      } catch {
        // Ignored unreadable file
      }

      entries.push({
        name: entry.name,
        path: fullPath,
        isDirectory,
        size,
        mtime,
        ext: isDirectory ? "" : path.extname(entry.name).toLowerCase(),
      });
    }

    // Sort: directories first, then alphabetically
    entries.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

    const parentPath = path.dirname(resolvedPath);

    return NextResponse.json({
      currentPath: resolvedPath,
      parentPath: parentPath !== resolvedPath ? parentPath : null,
      entries,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to list files" },
      { status: 500 }
    );
  }
}
