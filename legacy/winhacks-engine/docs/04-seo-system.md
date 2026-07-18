# WINHACKS SEO SYSTEM

**Versión:** 1.0.0
**Estado:** Oficial
**Última actualización:** Junio 2026
**Proyecto:** WinHacks
**Autor:** Clent Ebanks

---

# Propósito

Este documento establece el estándar SEO oficial de WinHacks.

Toda página publicada deberá seguir estas reglas.

No se deben tomar decisiones SEO individuales.

Todo seguirá este sistema.

---

# Objetivo SEO

El objetivo de WinHacks no es posicionar palabras genéricas.

El objetivo es responder búsquedas específicas relacionadas con Windows.

Ejemplo:

Incorrecto

```
Windows
```

Correcto

```
Cómo quitar las flechas de los accesos directos
```

---

# Estrategia General

Cada artículo debe responder una intención de búsqueda.

Nunca escribir contenido únicamente para generar visitas.

Cada artículo debe resolver un problema.

---

# Dominio Oficial

```
https://winhacks.dev
```

Siempre HTTPS.

Nunca utilizar URLs relativas en:

* Open Graph
* Twitter Cards
* Canonical

---

# URLs

Formato oficial

```
https://winhacks.dev/categoria/nombre-del-articulo
```

Ejemplo

```
https://winhacks.dev/personalizacion/quitar-flechas-accesos-directos
```

---

# Naming Convention

Siempre

* minúsculas
* guiones
* sin acentos
* sin espacios
* sin caracteres especiales

Correcto

```
quitar-flechas-accesos-directos
```

Incorrecto

```
QuitarFlechas
```

---

# Título SEO

Máximo

60 caracteres.

Debe contener

* palabra clave
* beneficio
* marca

Ejemplo

```
Cómo quitar las flechas de los accesos directos | WinHacks
```

---

# Meta Description

Longitud

150–160 caracteres.

Debe responder

* Qué aprenderá.
* En qué sistema funciona.
* Beneficio principal.

Nunca usar descripciones genéricas.

---

# H1

Solo uno por página.

Debe parecerse al Title pero no ser necesariamente idéntico.

---

# Encabezados

Orden obligatorio

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

# Palabra clave principal

Cada página tendrá

Una sola palabra clave principal.

Ejemplo

```
quitar flechas accesos directos
```

---

# Palabras clave secundarias

Entre tres y ocho.

Ejemplo

```
Windows 11

Windows 10

Registro

Shell Icons

blank.ico
```

---

# URL Canónica

Obligatoria.

Ejemplo

```html
<link rel="canonical"
href="https://winhacks.dev/personalizacion/quitar-flechas-accesos-directos">
```

---

# Robots

Por defecto

```html
<meta name="robots"
content="index,follow">
```

---

# Open Graph

Obligatorio.

Siempre incluir

* og:title
* og:description
* og:type
* og:image
* og:url
* og:site_name

---

# Twitter Cards

Siempre

```
summary_large_image
```

---

# Imagen Open Graph

Tamaño oficial

```
1200 x 630 px
```

Formato

WebP o JPG.

Una imagen por artículo.

---

# Thumbnail

Cada artículo tendrá una miniatura propia.

Debe coincidir visualmente con el Short de YouTube.

---

# Imágenes

Cada imagen debe incluir

```
alt
```

descriptivo.

Ejemplo

```
alt="Editor del Registro mostrando la clave Shell Icons"
```

Nunca usar

```
imagen1
```

---

# Nombre de imágenes

Correcto

```
shell-icons-regedit.webp
```

Incorrecto

```
IMG1234.jpg
```

---

# Schema.org

Todos los artículos incluirán

Article

---

Cuando exista un FAQ

FAQPage

---

Cuando exista un video

VideoObject

---

El sitio incluirá

Organization

WebSite

BreadcrumbList

---

# Breadcrumb

Formato

```
Inicio

>

Categoría

>

Artículo
```

Debe existir visualmente y en Schema.org.

---

# Enlaces Internos

Cada artículo debe enlazar

* cuatro artículos relacionados
* una categoría
* Academy
* un recurso gratuito

Nunca dejar artículos aislados.

---

# Enlaces Externos

Solo cuando aporten valor.

Prioridad

* Microsoft
* GitHub
* Documentación oficial
* WinHacks Academy

---

# Video

Todo artículo tendrá

Short incrustado.

El vídeo debe aparecer antes del tutorial.

---

# CTA

Todo artículo tendrá

Una llamada a la acción.

Ejemplo

```
Descarga la guía gratuita.
```

---

# PDF

Todo artículo importante debe enlazar un recurso descargable.

---

# Tiempo de Permanencia

Cada artículo debe incluir

* vídeo
* imágenes
* tutorial
* FAQ
* relacionados

Con el objetivo de aumentar el tiempo de lectura.

---

# Densidad de Palabras Clave

No forzar repeticiones.

Escribir para personas.

Después optimizar.

---

# Longitud

Artículo normal

1000–1800 palabras.

Artículo pilar

2000–3500 palabras.

---

# Categorías

Cada artículo pertenece únicamente a una categoría principal.

---

# Etiquetas

Evitar exceso de etiquetas.

Priorizar categorías.

---

# Sitemap

Todo contenido indexable debe aparecer en

```
sitemap.xml
```

---

# Robots.txt

Debe permitir indexación.

Bloquear únicamente recursos privados.

---

# Rendimiento

Objetivos

LCP

Menor de 2.5 segundos.

CLS

Menor de 0.1

INP

Menor de 200 ms

---

# Optimización de Imágenes

Siempre

Lazy Loading

Compresión

WebP cuando sea posible.

---

# Mobile SEO

Todo artículo debe revisarse primero en móvil.

---

# Accesibilidad

Toda imagen

ALT

Todo enlace

Texto descriptivo

Todo botón

ARIA cuando corresponda

---

# SEO para YouTube

Cada artículo relacionado con un Short debe incluir

* Video incrustado
* Enlace al canal
* Enlace al Short

---

# SEO para IA

El contenido debe responder preguntas de forma clara.

Utilizar

* listas
* tablas
* FAQ
* definiciones

Facilita la comprensión por motores de búsqueda y asistentes de IA.

---

# Checklist SEO

Antes de publicar verificar

✔ Title

✔ Meta Description

✔ Canonical

✔ Robots

✔ Open Graph

✔ Twitter Cards

✔ Schema.org

✔ Breadcrumb

✔ H1

✔ H2

✔ FAQ

✔ Video

✔ Imágenes

✔ ALT

✔ Enlaces internos

✔ CTA

✔ PDF

✔ Academy

✔ Sitemap

✔ Mobile

---

# Lo que nunca haremos

❌ Keyword stuffing.

❌ Contenido duplicado.

❌ Títulos engañosos.

❌ URLs largas.

❌ Imágenes sin ALT.

❌ Publicar sin Schema.

❌ Publicar sin Canonical.

---

# Principio SEO de WinHacks

No escribimos para algoritmos.

Escribimos para resolver problemas reales de usuarios de Windows.

Cuando el contenido aporta valor auténtico y está bien estructurado, el SEO es una consecuencia del sistema, no el objetivo principal.

---

# Control de Versiones

## v1.0.0

* Estándar SEO oficial.
* Convenciones de URLs.
* Metadatos.
* Schema.org.
* Open Graph.
* Twitter Cards.
* Optimización móvil.
* Enlazado interno.
* Checklist SEO.
