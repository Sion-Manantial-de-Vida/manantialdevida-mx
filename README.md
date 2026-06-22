# Iglesia Sion Manantial de Vida — Sitio Web

Aplicación del sitio web oficial de la **Iglesia Sion Manantial de Vida** (Toluca / Metepec,
Estado de México).

- 🌐 En vivo: **https://manantialdevida.mx**
- ✉️ Contacto: sion@manantialdevida.mx

> **Este repo es solo para la aplicación.** El contexto de la iglesia, decisiones, bitácora
> y conocimiento general viven en el repo privado `sion-knowledge-base`.

## Arquitectura
- **Frontend:** sitio estático (HTML + CSS + JavaScript). Sin framework.
- **Hosting:** Vercel (auto-deploy al hacer push a `main`).
- **Base de datos / Auth:** Supabase (proyecto `wisgwbfzyusdwlotspqn`).
- **Dominio:** `manantialdevida.mx` (DNS en Squarespace; correo Google Workspace).

## Estructura
| Archivo / carpeta | Qué es |
|---|---|
| `index.html` | Sitio público (inicio, servicios, nosotros, eventos, oración, etc.) |
| `admin.html` | Panel de administración ("Acceso Pastoral") |
| `styles.css` / `admin.css` | Estilos del sitio / del panel |
| `app.js` | Lógica del sitio público (incl. formulario de oración y login) |
| `public-extra.js`, `public-events.js` | Render de eventos, anuncios, blog, etc. |
| `public-sync.js` | Trae contenido desde Supabase al sitio público |
| `admin.js` | Lógica del panel (CRUD de cada sección) |
| `site-data.js` | Datos por defecto + helpers de lectura/escritura |
| `supabase-config.js` | Conexión a Supabase (clave pública, segura) |
| `scripts/db.sh` | Correr SQL en Supabase desde la terminal |
| `assets/` | Imágenes (logos, hero, anuncios) |
| `.env.local` | 🔒 Tokens privados (NUNCA se sube) · ver `.env.local.example` |

## Cómo trabajar

```bash
# Cargar tokens
set -a; source .env.local; set +a

# Ver el sitio localmente
python3 -m http.server 8000   # luego abrir http://127.0.0.1:8000

# Correr SQL en Supabase (sin el editor web)
./scripts/db.sh "select * from public.events;"

# Ver despliegues de Vercel
vercel ls project-ld1xd --token "$VERCEL_TOKEN"
```

Publicar: hacer `git push` a `main` → Vercel despliega solo.

## Base de datos (modelo normalizado)
Tablas: `content`, `services`, `sermons`, `events`, `announcements`, `blog_posts`, `team`,
`social_feed`, `prayer_requests`. Seguridad RLS: el público lee lo publicado y envía
peticiones de oración; solo el administrador autenticado edita.
Patrón de referencia ya conectado: **Eventos** (`events`).

⚠️ En Supabase JS, una consulta solo se ejecuta con `await` o `.then()`.

> Estado del proyecto, decisiones y próximos pasos: ver el repo `sion-knowledge-base`.
