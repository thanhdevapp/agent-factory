import fs from "fs";
import path from "path";

// LRU/Map cache to avoid repeated synchronous disk reads for the same path
const worktreeCache = new Map();

/**
 * Resolves whether a directory is a Git repository or a Git worktree.
 * If it is a worktree, resolves the parent repository root and branch/worktree name
 * so AGMon can group parallel worktrees under the same department.
 *
 * @param {string} directoryPath
 * @returns {{
 *   isWorktree: boolean,
 *   repoRoot: string,
 *   repoName: string,
 *   worktreeName: string | null,
 *   worktreePath: string | null,
 * }}
 */
export function resolveParentRepoRoot(directoryPath) {
  if (!directoryPath || typeof directoryPath !== "string") {
    return {
      isWorktree: false,
      repoRoot: "",
      repoName: "agent-factory",
      worktreeName: null,
      worktreePath: null,
    };
  }

  const normalized = path.normalize(directoryPath);
  if (worktreeCache.has(normalized)) {
    return worktreeCache.get(normalized);
  }

  let current = normalized;
  let result = null;

  // Search current directory and up to 4 parent levels for a .git file or directory
  for (let depth = 0; depth < 5; depth++) {
    const gitPath = path.join(current, ".git");
    try {
      if (fs.existsSync(gitPath)) {
        const stat = fs.statSync(gitPath);
        if (stat.isDirectory()) {
          // Standard Git root
          result = {
            isWorktree: false,
            repoRoot: current,
            repoName: path.basename(current),
            worktreeName: null,
            worktreePath: null,
          };
          break;
        } else if (stat.isFile()) {
          // Git worktree file: contains "gitdir: /path/to/main/.git/worktrees/<name>"
          const content = fs.readFileSync(gitPath, "utf-8");
          const match = content.match(/gitdir:\s*(.+)/i);
          if (match) {
            const rawGitdir = match[1].trim();
            const resolvedGitdir = path.isAbsolute(rawGitdir)
              ? rawGitdir
              : path.resolve(current, rawGitdir);

            const wtIdx = resolvedGitdir.lastIndexOf(path.join(".git", "worktrees"));
            if (wtIdx !== -1) {
              const mainRepoRoot = path.resolve(resolvedGitdir.slice(0, wtIdx));
              const worktreeName = path.basename(resolvedGitdir);
              result = {
                isWorktree: true,
                repoRoot: mainRepoRoot,
                repoName: path.basename(mainRepoRoot),
                worktreeName,
                worktreePath: current,
              };
              break;
            }
          }
        }
      }
    } catch {}

    const parent = path.dirname(current);
    if (!parent || parent === current) break;
    current = parent;
  }

  if (!result) {
    result = {
      isWorktree: false,
      repoRoot: normalized,
      repoName: path.basename(normalized) || "agent-factory",
      worktreeName: null,
      worktreePath: null,
    };
  }

  // Bound cache to 256 items
  if (worktreeCache.size > 256) {
    const firstKey = worktreeCache.keys().next().value;
    worktreeCache.delete(firstKey);
  }
  worktreeCache.set(normalized, result);

  return result;
}
