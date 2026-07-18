# ADR-0001: Separate production and development repositories

- Status: Accepted
- Date: 2026-07-18

## Context

The existing WinHacks repository contains the public website and active tools. Learning, restructuring, and experimentation inside that repository could break production.

## Decision

Create WinHacks OS Developer Journey as a separate repository. Copy only selected engine code into a clearly marked `legacy` area for analysis and controlled migration.

## Consequences

Positive:

- Production remains stable.
- The new Git history documents the modernization.
- Legacy code can be tested before refactoring.

Trade-offs:

- Some temporary duplication is accepted.
- Changes must be intentionally synchronized when required.
