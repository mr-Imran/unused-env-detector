#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { detect } from './index';
import {
  logSuccess,
  logError,
  logWarning,
  logInfo,
  logHeader,
  logDivider,
} from './utils/logger';
import chalk from 'chalk';

const program = new Command();

program
  .name('unused-env-detector')
  .description('Detect unused environment variables in your project')
  .version('1.0.0')
  .option('--json', 'Output results as JSON')
  .option(
    '--ignore <vars>',
    'Comma-separated list of variables to ignore',
    (val: string) => val.split(',').map((v) => v.trim())
  )
  .option('--ci', 'Exit with code 1 if unused variables are found')
  .option(
    '--dir <directory>',
    'Project root directory to scan',
    process.cwd()
  )
  .option(
    '--scan <dirs>',
    'Comma-separated directories to scan (e.g. src,server)',
    (val: string) => val.split(',').map((d) => d.trim())
  )
  .action(async (options: {
    json?: boolean;
    ignore?: string[];
    ci?: boolean;
    dir: string;
    scan?: string[];
  }) => {
    const projectRoot = path.resolve(options.dir);

    try {
      const result = await detect(projectRoot, {
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
      console.log(
        chalk.bold.cyan('\n🔍 unused-env-detector') +
          chalk.gray(` — scanning ${projectRoot}\n`)
      );

      // Env sources found
      const sources = Object.keys(envResult.sources);
      if (sources.length === 0) {
        logWarning('No .env files found in project root.');
        return;
      }

      logHeader('Env Files Detected');
      sources.forEach((s) => logInfo(s));

      // Variable results
      logHeader('Variable Analysis');

      if (comparison.used.length === 0 && comparison.unused.length === 0 && comparison.ignored.length === 0) {
        logWarning('No environment variables found in .env files.');
        return;
      }

      for (const variable of comparison.used) {
        logSuccess(`${variable} ${chalk.gray('used')}`);
      }
      for (const variable of comparison.unused) {
        logError(`${variable} ${chalk.gray('unused')}`);
      }
      for (const variable of comparison.ignored) {
        logWarning(`${variable} ${chalk.gray('ignored')}`);
      }

      // Summary
      logDivider();
      logHeader('Summary');
      console.log(
        chalk.green(`  Used variables:    ${comparison.used.length}`)
      );
      console.log(
        chalk.red(`  Unused variables:  ${comparison.unused.length}`)
      );
      if (comparison.ignored.length > 0) {
        console.log(
          chalk.yellow(`  Ignored variables: ${comparison.ignored.length}`)
        );
      }
      console.log('');

      // CI mode: exit with code 1 if there are unused variables
      if (options.ci && comparison.unused.length > 0) {
        logError('CI mode: unused environment variables detected. Exiting with code 1.');
        process.exit(1);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logError(`Failed to run detection: ${message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
