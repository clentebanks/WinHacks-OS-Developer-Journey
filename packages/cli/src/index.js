#!/usr/bin/env node
import {
  PROJECT_NAME,
  PROJECT_VERSION,
  createLogger
} from "../../core/src/index.js";

const command = process.argv[2] ?? "help";
const log = createLogger({
  namespace: "cli",
  timestamps: false
});

const commands = {
  help() {
    console.log(`${PROJECT_NAME} v${PROJECT_VERSION}`);
    console.log("");
    console.log("Usage: winhacks <command>");
    console.log("");
    console.log("Commands:");
    console.log("  help      Show available commands");
    console.log("  version   Show the current version");
    console.log("  doctor    Validate the local development environment");
    console.log("  demo-log  Demonstrate the core logger");
  },
  version() {
    console.log(PROJECT_VERSION);
  },
  async doctor() {
    const { runDoctor } = await import("../../../scripts/doctor.mjs");
    const result = runDoctor();
    process.exitCode = result.ok ? 0 : 1;
  },
  "demo-log"() {
    log.debug("Debug message hidden at the default info level");
    log.info("WinHacks OS started");
    log.success("Logger module is working");
    log.warn("This is a warning example");
    log.error("This is an error example");
  }
};

if (!(command in commands)) {
  console.error(`Unknown command: ${command}`);
  commands.help();
  process.exitCode = 1;
} else {
  await commands[command]();
}
