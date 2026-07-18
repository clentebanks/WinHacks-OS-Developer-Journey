# Legacy WinHacks Engine Snapshot

This directory contains a cleaned reference snapshot of the useful automation and CMS code from the existing WinHacks production project.

## Included

- `config/`
- `toolkit/`
- `tools/`
- `scripts/`
- `templates/`
- `cms/`
- selected technical documentation and components
- legacy package manifests renamed with `.legacy.json`

## Excluded

- Production HTML pages
- Website assets and downloads
- Netlify production configuration
- Git history
- `node_modules`
- Reports, logs and backups
- Unrelated product directories

## Important

This snapshot is not expected to run as a standalone website. It is source material for analysis, testing and incremental migration into `packages/` and `apps/`.

Do not edit legacy modules merely to make them look modern. First document what they do, then migrate one capability at a time with tests.
