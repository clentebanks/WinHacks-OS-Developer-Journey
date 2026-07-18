import test from "node:test";
import assert from "node:assert/strict";
import { createResult, PROJECT_VERSION } from "../packages/core/src/index.js";

test("project version follows semantic version format", () => {
  assert.match(PROJECT_VERSION, /^\d+\.\d+\.\d+$/);
});

test("createResult returns an immutable result", () => {
  const result = createResult(true, { value: 42 });
  assert.equal(result.ok, true);
  assert.equal(result.value.value, 42);
  assert.equal(Object.isFrozen(result), true);
});
