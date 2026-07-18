# Legacy Migration Strategy

## Purpose

Preserve the value of the existing WinHacks engine without copying its production-site responsibilities into the new platform.

## Migration sequence

1. Inventory files, commands, inputs, outputs, and dependencies.
2. Select one low-risk module.
3. Add characterization tests around current behavior.
4. Define a package interface.
5. Refactor in small steps.
6. Compare old and new outputs.
7. Document intentional differences.
8. Integrate through the CLI.
9. Remove the copied implementation only after the replacement is accepted.

## Selection criteria

Prefer a module that is:

- valuable to the current workflow;
- narrow enough to understand;
- deterministic;
- testable with local fixtures;
- not tightly coupled to production deployment.

RSS or sitemap generation are strong initial candidates.
