# WinHacks CMS Engine v1

Flujo editorial: Draft → Publish → Release.

## Comandos

```bash
npm run draft -- --title "Título" --category seguridad
npm run cms:status
npm run publish -- --slug mi-articulo --dry-run
npm run publish -- --slug mi-articulo --force
npm run release -- --slug mi-articulo --force
```

Las acciones Git, tag y deploy son explícitas:

```bash
npm run release -- --slug mi-articulo --force --git --message "Publicar artículo"
npm run release -- --slug mi-articulo --force --git --tag v3.0.0
npm run release -- --slug mi-articulo --force --deploy
```

`publish` bloquea borradores con marcadores o checklist incompleto, salvo que se use `--force` después de una revisión manual.
