# WinHacks SEO Auditor v1.0

## Instalación
Copia estos archivos en la raíz del proyecto:

- `tools/seo/index.js`
- `package.json`

Luego ejecuta:

```bash
npm install
npm run seo
```

## Salida
Genera:

- `reports/seo-report.html`
- `reports/seo-report.md`
- `reports/seo-report.json`

## Qué revisa

- Titles faltantes, largos, cortos y duplicados
- Meta descriptions faltantes, largas, cortas y duplicadas
- Canonical faltantes o fuera del dominio oficial
- Robots/noindex
- H1 faltantes, múltiples o duplicados
- H2 faltantes
- Open Graph
- Twitter Cards
- JSON-LD inválido o ausente
- VideoObject cuando hay YouTube
- Imágenes sin ALT, width, height, loading o decoding
- Imágenes inexistentes
- Enlaces internos rotos
- Posibles páginas huérfanas
- max-image-preview:large para Discover

No modifica HTML, CSS, JS ni componentes. Solo genera reportes.
