export interface ComparisonResult {
  used: string[];
  unused: string[];
  ignored: string[];
}

/**
 * Compares env variables defined in .env files against those used in source code.
 * Variables in the `ignore` list are excluded from the unused list.
 */
export function compareVariables(
  defined: Set<string>,
  used: Set<string>,
  ignore: string[] = []
): ComparisonResult {
  const ignoredSet = new Set(ignore.map((v) => v.toUpperCase()));

  const usedVars: string[] = [];
  const unusedVars: string[] = [];
  const ignoredVars: string[] = [];

  for (const variable of [...defined].sort()) {
    if (ignoredSet.has(variable)) {
      ignoredVars.push(variable);
    } else if (used.has(variable)) {
      usedVars.push(variable);
    } else {
      unusedVars.push(variable);
    }
  }

  return {
    used: usedVars,
    unused: unusedVars,
    ignored: ignoredVars,
  };
}
