# WHPRS Session Engine

Reemplaza la carpeta `pc-rescue-kit` sobre la existente.

Agrega a `package.json`:

```json
"session:test": "node pc-rescue-kit/scripts/test-session-engine.js"
```

Ejecuta:

```powershell
npm run knowledge:validate
npm run knowledge:index
npm run session:test
```

La prueba generará una sesión dentro de:

```text
pc-rescue-kit/sessions/
```
