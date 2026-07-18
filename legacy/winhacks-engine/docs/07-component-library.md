# WINHACKS COMPONENT LIBRARY

**Versión:** 1.0.0
**Estado:** Oficial
**Última actualización:** Junio 2026
**Proyecto:** WinHacks
**Autor:** Clent Ebanks

---

# Propósito

Este documento define la biblioteca oficial de componentes HTML reutilizables de WinHacks.

Todos los artículos, páginas, categorías, recursos y futuras herramientas deben construirse utilizando exclusivamente estos componentes.

No se deben crear componentes nuevos si uno existente cumple la misma función.

---

# Filosofía

Cada componente debe ser:

* Reutilizable.
* Independiente.
* Consistente.
* Responsive.
* Fácil de mantener.
* Fácil de identificar.

El objetivo es que cualquier página del proyecto pueda construirse únicamente ensamblando componentes.

---

# Convención

Todos los componentes utilizan clases CSS.

Nunca estilos inline.

Nunca IDs para estilos.

---

# Estructura Oficial

```
Navbar

↓

Breadcrumb

↓

Hero

↓

Meta Cards

↓

Video

↓

Info

↓

Warning

↓

Tip

↓

Did You Know

↓

Command

↓

Step

↓

Result

↓

FAQ

↓

CTA

↓

Related

↓

Academy

↓

Footer
```

---

# COMPONENTES GLOBALES

## Navbar

Clase

```
navbar
```

Propósito

Navegación principal.

Siempre cargado mediante

components.js

Nunca duplicar código.

---

## Footer

Clase

```
site-footer
```

Propósito

Pie de página global.

Siempre reutilizable.

---

## Breadcrumb

Clase

```
breadcrumb
```

Uso

Mostrar ubicación actual.

Ejemplo

```
Inicio

>

Personalización

>

Quitar flechas
```

Siempre encima del Hero.

---

# HERO

Clase

```
article-hero
```

Debe contener

* Eyebrow
* H1
* Descripción
* Botones

Nunca agregar tablas.

Nunca agregar imágenes enormes.

---

# EYEBROW

Clase

```
eyebrow
```

Uso

Mostrar categoría.

Ejemplo

```
Personalización
```

---

# BOTONES

## Primario

```
btn btn-primary
```

Color

Azul.

Uso

CTA principal.

---

## Outline

```
btn btn-outline
```

Uso

Acciones secundarias.

---

## Copiar

```
copy-btn
```

Uso

Botón para copiar comandos.

Siempre acompañado por

command-box.

---

# META GRID

Clase

```
meta-grid
```

Debe contener

cuatro

meta-card.

---

# META CARD

Clase

```
meta-card
```

Ejemplo

```
Dificultad

Tiempo

Compatible

Riesgo
```

---

# VIDEO

Clase

```
video-box
```

Debe contener

* título
* descripción
* iframe de YouTube

Formato

9:16

Nunca horizontal.

---

# YOUTUBE SHORT

Clase

```
youtube-short
```

Uso

Contenedor del iframe.

---

# INFO BOX

Clase

```
info-box
```

Color

Azul.

Uso

Explicar conceptos.

---

# WARNING BOX

Clase

```
warning-box
```

Color

Amarillo.

Uso

Advertencias.

Nunca usar para consejos.

---

# TIP BOX

Clase

```
tip-box
```

Color

Verde.

Uso

Consejos prácticos.

---

# PRO TIP BOX

Clase

```
pro-tip-box
```

Uso

Consejos avanzados.

No utilizar en artículos básicos.

---

# DID YOU KNOW

Clase

```
did-you-know-box
```

Uso

Curiosidades.

Datos históricos.

Información adicional.

---

# COMMAND BOX

Clase

```
command-box
```

Debe contener

```
<code>

Botón Copiar
```

Nunca mostrar comandos fuera de este componente.

---

# STEP BOX

Clase

```
step-box
```

Debe contener

Número

↓

Título

↓

Descripción

↓

Captura

↓

Comando (si aplica)

---

# STEP NUMBER

Clase

```
step-number
```

Nunca usar texto manual.

Siempre componente.

---

# SCREENSHOT

Clase

```
screenshot
```

Uso

Capturas oficiales.

---

## Placeholder

Clase

```
screenshot-placeholder
```

Solo durante desarrollo.

Debe desaparecer antes de producción.

---

# RESULT BOX

Clase

```
result-box
```

Color

Verde.

Uso

Mostrar resultado esperado.

---

# FAQ BOX

Clase

```
faq-box
```

Debe contener

Pregunta

↓

Respuesta

Compatible con

Schema FAQ.

---

# CTA SECTION

Clase

```
cta-section
```

Uso

Formulario.

PDF.

Newsletter.

Academy.

---

# RELATED GRID

Clase

```
related-grid
```

Debe contener

cuatro

related-card.

Nunca menos.

---

# RELATED CARD

Clase

```
related-card
```

Debe contener

Título

↓

Descripción

↓

Enlace

---

# ACADEMY BOX

Clase

```
next-box
```

Uso

Promocionar Academy.

Siempre último bloque antes del Footer.

---

# FORMULARIOS

Clase

```
email-form
```

Siempre

Netlify Forms.

---

# INPUT

Clase

```
form-control
```

Todos los campos utilizan el mismo estilo.

---

# TARJETAS

Clase

```
card
```

Debe contener

Icono

↓

Título

↓

Descripción

↓

Botón

---

# GRID

Clase

```
grid
```

Nunca crear grids diferentes.

---

# SECTION

Clase

```
section
```

Todas las secciones utilizan esta clase.

---

# SECTION HEADER

Clase

```
section-header
```

Debe contener

Eyebrow

↓

Título

↓

Descripción

---

# ICONOS

Todos los iconos utilizan

Font Awesome.

Nunca mezclar librerías.

---

# COMPONENTES DE CATEGORÍA

Toda página de categoría utiliza

```
Hero

↓

Section Header

↓

Grid

↓

Cards

↓

CTA

↓

Footer
```

---

# COMPONENTES DE ARTÍCULO

Todo artículo utiliza

```
Hero

↓

Meta

↓

Video

↓

Qué aprenderás

↓

Tutorial

↓

Resultado

↓

FAQ

↓

Relacionados

↓

Academy
```

Nunca modificar este orden.

---

# COMPONENTES DE RECURSOS

Todo recurso utiliza

```
Hero

↓

Beneficios

↓

Formulario

↓

Descarga

↓

FAQ
```

---

# COMPONENTES PROHIBIDOS

No crear

* hero alternativos
* botones distintos
* tarjetas distintas
* grids distintos
* formularios distintos

Todo debe reutilizar los componentes oficiales.

---

# Reglas de reutilización

Si un componente ya existe:

✔ reutilizar.

No duplicar.

No copiar.

No renombrar.

---

# Reglas CSS

Cada componente tiene:

Una clase.

Un comportamiento.

Una apariencia.

Nunca sobrescribir estilos dentro del HTML.

Todo cambio visual debe realizarse en

style.css

---

# Convención HTML

Correcto

```html
<div class="warning-box">
```

Incorrecto

```html
<div style="background:red">
```

---

# Versionado

Todo nuevo componente requiere:

Actualizar

```
07-component-library.md
```

Actualizar

```
style.css
```

Actualizar

```
article-template.html
```

Si corresponde.

---

# Checklist

Antes de crear una página verificar.

✔ Solo usa componentes oficiales.

✔ No inventa nuevas clases.

✔ No utiliza estilos inline.

✔ Mantiene el orden oficial.

✔ Funciona en móvil.

✔ Funciona en escritorio.

✔ Mantiene coherencia visual.

---

# Principio Fundamental

En WinHacks no diseñamos páginas.

Construimos páginas ensamblando componentes oficiales.

Esto garantiza coherencia, mantenimiento sencillo y escalabilidad para cientos de artículos.

---

# Control de Versiones

## v1.0.0

* Biblioteca oficial de componentes.
* Convenciones HTML.
* Componentes globales.
* Componentes de artículos.
* Componentes de categorías.
* Componentes de recursos.
* Reglas de reutilización.
* Checklist de implementación.
