# WinHacks Article Generator

Crea un artículo nuevo con la plantilla oficial de WinHacks.

## Uso interactivo

```powershell
npm run article
```

La herramienta pregunta por título, categoría, slug, descripción SEO, introducción, video, dificultad, duración y riesgo.

## Uso con parámetros

```powershell
npm run article -- --title "Cómo ver la clave WiFi en Windows 11" --category redes --description "Aprende a ver la contraseña WiFi guardada en Windows 11 con comandos integrados y pasos seguros." --intro "En esta guía aprenderás a recuperar una clave WiFi guardada sin instalar programas." --video "https://youtube.com/shorts/XXXXXXXXXXX" --yes
```

## Seguridad

No reemplaza un artículo existente. Para hacerlo intencionalmente, agrega `--force`.

## Resultado

- Página HTML en `<categoria>/<slug>.html`
- Carpeta de capturas en `assets/images/articulos/<slug>/`
