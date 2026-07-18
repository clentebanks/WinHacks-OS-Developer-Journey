# Lab 01: Core Logger

## Outcome

Understand and verify the first reusable WinHacks OS core service.

## Run

```powershell
npm install
npm run check
npm test
npm run test:logger
npm run dev:cli -- demo-log
```

## Expected CLI demonstration

```text
[INFO] [cli] WinHacks OS started
[SUCCESS] [cli] Logger module is working
[WARN] [cli] This is a warning example
[ERROR] [cli] This is an error example
```

The debug message is intentionally hidden because the default minimum level is `info`.

## Exercises

1. Open `packages/core/src/logger.js`.
2. Change the CLI logger level temporarily to `debug`.
3. Run `npm run dev:cli -- demo-log`.
4. Confirm the debug message appears.
5. Restore the level to its original value.
6. Run the tests again.

## Completion criteria

- [ ] All tests pass.
- [ ] The CLI displays info, success, warning, and error messages.
- [ ] You can explain why the debug message is hidden.
- [ ] You can identify where output routing occurs.
