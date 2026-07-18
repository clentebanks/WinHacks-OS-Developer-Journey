# Generador automático de sitemap — WinHacks

## Archivo principal

Coloca este archivo en:

```txt
scripts/generate-sitemap.js
```

## Uso

Desde la raíz del proyecto ejecuta:

```bash
node scripts/generate-sitemap.js
```

Esto generará automáticamente:

```txt
sitemap.xml
```

en la raíz del proyecto.

## Qué hace

El generador:

- Escanea todas las páginas `.html` públicas.
- Excluye carpetas internas como `assets`, `css`, `js`, `components`, `templates`, `docs` y `engine`.
- Excluye archivos técnicos como `google*.html` y `404.html`.
- Genera URLs absolutas con `https://winhacks.dev`.
- Agrega `lastmod`, `changefreq` y `priority`.
- Evita mantener el sitemap manualmente.

## Estructura esperada

```txt
winhacks/
├── index.html
├── sitemap.xml
├── scripts/
│   └── generate-sitemap.js
├── academy/
├── comandos/
├── recursos/
├── secretos/
└── ...
```

## Recomendación

Ejecuta el generador cada vez que:

- agregues una página nueva,
- elimines una página,
- cambies nombres de archivos,
- reorganices secciones.

Después haz:

```bash
git add sitemap.xml
git commit -m "Update sitemap"
git push
```
