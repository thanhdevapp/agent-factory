import fs from "fs";
import path from "path";

/**
 * Detects the preferred package manager based on lockfiles.
 * @param {string} dir
 * @returns {"pnpm" | "yarn" | "bun" | "npm"}
 */
export function detectPackageManager(dir) {
  try {
    if (fs.existsSync(path.join(dir, "pnpm-lock.yaml"))) return "pnpm";
    if (fs.existsSync(path.join(dir, "yarn.lock"))) return "yarn";
    if (fs.existsSync(path.join(dir, "bun.lockb")) || fs.existsSync(path.join(dir, "bun.lock"))) return "bun";
    if (fs.existsSync(path.join(dir, "package-lock.json"))) return "npm";
  } catch {}
  return "npm";
}

/**
 * Reads and categorizes scripts from package.json in the specified directory.
 * @param {string} [targetDir]
 * @returns {Promise<{
 *   exists: boolean,
 *   rootDir: string,
 *   packageName?: string,
 *   packageManager: "pnpm" | "yarn" | "bun" | "npm",
 *   scripts: Record<string, string>,
 *   categories: {
 *     dev?: { name: string, cmd: string },
 *     test?: { name: string, cmd: string },
 *     build?: { name: string, cmd: string },
 *     lint?: { name: string, cmd: string },
 *   },
 *   customScripts: Array<{ name: string, cmd: string }>
 * }>}
 */
export async function getProjectScripts(targetDir) {
  const rootDir = targetDir && fs.existsSync(targetDir) ? path.resolve(targetDir) : process.cwd();
  const pkgPath = path.join(rootDir, "package.json");

  if (!fs.existsSync(pkgPath)) {
    return {
      exists: false,
      rootDir,
      packageManager: "npm",
      scripts: {},
      categories: {},
      customScripts: [],
    };
  }

  try {
    const raw = await fs.promises.readFile(pkgPath, "utf-8");
    const pkg = JSON.parse(raw);
    const scripts = pkg.scripts || {};
    const packageManager = detectPackageManager(rootDir);

    // Identify standard categories
    const categories = {};
    const scriptKeys = Object.keys(scripts);

    // Dev
    const devKey = scriptKeys.find((k) => k === "dev") ||
      scriptKeys.find((k) => k === "start" || k === "serve" || k.startsWith("dev:"));
    if (devKey) {
      categories.dev = { name: devKey, cmd: scripts[devKey] };
    }

    // Test
    const testKey = scriptKeys.find((k) => k === "test") ||
      scriptKeys.find((k) => k.startsWith("test:") || k === "check:test");
    if (testKey) {
      categories.test = { name: testKey, cmd: scripts[testKey] };
    }

    // Build
    const buildKey = scriptKeys.find((k) => k === "build") ||
      scriptKeys.find((k) => k.startsWith("build:"));
    if (buildKey) {
      categories.build = { name: buildKey, cmd: scripts[buildKey] };
    }

    // Lint
    const lintKey = scriptKeys.find((k) => k === "lint") ||
      scriptKeys.find((k) => k === "check" || k.startsWith("lint:"));
    if (lintKey) {
      categories.lint = { name: lintKey, cmd: scripts[lintKey] };
    }

    const categorizedKeys = new Set(Object.values(categories).map((c) => c.name));
    const customScripts = scriptKeys
      .filter((k) => !categorizedKeys.has(k))
      .map((k) => ({ name: k, cmd: scripts[k] }));

    return {
      exists: true,
      rootDir,
      packageName: pkg.name || path.basename(rootDir),
      packageManager,
      scripts,
      categories,
      customScripts,
    };
  } catch (err) {
    return {
      exists: false,
      rootDir,
      packageManager: "npm",
      scripts: {},
      categories: {},
      customScripts: [],
      error: err.message,
    };
  }
}
