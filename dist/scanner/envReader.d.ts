export interface EnvReadResult {
    variables: Set<string>;
    sources: Record<string, string[]>;
}
/**
 * Reads all detected .env files in the project root and extracts variable names.
 */
export declare function readEnvFiles(projectRoot: string, customEnvFiles?: string[]): EnvReadResult;
//# sourceMappingURL=envReader.d.ts.map