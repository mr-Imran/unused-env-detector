"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareVariables = compareVariables;
/**
 * Compares env variables defined in .env files against those used in source code.
 * Variables in the `ignore` list are excluded from the unused list.
 */
function compareVariables(defined, used, ignore = []) {
    const ignoredSet = new Set(ignore.map((v) => v.toUpperCase()));
    const usedVars = [];
    const unusedVars = [];
    const ignoredVars = [];
    for (const variable of [...defined].sort()) {
        if (ignoredSet.has(variable)) {
            ignoredVars.push(variable);
        }
        else if (used.has(variable)) {
            usedVars.push(variable);
        }
        else {
            unusedVars.push(variable);
        }
    }
    return {
        used: usedVars,
        unused: unusedVars,
        ignored: ignoredVars,
    };
}
//# sourceMappingURL=comparator.js.map