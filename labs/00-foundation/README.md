# Lab 00: Repository Foundation

## Outcome

Run the repository checks locally and create the first commit in the new GitHub repository.

## Steps

1. Extract the project into an empty folder.
2. Open the folder in Visual Studio Code.
3. Open the integrated terminal.
4. Run:

```bash
node --version
npm --version
npm install
npm run doctor
npm run check
npm test
npm run dev:cli -- help
```

5. Confirm every required check passes.
6. Create the repository on GitHub without adding another README or license.
7. Initialize and push:

```bash
git init
git branch -M main
git add .
git commit -m "chore: establish WinHacks OS foundation"
git remote add origin <YOUR-REPOSITORY-URL>
git push -u origin main
```

## Evidence

Record:

- Node.js version;
- npm version;
- check result;
- test result;
- GitHub repository URL;
- commit hash.

## Completion criteria

- [ ] `npm run doctor` passes.
- [ ] `npm run check` passes.
- [ ] `npm test` passes.
- [ ] CLI help is displayed.
- [ ] Initial commit is pushed.
