#!/usr/bin/env node
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
const commander_1 = require("commander");
const path = __importStar(require("path"));
const index_1 = require("./index");
const logger_1 = require("./utils/logger");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name('unused-env-detector')
    .description('Detect unused environment variables in your project')
    .version('1.0.0')
    .option('--json', 'Output results as JSON')
    .option('--ignore <vars>', 'Comma-separated list of variables to ignore', (val) => val.split(',').map((v) => v.trim()))
    .option('--ci', 'Exit with code 1 if unused variables are found')
    .option('--dir <directory>', 'Project root directory to scan', process.cwd())
    .option('--scan <dirs>', 'Comma-separated directories to scan (e.g. src,server)', (val) => val.split(',').map((d) => d.trim()))
    .action(async (options) => {
    const projectRoot = path.resolve(options.dir);
    try {
        const result = await (0, index_1.detect)(projectRoot, {
            ignore: options.ignore ?? [],
            scanDirectories: options.scan,
        });
        const { comparison, envResult } = result;
        // ── JSON output ──────────────────────────────────────────────
        if (options.json) {
            const jsonOutput = {
                projectRoot,
                envSources: Object.keys(envResult.sources),
                summary: {
                    total: comparison.used.length + comparison.unused.length + comparison.ignored.length,
                    used: comparison.used.length,
                    unused: comparison.unused.length,
                    ignored: comparison.ignored.length,
                },
                used: comparison.used,
                unused: comparison.unused,
                ignored: comparison.ignored,
            };
            console.log(JSON.stringify(jsonOutput, null, 2));
            if (options.ci && comparison.unused.length > 0) {
                process.exit(1);
            }
            return;
        }
        // ── Human-readable output ────────────────────────────────────
        console.log(chalk_1.default.bold.cyan('\n🔍 unused-env-detector') +
            chalk_1.default.gray(` — scanning ${projectRoot}\n`));
        // Env sources found
        const sources = Object.keys(envResult.sources);
        if (sources.length === 0) {
            (0, logger_1.logWarning)('No .env files found in project root.');
            return;
        }
        (0, logger_1.logHeader)('Env Files Detected');
        sources.forEach((s) => (0, logger_1.logInfo)(s));
        // Variable results
        (0, logger_1.logHeader)('Variable Analysis');
        if (comparison.used.length === 0 && comparison.unused.length === 0 && comparison.ignored.length === 0) {
            (0, logger_1.logWarning)('No environment variables found in .env files.');
            return;
        }
        for (const variable of comparison.used) {
            (0, logger_1.logSuccess)(`${variable} ${chalk_1.default.gray('used')}`);
        }
        for (const variable of comparison.unused) {
            (0, logger_1.logError)(`${variable} ${chalk_1.default.gray('unused')}`);
        }
        for (const variable of comparison.ignored) {
            (0, logger_1.logWarning)(`${variable} ${chalk_1.default.gray('ignored')}`);
        }
        // Summary
        (0, logger_1.logDivider)();
        (0, logger_1.logHeader)('Summary');
        console.log(chalk_1.default.green(`  Used variables:    ${comparison.used.length}`));
        console.log(chalk_1.default.red(`  Unused variables:  ${comparison.unused.length}`));
        if (comparison.ignored.length > 0) {
            console.log(chalk_1.default.yellow(`  Ignored variables: ${comparison.ignored.length}`));
        }
        console.log('');
        // CI mode: exit with code 1 if there are unused variables
        if (options.ci && comparison.unused.length > 0) {
            (0, logger_1.logError)('CI mode: unused environment variables detected. Exiting with code 1.');
            process.exit(1);
        }
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        (0, logger_1.logError)(`Failed to run detection: ${message}`);
        process.exit(1);
    }
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map