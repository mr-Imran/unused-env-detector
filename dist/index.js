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
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareVariables = exports.scanCodebase = exports.readEnvFiles = void 0;
exports.loadConfig = loadConfig;
exports.detect = detect;
const path = __importStar(require("path"));
const envReader_1 = require("./scanner/envReader");
Object.defineProperty(exports, "readEnvFiles", { enumerable: true, get: function () { return envReader_1.readEnvFiles; } });
const codeScanner_1 = require("./scanner/codeScanner");
Object.defineProperty(exports, "scanCodebase", { enumerable: true, get: function () { return codeScanner_1.scanCodebase; } });
const comparator_1 = require("./scanner/comparator");
Object.defineProperty(exports, "compareVariables", { enumerable: true, get: function () { return comparator_1.compareVariables; } });
/**
 * Loads optional config file from the project root.
 * Supports: unused-env.config.js or unused-env.config.cjs
 */
async function loadConfig(projectRoot) {
    const configPaths = [
        path.join(projectRoot, 'unused-env.config.js'),
        path.join(projectRoot, 'unused-env.config.cjs'),
    ];
    for (const configPath of configPaths) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const config = require(configPath);
            return config?.default ?? config;
        }
        catch {
            // Config file not present or failed to load, continue
        }
    }
    return {};
}
/**
 * Main detection engine: reads env files, scans codebase, and compares.
 */
async function detect(projectRoot = process.cwd(), options = {}) {
    const config = await loadConfig(projectRoot);
    // Merge config with CLI options (CLI options take precedence)
    const mergedIgnore = [
        ...(config.ignore ?? []),
        ...(options.ignore ?? []),
    ];
    const scanDirectories = options.scanDirectories ?? config.scanDirectories ?? ['.'];
    const envFiles = config.envFiles;
    const envResult = (0, envReader_1.readEnvFiles)(projectRoot, envFiles);
    const scanResult = await (0, codeScanner_1.scanCodebase)(projectRoot, scanDirectories);
    const comparison = (0, comparator_1.compareVariables)(envResult.variables, scanResult.usedVariables, mergedIgnore);
    return { envResult, scanResult, comparison };
}
//# sourceMappingURL=index.js.map