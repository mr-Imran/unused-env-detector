import fg from 'fast-glob';
import * as fs from 'fs';

const DEFAULT_IGNORE = ['node_modules/**', 'dist/**', 'build/**', '.git/**'];

const DEFAULT_EXTENSIONS = ['js', 'ts', 'jsx', 'tsx', 'mjs', 'cjs'];

/**
 * Regex patterns that match environment variable usage in source code.
 * Groups:
 *  1. process.env.VAR_NAME
 *  2. import.meta.env.VAR_NAME
 *  3. env("VAR_NAME") or env('VAR_NAME')
 *  4. config.VAR_NAME (only ALL_CAPS identifiers to avoid false positives)
 */
const ENV_USAGE_PATTERNS: RegExp[] = [
  /process\.env\.([A-Z_][A-Z0-9_]*)/gi,
  /import\.meta\.env\.([A-Z_][A-Z0-9_]*)/gi,
  /env\(\s*['"`]([A-Z_][A-Z0-9_]*)['"`]\s*\)/gi,
  /config\.([A-Z_][A-Z0-9_]+)/g,
];

export interface ScanResult {
  usedVariables: Set<string>;
  fileMatches: Record<string, string[]>;
}

/**
 * Collects all source files matching the given extensions from the scan directories.
 */
async function collectSourceFiles(
  scanDirectories: string[],
  projectRoot: string
): Promise<string[]> {
  const ext = `{${DEFAULT_EXTENSIONS.join(',')}}`;
  const patterns: string[] = [];

  for (const dir of scanDirectories) {
    // Normalise: strip leading ./ or .\
    const d = dir.replace(/^\.[\\/]/, '').replace(/^\.?$/, '');
    if (d === '') {
      // Scan root and all subdirectories
      patterns.push(`*.${ext}`, `**/*.${ext}`);
    } else {
      // Scan top-level files in the dir and all subdirs
      patterns.push(`${d}/*.${ext}`, `${d}/**/*.${ext}`);
    }
  }

  const files = await fg(patterns, {
    cwd: projectRoot,
    absolute: true,
    ignore: DEFAULT_IGNORE,
    onlyFiles: true,
  });

  return files;
}

/**
 * Scans a single file for all env variable usage patterns.
 */
function scanFileContent(content: string): string[] {
  const found = new Set<string>();

  for (const pattern of ENV_USAGE_PATTERNS) {
    // Reset lastIndex for global patterns between files
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(content)) !== null) {
      if (match[1]) {
        found.add(match[1].toUpperCase());
      }
    }
  }

  return [...found];
}

/**
 * Scans source files in the specified directories and returns all env variable names found.
 */
export async function scanCodebase(
  projectRoot: string,
  scanDirectories: string[]
): Promise<ScanResult> {
  const usedVariables = new Set<string>();
  const fileMatches: Record<string, string[]> = {};

  const files = await collectSourceFiles(scanDirectories, projectRoot);

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const vars = scanFileContent(content);

      if (vars.length > 0) {
        fileMatches[filePath] = vars;
        vars.forEach((v) => usedVariables.add(v));
      }
    } catch {
      // Skip unreadable files
    }
  }

  return { usedVariables, fileMatches };
}
