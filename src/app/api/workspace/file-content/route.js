import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export const dynamic = "force-dynamic";

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

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".bmp"]);

function detectLanguage(filePath) {
  const lower = (filePath || "").toLowerCase();
  const base = path.basename(lower);

  // Exact names or prefixes
  if (base === "dockerfile" || base.startsWith("dockerfile.") || lower.endsWith(".dockerfile")) return "dockerfile";
  if (base.endsWith("ignore")) return "shell"; // .gitignore, .npmignore, .dockerignore
  if (base.startsWith(".env")) return "ini";
  if (base === "makefile") return "makefile";

  // Extension mappings
  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return "typescript";
  if (lower.endsWith(".js") || lower.endsWith(".jsx") || lower.endsWith(".mjs") || lower.endsWith(".cjs")) return "javascript";
  if (lower.endsWith(".json") || lower.endsWith(".jsonl") || lower.endsWith(".jsonc")) return "json";
  if (lower.endsWith(".md") || lower.endsWith(".markdown") || lower.endsWith(".mdx")) return "markdown";
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "html";
  if (lower.endsWith(".css") || lower.endsWith(".scss") || lower.endsWith(".sass") || lower.endsWith(".less")) return "css";
  if (lower.endsWith(".java")) return "java";
  if (lower.endsWith(".py")) return "python";
  if (lower.endsWith(".sql") || lower.endsWith(".ddl") || lower.endsWith(".prisma")) return "sql";
  if (lower.endsWith(".xml") || lower.endsWith(".svg")) return "xml";
  if (lower.endsWith(".sh") || lower.endsWith(".bash") || lower.endsWith(".zsh")) return "shell";
  if (lower.endsWith(".yaml") || lower.endsWith(".yml")) return "yaml";
  if (
    lower.endsWith(".toml") ||
    lower.endsWith(".ini") ||
    lower.endsWith(".cfg") ||
    lower.endsWith(".conf") ||
    lower.endsWith(".properties")
  ) {
    return "ini";
  }
  if (lower.endsWith(".graphql") || lower.endsWith(".gql")) return "graphql";
  if (lower.endsWith(".rs")) return "rust";
  if (lower.endsWith(".go")) return "go";
  if (lower.endsWith(".c") || lower.endsWith(".h") || lower.endsWith(".cpp") || lower.endsWith(".hpp")) return "cpp";
  return "plaintext";
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let targetPath = searchParams.get("path");

    if (!targetPath) {
      return NextResponse.json({ error: "path parameter is required" }, { status: 400 });
    }

    targetPath = targetPath.replace(/^file:\/\//, "");

    const resolvedPath = path.isAbsolute(targetPath)
      ? path.normalize(targetPath)
      : path.resolve(process.cwd(), targetPath);

    if (!isPathAllowed(resolvedPath)) {
      return NextResponse.json({ error: "Access forbidden" }, { status: 403 });
    }

    const stat = await fs.stat(resolvedPath);
    if (stat.isDirectory()) {
      return NextResponse.json({ error: "Target path is a directory, not a file" }, { status: 400 });
    }

    const name = path.basename(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();
    const mediaUrl = `/api/media?path=${encodeURIComponent(resolvedPath)}`;

    // Binary image files (.png, .jpg, .gif, .webp, etc.)
    if (IMAGE_EXTS.has(ext)) {
      return NextResponse.json({
        path: resolvedPath,
        name,
        ext,
        language: "image",
        isImage: true,
        size: stat.size,
        mtime: stat.mtime.toISOString(),
        mediaUrl,
      });
    }

    // Limit maximum text file size to read into memory (e.g. 10MB)
    if (stat.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (exceeds 10MB limit)" }, { status: 413 });
    }

    const content = await fs.readFile(resolvedPath, "utf-8");
    const language = detectLanguage(resolvedPath);
    const isSvg = ext === ".svg";

    return NextResponse.json({
      path: resolvedPath,
      name,
      ext,
      language,
      isImage: isSvg,
      isSvg,
      mediaUrl: isSvg ? mediaUrl : undefined,
      size: stat.size,
      mtime: stat.mtime.toISOString(),
      content,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to read file" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    let targetPath = body?.path;
    const content = body?.content;

    if (!targetPath || typeof content !== "string") {
      return NextResponse.json({ error: "path and string content required" }, { status: 400 });
    }

    targetPath = targetPath.replace(/^file:\/\//, "");

    const resolvedPath = path.isAbsolute(targetPath)
      ? path.normalize(targetPath)
      : path.resolve(process.cwd(), targetPath);

    if (!isPathAllowed(resolvedPath)) {
      return NextResponse.json({ error: "Access forbidden" }, { status: 403 });
    }

    await fs.writeFile(resolvedPath, content, "utf-8");

    return NextResponse.json({
      success: true,
      path: resolvedPath,
      size: Buffer.byteLength(content, "utf-8"),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to save file" },
      { status: 500 }
    );
  }
}
