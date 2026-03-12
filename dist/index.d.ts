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
export declare function loadConfig(projectRoot: string): Promise<Config>;
/**
 * Main detection engine: reads env files, scans codebase, and compares.
 */
export declare function detect(projectRoot?: string, options?: Config): Promise<DetectionResult>;
export { readEnvFiles, scanCodebase, compareVariables };
export type { EnvReadResult, ScanResult, ComparisonResult };
//# sourceMappingURL=index.d.ts.map