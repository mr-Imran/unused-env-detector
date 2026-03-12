# unused-env-detector

**npm:** https://www.npmjs.com/package/unused-env-detector

**Node.js | CLI Tool | MIT License**

🔍 **A CLI tool to detect unused environment variables in your project**
Keep your `.env` files clean, reduce confusion, and prevent unnecessary secrets from staying in production.

---

## Why this tool exists

Over time projects accumulate environment variables that are no longer used.
These variables often stay in `.env` files and deployment configs, creating problems such as:

• confusion for new developers
• unused secrets stored in infrastructure
• messy configuration files
• potential security risks

`unused-env-detector` scans your project and shows which variables are **actually used** and which ones can safely be removed.

---

# Features

• 📂 Automatically detects `.env`, `.env.local`, `.env.production`, `.env.development`
• 🔎 Scans **JS, TS, JSX, TSX, MJS, and CJS** source files
• 🎨 Clean and colored CLI output
• 📦 JSON output mode for CI/CD pipelines
• 🚦 CI mode to fail builds when unused variables exist
• ⚙️ Optional config file (`unused-env.config.js`)
• 🚀 Works instantly with **zero configuration**

---

# Installation

Run directly without installing

```bash
npx unused-env-detector
```

Install globally

```bash
npm install -g unused-env-detector
```

---

# Usage

Run in your project root:

```bash
npx unused-env-detector
```

Example output

```
🔍 unused-env-detector — scanning /your/project

Env Files Detected
──────────────────
  ℹ .env
  ℹ .env.local

Variable Analysis
─────────────────
  ✓ DATABASE_URL used
  ✓ JWT_SECRET used
  ✗ STRIPE_TEST_KEY unused
  ✗ OLD_API_URL unused

────────────────────────────────────

Summary
───────
Used variables:    2
Unused variables:  2
```

---

# CLI Flags

| Flag        | Description                                | Example                             |
| ----------- | ------------------------------------------ | ----------------------------------- |
| `--json`    | Output results as JSON                     | `npx unused-env-detector --json`    |
| `--ignore`  | Ignore specific variables                  | `--ignore NODE_ENV,PORT`            |
| `--ci`      | Exit with code 1 if unused variables exist | `npx unused-env-detector --ci`      |
| `--dir`     | Specify project root                       | `--dir /path/to/project`            |
| `--scan`    | Directories to scan                        | `--scan src,server`                 |
| `--version` | Show version                               | `npx unused-env-detector --version` |
| `--help`    | Show CLI help                              | `npx unused-env-detector --help`    |

---

# CI/CD Integration

Use CI mode to automatically fail pipelines when unused variables are detected.

```bash
npx unused-env-detector --ci
```

Example in GitHub Actions

```yaml
- name: Check environment variables
  run: npx unused-env-detector --ci
```

If unused variables are found the command exits with **code 1**, causing the CI job to fail.

---

# JSON Output

Useful for automation and pipelines.

```bash
npx unused-env-detector --json
```

Example output

```json
{
  "projectRoot": "/your/project",
  "envSources": [".env", ".env.local"],
  "summary": {
    "total": 4,
    "used": 2,
    "unused": 2,
    "ignored": 0
  },
  "used": ["DATABASE_URL", "JWT_SECRET"],
  "unused": ["OLD_API_URL", "STRIPE_TEST_KEY"],
  "ignored": []
}
```

---

# Configuration File

Create `unused-env.config.js` in your project root.

```javascript
module.exports = {
  ignore: ['NODE_ENV', 'PORT'],
  scanDirectories: ['src', 'server'],
  envFiles: ['.env', '.env.staging']
}
```

Options

**ignore**
Variables that should always be treated as used.

**scanDirectories**
Restrict scanning to specific directories.

**envFiles**
Custom list of `.env` files.

---

# Detected Usage Patterns

The scanner recognizes common environment usage patterns.

```
process.env.MY_VARIABLE
import.meta.env.MY_VARIABLE
env("MY_VARIABLE")
config.MY_VARIABLE
```

---

# Supported File Types

| Extension | Supported |
| --------- | --------- |
| .js       | yes       |
| .ts       | yes       |
| .jsx      | yes       |
| .tsx      | yes       |
| .mjs      | yes       |
| .cjs      | yes       |

---

# Ignored Directories

These folders are excluded from scanning automatically.

```
node_modules
dist
build
.git
```

---

# Programmatic API

You can also use the package inside Node.js projects.

```javascript
import { detect } from "unused-env-detector"

const result = await detect("/path/to/project", {
  ignore: ["NODE_ENV"],
  scanDirectories: ["src"]
})

console.log(result.comparison.unused)
console.log(result.comparison.used)
```

---

# Contributing

Contributions are welcome and highly appreciated.

Ways to contribute

• report bugs
• suggest improvements
• add new detection patterns
• improve performance
• help with documentation
• add framework integrations

Steps

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

If you have ideas to improve the project, open an **issue discussion**.

---

# Collaboration

This project aims to become a **standard tool for keeping `.env` files clean in modern JavaScript projects**.

Developers, maintainers, and DevOps engineers are welcome to collaborate.

If you want to contribute to the ecosystem around this tool, you can help with:

• building plugins for frameworks like Next.js or NestJS
• creating GitHub Actions integration
• improving detection accuracy
• adding support for additional file patterns
• improving performance for large monorepos

Open an issue or discussion and let's build it together.

---

# License

MIT License

© unused-env-detector contributors

---

# Keywords

env
environment variables
nodejs cli
developer tools
env cleaner
dotenv
devops tools
javascript tooling
configuration management
