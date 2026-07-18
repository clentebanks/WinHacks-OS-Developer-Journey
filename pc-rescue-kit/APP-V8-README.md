# PC Rescue Kit App v8 — Session Manager v2

## Funciones nuevas

- Historial local de hasta 50 sesiones.
- Continuar diagnósticos pendientes.
- Consultar expedientes finalizados.
- Eliminar una sesión o todo el historial.
- Reporte técnico completo.
- Copiar resumen técnico.
- Imprimir o guardar el reporte como PDF.
- Registro de duración, evidencia, reglas y pasos.
- WinHacks Health Score calculado al finalizar.

## Instalación

Reemplaza la carpeta `pc-rescue-kit` sobre la existente y ejecuta:

```powershell
npm run knowledge:validate
npm run knowledge:index
npx serve .
```

Abre:

```text
http://localhost:3000/pc-rescue-kit/app/
```

Los expedientes se guardan en `localStorage` dentro del navegador.
