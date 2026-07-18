# Development Workflow

## Start a task

```bash
git switch main
git pull
git switch -c feat/short-task-name
```

## Validate during development

```bash
npm run doctor
npm run check
npm test
```

## Commit

```bash
git add .
git commit -m "feat(cli): add environment doctor"
```

## Finish

Push the branch and open a pull request. Explain the problem, the chosen solution, and validation performed.
