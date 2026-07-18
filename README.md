# WinHacks OS Developer Journey

> **Learn. Build. Document. Share.**

[![Status](https://img.shields.io/badge/status-in%20progress-blue)](#current-status)
[![Journey](https://img.shields.io/badge/journey-full--stack-success)](#learning-path)
[![Project](https://img.shields.io/badge/project-WinHacks%20OS-0A66C2)](#project-vision)

## About

**WinHacks OS Developer Journey** documents the complete process of learning modern full-stack development while designing and building a real software platform.

The project starts from the existing WinHacks automation engine and gradually transforms its useful modules into a modular platform built with:

- JavaScript and TypeScript
- Node.js
- React
- Next.js
- Tailwind CSS
- SQLite, with a future path to PostgreSQL
- Internal APIs
- Reusable components
- Professional Git and software-engineering practices

This repository is intentionally separate from the production WinHacks website. The live site remains stable while experiments, lessons, refactoring, and new architecture are developed here.

## Project Vision

WinHacks OS will become the internal platform used to create, validate, publish, measure, and eventually monetize content across the WinHacks ecosystem.

```text
WinHacks OS
├── Content Management
├── SEO and GEO Auditing
├── Content Planning
├── Publishing Workflows
├── Analytics
├── Academy
└── Digital Products
```

## Repository Strategy

This repository contains two complementary tracks:

1. **Developer Journey** — lessons, laboratories, exercises, notes, and engineering logs.
2. **WinHacks OS** — the new modular application developed progressively throughout the journey.

A frozen, cleaned snapshot of the useful automation code from the existing project is stored in [`legacy/winhacks-engine`](legacy/winhacks-engine). It is reference material for analysis and migration; it is not the production website.

## Learning Path

| Level | Topic | Application |
|---|---|---|
| 0 | Development environment | Professional repository foundation |
| 1 | Modern JavaScript | Core utilities and data processing |
| 2 | TypeScript | Domain models and safe modules |
| 3 | Node.js | CLI, filesystem and backend services |
| 4 | Git and GitHub | Professional workflow and releases |
| 5 | React | Reusable dashboard components |
| 6 | Next.js | Full-stack dashboard application |
| 7 | Tailwind CSS | Responsive design system |
| 8 | SQLite | Content and workflow database |
| 9 | REST APIs | Internal communication layer |
| 10 | WinHacks OS | Integrated production-ready MVP |

See [LEARNING_PATH.md](LEARNING_PATH.md) and [ROADMAP.md](ROADMAP.md).

## Repository Structure

```text
.
├── apps/                 # Frontend and full-stack applications
├── course/               # Ordered learning modules
├── database/             # Database design and migrations
├── docs/                 # Architecture and technical documentation
├── engineering-log/      # Chronological learning and engineering journal
├── exercises/            # Independent practice exercises
├── labs/                 # Guided coding laboratories
├── legacy/               # Clean reference snapshot of the current engine
├── packages/             # Reusable modular packages
├── resources/            # Curated learning resources
└── tests/                # Automated tests
```

## Study Method

Every lesson follows the same cycle:

1. Define the objective.
2. Understand the concept.
3. Study one focused video or official resource.
4. Complete a small guided laboratory.
5. Apply the concept to WinHacks OS.
6. Complete an independent challenge.
7. Document the result.
8. Create a clear Git commit.

## Current Status

**Phase 0 — Repository Foundation**

- [x] Separate repository strategy
- [x] Initial professional documentation
- [x] Clean legacy engine snapshot
- [ ] Local development environment verification
- [ ] First GitHub Project board
- [ ] First guided laboratory
- [ ] Initial TypeScript workspace

## Important Safety Rule

The production WinHacks repository and its Netlify deployment are not modified from this repository. Any future integration must be explicit, tested, and reversible.

## Author

**Clent Ebanks**  
Creator of WinHacks  
Building and documenting the journey from technology learner to full-stack developer.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
