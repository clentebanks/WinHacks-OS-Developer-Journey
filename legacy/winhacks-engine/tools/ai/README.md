# WinHacks AI Content Planner

Genera un plan editorial local a partir de `reports/knowledge-graph.json`.

## Uso

```bash
npm run ai:plan
```

## Salidas

- `reports/ai-content-plan.json`
- `reports/ai-content-plan.html`
- `reports/ai-content-plan.md`
- `reports/content-calendar.csv`

No requiere una API externa. Las prioridades se calculan con el grafo de conocimiento, páginas huérfanas, entidades y oportunidades de enlazado interno.
