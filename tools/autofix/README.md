# WinHacks Auto Fix Engine v1

Correcciones conservadoras y determinísticas para HTML.

## Vista previa

```bash
npm run autofix
```

No modifica páginas. Genera reportes en `reports/autofix-report.*`.

## Aplicar

```bash
npm run autofix:apply
```

Antes de modificar cada archivo crea un respaldo en `backups/autofix/<fecha>/`.

## Reglas v1

- Canonical faltante.
- `max-image-preview:large` en robots.
- `og:locale` faltante.
- `twitter:card` faltante.
- `loading="lazy"` en imágenes no prioritarias.
- `decoding="async"` en imágenes.
- `rel="noopener noreferrer"` en enlaces externos con `target="_blank"`.

No reescribe títulos, descripciones, contenido ni JSON-LD porque esas correcciones requieren revisión editorial.
