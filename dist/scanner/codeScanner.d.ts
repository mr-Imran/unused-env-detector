export interface ScanResult {
    usedVariables: Set<string>;
    fileMatches: Record<string, string[]>;
}
/**
 * Scans source files in the specified directories and returns all env variable names found.
 */
export declare function scanCodebase(projectRoot: string, scanDirectories: string[]): Promise<ScanResult>;
//# sourceMappingURL=codeScanner.d.ts.map