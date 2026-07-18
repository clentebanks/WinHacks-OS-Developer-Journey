# WinHacks Content Pipeline v1

Genera un paquete editorial completo a partir de una idea del AI Content Planner o de un título manual.

## Comandos

```bash
npm run content
npm run content -- --idea 3
npm run content -- --title "Cambiar DNS en Windows 11" --category redes
```

Los borradores se guardan en `content/drafts/<slug>/`. El sistema nunca publica ni sobrescribe páginas de producción.
