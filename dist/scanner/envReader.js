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
exports.readEnvFiles = readEnvFiles;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const DEFAULT_ENV_FILES = [
    '.env',
    '.env.local',
    '.env.production',
    '.env.development',
];
/**
 * Parses a single .env file content and returns variable names.
 */
function parseEnvContent(content) {
    const variables = [];
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
function readEnvFiles(projectRoot, customEnvFiles) {
    const filesToScan = customEnvFiles ?? DEFAULT_ENV_FILES;
    const allVariables = new Set();
    const sources = {};
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
            }
            catch (err) {
                // Silently skip unreadable files
            }
        }
    }
    return { variables: allVariables, sources };
}
//# sourceMappingURL=envReader.js.map