#!/usr/bin/env node
import { PROJECT_NAME, PROJECT_VERSION } from "../../core/src/index.js";

const command = process.argv[2] ?? "help";

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
  },
  version() {
    console.log(PROJECT_VERSION);
  },
  async doctor() {
    const { runDoctor } = await import("../../../scripts/doctor.mjs");
    const result = runDoctor();
    process.exitCode = result.ok ? 0 : 1;
  }
};

if (!(command in commands)) {
  console.error(`Unknown command: ${command}`);
  commands.help();
  process.exitCode = 1;
} else {
  await commands[command]();
}
