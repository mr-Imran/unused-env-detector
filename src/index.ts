import * as path from 'path';
import { readEnvFiles, EnvReadResult } from './scanner/envReader';
import { scanCodebase, ScanResult } from './scanner/codeScanner';
import { compareVariables, ComparisonResult } from './scanner/comparator';

export interface Config {
  ignore?: string[];
  scanDirectories?: string[];
  envFiles?: string[];
}

export interface DetectionResult {
  envResult: EnvReadResult;
  scanResult: ScanResult;
  comparison: ComparisonResult;
}

/**
 * Loads optional config file from the project root.
 * Supports: unused-env.config.js or unused-env.config.cjs
 */
export async function loadConfig(projectRoot: string): Promise<Config> {
  const configPaths = [
    path.join(projectRoot, 'unused-env.config.js'),
    path.join(projectRoot, 'unused-env.config.cjs'),
  ];

  for (const configPath of configPaths) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require(configPath) as Config & { default?: Config };
      return config?.default ?? config;
    } catch {
      // Config file not present or failed to load, continue
    }
  }

  return {};
}

/**
 * Main detection engine: reads env files, scans codebase, and compares.
 */
export async function detect(
  projectRoot: string = process.cwd(),
  options: Config = {}
): Promise<DetectionResult> {
  const config = await loadConfig(projectRoot);

  // Merge config with CLI options (CLI options take precedence)
  const mergedIgnore = [
    ...(config.ignore ?? []),
    ...(options.ignore ?? []),
  ];
  const scanDirectories =
    options.scanDirectories ?? config.scanDirectories ?? ['.'];
  const envFiles = config.envFiles;

  const envResult = readEnvFiles(projectRoot, envFiles);
  const scanResult = await scanCodebase(projectRoot, scanDirectories);
  const comparison = compareVariables(
    envResult.variables,
    scanResult.usedVariables,
    mergedIgnore
  );

  return { envResult, scanResult, comparison };
}

export { readEnvFiles, scanCodebase, compareVariables };
export type { EnvReadResult, ScanResult, ComparisonResult };
