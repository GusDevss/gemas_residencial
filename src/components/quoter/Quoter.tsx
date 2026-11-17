import { useEffect, useMemo, useState } from 'react';
import { models, project, quoter, site, waLink } from '../../config/site';
import './quoter.css';

type Payment = 'hipotecario' | 'infonavit' | 'contado';

const PAYMENTS: { id: Payment; label: string; hint: string }[] = [
  { id: 'hipotecario', label: 'Crédito hipotecario', hint: 'Bancario' },
  { id: 'infonavit', label: 'Crédito INFONAVIT', hint: 'Con tu subcuenta' },
  { id: 'contado', label: 'Contado', hint: 'Recursos propios' },
];

const mxn = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(
    Math.max(0, Math.round(n)),
  );

/** Pago mensual de un crédito con tasa fija */
function pmt(monthlyRate: number, periods: number, principal: number) {
  if (principal <= 0) return 0;
  if (monthlyRate === 0) return principal / periods;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -periods));
}

export default function Quoter() {
  const [modelId, setModelId] = useState(models[0].id);
  const [payment, setPayment] = useState<Payment>('hipotecario');
  const [downPct, setDownPct] = useState(20);
  const [term, setTerm] = useState(20);
  const [infonavit, setInfonavit] = useState('');

  // Permite que los botones "Cotizar" de la sección Modelos preseleccionen el modelo
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-quote-model]');
      if (el?.dataset.quoteModel) setModelId(el.dataset.quoteModel);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const model = models.find((m) => m.id === modelId) ?? models[0];
  const isReference = model.price == null;
  const price = model.price ?? quoter.referencePrice;

  const r = useMemo(() => {
    const closing = price * quoter.closingCostsRate;
    if (payment === 'hipotecario') {
      const down = (price * downPct) / 100;
      const financed = price - down;
      const monthly = pmt(quoter.annualRate / 12, term * 12, financed);
      return {
        headline: { label: 'Mensualidad estimada', value: mxn(monthly), suffix: `/ mes · ${term} años` },
        rows: [
          ['Precio de la casa', mxn(price)],
          [`Enganche (${downPct}%)`, mxn(down)],
          ['Monto a financiar', mxn(financed)],
          ['Gastos de escrituración (est.)', mxn(closing)],
        ],
        total: ['Desembolso inicial estimado', mxn(down + closing)],
      };
    }
    if (payment === 'infonavit') {
      const credit = Number(infonavit.replace(/[^\d]/g, '')) || 0;
      const diff = Math.max(price - credit, 0);
      return {
        headline: credit
          ? { label: 'Diferencia a cubrir', value: mxn(diff), suffix: 'con recursos propios' }
          : { label: 'Precio de referencia', value: mxn(price), suffix: 'captura tu monto INFONAVIT' },
        rows: [
          ['Precio de la casa', mxn(price)],
          ['Tu crédito INFONAVIT', credit ? mxn(credit) : 'Por capturar'],
          ['Diferencia', mxn(diff)],
          ['Gastos de escrituración (est.)', mxn(closing)],
        ],
        total: ['Recursos propios estimados', mxn(diff + closing)],
      };
    }
    return {
      headline: { label: 'Precio de contado', value: mxn(price), suffix: 'pago en una o varias exhibiciones' },
      rows: [
        ['Precio de la casa', mxn(price)],
        ['Gastos de escrituración (est.)', mxn(closing)],
      ],
      total: ['Inversión total estimada', mxn(price + closing)],
    };
  }, [price, payment, downPct, term, infonavit]);

  const summary = [
    `Hola, me interesa una cotización formal de Residencial Gema.`,
    `• Modelo: ${model.name}`,
    `• Forma de pago: ${PAYMENTS.find((p) => p.id === payment)!.label}`,
    payment === 'hipotecario' ? `• Enganche: ${downPct}% · Plazo: ${term} años` : '',
    payment === 'infonavit' && infonavit ? `• Monto INFONAVIT aprox.: ${infonavit}` : '',
    `• ${r.headline.label}: ${r.headline.value}`,
  ]
    .filter(Boolean)
    .join('\n');

  const sendToForm = () => {
    window.dispatchEvent(
      new CustomEvent('gema:prefill', {
        detail: {
          model: model.name,
          payment: PAYMENTS.find((p) => p.id === payment)!.label,
          message: summary.replace('Hola, me interesa', 'Me interesa'),
        },
      }),
    );
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="q">
      <div className="q-form">
        <fieldset className="q-group">
          <legend>1. Elige tu modelo</legend>
          <div className="q-models">
            {models.map((m) => (
              <label key={m.id} className={`q-model ${m.id === modelId ? 'is-active' : ''}`}>
                <input type="radio" name="q-model" value={m.id} checked={m.id === modelId} onChange={() => setModelId(m.id)} />
                <img src={`/img/${m.image}-600.webp`} alt="" width={120} height={150} loading="lazy" />
                <span>
                  <strong>{m.name}</strong>
                  <small>{m.price ? `Desde ${mxn(m.price)}` : `Desde ${project.priceFromLabel}*`}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="q-group">
          <legend>2. Forma de pago</legend>
          <div className="q-seg">
            {PAYMENTS.map((p) => (
              <label key={p.id} className={payment === p.id ? 'is-active' : ''}>
                <input type="radio" name="q-pay" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} />
                <strong>{p.label}</strong>
                <small>{p.hint}</small>
              </label>
            ))}
          </div>
        </fieldset>

        {payment === 'hipotecario' && (
          <fieldset className="q-group">
            <legend>3. Enganche y plazo</legend>
            <div className="q-range">
              <div className="q-range-head">
                <label htmlFor="q-down">Enganche</label>
                <output htmlFor="q-down">
                  {downPct}% · {mxn((price * downPct) / 100)}
                </output>
              </div>
              <input
                id="q-down"
                type="range"
                min={quoter.downPaymentOptions[0]}
                max={quoter.downPaymentOptions.at(-1)}
                step={5}
                value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value))}
                style={{ ['--p' as string]: `${((downPct - 10) / 40) * 100}%` }}
              />
            </div>
            <div className="q-chips" role="radiogroup" aria-label="Plazo del crédito">
              {quoter.termOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={term === t}
                  className={term === t ? 'is-active' : ''}
                  onClick={() => setTerm(t)}
                >
                  {t} años
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {payment === 'infonavit' && (
          <fieldset className="q-group">
            <legend>3. Tu crédito INFONAVIT</legend>
            <div className="field">
              <label htmlFor="q-infonavit">Monto aproximado de tu crédito (opcional)</label>
              <input
                id="q-infonavit"
                inputMode="numeric"
                placeholder="Ej. $1,200,000"
                value={infonavit}
                onChange={(e) => {
                  const n = e.target.value.replace(/[^\d]/g, '');
                  setInfonavit(n ? mxn(Number(n)) : '');
                }}
              />
            </div>
            <p className="q-help">
              Consulta tu precalificación en Mi Cuenta INFONAVIT o pide a un asesor que te ayude a calcularla.
            </p>
          </fieldset>
        )}

        {payment === 'contado' && (
          <fieldset className="q-group">
            <legend>3. Pago de contado</legend>
            <p className="q-help">
              Te compartiremos el esquema de apartado y pagos disponible para compra de contado al solicitar tu
              cotización formal.
            </p>
          </fieldset>
        )}
      </div>

      <aside className="q-result" aria-live="polite">
        {isReference && (
          <p className="q-notice">
            <span>Lista de precios en preparación.</span> Este cálculo usa el precio de referencia “desde{' '}
            {project.priceFromLabel}”.
          </p>
        )}
        <p className="q-label">{r.headline.label}</p>
        <p className="q-value">{r.headline.value}</p>
        <p className="q-suffix">{r.headline.suffix}</p>

        <dl className="q-rows">
          {r.rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div className="q-total">
            <dt>{r.total[0]}</dt>
            <dd>{r.total[1]}</dd>
          </div>
        </dl>

        <div className="q-actions">
          <a className="btn btn--wa btn--block" href={waLink(summary)} target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.6 2 2.16 6.43 2.16 11.88c0 1.74.46 3.44 1.32 4.94L2.08 22l5.3-1.39a9.86 9.86 0 0 0 4.66 1.19h.01c5.45 0 9.88-4.43 9.88-9.88a9.8 9.8 0 0 0-2.88-7.01Zm-7.01 15.2a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.14.83.84-3.06-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.53 3.69-8.21 8.23-8.21a8.2 8.2 0 0 1 8.22 8.22c0 4.53-3.69 8.22-8.2 8.22Z" />
            </svg>
            Cotización formal por WhatsApp
          </a>
          <button type="button" className="btn btn--ghost-light btn--block" onClick={sendToForm}>
            {site.contact.email ? 'Recibirla por correo' : 'Dejar mis datos a un asesor'}
          </button>
        </div>

        <p className="q-legal">
          Cálculo informativo y no constituye una oferta. Tasa anual de referencia del {(quoter.annualRate * 100).toFixed(1)}%
          y gastos de escrituración estimados en {Math.round(quoter.closingCostsRate * 100)}%. Montos, enganche y
          autorización de crédito sujetos al perfil y precalificación de cada cliente.
        </p>
      </aside>
    </div>
  );
}
