# PC Rescue Kit App v3

## Nuevo diagnóstico

Esta versión agrega el flujo completo:

```text
Sin Internet
```

Incluye:

- Configuración IP
- Ping
- DNS
- Limpieza DNS
- Liberar y renovar IP
- Pathping
- Cuatro reglas de decisión
- Cuatro validaciones finales

## Después de reemplazar la carpeta

```powershell
npm run knowledge:validate
npm run knowledge:index
npx serve .
```

Abre:

```text
http://localhost:3000/pc-rescue-kit/app/
```

## Totales esperados

- Procedures: 14
- Symptoms: 2
- Questions: 2
- Rules: 8
- Validations: 8
- Total: 34
