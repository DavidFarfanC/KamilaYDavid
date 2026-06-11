# Kamila & David — Invitación de boda

Invitación virtual para la boda de Kamila & David.
**12 de diciembre de 2026 · Cocoyoc, Morelos.**

Construida con **React + Vite**, **Tailwind CSS** y **Framer Motion**.
Español por defecto, con cambio a inglés (ES | EN) en la barra de navegación.

## Cómo correr el proyecto

```bash
npm install
npm run dev
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
| `RSVP_ENDPOINT` | Si lo llenas (Formspree, Google Apps Script, API propia), el formulario enviará ahí un POST con JSON. Si lo dejas vacío `''`, el RSVP se envía por WhatsApp |
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

### 3. Textos (español e inglés) → `src/i18n/translations.js`

Todos los textos de la página viven ahí, en dos bloques idénticos: `es` y `en`.
Versículos, capítulos de la historia, programa del día, tarjetas de detalles,
preguntas frecuentes, formulario y footer.

### 4. Colores y tipografías → `tailwind.config.js`

Paleta: Verde Palma `#4F6B4A`, Beige Arena `#DCCDB5`, Amarillo Manzanilla `#F4D98B`,
Marfil `#FAF8F2`, Café Miel `#A67C52`.
Tipografías (Google Fonts, cargadas en `index.html`): Cormorant Garamond (títulos) e Inter (textos).

## El formulario RSVP

- **Sin backend (por defecto):** al enviar, abre WhatsApp con el mensaje ya formateado
  hacia `WHATSAPP_NUMBER`.
- **Con backend:** llena `RSVP_ENDPOINT` y el formulario hará un `POST` con
  `{ name, guests, attendance, transport, comments, submittedAt }`. El botón de
  WhatsApp queda como alternativa visible.

Servicios sin código que funcionan como endpoint: [Formspree](https://formspree.io),
[Getform](https://getform.io) o un Google Apps Script conectado a una hoja de cálculo.

## Estructura

```
src/
  config.js                  ← constantes editables (¡empieza aquí!)
  photos.js                  ← carga de fotos con fallback
  i18n/
    translations.js          ← todos los textos ES/EN
    LanguageContext.jsx      ← sistema de idioma
  hooks/useCountdown.js      ← lógica del contador
  components/                ← una sección por archivo
  assets/photos/             ← tus fotos
```
