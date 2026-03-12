export interface ComparisonResult {
    used: string[];
    unused: string[];
    ignored: string[];
}
/**
 * Compares env variables defined in .env files against those used in source code.
 * Variables in the `ignore` list are excluded from the unused list.
 */
export declare function compareVariables(defined: Set<string>, used: Set<string>, ignore?: string[]): ComparisonResult;
//# sourceMappingURL=comparator.d.ts.map