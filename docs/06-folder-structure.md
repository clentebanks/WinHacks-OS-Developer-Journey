# WINHACKS FOLDER STRUCTURE

**Versión:** 1.0.0
**Estado:** Oficial
**Última actualización:** Junio 2026
**Proyecto:** WinHacks
**Autor:** Clent Ebanks

---

# Propósito

Este documento define la estructura oficial de carpetas y archivos del proyecto WinHacks.

Toda nueva página, recurso o componente deberá seguir esta organización.

No se crearán carpetas nuevas sin una justificación y sin actualizar este documento.

---

# Filosofía

La estructura debe cumplir cuatro principios:

* Escalable
* Fácil de mantener
* Fácil de navegar
* Predecible

Si una persona conoce una parte del proyecto, debe poder encontrar cualquier otra sin esfuerzo.

---

# Estructura General

```text
WINHACKS/
│
├── academy/
├── assets/
├── blog/
├── comandos/
├── components/
├── css/
├── docs/
├── js/
├── optimizacion/
├── personalizacion/
├── recursos/
├── redes/
├── secretos/
├── seguridad/
├── templates/
│
├── about.html
├── contact.html
├── disclaimer.html
├── index.html
├── privacy-policy.html
├── terms.html
├── robots.txt
├── sitemap.xml
└── netlify.toml
```

---

# Carpetas del sitio

## academy/

Contiene todas las páginas de WinHacks Academy.

Ejemplo

```text
academy/

index.html

plan-basico.html

plan-pro.html

plan-premium.html
```

---

## blog/

Artículos generales.

Solo se utiliza cuando un contenido no pertenece a ninguna categoría específica.

---

## secretos/

Funciones ocultas de Windows.

Ejemplos

```text
god-mode-windows.html

visor-eventos.html

historial-confiabilidad.html

monitor-recursos.html
```

---

## personalizacion/

Cambios visuales.

Ejemplos

```text
quitar-flechas-accesos-directos.html

cambiar-icono-disco.html

mensaje-inicio-sesion.html

menu-contextual-clasico.html
```

---

## redes/

Comandos y herramientas de red.

Ejemplos

```text
ipconfig.html

arp-a.html

ping.html

netstat.html

tracert.html

nslookup.html
```

---

## comandos/

Herramientas integradas de Windows.

Ejemplos

```text
services-msc.html

msconfig.html

cleanmgr.html

dxdiag.html
```

---

## optimizacion/

Optimización del sistema.

Ejemplos

```text
programas-inicio.html

storage-sense.html

limpiar-cache.html
```

---

## seguridad/

Seguridad de Windows.

Ejemplos

```text
mrt.html

windows-defender.html

firewall.html

uac.html
```

---

## recursos/

Recursos descargables.

Ejemplos

```text
index.html

guia-50-secretos.html

atajos-teclado.html

checklist-optimizacion.html

gracias-50-secretos.html
```

---

# Carpeta assets/

Contiene todos los recursos multimedia.

Nunca colocar imágenes fuera de esta carpeta.

---

## assets/img/

Imágenes generales.

---

## assets/og/

Imágenes Open Graph.

1200 × 630 px.

Una por artículo.

---

## assets/thumbnails/

Miniaturas.

---

## assets/screenshots/

Capturas oficiales.

Organizadas por categoría.

Ejemplo

```text
screenshots/

personalizacion/

redes/

secretos/

seguridad/
```

---

## assets/icons/

Favicons.

Iconos SVG.

Logotipos.

---

## assets/pdf/

Todos los PDFs oficiales.

---

## assets/videos/

Videos propios del sitio (si se utilizan).

---

# components/

Componentes HTML reutilizables.

```text
navbar.html

footer.html
```

En futuras versiones podrán añadirse:

```text
breadcrumb.html

cta.html

newsletter.html
```

---

# css/

Hojas de estilo.

```text
style.css
```

El proyecto utiliza un único archivo CSS principal.

No crear hojas de estilo específicas para cada artículo.

---

# js/

Scripts JavaScript.

```text
components.js

script.js
```

## components.js

Carga componentes reutilizables.

## script.js

Funciones globales del sitio.

---

# templates/

Plantillas oficiales.

```text
article-template.html

category-template.html

resource-template.html
```

Todo nuevo contenido debe partir de estas plantillas.

---

# docs/

Documentación oficial.

```text
01-brand-guidelines.md

02-design-system.md

03-core-system.md

04-seo-system.md

05-content-system.md

06-folder-structure.md

07-component-library.md

08-coding-standards.md

09-roadmap.md

10-changelog.md
```

Estos documentos representan la especificación oficial del proyecto.

---

# Convención de nombres

Siempre utilizar:

* minúsculas
* guiones
* sin acentos
* sin espacios

Correcto

```text
quitar-flechas-accesos-directos.html
```

Incorrecto

```text
QuitarFlechas.html
```

---

# Convención para imágenes

Formato

```text
tema-descripcion.webp
```

Ejemplos

```text
shell-icons.webp

ipconfig-cmd.webp

arp-a-lista.webp
```

Nunca utilizar nombres como:

```text
imagen1.jpg

captura2.png

foto-final.webp
```

---

# Convención para PDFs

```text
guia-50-secretos.pdf

checklist-seguridad.pdf

50-atajos-windows.pdf
```

---

# Convención para Open Graph

Siempre:

```text
og-nombre-articulo.webp
```

Ejemplo

```text
og-quitar-flechas.webp
```

---

# Convención para thumbnails

Siempre:

```text
thumb-nombre-articulo.webp
```

Ejemplo

```text
thumb-quitar-flechas.webp
```

---

# Convención para capturas

```text
step-01.webp

step-02.webp

step-03.webp

resultado.webp
```

Esto facilita automatizar procesos futuros.

---

# Organización por módulos

Cada categoría debe comportarse como un módulo independiente.

Ejemplo

```text
personalizacion/

↓

index.html

↓

10 artículos

↓

imágenes

↓

PDF

↓

Academy
```

Todos los módulos siguen la misma estructura.

---

# Archivos raíz

Solo permanecen en la raíz los archivos globales.

```text
index.html

about.html

contact.html

privacy-policy.html

terms.html

disclaimer.html

robots.txt

sitemap.xml

netlify.toml
```

No colocar artículos en la raíz.

---

# Archivos prohibidos

No deben permanecer en producción:

```text
test.html

nuevo.html

backup.html

copia.html

temp.html
```

---

# Limpieza del proyecto

Antes de publicar una nueva versión:

Eliminar archivos sin uso.

Eliminar imágenes duplicadas.

Eliminar código comentado innecesario.

Verificar enlaces rotos.

Actualizar sitemap.

---

# Escalabilidad

La estructura está preparada para:

* Más de 500 artículos.
* Más de 300 Shorts.
* Decenas de recursos PDF.
* Cursos completos.
* Herramientas propias.
* Nuevas categorías.

No será necesario reorganizar el proyecto al crecer.

---

# Checklist

Antes de agregar un nuevo archivo comprobar:

✔ Está en la carpeta correcta.

✔ Sigue la convención de nombres.

✔ Utiliza la plantilla oficial.

✔ Tiene recursos en assets.

✔ Está enlazado desde su categoría.

✔ Será incluido en sitemap.xml.

✔ Cumple los estándares del proyecto.

---

# Control de versiones

## v1.0.0

* Arquitectura oficial del proyecto.
* Organización de carpetas.
* Convenciones de nombres.
* Organización de recursos.
* Estructura preparada para el crecimiento del ecosistema WinHacks.
