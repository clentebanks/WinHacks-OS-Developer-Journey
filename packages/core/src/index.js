export const PROJECT_NAME = "WinHacks OS Developer Journey";
export const PROJECT_VERSION = "0.4.0";

export function createResult(ok, value, error = null) {
  return Object.freeze({ ok, value, error });
}
