# Iglesia Sion Manantial de Vida — Sitio Web

Sitio web oficial de la **Iglesia Sion Manantial de Vida** (Toluca / Metepec, Estado de México).

- 🌐 Dominio: `manantialdevida.mx`
- ✉️ Contacto: sion@manantialvida.mx
- 🏔️ "Un manantial de vida para las naciones"

## Estado del proyecto

✅ Diseño implementado (sitio estático generado con Claude Design). En revisión de contenido.

## Cómo ver el sitio

Es un sitio **estático** (HTML + CSS + JavaScript, sin servidor). Para verlo:

- **Lo más fácil:** abre `index.html` con doble clic (se abre en tu navegador).
- El panel de administración está en `admin.html` (se entra desde el botón "Acceso Pastoral").

## Estructura de archivos

| Archivo / carpeta | Qué es |
|---|---|
| `index.html` | Página principal pública (inicio, servicios, nosotros, eventos, etc.) |
| `admin.html` | Panel de administración ("Acceso Pastoral") |
| `styles.css` | Estilos del sitio público |
| `admin.css` | Estilos del panel de administración |
| `app.js` | Lógica del sitio público |
| `public-extra.js`, `public-events.js` | Funciones extra del sitio (eventos, calendario) |
| `admin.js` | Lógica del panel de administración |
| `site-data.js` | Contenido editable, compartido entre el sitio y el panel (usa el navegador) |
| `assets/` | Imágenes: logos, foto del hero (montaña), anuncios |
| `.env.local` | 🔒 Tokens privados (NUNCA se sube a GitHub) |

## Notas técnicas / pendientes

- Las imágenes de `assets/` son grandes (~32 MB en total). Conviene **optimizarlas**
  (comprimir a tamaño web) antes de publicar, para que el sitio cargue rápido en celular.
- El contenido se guarda por ahora en el navegador (localStorage) vía `site-data.js`.
  Para que las ediciones del panel sean permanentes y compartidas, más adelante habrá
  que conectar una base de datos / backend.
- El login del panel es por ahora una maqueta (sin autenticación real). Antes de publicar
  el panel hay que conectar un sistema de acceso seguro.
- Falta elegir hosting (GitHub Pages o Cloudflare Pages, ambos gratuitos) y conectar el
  dominio `manantialdevida.mx`.

> Contexto, decisiones y memoria del proyecto: ver el repositorio `sion-knowledge-base`.
