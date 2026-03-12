// unused-env.config.js
// This file is optional. Place it in your project root to configure unused-env-detector.

module.exports = {
  /**
   * Variables to ignore (will not be reported as unused).
   * Useful for variables like NODE_ENV and PORT that are used implicitly.
   */
  ignore: [
    // 'NODE_ENV',
    // 'PORT',
  ],

  /**
   * Directories to scan for env variable usage.
   * Defaults to the entire project root (excluding node_modules, dist, build, .git).
   */
  scanDirectories: [
    'src',
    // 'server',
    // 'lib',
  ],

  /**
   * Custom .env files to read. Defaults to .env, .env.local, .env.production, .env.development.
   */
  // envFiles: ['.env', '.env.staging'],
};
