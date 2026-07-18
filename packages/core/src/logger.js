const LEVELS = Object.freeze({
  debug: 10,
  info: 20,
  success: 25,
  warn: 30,
  error: 40,
  silent: Number.POSITIVE_INFINITY
});

const LABELS = Object.freeze({
  debug: "DEBUG",
  info: "INFO",
  success: "SUCCESS",
  warn: "WARN",
  error: "ERROR"
});

function normalizeLevel(level) {
  if (typeof level !== "string") {
    throw new TypeError("Logger level must be a string.");
  }

  const normalized = level.toLowerCase();

  if (!(normalized in LEVELS)) {
    throw new RangeError(
      `Unknown logger level "${level}". Valid levels: ${Object.keys(LEVELS).join(", ")}.`
    );
  }

  return normalized;
}

function normalizeMessage(message) {
  if (message instanceof Error) {
    return message.stack ?? message.message;
  }

  if (typeof message === "string") {
    return message;
  }

  try {
    return JSON.stringify(message);
  } catch {
    return String(message);
  }
}

function formatTimestamp(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError("Logger clock must return a valid Date instance.");
  }

  return date.toISOString();
}

export function createLogger(options = {}) {
  const {
    level = "info",
    namespace = null,
    timestamps = true,
    output = console,
    clock = () => new Date()
  } = options;

  const minimumLevel = normalizeLevel(level);

  if (namespace !== null && typeof namespace !== "string") {
    throw new TypeError("Logger namespace must be a string or null.");
  }

  if (
    !output ||
    typeof output.log !== "function" ||
    typeof output.warn !== "function" ||
    typeof output.error !== "function"
  ) {
    throw new TypeError("Logger output must provide log(), warn(), and error() methods.");
  }

  function shouldWrite(entryLevel) {
    return LEVELS[entryLevel] >= LEVELS[minimumLevel];
  }

  function format(entryLevel, message) {
    const parts = [];

    if (timestamps) {
      parts.push(`[${formatTimestamp(clock())}]`);
    }

    parts.push(`[${LABELS[entryLevel]}]`);

    if (namespace) {
      parts.push(`[${namespace}]`);
    }

    parts.push(normalizeMessage(message));

    return parts.join(" ");
  }

  function write(entryLevel, message) {
    if (!shouldWrite(entryLevel)) {
      return false;
    }

    const line = format(entryLevel, message);

    if (entryLevel === "error") {
      output.error(line);
    } else if (entryLevel === "warn") {
      output.warn(line);
    } else {
      output.log(line);
    }

    return true;
  }

  return Object.freeze({
    level: minimumLevel,
    namespace,
    debug: (message) => write("debug", message),
    info: (message) => write("info", message),
    success: (message) => write("success", message),
    warn: (message) => write("warn", message),
    error: (message) => write("error", message),
    child(childNamespace) {
      if (typeof childNamespace !== "string" || childNamespace.trim() === "") {
        throw new TypeError("Child logger namespace must be a non-empty string.");
      }

      return createLogger({
        level: minimumLevel,
        namespace: namespace ? `${namespace}:${childNamespace}` : childNamespace,
        timestamps,
        output,
        clock
      });
    }
  });
}

export const logger = createLogger();
