# WHPRS Decision Engine

Copia la carpeta `pc-rescue-kit` sobre la existente.

Agrega a `package.json`:

```json
"decision:test": "node pc-rescue-kit/scripts/test-decision-engine.js"
```

Ejecuta:

```powershell
npm run knowledge:validate
npm run knowledge:index
npm run decision:test
```

Resultado esperado:

```text
Estado: plan-generated
1. WHPRS-DIA-001 — Información completa del sistema
2. WHPRS-REP-003 — Comprobación y reparación del disco con CHKDSK
3. VAL-PERF-001 — Validar reducción del uso del disco
```
