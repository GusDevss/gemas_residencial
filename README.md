# Residencial Gema — Sitio web

Sitio one-page de **Residencial Gema** (Av. Tlacote 701, Querétaro), construido con **Astro + React**:
HTML estático pre-renderizado (ideal para SEO y velocidad) con islas interactivas en React (cotizador).

## Comandos

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera /dist listo para subir a cualquier hosting estático
npm run preview
```

## Dónde editar

| Qué | Archivo |
| --- | --- |
| Teléfono, WhatsApp, correo, dominio, redes, dirección | `src/config/site.ts` → `site` |
| **Precios** (lista pendiente) y superficies de cada modelo | `src/config/site.ts` → `models` (`price`, `specs`) |
| Supuestos del cotizador (tasa, gastos, enganches, plazos) | `src/config/site.ts` → `quoter` |
| Preguntas frecuentes (también alimentan el schema FAQ de Google) | `src/config/faq.ts` |
| Aviso de privacidad | `src/pages/aviso-de-privacidad/index.astro` |
| Colores y tipografía | `src/styles/global.css` |

Mientras un modelo tenga `price: null`, el sitio muestra "Próximamente desde $2.1 MDP" y el cotizador usa
ese precio de referencia con un aviso visible. Al capturar el precio, todo se actualiza solo.

## Formulario

- **Enviar por WhatsApp**: abre WhatsApp con los datos del prospecto ya escritos.
- **Enviar por correo**: usa [FormSubmit](https://formsubmit.co) (sin servidor). La primera vez que se envíe,
  FormSubmit manda un correo de activación a `site.contact.email`; hay que confirmarlo una vez.
  Para usar otro servicio, cambia `site.form.endpoint`.

## SEO incluido

Títulos y descripciones, canonical, Open Graph/Twitter (`public/og-residencial-gema.jpg`), datos estructurados
JSON-LD (RealEstateAgent, Residence, WebSite, FAQPage), `sitemap-index.xml`, `robots.txt`, metadatos geo,
imágenes WebP responsivas con carga diferida, fuentes auto-alojadas y HTML semántico accesible.

## Pendientes

- Correo real de ventas y dominio definitivo (`site.ts`, `astro.config.mjs` y `public/robots.txt`).
- Lista de precios, superficies y distribución de Coral y Coral Ampliada.
- Razón social del responsable en el aviso de privacidad.
- Redes sociales, fotos de amenidades y avance de obra.
