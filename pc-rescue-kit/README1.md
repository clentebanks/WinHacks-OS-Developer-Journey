# WHPRS Knowledge Loader + Indexer

Agrega a `package.json` dentro de `scripts`:

```json
"knowledge:index": "node pc-rescue-kit/scripts/build-index.js",
"knowledge:test": "node pc-rescue-kit/scripts/test-knowledge-engine.js"
```

Ejecuta:

```powershell
npm run knowledge:validate
npm run knowledge:index
npm run knowledge:test
```
