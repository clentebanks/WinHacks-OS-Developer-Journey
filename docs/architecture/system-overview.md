# System Overview

## Current State

The original WinHacks project combines a static production website with automation modules for building, auditing, planning, and publishing content.

## Target State

WinHacks OS will be a separate modular platform.

```text
Dashboard (Next.js + React)
          |
     Internal API
          |
Application Services (Node.js + TypeScript)
          |
SQLite Database / File Integrations
          |
Controlled Production Publishing
```

## Migration Principle

Each useful legacy module follows this cycle:

1. Analyze current behavior.
2. Document inputs, outputs and dependencies.
3. Create tests or fixtures.
4. Learn the required language concept.
5. Rebuild it as a typed modular package.
6. Compare behavior.
7. Integrate it into WinHacks OS.
8. Retire the legacy implementation only after validation.
