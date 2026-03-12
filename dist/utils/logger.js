"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSuccess = logSuccess;
exports.logError = logError;
exports.logWarning = logWarning;
exports.logInfo = logInfo;
exports.logHeader = logHeader;
exports.logDivider = logDivider;
const chalk_1 = __importDefault(require("chalk"));
function logSuccess(message) {
    console.log(chalk_1.default.green(`  ✓ ${message}`));
}
function logError(message) {
    console.log(chalk_1.default.red(`  ✗ ${message}`));
}
function logWarning(message) {
    console.log(chalk_1.default.yellow(`  ⚠ ${message}`));
}
function logInfo(message) {
    console.log(chalk_1.default.cyan(`  ℹ ${message}`));
}
function logHeader(message) {
    console.log(chalk_1.default.bold.white(`\n${message}`));
    console.log(chalk_1.default.gray('─'.repeat(message.length)));
}
function logDivider() {
    console.log(chalk_1.default.gray('─'.repeat(50)));
}
//# sourceMappingURL=logger.js.map