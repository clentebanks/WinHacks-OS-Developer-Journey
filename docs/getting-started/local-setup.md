# Local Setup

## 1. Install tools

Install Git, Node.js 22 or newer, npm, and Visual Studio Code.

## 2. Open a terminal in the repository

```bash
cd WinHacks-OS-Developer-Journey
```

## 3. Install workspace metadata

```bash
npm install
```

The current foundation has no required third-party runtime dependencies, but this command prepares npm workspaces and creates a lockfile.

## 4. Check the environment

```bash
npm run doctor
npm run check
npm test
```

## 5. Run the CLI

```bash
npm run dev:cli -- help
npm run dev:cli -- version
npm run dev:cli -- doctor
```
