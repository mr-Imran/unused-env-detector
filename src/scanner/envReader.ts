import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_ENV_FILES = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
];

export interface EnvReadResult {
  variables: Set<string>;
  sources: Record<string, string[]>;
}

/**
 * Parses a single .env file content and returns variable names.
 */
function parseEnvContent(content: string): string[] {
  const variables: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Match VAR_NAME=... or VAR_NAME: ...
    const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)\s*=/i);
    if (match && match[1]) {
      variables.push(match[1]);
    }
  }

  return variables;
}

/**
 * Reads all detected .env files in the project root and extracts variable names.
 */
export function readEnvFiles(
  projectRoot: string,
  customEnvFiles?: string[]
): EnvReadResult {
  const filesToScan = customEnvFiles ?? DEFAULT_ENV_FILES;
  const allVariables = new Set<string>();
  const sources: Record<string, string[]> = {};

  for (const envFile of filesToScan) {
    const fullPath = path.join(projectRoot, envFile);

    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const vars = parseEnvContent(content);

        if (vars.length > 0) {
          sources[envFile] = vars;
          vars.forEach((v) => allVariables.add(v));
        }
      } catch (err) {
        // Silently skip unreadable files
      }
    }
  }

  return { variables: allVariables, sources };
}
