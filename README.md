# Kamila & David — Invitación de boda

Invitación virtual para la boda de Kamila & David.
**12 de diciembre de 2026 · Cocoyoc, Morelos.**

Construida con **React + Vite**, **Tailwind CSS** y **Framer Motion**.
Español por defecto, con cambio a inglés y alemán en la barra de navegación.

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Para probar también las Vercel Functions locales (`/api/rsvp` y `/api/sponsorships`):

```bash
vercel dev
```

Para generar la versión final (carpeta `dist/`, lista para Vercel, Netlify o GitHub Pages):

```bash
npm run build
```

## Dónde se edita cada cosa

### 1. WhatsApp, fecha, mesa de regalos, dirección y hospedaje → `src/config.js`

Todo lo importante está en un solo archivo:

| Constante | Qué es |
|---|---|
| `WEDDING_DATE` | Fecha y hora de la boda (mueve el contador) |
| `WHATSAPP_NUMBER` | Número que recibe las confirmaciones. Formato internacional sin `+` ni espacios, ej. `5215512345678` |
| `RSVP_ENDPOINT` | Endpoint principal del backend. Por defecto usa `/api/rsvp`; si lo dejas vacío `''`, el RSVP usa WhatsApp como respaldo principal |
| `REGISTRY_URL` | Link de la mesa de regalos |
| `VENUE_ADDRESS` | Dirección (genera automáticamente el link de Google Maps) |
| `LODGING_OPTIONS` | Lista de hoteles / Airbnb con nombre, nota y link |

### 2. Fotos → `src/assets/photos/`

Para cambiar una foto, **reemplaza el archivo con el mismo nombre**. Si una foto
no existe, la página muestra un placeholder elegante ("Agregar foto aquí") y sigue funcionando.

| Archivo | Dónde aparece |
|---|---|
| `hero-1.jpg` | Portada (pantalla completa) |
| `story-1.jpg` + `story-1b.jpg` | Capítulo uno — foto principal y detalle |
| `story-2.jpg` + `story-2b.jpg` | Capítulo dos — foto principal y detalle |
| `story-3.jpg` + `story-3b.jpg` | Capítulo tres — foto principal y detalle (la pedida) |
| `gallery-1.jpg` … `gallery-6.jpg` | Collage "Momentos que nos trajeron hasta aquí" |
| `final-verse.jpg` | Fondo del versículo final (la foto B/N corriendo al mar) |

> Consejo: exporta las fotos a un ancho máximo de ~1600–2000 px y calidad ~80
> para que la página cargue rápido en celular. Las fotos actuales ya están optimizadas
> (los originales siguen intactos en la carpeta `FOTOS/`).

### 3. Textos (español, inglés y alemán) → `src/i18n/translations.js`

Todos los textos de la página viven ahí, en tres bloques: `es`, `en` y `de`.
Versículos, capítulos de la historia, programa del día, tarjetas de detalles,
preguntas frecuentes, formulario y footer.

### 4. Colores y tipografías → `tailwind.config.js`

Paleta: Verde Palma `#4F6B4A`, Beige Arena `#DCCDB5`, Amarillo Manzanilla `#F4D98B`,
Marfil `#FAF8F2`, Café Miel `#A67C52`.
Tipografías (Google Fonts, cargadas en `index.html`): Cormorant Garamond (títulos) e Inter (textos).

## Supabase / Backend setup

La app usa dos Vercel Functions:

- `POST /api/rsvp` para guardar RSVP y aportaciones de padrinos.
- `GET /api/sponsorships` para leer la vista pública de padrinos confirmados.

### 1. Tablas y vista en Supabase

Crea o verifica estas entidades en el esquema `public`:

- `rsvp_submissions`
- `sponsorship_contributions`
- `public_sponsorship_contributions`

Los payloads fuente viven en `src/rsvpPayload.js` y `src/sponsorshipPayload.js`.

### 2. Variables locales

Crea `.env` en la raíz con:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

El repo incluye `.env.example` con placeholders. No uses prefijos `VITE_` para estas variables y no importes la service role key en el frontend.

### 3. Variables en Vercel

Configura en Vercel Dashboard:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

El frontend consume en producción:

- `/api/rsvp`
- `/api/sponsorships`

### 4. Desarrollo local

Para frontend solamente:

```bash
npm run dev
```

Para frontend + Vercel Functions:

```bash
npm install
vercel dev
```

Si te falta la CLI:

```bash
npm install -g vercel
```

### 5. Flujo del RSVP

- Con `RSVP_ENDPOINT = '/api/rsvp'`, el formulario intenta guardar primero en Supabase.
- Si el guardado falla, muestra un mensaje elegante y deja WhatsApp como respaldo manual.
- Si `RSVP_ENDPOINT = ''`, el formulario usa WhatsApp como flujo principal.

### 6. Pruebas con `curl`

RSVP:

```bash
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "event": "kamila-david-wedding",
    "language": "es",
    "attendeesNames": "Juan Perez y Maria Lopez",
    "attendance": "attending",
    "transportInterest": "interested",
    "lodgingInterest": "shared_group_option",
    "email": "juan@example.com",
    "whatsappPhone": "5215512345678",
    "messageToCouple": "Nos dará mucho gusto acompañarlos",
    "submittedAt": "2026-06-14T18:00:00.000Z",
    "source": "wedding-website"
  }'
```

Padrinos:

```bash
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "event": "kamila-david-wedding",
    "type": "sponsorship_contribution",
    "language": "es",
    "sponsorName": "Juan Perez",
    "category": "photography",
    "amount": 1500,
    "currency": "MXN",
    "contact": "juan@example.com",
    "messageToCouple": "Con mucho cariño para ustedes",
    "paymentMethod": "bank_transfer",
    "paymentStatus": "pending_transfer",
    "submittedAt": "2026-06-14T18:00:00.000Z",
    "source": "wedding-website"
  }'
```

Tabla pública de padrinos:

```bash
curl http://localhost:3000/api/sponsorships
```

### 7. Flujo de aportaciones de padrinos

1. El invitado registra su intención de aportar.
2. El registro entra a Supabase como `pending_transfer`.
3. Los novios revisan la transferencia bancaria.
4. Cuando se confirme, se actualiza `paymentStatus` a `confirmed`.
5. Solo entonces aparece públicamente en la tabla de padrinos y suma al avance.

SQL para confirmar una aportación:

```sql
update public.sponsorship_contributions
set "paymentStatus" = 'confirmed'
where id = 'UUID_DEL_REGISTRO';
```

## Estructura

```
api/
  rsvp.js                    ← endpoint POST para RSVP y padrinos
  sponsorships.js            ← endpoint GET para aportaciones públicas
lib/
  supabaseAdmin.js           ← cliente server-side de Supabase
src/
  config.js                  ← constantes editables (¡empieza aquí!)
  photos.js                  ← carga de fotos con fallback
  i18n/
    translations.js          ← todos los textos ES/EN/DE
    LanguageContext.jsx      ← sistema de idioma
  hooks/useCountdown.js      ← lógica del contador
  components/                ← una sección por archivo
  assets/photos/             ← tus fotos
```
