/**
 * Configuración central de Residencial Gema.
 * Edita aquí los datos de contacto, precios y textos clave: todo el sitio los toma de este archivo.
 */

export const site = {
  name: 'Residencial Gema',
  shortName: 'Gema',
  /** Dominio final del sitio (sin "/" al final). Se usa para canonical, sitemap y Open Graph. */
  url: 'https://residencialgema.com',
  locale: 'es_MX',
  title: 'Residencial Gema | Casas en venta a 2 km del Centro Histórico de Querétaro',
  description:
    'Residencial Gema: privada de solo 19 casas en Av. Tlacote 701, a 2 km del Centro Histórico de Querétaro. Modelos Coral y Coral Ampliada, próximamente desde $2.1 MDP. Crédito INFONAVIT, hipotecario y contado.',
  keywords: [
    'casas en venta Querétaro',
    'casas cerca del Centro Histórico de Querétaro',
    'Residencial Gema',
    'casas Av. Tlacote',
    'casas en privada Querétaro',
    'casas con crédito INFONAVIT Querétaro',
    'Modelo Coral',
    'preventa casas Querétaro',
  ],

  contact: {
    /** Teléfono visible (formato legible) */
    phoneDisplay: '442 393 2090',
    /** Teléfono en formato internacional para enlaces tel: */
    phoneE164: '+524423932090',
    /** Número de WhatsApp en formato internacional SIN "+" ni espacios */
    whatsapp: '524423932090',
    /** Correo que recibe los formularios.  ⚠️ PENDIENTE: reemplazar por el correo real de ventas. */
    email: 'ventas@residencialgema.com',
    whatsappGreeting: 'Hola, me interesa conocer Residencial Gema en Querétaro. ¿Me pueden dar más información?',
  },

  /**
   * Envío de formularios por correo.
   * Por defecto usa FormSubmit (https://formsubmit.co), sin backend: la primera vez que se envíe
   * el formulario, FormSubmit mandará un correo de activación a `contact.email`.
   * Si prefieres otro servicio (Web3Forms, Formspree, un PHP propio), cambia este endpoint.
   */
  form: {
    endpoint: (email: string) => `https://formsubmit.co/ajax/${email}`,
  },

  address: {
    street: 'Av. Tlacote 701',
    postalCode: '76177',
    city: 'Santiago de Querétaro',
    region: 'Querétaro',
    regionCode: 'QRO',
    country: 'MX',
    full: 'Av. Tlacote 701, 76177 Santiago de Querétaro, Qro., México',
  },

  maps: {
    embed: 'https://www.google.com/maps?q=Av.+Tlacote+701,+76177+Santiago+de+Quer%C3%A9taro,+Qro.&output=embed',
    link: 'https://www.google.com/maps/search/?api=1&query=Av.+Tlacote+701,+76177+Santiago+de+Quer%C3%A9taro,+Qro.',
  },

  social: {
    // Agrega aquí las redes cuando estén listas, p. ej. facebook: 'https://facebook.com/residencialgema'
    facebook: '',
    instagram: '',
    tiktok: '',
  },
} as const;

/** Proyecto */
export const project = {
  totalHomes: 19,
  condominium: 'Condominio Zafiro I – Gema',
  distanceToCenterKm: 2,
  salesStart: 'Agosto 2026',
  deedsStart: 'Febrero 2027',
  deedsEnd: 'Agosto 2027',
  deedsPerMonth: 3,
  priceFromLabel: '$2.1 MDP',
};

/**
 * Precios y datos de cada modelo.
 * ⚠️ Mientras `price` sea null, el cotizador usa el precio de referencia "desde $2.1 MDP".
 * Cuando tengas la lista de precios, captura aquí el precio en pesos (ej. 2150000).
 */
export const models = [
  {
    id: 'coral',
    name: 'Coral',
    tagline: 'Funcional, luminosa y lista para tu familia',
    description:
      'Casa de dos niveles con fachada contemporánea: volúmenes en blanco y gris, detalles en madera y amplios ventanales que llenan de luz natural cada espacio.',
    price: null as number | null,
    image: 'fachada-coral',
    imageWidths: [600, 1000, 1400],
    imageRatio: '1696 / 2512',
    highlights: ['Dos niveles', 'Cochera frontal', 'Cocina integral', 'Patio posterior'],
    // ⚠️ PENDIENTE: superficies y distribución reales
    specs: [
      { label: 'Terreno', value: null as string | null },
      { label: 'Construcción', value: null as string | null },
      { label: 'Recámaras', value: null as string | null },
      { label: 'Baños', value: null as string | null },
    ],
  },
  {
    id: 'coral-ampliada',
    name: 'Coral Ampliada',
    tagline: 'Más espacio para vivir y convivir',
    description:
      'La versión ampliada del modelo Coral: una fachada más generosa, volumen volado con acabados en madera y espacios interiores pensados para crecer en familia.',
    price: null as number | null,
    image: 'fachada-coral-ampliada',
    imageWidths: [600, 900],
    imageRatio: '912 / 1163',
    highlights: ['Dos niveles', 'Fachada más amplia', 'Cocina integral', 'Patio posterior'],
    specs: [
      { label: 'Terreno', value: null as string | null },
      { label: 'Construcción', value: null as string | null },
      { label: 'Recámaras', value: null as string | null },
      { label: 'Baños', value: null as string | null },
    ],
  },
];

/** Supuestos del cotizador (referenciales; ajústalos cuando tengas condiciones reales) */
export const quoter = {
  referencePrice: 2_100_000,
  annualRate: 0.105, // tasa anual referencial para crédito hipotecario
  closingCostsRate: 0.06, // gastos de escrituración estimados (% del valor)
  downPaymentOptions: [10, 15, 20, 30, 40, 50],
  termOptions: [10, 15, 20],
};

export const waLink = (text: string = site.contact.whatsappGreeting) =>
  `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
