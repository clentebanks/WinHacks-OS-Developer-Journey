# ADR-0001: Separate Production and Development

- **Status:** Accepted
- **Date:** 2026-07-18

## Context

The existing WinHacks repository is deployed and must remain online. WinHacks OS requires extensive experimentation, learning and architectural change.

## Decision

Create an independent repository named `winhacks-os-developer-journey`. Keep production untouched. Store only a cleaned reference snapshot of useful engine code in the new repository.

## Consequences

### Positive

- Experiments cannot break the live site.
- The new repository has a clean Git history.
- Migration can be incremental and reversible.
- Learning material and architecture decisions remain documented.

### Trade-offs

- Some code exists temporarily in both repositories.
- Integration requires an explicit future workflow.
