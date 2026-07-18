import test from "node:test";
import assert from "node:assert/strict";
import { createLogger } from "../src/logger.js";

function createOutputSpy() {
  const entries = [];

  return {
    entries,
    output: {
      log: (message) => entries.push({ method: "log", message }),
      warn: (message) => entries.push({ method: "warn", message }),
      error: (message) => entries.push({ method: "error", message })
    }
  };
}

const fixedClock = () => new Date("2026-07-18T15:30:00.000Z");

test("writes a formatted info message", () => {
  const spy = createOutputSpy();
  const log = createLogger({
    output: spy.output,
    clock: fixedClock
  });

  const written = log.info("Build started");

  assert.equal(written, true);
  assert.deepEqual(spy.entries, [
    {
      method: "log",
      message: "[2026-07-18T15:30:00.000Z] [INFO] Build started"
    }
  ]);
});

test("routes warn and error messages to their matching output methods", () => {
  const spy = createOutputSpy();
  const log = createLogger({
    output: spy.output,
    clock: fixedClock
  });

  log.warn("Missing metadata");
  log.error("Unable to read config");

  assert.deepEqual(
    spy.entries.map((entry) => entry.method),
    ["warn", "error"]
  );
});

test("filters messages below the configured level", () => {
  const spy = createOutputSpy();
  const log = createLogger({
    level: "warn",
    output: spy.output,
    clock: fixedClock
  });

  assert.equal(log.debug("Hidden"), false);
  assert.equal(log.info("Hidden"), false);
  assert.equal(log.success("Hidden"), false);
  assert.equal(log.warn("Visible"), true);

  assert.equal(spy.entries.length, 1);
  assert.match(spy.entries[0].message, /\[WARN\] Visible$/);
});

test("supports namespaces and child loggers", () => {
  const spy = createOutputSpy();
  const rootLogger = createLogger({
    namespace: "core",
    output: spy.output,
    clock: fixedClock
  });

  rootLogger.child("rss").success("Feed generated");

  assert.equal(
    spy.entries[0].message,
    "[2026-07-18T15:30:00.000Z] [SUCCESS] [core:rss] Feed generated"
  );
});

test("serializes objects and Error instances", () => {
  const spy = createOutputSpy();
  const log = createLogger({
    timestamps: false,
    output: spy.output
  });

  log.info({ files: 3 });
  log.error(new Error("Disk failure"));

  assert.equal(spy.entries[0].message, '[INFO] {"files":3}');
  assert.match(spy.entries[1].message, /\[ERROR\] Error: Disk failure/);
});

test("rejects invalid configuration", () => {
  assert.throws(() => createLogger({ level: "verbose" }), /Unknown logger level/);
  assert.throws(() => createLogger({ namespace: 42 }), /namespace/);
  assert.throws(() => createLogger({ output: {} }), /output/);
});
