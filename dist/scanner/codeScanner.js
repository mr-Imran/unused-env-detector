"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanCodebase = scanCodebase;
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs = __importStar(require("fs"));
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
const ENV_USAGE_PATTERNS = [
    /process\.env\.([A-Z_][A-Z0-9_]*)/gi,
    /import\.meta\.env\.([A-Z_][A-Z0-9_]*)/gi,
    /env\(\s*['"`]([A-Z_][A-Z0-9_]*)['"`]\s*\)/gi,
    /config\.([A-Z_][A-Z0-9_]+)/g,
];
/**
 * Collects all source files matching the given extensions from the scan directories.
 */
async function collectSourceFiles(scanDirectories, projectRoot) {
    const ext = `{${DEFAULT_EXTENSIONS.join(',')}}`;
    const patterns = [];
    for (const dir of scanDirectories) {
        // Normalise: strip leading ./ or .\
        const d = dir.replace(/^\.[\\/]/, '').replace(/^\.?$/, '');
        if (d === '') {
            // Scan root and all subdirectories
            patterns.push(`*.${ext}`, `**/*.${ext}`);
        }
        else {
            // Scan top-level files in the dir and all subdirs
            patterns.push(`${d}/*.${ext}`, `${d}/**/*.${ext}`);
        }
    }
    const files = await (0, fast_glob_1.default)(patterns, {
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
function scanFileContent(content) {
    const found = new Set();
    for (const pattern of ENV_USAGE_PATTERNS) {
        // Reset lastIndex for global patterns between files
        pattern.lastIndex = 0;
        let match;
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
async function scanCodebase(projectRoot, scanDirectories) {
    const usedVariables = new Set();
    const fileMatches = {};
    const files = await collectSourceFiles(scanDirectories, projectRoot);
    for (const filePath of files) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const vars = scanFileContent(content);
            if (vars.length > 0) {
                fileMatches[filePath] = vars;
                vars.forEach((v) => usedVariables.add(v));
            }
        }
        catch {
            // Skip unreadable files
        }
    }
    return { usedVariables, fileMatches };
}
//# sourceMappingURL=codeScanner.js.map