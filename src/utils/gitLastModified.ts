import { execSync } from "node:child_process";

export function getGitLastModified(filePath: string) {
  try {
    const result = execSync(
      `git log -1 --format=%cI "${filePath}"`
    ).toString().trim();

    return result ? new Date(result) : null;
  } catch {
    return null;
  }
}