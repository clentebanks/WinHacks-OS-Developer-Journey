# Core Logger

The logger is the first reusable WinHacks OS core service.

## API

```js
import { createLogger, logger } from "@winhacks/core";
```

Default methods:

```js
logger.debug("Detailed diagnostic message");
logger.info("Build started");
logger.success("RSS generated");
logger.warn("Missing metadata");
logger.error("Unable to read config");
```

## Custom logger

```js
const seoLogger = createLogger({
  level: "info",
  namespace: "seo"
});

seoLogger.info("Audit started");
```

## Child logger

```js
const rssLogger = seoLogger.child("rss");
rssLogger.success("Feed generated");
```

The resulting namespace is `seo:rss`.

## Supported levels

From lowest to highest priority:

1. `debug`
2. `info`
3. `success`
4. `warn`
5. `error`
6. `silent`

A logger configured at `warn` ignores `debug`, `info`, and `success`.

## Design decisions

- No external dependency is required.
- The default format is stable and machine-readable enough for initial local tools.
- Output can be injected, which makes the module testable.
- Time can be injected, which makes tests deterministic.
- Child loggers preserve the parent configuration.
