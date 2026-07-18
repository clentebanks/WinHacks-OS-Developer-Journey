# WINHACKS CODING STANDARDS

**Versión:** 1.0.0
**Estado:** Oficial
**Última actualización:** Junio 2026
**Proyecto:** WinHacks
**Autor:** Clent Ebanks

---

# Propósito

Este documento define los estándares oficiales de programación para el proyecto WinHacks.

Todo archivo HTML, CSS y JavaScript debe cumplir estas reglas.

El objetivo es mantener un código:

* Limpio
* Reutilizable
* Escalable
* Fácil de mantener
* Consistente

---

# Filosofía

El código debe escribirse para que otra persona pueda entenderlo fácilmente.

Se prioriza:

* Legibilidad.
* Simplicidad.
* Mantenimiento.
* Reutilización.

No se escribe código "ingenioso".

Se escribe código claro.

---

# Estándares Generales

Siempre utilizar:

* HTML5 semántico.
* CSS reutilizable.
* JavaScript modular.
* Componentes reutilizables.

Nunca duplicar código.

---

# HTML

Siempre utilizar etiquetas semánticas.

Correcto

```html
<header>

<nav>

<main>

<article>

<section>

<footer>
```

Incorrecto

```html
<div id="header">

<div id="menu">

<div id="content">
```

---

# Estructura HTML

Orden oficial.

```text
DOCTYPE

↓

html

↓

head

↓

body

↓

header

↓

main

↓

footer

↓

scripts
```

Nunca modificar este orden.

---

# HEAD

Toda página debe contener.

* charset
* viewport
* title
* description
* canonical
* robots
* Open Graph
* Twitter Cards
* favicon
* Google Fonts
* style.css
* script.js

---

# H1

Solo un H1 por página.

---

# Encabezados

Siempre respetar.

```
H1

↓

H2

↓

H3

↓

H4
```

Nunca saltar niveles.

---

# Sangría

Utilizar

2 espacios

Nunca tabs.

---

# Longitud de línea

Preferencia

120 caracteres máximo.

---

# Comentarios

Solo para separar bloques importantes.

Ejemplo.

```html
<!-- HERO -->

<!-- TUTORIAL -->

<!-- FAQ -->

<!-- FOOTER -->
```

Nunca comentar código obsoleto.

Eliminarlo.

---

# CSS

Todo el proyecto utiliza:

```
style.css
```

No crear hojas de estilo específicas por artículo.

---

# Variables CSS

Todos los colores, radios y espaciados deben definirse mediante variables CSS.

Nunca repetir valores.

---

# Clases CSS

Siempre descriptivas.

Correcto

```css
.article-hero

.warning-box

.command-box

.related-grid
```

Incorrecto

```css
.box1

.item2

.blue
```

---

# IDs

No utilizar IDs para estilos.

Los IDs se reservan para:

* JavaScript.
* Formularios.
* Accesibilidad.

---

# Estilos Inline

Prohibidos.

Incorrecto

```html
<div style="color:red">
```

Correcto

```html
<div class="warning-box">
```

---

# JavaScript

Todo JavaScript global se almacena en:

```
script.js
```

Los componentes reutilizables en:

```
components.js
```

---

# Organización JS

Las funciones deben ser pequeñas.

Una responsabilidad por función.

---

# Nombres de funciones

Utilizar camelCase.

Correcto

```javascript
loadComponent()

initializeMenu()

copyCommand()

highlightActiveLink()
```

Incorrecto

```javascript
funcion1()

TEST()

abc()
```

---

# Variables

Utilizar nombres descriptivos.

Correcto

```javascript
menuToggle

articleContainer

copyButton
```

Incorrecto

```javascript
x

a

temp1
```

---

# Constantes

Siempre utilizar

const

cuando el valor no cambie.

Utilizar

let

solo cuando sea necesario.

Evitar

var

---

# Eventos

Preferir

addEventListener()

Nunca utilizar

onclick

inline.

Incorrecto

```html
<button onclick="copiar()">
```

Correcto

```javascript
button.addEventListener("click", copyCommand);
```

---

# Componentes

Toda funcionalidad reutilizable debe convertirse en componente.

Nunca copiar el mismo bloque HTML varias veces.

---

# Imágenes

Siempre utilizar.

loading="lazy"

cuando sea posible.

Siempre definir.

alt

---

# Rutas

Preferir rutas absolutas para recursos compartidos.

Ejemplo

```html
/js/script.js

/css/style.css

/components/navbar.html
```

Utilizar rutas relativas únicamente cuando sea necesario.

---

# Nombres de archivos

Siempre.

* minúsculas.
* guiones.
* sin espacios.
* sin acentos.

Correcto

```
quitar-flechas-accesos-directos.html
```

Incorrecto

```
QuitarFlechas.html
```

---

# Archivos CSS

No crear.

```
articulo.css

pagina.css

nuevo.css
```

Todo se centraliza.

---

# Archivos JS

No crear un archivo por artículo.

Centralizar funciones reutilizables.

---

# Reutilización

Antes de escribir código preguntar.

¿Ya existe?

Si existe.

Reutilizar.

---

# Accesibilidad

Todo botón debe tener.

aria-label

cuando no exista texto visible.

Toda imagen.

alt.

Todo formulario.

label.

---

# Rendimiento

Siempre.

defer

en scripts.

Lazy Loading.

Compresión de imágenes.

Evitar JavaScript innecesario.

---

# Seguridad

Nunca utilizar.

innerHTML

si el contenido proviene del usuario.

Validar entradas de formularios.

No confiar únicamente en JavaScript.

---

# Formularios

Todos utilizan.

Netlify Forms.

Nunca duplicar la lógica.

---

# Responsive

Todo cambio debe probarse en.

* móvil.
* tablet.
* escritorio.

---

# Compatibilidad

Compatible con.

* Chrome.
* Edge.
* Firefox.

---

# Git (Preparado para futuro)

Commits descriptivos.

Ejemplos.

```
feat: agregar artículo de arp -a

fix: corregir menú móvil

docs: actualizar design system

refactor: mejorar component library
```

---

# Documentación

Todo cambio importante debe actualizar.

* Changelog.
* Design System.
* Component Library.

Si aplica.

---

# Código Prohibido

❌ Estilos inline.

❌ Código duplicado.

❌ Funciones gigantes.

❌ Variables sin significado.

❌ Archivos temporales.

❌ Código comentado sin uso.

❌ Clases CSS duplicadas.

---

# Checklist

Antes de publicar revisar.

✔ HTML válido.

✔ CSS reutilizable.

✔ JavaScript modular.

✔ Responsive.

✔ Accesibilidad.

✔ SEO.

✔ Componentes oficiales.

✔ Sin estilos inline.

✔ Sin código duplicado.

✔ Sin archivos innecesarios.

---

# Principio Fundamental

En WinHacks el código debe ser tan consistente como el contenido.

Cada nueva página debe parecer escrita por el mismo desarrollador, aunque el proyecto crezca durante años.

La mantenibilidad tiene prioridad sobre la rapidez.

---

# Control de Versiones

## v1.0.0

* Estándares HTML.
* Estándares CSS.
* Estándares JavaScript.
* Convenciones de nombres.
* Accesibilidad.
* Rendimiento.
* Seguridad.
* Checklist de calidad.

