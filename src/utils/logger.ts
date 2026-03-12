import chalk from 'chalk';

export function logSuccess(message: string): void {
  console.log(chalk.green(`  ✓ ${message}`));
}

export function logError(message: string): void {
  console.log(chalk.red(`  ✗ ${message}`));
}

export function logWarning(message: string): void {
  console.log(chalk.yellow(`  ⚠ ${message}`));
}

export function logInfo(message: string): void {
  console.log(chalk.cyan(`  ℹ ${message}`));
}

export function logHeader(message: string): void {
  console.log(chalk.bold.white(`\n${message}`));
  console.log(chalk.gray('─'.repeat(message.length)));
}

export function logDivider(): void {
  console.log(chalk.gray('─'.repeat(50)));
}
