# WINHACKS DESIGN SYSTEM

**Versión:** 1.0.0
**Estado:** Oficial
**Última actualización:** Junio 2026
**Proyecto:** WinHacks
**Autor:** Clent Ebanks

---

# Propósito

Este documento define el sistema de diseño oficial de WinHacks.

Todo componente visual del sitio web debe seguir estas reglas.

No se deben crear nuevos estilos si ya existe un componente equivalente.

---

# Filosofía del Diseño

WinHacks debe transmitir:

* Tecnología
* Profesionalismo
* Simplicidad
* Claridad
* Confianza

El diseño debe recordar a:

* Windows 11
* Microsoft Learn
* Visual Studio Code
* GitHub Docs

El contenido siempre es el protagonista.

---

# Principios del Diseño

## Consistencia

Todo debe verse igual.

Nunca crear variantes innecesarias.

---

## Reutilización

Todo componente debe poder reutilizarse.

---

## Escalabilidad

El sistema debe permitir cientos de artículos sin modificar el diseño.

---

## Accesibilidad

Todo elemento debe ser legible.

---

## Mobile First

Todo diseño debe verse primero en móvil.

Después en escritorio.

---

# Sistema de Colores

## Fondo principal

```css
#070B12
```

---

## Fondo secundario

```css
#111827
```

---

## Cards

```css
#0F172A
```

---

## Azul principal

```css
#0078D4
```

Botones principales.

Links.

Elementos activos.

---

## Cian

```css
#00C2FF
```

Detalles.

Iconos.

Resaltados.

---

## Verde

```css
#00FF88
```

Éxito.

Comandos.

Resultados.

---

## Amarillo

```css
#FFD54A
```

Advertencias.

---

## Rojo

```css
#FF3B3B
```

Errores.

Alertas.

---

## Blanco

```css
#F5F5F5
```

Texto principal.

---

## Gris

```css
#A1A1AA
```

Texto secundario.

---

# Tipografía

## Títulos

Montserrat ExtraBold

Peso

800-900

---

## Texto

Inter

400

500

600

---

## Código

Consolas

---

# Espaciado

Nunca utilizar valores aleatorios.

Espaciado oficial.

```text
4 px

8 px

12 px

16 px

24 px

32 px

48 px

64 px
```

---

# Contenedor

Ancho máximo

1200 px

Padding

24 px

---

# Grid

Cards

2 columnas móvil

3 columnas tablet

4 columnas escritorio

---

# Botones

Solo existen tres.

---

## Botón Primario

Color

Azul

Uso

CTA principal.

---

## Botón Outline

Fondo transparente.

Borde azul.

---

## Botón Copiar

Verde.

Solo para comandos.

---

# Navbar

Siempre:

Logo izquierda.

Menú centro.

CTA derecha.

Responsive.

Hamburguesa en móvil.

Nunca modificar su estructura.

---

# Footer

Siempre dividido en:

WinHacks

Categorías

Recursos

Academy

Legal

Redes sociales

Copyright

---

# Hero

Todo Hero oficial debe contener.

Eyebrow

H1

Descripción

Botones

Nunca agregar imágenes enormes en el Hero.

---

# Breadcrumb

Formato oficial.

```
Inicio

>

Categoría

>

Artículo
```

Siempre arriba del Hero.

---

# Meta Cards

Siempre cuatro.

Ejemplo.

```
Dificultad

Tiempo

Compatible

Riesgo
```

---

# Video

Todos los artículos deben incluir.

Video de YouTube Shorts.

Formato vertical.

Radio 22 px.

---

# Componentes Oficiales

## info-box

Explica conceptos.

---

## warning-box

Advertencias.

---

## tip-box

Consejos.

---

## pro-tip-box

Consejos avanzados.

---

## did-you-know-box

Curiosidades.

---

## command-box

Comandos.

Siempre incluye botón copiar.

---

## step-box

Pasos numerados.

---

## result-box

Resultado esperado.

---

## faq-box

Preguntas frecuentes.

---

## related-card

Artículos relacionados.

---

## academy-box

Promoción de WinHacks Academy.

---

## video-box

Short incrustado.

---

## screenshot-placeholder

Marcador temporal para capturas.

---

# Formularios

Todos los formularios utilizarán:

Netlify Forms.

Mismo estilo.

Mismos botones.

Mismos campos.

---

# Tarjetas

Toda card oficial contiene.

Icono.

Título.

Descripción.

Botón.

Nunca agregar más elementos.

---

# Iconografía

Font Awesome.

Nunca mezclar librerías.

---

# Animaciones

Permitidas.

Hover.

Fade.

Translate.

Scale.

No usar animaciones excesivas.

---

# Sombras

Todas las sombras deben ser suaves.

Nunca utilizar sombras negras intensas.

---

# Bordes

Radio oficial.

```
12 px

16 px

18 px

22 px
```

---

# Responsive

Breakpoints oficiales.

```
576

768

900

1200
```

---

# Sistema de Artículos

Orden oficial.

```
Breadcrumb

↓

Hero

↓

Meta

↓

Video

↓

Qué aprenderás

↓

Introducción

↓

Tutorial

↓

Resultado

↓

FAQ

↓

PDF

↓

Relacionados

↓

Academy

↓

Footer
```

Nunca modificar el orden.

---

# Sistema de Categorías

Todas las categorías tendrán.

Hero.

Descripción.

Cards.

CTA.

Footer.

---

# Sistema de Recursos

Todos los recursos tendrán.

Descripción.

Beneficios.

Formulario.

Descarga.

---

# Sistema Academy

Toda página Academy tendrá.

Hero.

Planes.

Beneficios.

Preguntas frecuentes.

CTA.

---

# SEO Visual

Todas las páginas deben tener.

Imagen Open Graph.

Thumbnail.

Título claro.

Un H1.

---

# Accesibilidad

Todo botón debe ser visible.

Todo enlace debe tener contraste.

Toda imagen debe tener ALT.

Toda navegación debe poder realizarse con teclado.

---

# Rendimiento

Siempre utilizar.

CSS único.

JavaScript único.

Lazy Loading.

Defer.

Imágenes optimizadas.

WebP cuando sea posible.

---

# Componentes Prohibidos

No crear.

Botones nuevos.

Cards nuevas.

Heroes distintos.

Colores nuevos.

Tipografías nuevas.

Layouts diferentes.

---

# Checklist antes de aprobar un diseño

✔ Usa la paleta oficial.

✔ Usa la tipografía oficial.

✔ Respeta los espaciados.

✔ Utiliza componentes reutilizables.

✔ Funciona en móvil.

✔ Funciona en escritorio.

✔ Mantiene coherencia con el resto del sitio.

---

# Control de versiones

## v1.0.0

* Sistema oficial de diseño.
* Paleta de colores.
* Tipografía.
* Componentes.
* Layouts.
* Responsive.
* Accesibilidad.
* Rendimiento.
* Checklist de diseño.
