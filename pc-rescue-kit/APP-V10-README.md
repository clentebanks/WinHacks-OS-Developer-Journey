# PC Rescue Kit App v10 — Integración y PWA

## Funciones nuevas

- Carga automática de navbar y footer compartidos de WinHacks.
- Fallback independiente si los componentes globales no están disponibles.
- PWA instalable con manifest e iconos.
- Service Worker para app shell y caché de la base de conocimiento.
- Página offline.
- Aviso de conexión perdida.
- Icono Apple Touch corregido.
- Accesibilidad: skip link, foco visible y reducción de movimiento.
- Smoke test de archivos del navegador.
- Manejo global de errores de JavaScript.

## Instalación

Reemplaza la carpeta `pc-rescue-kit` sobre la existente.

Agrega dentro de `scripts` en `package.json`:

```json
"app:test": "node pc-rescue-kit/scripts/test-browser-app.js"
```

Ejecuta:

```powershell
npm run knowledge:validate
npm run knowledge:index
npm run app:test
npx serve .
```

Abre:

```text
http://localhost:3000/pc-rescue-kit/app/
```

Para comprobar el modo offline, abre DevTools, Application, Service Workers y activa Offline después de visitar la app una vez.
