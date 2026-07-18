# WHKB Validator

1. Copia la carpeta `pc-rescue-kit` en la raíz del proyecto.
2. Ejecuta:

```powershell
npm install ajv ajv-formats
```

3. Agrega a `package.json`:

```json
"knowledge:validate": "node pc-rescue-kit/scripts/validate-knowledge.js"
```

4. Ejecuta:

```powershell
npm run knowledge:validate
```
