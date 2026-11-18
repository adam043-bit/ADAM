import React, { useState, useEffect } from 'react';
import {
  Truck,
  ThermometerSnowflake,
  Phone,
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  BatteryCharging,
  Lock,
  Activity,
  Calculator,
  ArrowRight,
  Menu,
  X,
  MapPin,
  GraduationCap,
  RefreshCw,
  Award,
  Mail,
  Stethoscope,
  Syringe,
  Pill,
  HeartPulse,
  Microscope,
  FlaskConical,
  Dna,
  Hospital,
  ShieldPlus,
  Cross,
  Gauge,
  ClipboardCheck,
  Navigation,
  FileSpreadsheet
} from 'lucide-react';
import {
  HERO_TELEMETRY_TRUCKS,
  SPAIN_HUBS,
  COLD_RANGES,
  FLEET_ITEMS,
  SHIPMENT_DATABASE,
  REGULATIONS,
  CONTINGENCY_PROTOCOLS,
  HUB_NETWORK,
  RoadShipment,
  ColdRangeSpec
} from './data/pharmaData';
import Ibuprofen3D from './components/Ibuprofen3D';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvkkyjgo';
const SHEETDB_ENDPOINT = 'https://sheetdb.io/api/v1/fst1vl3p3sehx';

const UI_COPY = {
  es: {
    deskStatus: 'Centro Operativo Farmacéutico España activo',
    operacionesLabel: 'Tráfico España:',
    navServices: 'Servicios',
    navCorridors: 'Rutas España',
    navSpectrum: 'Cadena de Frío',
    navFleet: 'Flota',
    navQuote: 'Cotizador',
    trackCta: 'Rastrear Camión',
    heroEyebrow: 'medicam.cat · Red Oficial de Transporte Sanitario en España · ATP FRC & AEMPS',
    heroTitle: 'ENTREGA DE MEDICAMENTOS HOSPITALARIOS EN CAMIÓN FRIGORÍFICO',
    heroHighlight: 'Servicio Continuo Península y Baleares · -196 °C a +25 °C',
    heroPrimaryCta: 'Cotizar Envío en Camión',
    heroSecondaryCta: 'Rastrear Expedición',
    academicNotice: 'Web Académica · Proyecto educativo sin actividad comercial real',
  },
  ca: {
    deskStatus: 'Centre Operatiu Farmacèutic Espanya actiu',
    operacionesLabel: 'Tràfic i Operacions:',
    navServices: 'Serveis',
    navCorridors: 'Rutes Espanya',
    navSpectrum: 'Cadena de Fred',
    navFleet: 'Flota',
    navQuote: 'Cotitzador',
    trackCta: 'Rastrejar Camió',
    heroEyebrow: 'medicam.cat · Xarxa Oficial de Transport Sanitari a Espanya · ATP FRC & AEMPS',
    heroTitle: 'LLIURAMENT DE MEDICAMENTS HOSPITALARIS EN CAMIÓ FRIGORÍFIC',
    heroHighlight: 'Servei Continu Península i Balears · -196 °C a +25 °C',
    heroPrimaryCta: 'Demanar Cotització',
    heroSecondaryCta: 'Rastrejar Expedició',
    academicNotice: 'Web Acadèmica · Projecte educatiu sense activitat comercial real',
  },
  en: {
    deskStatus: 'Spain Pharmaceutical Operations Desk active',
    operacionesLabel: 'Traffic Control:',
    navServices: 'Services',
    navCorridors: 'Spain Routes',
    navSpectrum: 'Cold Chain',
    navFleet: 'Fleet',
    navQuote: 'Quote',
    trackCta: 'Track Truck',
    heroEyebrow: 'medicam.cat · Official Spanish Pharma Road Network · ATP FRC & AEMPS',
    heroTitle: 'HOSPITAL MEDICATION DELIVERY BY REFRIGERATED PHARMA TRUCK',
    heroHighlight: '24h Iberian & Balearic Coverage · -196 °C to +25 °C',
    heroPrimaryCta: 'Request Road Quote',
    heroSecondaryCta: 'Track Shipment',
    academicNotice: 'Academic Website · Educational project (non-commercial)',
  },
};

/* Emblema farmacéutico inspirado en la Copa de Higía y la Cruz de Farmacia */
function PharmacyChaliceEmblem({ dark = false }: { dark?: boolean }) {
  const strokeColor = dark ? '#FFFFFF' : '#14360E';
  const accentColor = dark ? '#F5E626' : '#2E741B';
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
      <circle cx="22" cy="24" r="14" stroke={strokeColor} strokeWidth="2.3" />
      <circle cx="22" cy="24" r="6" stroke={strokeColor} strokeWidth="2" />
      <path d="M16 32V24C16 20.7 18.7 18 22 18C25.3 18 28 20.7 28 24V32" stroke={strokeColor} strokeWidth="2.1" strokeLinecap="round" />
      <path d="M14.5 11.5H29.5C28.5 15.5 25.5 17.8 22 17.8C18.5 17.8 15.5 15.5 14.5 11.5Z" stroke={strokeColor} strokeWidth="2.1" strokeLinejoin="round" />
      <path d="M22 11.5V6.5C22 4.8 23.6 3.8 25.4 4.3C27 4.7 27.6 6.2 26.8 7.6C25.9 9 23.2 9.4 22 11.5Z" stroke={accentColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="24" r="2.2" fill={accentColor} />
    </svg>
  );
}

/* Separador clínico minimalista con traza verde farmacia */
function MedicalPulseDivider() {
  return (
    <div className="w-full flex items-center justify-center py-1 bg-[#F4F7F2]" aria-hidden="true">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        <span className="h-px flex-1 bg-[#2E741B]/20" />
        <svg viewBox="0 0 64 20" fill="none" className="w-14 h-4 text-[#2E741B]/70 shrink-0">
          <path
            d="M0 10H18L23 3L29 17L35 6L39 10H64"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="h-px flex-1 bg-[#2E741B]/20" />
      </div>
    </div>
  );
}

function getColdRangeIcon(id: ColdRangeSpec['id'], active: boolean) {
  const cls = `w-4 h-4 shrink-0 ${active ? 'text-[#F5E626]' : 'text-[#2E741B]'}`;
  switch (id) {
    case 'criogenico':
      return <Dna className={cls} />;
    case 'ultracongelado':
      return <FlaskConical className={cls} />;
    case 'congelado':
      return <ThermometerSnowflake className={cls} />;
    case 'refrigerado':
      return <Syringe className={cls} />;
    case 'ambiente':
      return <Pill className={cls} />;
  }
}

/* Gráfica lineal interactiva SVG de estabilidad térmica durante el trayecto en camión */
function ThermalStabilityChart({
  points,
  targetMin,
  targetMax,
}: {
  points: { hora: string; temp: number; fase: string }[];
  targetMin: number;
  targetMax: number;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const width = 640;
  const height = 220;
  const padL = 54;
  const padR = 24;
  const padT = 24;
  const padB = 34;

  const temps = points.map((p) => p.temp);
  const rawMin = Math.min(...temps, targetMin);
  const rawMax = Math.max(...temps, targetMax);
  const margin = Math.max(1.5, (rawMax - rawMin) * 0.22);
  const yMin = rawMin - margin;
  const yMax = rawMax + margin;

  const xScale = (i: number) =>
    padL + (i / Math.max(1, points.length - 1)) * (width - padL - padR);
  const yScale = (t: number) =>
    padT + ((yMax - t) / Math.max(0.1, yMax - yMin)) * (height - padT - padB);

  const pathD = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${xScale(idx).toFixed(1)} ${yScale(p.temp).toFixed(1)}`)
    .join(' ');

  const bandTop = yScale(targetMax);
  const bandBottom = yScale(targetMin);
  const bandHeight = Math.max(4, bandBottom - bandTop);

  const activeIdx = hoverIdx !== null ? hoverIdx : points.length - 1;
  const activePoint = points[activeIdx];

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
        <div className="flex items-center gap-4 text-slate-600">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#14360E]">
            <span className="w-3 h-0.5 bg-[#2E741B] inline-block" />
            Sonda Caja Isotérmica
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#2E741B] font-medium">
            <span className="w-3 h-2.5 bg-[#2E741B]/15 border border-[#2E741B]/45 inline-block rounded-xs" />
            Banda Validada ({targetMin} °C / {targetMax} °C)
          </span>
        </div>
        {activePoint && (
          <div className="font-mono text-xs bg-[#173E0D] text-white px-2.5 py-1 rounded">
            {activePoint.hora} · {activePoint.fase}: <strong className="text-[#F5E626]">{activePoint.temp.toFixed(1)} °C</strong>
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-52 sm:h-56 bg-[#F4F7F2] rounded-lg border border-[#2E741B]/20 cursor-crosshair select-none"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <rect
          x={padL}
          y={bandTop}
          width={width - padL - padR}
          height={bandHeight}
          fill="#2E741B"
          fillOpacity="0.14"
        />
        <line
          x1={padL}
          y1={bandTop}
          x2={width - padR}
          y2={bandTop}
          stroke="#2E741B"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1={padL}
          y1={bandBottom}
          x2={width - padR}
          y2={bandBottom}
          stroke="#2E741B"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {[yMax, (yMax + yMin) / 2, yMin].map((val, idx) => (
          <g key={idx}>
            <line
              x1={padL}
              y1={yScale(val)}
              x2={width - padR}
              y2={yScale(val)}
              stroke="#DCE5D7"
              strokeWidth="1"
            />
            <text
              x={padL - 8}
              y={yScale(val) + 3}
              textAnchor="end"
              className="fill-slate-600 text-[10px] font-mono"
            >
              {val.toFixed(0)}°
            </text>
          </g>
        ))}

        <path
          d={pathD}
          fill="none"
          stroke="#2E741B"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, idx) => {
          const cx = xScale(idx);
          const cy = yScale(p.temp);
          const isSelected = idx === activeIdx;
          return (
            <g key={p.hora} onMouseEnter={() => setHoverIdx(idx)}>
              {isSelected && (
                <line
                  x1={cx}
                  y1={padT}
                  x2={cx}
                  y2={height - padB}
                  stroke="#173E0D"
                  strokeOpacity="0.3"
                  strokeDasharray="3 3"
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 5.5 : 3.5}
                fill={isSelected ? '#F5E626' : '#2E741B'}
                stroke="#14360E"
                strokeWidth="1.5"
              />
              <text
                x={cx}
                y={height - 10}
                textAnchor="middle"
                className="fill-slate-600 text-[10px] font-mono"
              >
                {p.hora}
              </text>
              <rect
                x={cx - 24}
                y={padT}
                width={48}
                height={height - padT - padB}
                fill="transparent"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<'es' | 'ca' | 'en'>('es');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Telemetría Hero en tiempo real de unidades de camión
  const [heroTruckIdx, setHeroTruckIdx] = useState(0);
  const [telemetryLive, setTelemetryLive] = useState(true);
  const [telemetryTick, setTelemetryTick] = useState(0);

  useEffect(() => {
    if (!telemetryLive) return;
    const id = setInterval(() => {
      setTelemetryTick((t) => (t + 1) % 6);
    }, 2400);
    return () => clearInterval(id);
  }, [telemetryLive]);

  const currentHeroTruck = HERO_TELEMETRY_TRUCKS[heroTruckIdx];
  const tempJitter = [0, 0.1, -0.1, 0.0, 0.1, -0.1][telemetryTick];
  const liveHeroTemp = (currentHeroTruck.temp + tempJitter).toFixed(1);

  // 2. Red Interactivo España por Carretera (Mapa de Autovías Sanitarias)
  const [selectedHubCode, setSelectedHubCode] = useState<string>('MAD');
  const activeSpainHub = SPAIN_HUBS.find((h) => h.codigo === selectedHubCode) || SPAIN_HUBS[0];

  // 3. Espectro de Cadena de Frío interactivo
  const [activeRangeId, setActiveRangeId] = useState<ColdRangeSpec['id']>('refrigerado');
  const activeColdSpec = COLD_RANGES.find((r) => r.id === activeRangeId) || COLD_RANGES[0];

  // 4. Filtro Flota de Camiones
  const [fleetFilter, setFleetFilter] = useState<'todos' | 'pesado' | 'clinico'>('todos');
  const filteredFleet =
    fleetFilter === 'todos' ? FLEET_ITEMS : FLEET_ITEMS.filter((f) => f.categoria === fleetFilter);

  // 5. Rastreador Terrestre en Tiempo Real (Live Road Cold Chain Tracker)
  const [trackingInput, setTrackingInput] = useState('MDC-2026-0841');
  const [activeShipment, setActiveShipment] = useState<RoadShipment | null>(SHIPMENT_DATABASE['MDC-2026-0841']);
  const [trackerError, setTrackerError] = useState<string | null>(null);
  const [trackerLoading, setTrackerLoading] = useState(false);

  const navigateToTracking = (code?: string) => {
    const target = code ? `/tracking?code=${encodeURIComponent(code)}` : '/tracking';
    if (window.history?.pushState) {
      window.history.pushState({}, '', target);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = target;
    }
  };

  const handleTrackShipment = async (codeOverride?: string) => {
    const query = (codeOverride ?? trackingInput).trim().toUpperCase();
    if (codeOverride) setTrackingInput(codeOverride);

    if (!query) {
      setTrackerError('Introduce un código de expedición válido (ej: MDC-2026-4542) para consultar la telemetría del camión.');
      setActiveShipment(null);
      return;
    }

    setTrackerLoading(true);
    setTrackerError(null);

    // 1. Consulta en vivo a SheetDB usando la columna real del Excel: codigo_expedicion
    try {
      let rowMatch: Record<string, unknown> | null = null;

      try {
        const searchRes = await fetch(
          `${SHEETDB_ENDPOINT}/search?codigo_expedicion=${encodeURIComponent(query)}&casesensitive=false`,
          { cache: 'no-store' }
        );
        const searchData = await searchRes.json();
        if (Array.isArray(searchData) && searchData.length > 0) {
          rowMatch = searchData[0];
        }
      } catch {
        // Continuar al fallback de tabla completa
      }

      if (!rowMatch) {
        const res = await fetch(`${SHEETDB_ENDPOINT}?_nc=${Date.now()}`, { cache: 'no-store' });
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          rowMatch =
            rows.find((r: Record<string, unknown>) => {
              const code = String(r.codigo_expedicion ?? r.tracking_code ?? r['tracking_code '] ?? '')
                .trim()
                .toUpperCase();
              return code === query;
            }) || null;
        }
      }

      if (rowMatch) {
        const getField = (...keys: string[]) => {
          for (const k of keys) {
            for (const rk of Object.keys(rowMatch!)) {
              if (rk.trim().toLowerCase() === k.toLowerCase()) {
                const v = String(rowMatch![rk] ?? '').trim();
                if (v) return v;
              }
            }
          }
          return '';
        };

        const rawStatus = getField('status', 'estat', 'estado') || 'En magatzem';
        const s = rawStatus.toLowerCase();
        const isDelivered = s.includes('lliur') || s.includes('entregad') || s.includes('delivered');
        const isTransit = s.includes('trànsit') || s.includes('transit') || s.includes('tránsito') || s.includes('ruta');
        const estadoLabel: RoadShipment['estado'] = isDelivered
          ? 'Entregado'
          : isTransit
            ? 'En ruta'
            : 'En cámara GDP';
        const progressPct = isDelivered ? 100 : isTransit ? 50 : 10;

        setActiveShipment({
          codigo: getField('codigo_expedicion', 'tracking_code') || query,
          unidad: `Unidad MEDICAM · ${getField('empresa', 'client') || 'Hospital / Lab'}`,
          vehiculo: 'Semirremolque Frigorífico ATP Clase FRC',
          origen: getField('origen', 'origin') || 'Base Barcelona ZAL',
          destino: getField('destino', 'destination') || 'Hospital Destino España',
          producto: `Cliente: ${getField('empresa', 'client') || 'Hospital España'} · Ubicación: ${getField('location', 'ubicacio') || 'Muelle GDP'}`,
          loteClinico: `Estado Excel: ${rawStatus}`,
          rangoObjetivo: '+2 °C a +8 °C (Refrigerado Clínico)',
          targetMin: 2,
          targetMax: 8,
          equipoFrio: 'Carrier Bi-Zona + Sondas EN 12830',
          estado: estadoLabel,
          progreso: progressPct,
          eta: getField('eta', 'data') || 'En tránsito por carretera',
          sensores: {
            tempActual: '+4.4 °C',
            vibracionG: '0.03 G',
            aperturaPuerta: 'Precintado · 0 aperturas',
            combustibleReserva: '86 % (Autonomía 800 km)',
            humedad: '40.0 % HR',
          },
          hitos: SHIPMENT_DATABASE['MDC-2026-0841'].hitos,
          curvaTermica: SHIPMENT_DATABASE['MDC-2026-0912'].curvaTermica,
        });
        setTrackerLoading(false);
        return;
      }
    } catch {
      // Continuar a expediciones locales de demostración
    }

    // 2. Fallback a expediciones locales de demostración MEDICAM
    const found = SHIPMENT_DATABASE[query];
    if (found) {
      setActiveShipment(found);
      setTrackerLoading(false);
      return;
    }

    setTrackerError(`Expedición "${query}" no encontrada en la red de camiones de MEDICAM España.`);
    setActiveShipment(null);
    setTrackerLoading(false);
  };

  // 6. Calculadora de Cotización en Camión Frigorífico (100 % España)
  const [quoteOrigin, setQuoteOrigin] = useState('BCN · Barcelona (ZAL Pharma)');
  const [quoteDest, setQuoteDest] = useState('MAD · Madrid (Hub Central)');
  const [quoteWeight, setQuoteWeight] = useState(650);
  const [quotePallets, setQuotePallets] = useState(4);
  const [quoteTemp, setQuoteTemp] = useState<ColdRangeSpec['id']>('refrigerado');
  const [quoteUrgency, setQuoteUrgency] = useState<'consolidado' | 'directo' | 'furgon_urgente'>('directo');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteCompany, setQuoteCompany] = useState('');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteConfirmedCode, setQuoteConfirmedCode] = useState<string | null>(null);
  const [lastSubmittedExcelRow, setLastSubmittedExcelRow] = useState<{
    codigo_expedicion: string;
    empresa: string;
    origen: string;
    destino: string;
    status: string;
    location: string;
    eta: string;
  } | null>(null);

  // Cálculo dinámico realista de flete por carretera en España
  const effectiveWeight = Math.max(quoteWeight, quotePallets * 280);
  const routeDistanceFactor =
    quoteDest.includes('SCQ') || quoteDest.includes('SVQ')
      ? 1.28
      : quoteDest.includes('PMI')
        ? 1.38
        : quoteDest.includes('MAD') || quoteDest.includes('BIO')
          ? 1.12
          : 0.92;

  const tempMultiplier: Record<ColdRangeSpec['id'], number> = {
    criogenico: 1.9,
    ultracongelado: 1.55,
    congelado: 1.25,
    refrigerado: 1.12,
    ambiente: 1.0,
  };

  const urgencyRates = {
    consolidado: { mult: 0.42, transitBaseHours: 14, label: 'Grupaje Refrigerado GDP (24h)' },
    directo: { mult: 0.78, transitBaseHours: 7, label: 'Camión Directo Dedicado (Mismo Día)' },
    furgon_urgente: { mult: 1.45, transitBaseHours: 5, label: 'Furgón Clínico Express (Puerta a Farmacia)' },
  };

  const selectedUrgency = urgencyRates[quoteUrgency];
  const selectedColdMeta = COLD_RANGES.find((r) => r.id === quoteTemp) || COLD_RANGES[3];
  const estimatedCost =
    quoteUrgency === 'furgon_urgente'
      ? Math.round(790 * routeDistanceFactor + effectiveWeight * 0.48 * tempMultiplier[quoteTemp])
      : Math.round(165 + effectiveWeight * selectedUrgency.mult * tempMultiplier[quoteTemp] * routeDistanceFactor);

  const estimatedHours = Math.round(selectedUrgency.transitBaseHours * routeDistanceFactor);

  // Vista previa ordenada de las 7 columnas exactas del Excel conectado a SheetDB
  const previewExcelColumns = {
    codigo_expedicion: quoteConfirmedCode || 'MDC-2026-XXXX (Auto)',
    empresa: quoteCompany.trim() || 'Laboratorio / Hospital España',
    origen: quoteOrigin,
    destino: quoteDest,
    status: 'En magatzem',
    location: `Muelle Climatizado · ${quoteOrigin}`,
    eta: `${estimatedHours}h tránsito carretera · ${quotePallets} palés (${effectiveWeight} kg) · ${selectedColdMeta.rango}`,
  };

  const syncSheetDbNewestFirst = async (newRow: typeof lastSubmittedExcelRow & {}) => {
    let existingValidRows: NonNullable<typeof lastSubmittedExcelRow>[] = [];
    try {
      const getRes = await fetch(`${SHEETDB_ENDPOINT}?_nc=${Date.now()}`, { cache: 'no-store' });
      const rawRows = await getRes.json();
      if (Array.isArray(rawRows)) {
        existingValidRows = rawRows
          .filter((r) => String(r?.codigo_expedicion ?? '').trim() !== '')
          .map((r) => ({
            codigo_expedicion: String(r.codigo_expedicion ?? '').trim(),
            empresa: String(r.empresa ?? '').trim(),
            origen: String(r.origen ?? '').trim(),
            destino: String(r.destino ?? '').trim(),
            status: String(r.status ?? '').trim(),
            location: String(r.location ?? '').trim(),
            eta: String(r.eta ?? '').trim(),
          }));
      }
    } catch {
      // Si falla la lectura previa, insertar al menos la nueva cotización
    }

    if (existingValidRows.length > 0) {
      await Promise.allSettled(
        existingValidRows.map((row) =>
          fetch(
            `${SHEETDB_ENDPOINT}/codigo_expedicion/${encodeURIComponent(row.codigo_expedicion)}`,
            { method: 'DELETE' }
          )
        )
      );
    }

    await fetch(SHEETDB_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        data: [newRow, ...existingValidRows],
      }),
    });
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    const newCode = `MDC-2026-${Math.floor(1000 + Math.random() * 8999)}`;

    // Objeto ordenado exactamente según las 7 columnas preescritas del Excel (SheetDB):
    // 1. codigo_expedicion | 2. empresa | 3. origen | 4. destino | 5. status | 6. location | 7. eta
    const orderedExcelRow = {
      codigo_expedicion: newCode,
      empresa: (quoteCompany || 'Laboratorio / Hospital España').trim(),
      origen: quoteOrigin,
      destino: quoteDest,
      status: 'En magatzem',
      location: `Muelle Climatizado · ${quoteOrigin}`,
      eta: `${estimatedHours}h tránsito carretera · ${quotePallets} palés (${effectiveWeight} kg) · ${selectedColdMeta.rango}`,
    };

    try {
      await Promise.allSettled([
        fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            ...orderedExcelRow,
            email_cliente: quoteEmail || 'No indicado',
            peso_bruto_kg: quoteWeight,
            europales: quotePallets,
            peso_tasable_kg: effectiveWeight,
            rango_termico: `${selectedColdMeta.nombre} (${selectedColdMeta.rango})`,
            modalidad_camion: selectedUrgency.label,
            estimacion_eur: `${estimatedCost} EUR`,
            buzon_comercial: 'comercial@medicam.cat',
            destinatario_academico: 'adam043@vidalibarraquer.net',
            _subject: `Cotització MEDICAM [${newCode}] - ${quoteOrigin} -> ${quoteDest}`,
          }),
        }),
        syncSheetDbNewestFirst(orderedExcelRow),
      ]);
    } finally {
      setLastSubmittedExcelRow(orderedExcelRow);
      setQuoteConfirmedCode(newCode);
      setQuoteSubmitting(false);
    }
  };

  // 7. Modal Legal
  const [legalModal, setLegalModal] = useState<'gdp' | 'atp' | 'privacidad' | null>(null);

  const t = UI_COPY[lang];

  return (
    <div className="min-h-screen bg-[#F4F7F2] text-[#14360E] flex flex-col selection:bg-[#F5E626] selection:text-[#14360E]">
      {/* ===================================================================== */}
      {/* BARRA OPERATIVA SUPERIOR INSTITUCIONAL (VERDE BOSQUE + AMARILLO)       */}
      {/* ===================================================================== */}
      <div className="bg-[#173E0D] text-white border-b border-[#2E741B] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#F5E626] font-semibold">
              <HeartPulse className="w-3.5 h-3.5 text-[#F5E626]" />
              {t.deskStatus}
            </span>
            <span aria-hidden="true" className="text-white/30 hidden sm:inline">|</span>
            <a
              href="mailto:operacions@medicam.cat"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-[#F5E626] transition-colors font-mono"
            >
              <Mail className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>operacions@medicam.cat</span>
            </a>
            <span aria-hidden="true" className="text-white/30 hidden md:inline">|</span>
            <a
              href="tel:+34932458800"
              className="hidden md:inline-flex items-center gap-1.5 text-white/90 hover:text-[#F5E626] transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-[#A3E635]" />
              <span className="font-sans text-white/80">{t.operacionesLabel}</span>
              <strong className="text-white">+34 932 45 88 00</strong>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#F5E626] font-semibold">
              <GraduationCap className="w-4 h-4 text-[#F5E626] shrink-0" />
              <span>{t.academicNotice}</span>
            </span>
            <div className="flex items-center gap-1 bg-[#102C09] border border-[#2E741B] rounded-md p-0.5">
              <Globe className="w-3.5 h-3.5 text-[#A3E635] ml-1.5 mr-0.5" />
              {(['ca', 'es', 'en'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-2 py-0.5 text-[11px] font-bold uppercase rounded transition-colors cursor-pointer ${
                    lang === code ? 'bg-[#F5E626] text-[#14360E]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* CABECERA BLANCA INSTITUCIONAL CON EMBLEMA COPA DE HIGÍA              */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-[#2E741B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zona 1: Emblema Copa de Higía + Marca limpia */}
          <a href="#inicio" className="flex items-center gap-3 whitespace-nowrap shrink-0">
            <PharmacyChaliceEmblem />
            <span className="text-xl font-extrabold tracking-tight text-[#14360E]">
              MEDICAM
            </span>
          </a>

          {/* Zona 2: Enlaces concisos */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#2E5426]">
            <a href="#servicios" className="hover:text-[#2E741B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              {t.navServices}
            </a>
            <a href="#corredores" className="hover:text-[#2E741B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              {t.navCorridors}
            </a>
            <a href="#espectro" className="hover:text-[#2E741B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              {t.navSpectrum}
            </a>
            <a href="#flota" className="hover:text-[#2E741B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              {t.navFleet}
            </a>
            <a href="#cotizador" className="hover:text-[#2E741B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              {t.navQuote}
            </a>
            <a
              href="/tracking"
              onClick={(e) => {
                e.preventDefault();
                navigateToTracking();
              }}
              className="hover:text-[#2E741B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 font-bold text-[#2E741B]"
            >
              /tracking
            </a>
          </nav>

          {/* Zona 3: Botón Clave Verde Farmacia */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/tracking"
              onClick={(e) => {
                e.preventDefault();
                navigateToTracking();
              }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2E741B] hover:bg-[#225814] text-white text-sm font-bold transition-colors whitespace-nowrap shrink-0"
            >
              <Cross className="w-4 h-4 text-[#F5E626]" />
              {t.trackCta}
            </a>

            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#14360E] hover:bg-[#F4F7F2] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2">
            {[
              { href: '#servicios', label: t.navServices },
              { href: '#corredores', label: t.navCorridors },
              { href: '#espectro', label: t.navSpectrum },
              { href: '#flota', label: t.navFleet },
              { href: '#tracker', label: t.trackCta },
              { href: '#cotizador', label: t.navQuote },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#14360E] hover:bg-[#F4F7F2]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/tracking"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigateToTracking();
              }}
              className="block px-3 py-2.5 rounded-lg text-sm font-bold text-white bg-[#2E741B]"
            >
              Portal Tracking (/tracking)
            </a>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ===================================================================== */}
        {/* SECCIÓN HERO INSPIRADA EN REFERENCIA FARMACÉUTICA VERDE DUOTONO       */}
        {/* ===================================================================== */}
        <section id="inicio" className="relative bg-[#2E741B] clinical-grid-bg text-white overflow-hidden">
          {/* Fotografía nítida de camión frigorífico a todo color con gradiente equilibrado */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <img
              src="/src/assets/images/hero_pharma_truck_spain_1795018963010.jpg"
              alt="Camión frigorífico farmacéutico de MEDICAM circulando por autovía española"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-right brightness-110 contrast-105 saturate-115 opacity-55"
            />
          </div>

          {/* Degradado verde farmacia con alto contraste para lectura a la izquierda y foto clara a la derecha */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(100deg, rgba(23, 62, 13, 0.94) 0%, rgba(36, 94, 21, 0.84) 44%, rgba(46, 116, 27, 0.45) 72%, rgba(46, 116, 27, 0.18) 100%)',
            }}
          />

          {/* Motivos médicos geométricos, cruz farmacéutica sutil y arcos curvos translúcidos */}
          <svg
            viewBox="0 0 1440 720"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            {/* Traza médica de red logística de fondo en zona izquierda */}
            <g opacity="0.14" stroke="#F5E626" fill="none">
              <circle cx="170" cy="180" r="110" strokeWidth="1.2" strokeDasharray="6 6" />
              <circle cx="170" cy="180" r="175" strokeWidth="1" />
              <path d="M150 180H190M170 160V200" strokeWidth="4" strokeLinecap="round" />
              <path d="M0 540 H240 L275 495 L305 585 L335 520 L360 540 H620" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            {/* Arcos curvos característicos del cartel farmacéutico */}
            <path
              d="M 460 720 C 660 470, 940 270, 1440 110 L 1440 230 C 1020 380, 790 530, 620 720 Z"
              fill="#A3E635"
              fillOpacity="0.18"
            />
            <path
              d="M 730 720 C 890 530, 1110 385, 1440 285 L 1440 365 C 1170 465, 975 575, 845 720 Z"
              fill="#F5E626"
              fillOpacity="0.14"
            />
          </svg>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Columna Izquierda: Titular Blanco Fuerte + Destacado Amarillo + Lista Hospitales */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="text-xs font-mono font-semibold text-white/90 mb-3">
                  {t.heroEyebrow}
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
                  “{t.heroTitle}”
                </h1>

                {/* Bloque destacado en Amarillo Lima Farmacéutico */}
                <p className="mt-5 text-xl sm:text-2xl font-bold text-[#F5E626] tracking-tight">
                  {t.heroHighlight}
                </p>

                {/* Relación de centros hospitalarios y rutas (estilo lista institucional) */}
                <div className="mt-5 space-y-2 text-sm text-white/95 max-w-2xl">
                  <div className="font-semibold text-white">Cobertura Directa en Hospitales y Centros Sanitarios:</div>
                  <p className="leading-relaxed">
                    <strong className="font-bold text-white">-Hospital Universitari Vall d’Hebron y Clínic (Barcelona)</strong>, enlace diario desde ZAL Pharma por A-2 y AP-7
                  </p>
                  <p className="leading-relaxed">
                    <strong className="font-bold text-white">-Servicio de Farmacia Hospitalaria La Paz y 12 de Octubre (Madrid)</strong>
                  </p>
                  <p className="leading-relaxed">
                    <strong className="font-bold text-white">-Hospital Universitario Virgen Macarena y Virgen del Rocío (Sevilla)</strong>
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#cotizador"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#F5E626] hover:bg-[#E5D618] text-[#14360E] font-extrabold text-sm transition-colors whitespace-nowrap shadow-lg"
                  >
                    <Syringe className="w-4 h-4" />
                    {t.heroPrimaryCta}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#tracker"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border-2 border-white/75 bg-[#173E0D]/80 hover:bg-[#173E0D] text-white font-bold text-sm transition-colors whitespace-nowrap"
                  >
                    <Search className="w-4 h-4 text-[#F5E626]" />
                    {t.heroSecondaryCta}
                  </a>
                </div>
              </div>

              {/* Columna Derecha: Ibuprofeno 600 mg en 3D Interactivo giratorio como un globo */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <Ibuprofen3D lang={lang} />
              </div>
            </div>

            {/* Consola Horizontal de Telemetría Satelital en Carretera */}
            <div className="mt-8 bg-[#173E0D]/92 border border-[#A3E635]/40 rounded-2xl p-4 sm:p-5 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#2E741B] border border-[#A3E635]/40 flex items-center justify-center shrink-0">
                    <HeartPulse className="w-5 h-5 text-[#F5E626]" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#A3E635] block">Telemetría Satelital en Carretera</span>
                    <h2 className="text-sm font-bold text-white font-mono">
                      {currentHeroTruck.unidad}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 p-1 bg-[#102C09] rounded-lg border border-white/15">
                    {HERO_TELEMETRY_TRUCKS.map((tr, i) => (
                      <button
                        key={tr.id}
                        type="button"
                        onClick={() => setHeroTruckIdx(i)}
                        className={`py-1.5 px-3 text-xs font-mono rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          heroTruckIdx === i
                            ? 'bg-[#F5E626] text-[#14360E] font-extrabold'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        {tr.id}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setTelemetryLive(!telemetryLive)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2E741B] border border-[#F5E626]/60 text-xs font-mono text-[#F5E626] hover:bg-[#235A14] transition-colors cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    {telemetryLive ? 'LIVE' : 'PAUSA'}
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                <div className="lg:col-span-4 p-3 rounded-lg bg-[#215314] border border-white/15">
                  <div className="flex items-center justify-between text-xs font-mono text-white">
                    <span>{currentHeroTruck.origenCode}</span>
                    <div className="flex-1 mx-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-white/40" />
                      <Truck className="w-3.5 h-3.5 text-[#F5E626]" />
                      <span className="h-px flex-1 border-t border-dashed border-white/40" />
                    </div>
                    <span className="text-[#F5E626] font-bold">{currentHeroTruck.destinoCode}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-white/85 gap-2">
                    <span>{currentHeroTruck.ruta}</span>
                    <span className="text-[#A3E635] font-semibold text-right">{currentHeroTruck.carga}</span>
                  </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-[#215314] border border-white/15">
                    <span className="text-[11px] text-white/80 flex items-center gap-1.5">
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-[#F5E626]" />
                      Temp. Caja
                    </span>
                    <div className="mt-1 flex items-baseline gap-1 font-mono">
                      <span className="text-xl font-bold text-[#F5E626]">{liveHeroTemp}</span>
                      <span className="text-xs text-white/85">°C</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#215314] border border-white/15">
                    <span className="text-[11px] text-white/80 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-[#A3E635]" />
                      Velocidad Ruta
                    </span>
                    <div className="mt-1 font-mono">
                      <span className="text-lg font-bold text-white">{currentHeroTruck.velocidad}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#215314] border border-white/15">
                    <span className="text-[11px] text-white/80 flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-[#A3E635]" />
                      Humedad Relativa
                    </span>
                    <div className="mt-1 font-mono">
                      <span className="text-lg font-bold text-white">{currentHeroTruck.humedad}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#215314] border border-white/15">
                    <span className="text-[11px] text-white/80 flex items-center gap-1.5">
                      <ShieldPlus className="w-3.5 h-3.5 text-[#F5E626]" />
                      Precinto Sanitario
                    </span>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#A3E635]">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{currentHeroTruck.sello}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Franja inferior de métricas verificadas en carretera */}
            <div className="mt-10 pt-7 border-t border-white/20 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl font-bold font-mono text-white">99.97 %</div>
                <div className="text-xs text-white/85 mt-1">Estabilidad térmica anual en camiones ATP FRC</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-[#F5E626]">0 Rupturas</div>
                <div className="text-xs text-white/85 mt-1">Traslado puerta a farmacia hospitalaria sin trasbordos</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-white">48 Unidades</div>
                <div className="text-xs text-white/85 mt-1">Tráileres bi-zona, rígidos 18t y furgones clínicos</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-[#A3E635]">medicam.cat</div>
                <div className="text-xs text-white/85 mt-1">Bases propias en Barcelona ZAL y Madrid con QP</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* BENTO GRID DE SERVICIOS HOSPITALARIOS Y FARMACÉUTICOS EN CAMIÓN       */}
        {/* ===================================================================== */}
        <section id="servicios" className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2E741B] uppercase tracking-wider">
                  <Stethoscope className="w-4 h-4" />
                  Logística Hospitalaria y Farmacéutica en Camión
                </div>
                <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14360E] text-balance">
                  Transporte sanitario en camión adaptado a cada medicamento
                </h2>
              </div>
              <p className="text-slate-600 text-sm max-w-md leading-relaxed">
                Cada vehículo opera como una cámara limpia móvil certificada ATP Clase FRC, conectando laboratorios con farmacias hospitalarias sin rupturas térmicas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Tarjeta Bento 01 (Ancha 7 cols - Verde Farmacia Protagonista) */}
              <article className="lg:col-span-7 bg-[#2E741B] text-white rounded-2xl p-8 flex flex-col justify-between border border-[#225814]">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-semibold text-[#F5E626]">01 · Furgón Clínico Dedicado (Puerta a Farmacia)</span>
                    <div className="w-11 h-11 rounded-xl bg-[#173E0D] border border-white/20 flex items-center justify-center">
                      <Dna className="w-5 h-5 text-[#F5E626]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-snug">
                    Entrega Directa de Medicamentos Hospitalarios y Terapias Celulares
                  </h3>
                  <p className="mt-3 text-sm text-white/90 leading-relaxed max-w-xl">
                    Vehículos exclusivos directos desde el laboratorio hasta el servicio de Farmacia Hospitalaria o Hematología (Vall d’Hebron, La Paz, La Fe, Virgen Macarena, Virgen del Rocío) con bancada antivibración y doble sonda PT100 para CAR-T y biológicos.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                  <span className="text-[#F5E626] inline-flex items-center gap-1.5 font-semibold">
                    <Syringe className="w-4 h-4" />
                    Salida inmediata desde BCN / MAD en &lt; 30 min
                  </span>
                  <a href="#cotizador" className="text-[#14360E] bg-[#F5E626] hover:bg-[#E5D618] px-4 py-2 rounded-lg font-sans font-extrabold transition-colors">
                    Solicitar furgón directo →
                  </a>
                </div>
              </article>

              {/* Tarjeta Bento 02 (5 cols - Blanco Clínico) */}
              <article className="lg:col-span-5 bg-[#F4F7F2] rounded-2xl border border-[#2E741B]/20 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold text-[#2E741B]">02 · Tráileres Bi-Temperatura FRC</span>
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#2E741B]/25 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-[#2E741B]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#14360E]">
                    Líneas Diarias Bi-Zona por Toda la Península y Baleares
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Camiones frigoríficos de 18 t y 33 palés con mamparo isotermo divisor para transportar en el mismo viaje vacunas congeladas (-20 °C) y fármacos refrigerados (+2/+8 °C), más enlace Ro-Ro 380V a Palma.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-[#2E741B]/15 flex items-center justify-between text-xs text-slate-600 font-mono">
                  <span>ATP Clase FRC · Doble evaporador</span>
                  <a href="#espectro" className="text-[#2E741B] font-sans font-bold hover:underline">
                    Ver rangos →
                  </a>
                </div>
              </article>

              {/* Tarjeta Bento 03 (5 cols - Fotografía Nítida a Todo Color) */}
              <article className="lg:col-span-5 bg-[#F4F7F2] rounded-2xl border border-[#2E741B]/20 overflow-hidden flex flex-col">
                <div className="h-56 bg-slate-100 relative overflow-hidden">
                  <img
                    src="/src/assets/images/fleet_clinical_delivery_van_1795018963295.jpg"
                    alt="Furgón clínico y camión farmacéutico MEDICAM entregando medicamentos en hospital universitario español"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center brightness-[1.03] contrast-[1.06] saturate-[1.08]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-[#2E741B]">03 · Capilaridad Hospitalaria</span>
                      <Hospital className="w-5 h-5 text-[#2E741B]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#14360E]">
                      Entrega Directa en Farmacia Hospitalaria y Ensayos Clínicos
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Furgones silenciosos ECO/CERO autorizados para acceso a recintos hospitalarios y centros de investigación clínica en todo el territorio nacional.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#2E741B]/15 text-xs font-mono text-[#2E741B] font-bold flex items-center gap-1.5">
                    <ClipboardCheck className="w-4 h-4" />
                    Recepción biométrica y albarán térmico digital
                  </div>
                </div>
              </article>

              {/* Tarjeta Bento 04 (Ancha 7 cols - Validación Médica AEMPS) */}
              <article className="lg:col-span-7 bg-[#F4F7F2] rounded-2xl border border-[#2E741B]/20 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold text-[#2E741B]">04 · Auditoría Clínica &amp; Bioseguridad</span>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#2E741B]/25 flex items-center justify-center">
                        <Microscope className="w-5 h-5 text-[#2E741B]" />
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[#2E741B] flex items-center justify-center">
                        <ShieldPlus className="w-5 h-5 text-[#F5E626]" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#14360E]">
                    Mapeo Térmico 3D, Termógrafos EN 12830 y Supervisión QP
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Cada caja frigorífica cuenta con cualificación IQ/OQ/PQ en verano e invierno español, precintos electrónicos TAPA TSR-1 contra robo y registro de temperatura inmutable validado por nuestra Persona Cualificada (QP) conforme a la AEMPS.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-[#2E741B]/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-[#2E741B]/20">
                    <span className="text-slate-500 block">Calibración Sondas</span>
                    <strong className="text-[#14360E] font-mono">UNE-EN 12830 (Anual)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#2E741B]/20">
                    <span className="text-slate-500 block">Seguridad en Ruta</span>
                    <strong className="text-[#2E741B] font-mono">Nivel TAPA TSR-1</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#2E741B]/20">
                    <span className="text-slate-500 block">Certificado Lote</span>
                    <strong className="text-[#14360E] font-mono">Curva PDF a la Entrega</strong>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <MedicalPulseDivider />

        {/* ===================================================================== */}
        {/* MAPA INTERACTIVO DE CORREDORES DE AUTOVÍA EN ESPAÑA                   */}
        {/* ===================================================================== */}
        <section id="corredores" className="py-20 bg-[#F4F7F2] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2E741B] uppercase tracking-wider">
                <Navigation className="w-4 h-4" />
                Red Terrestre Exclusiva en España
              </div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14360E] text-balance">
                Autovías farmacéuticas y hospitales conectados por carretera
              </h2>
              <p className="mt-3 text-slate-600 text-base">
                Selecciona una base logística en el mapa de España para consultar los tiempos de tránsito en camión, capacidad de muelles climatizados y hospitales atendidos.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Mapa Vectorial Interactivo de Corredores de Carretera en España */}
              <div className="lg:col-span-7 bg-[#173E0D] clinical-grid-bg rounded-2xl p-5 sm:p-6 border border-[#2E741B] flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-white/85 mb-3">
                  <span className="font-mono text-[#F5E626] font-bold">CORREDORES DE CAMIÓN FRIGORÍFICO · ESPAÑA</span>
                  <span>Selecciona una plataforma</span>
                </div>

                <svg viewBox="0 0 560 360" className="w-full h-auto select-none">
                  {/* Silueta Península Ibérica */}
                  <path
                    d="M 88 46 L 182 40 L 285 52 L 420 88 L 456 114 L 434 148 L 382 176 L 366 224 L 328 278 L 266 316 L 182 318 L 146 292 L 128 250 L 136 194 L 120 136 L 84 88 Z"
                    fill="#276217"
                    stroke="#A3E635"
                    strokeOpacity="0.45"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  {/* Islas Baleares */}
                  <path d="M 442 186 L 478 178 L 486 196 L 456 204 Z" fill="#276217" stroke="#A3E635" strokeOpacity="0.55" strokeWidth="1.2" />
                  <path d="M 418 206 L 432 202 L 434 214 L 420 214 Z" fill="#276217" stroke="#A3E635" strokeOpacity="0.55" strokeWidth="1.2" />

                  {/* Trazado de Autovías Sanitarias */}
                  {SPAIN_HUBS.map((hub) => {
                    const isSelected = hub.codigo === selectedHubCode;
                    const hubY = hub.svgY - 8;
                    return (
                      <g key={`road-${hub.codigo}`}>
                        {hub.codigo !== 'MAD' && hub.codigo !== 'PMI' && (
                          <line
                            x1={256}
                            y1={160}
                            x2={hub.svgX}
                            y2={hubY}
                            stroke={isSelected ? '#F5E626' : '#A3E635'}
                            strokeWidth={isSelected ? 2.5 : 1.1}
                            strokeOpacity={isSelected ? 0.95 : 0.4}
                            strokeDasharray={isSelected ? undefined : '4 4'}
                          />
                        )}
                        {hub.codigo !== 'BCN' && (
                          <line
                            x1={432}
                            y1={124}
                            x2={hub.svgX}
                            y2={hubY}
                            stroke={isSelected ? '#F5E626' : '#A3E635'}
                            strokeWidth={isSelected ? 2 : 0.9}
                            strokeOpacity={isSelected ? 0.85 : 0.28}
                            strokeDasharray={hub.codigo === 'PMI' ? '2 3' : '3 4'}
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Nodos interactivos de bases de camión */}
                  {SPAIN_HUBS.map((hub) => {
                    const isSelected = hub.codigo === selectedHubCode;
                    const hubY = hub.svgY - 8;
                    return (
                      <g
                        key={hub.codigo}
                        onClick={() => setSelectedHubCode(hub.codigo)}
                        className="cursor-pointer"
                      >
                        {isSelected && (
                          <circle
                            cx={hub.svgX}
                            cy={hubY}
                            r="16"
                            fill="#F5E626"
                            fillOpacity="0.3"
                          />
                        )}
                        <circle
                          cx={hub.svgX}
                          cy={hubY}
                          r={isSelected ? 8 : 6}
                          fill={isSelected ? '#F5E626' : '#4FA825'}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        <text
                          x={hub.svgX}
                          y={hubY - 12}
                          textAnchor="middle"
                          className={`text-[11px] font-mono font-bold ${isSelected ? 'fill-[#F5E626]' : 'fill-white'}`}
                        >
                          {hub.codigo}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/15">
                  {SPAIN_HUBS.map((hub) => (
                    <button
                      key={hub.codigo}
                      type="button"
                      onClick={() => setSelectedHubCode(hub.codigo)}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                        hub.codigo === selectedHubCode
                          ? 'bg-[#F5E626] text-[#14360E] font-extrabold'
                          : 'bg-[#215314] text-white/90 border border-white/20 hover:border-[#F5E626]'
                      }`}
                    >
                      {hub.codigo} · {hub.ciudad}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ficha Operativa de la Base Seleccionada */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#2E741B]/25 p-7 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="pb-4 border-b border-slate-200 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#2E741B]">
                        {activeSpainHub.comunidad} · {activeSpainHub.corredor}
                      </span>
                      <h3 className="text-2xl font-bold text-[#14360E] mt-1">
                        {activeSpainHub.ciudad} ({activeSpainHub.codigo})
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{activeSpainHub.plataforma}</p>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-[#F4F7F2] border border-[#2E741B]/25 flex items-center justify-center shrink-0">
                      <Cross className="w-5 h-5 text-[#2E741B]" />
                    </div>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#2E741B]" />
                        Tiempo de Tránsito en Camión
                      </span>
                      <p className="font-mono font-bold text-[#14360E] mt-1">
                        {activeSpainHub.tiempoDesdeBase}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <ThermometerSnowflake className="w-3.5 h-3.5 text-[#2E741B]" />
                        Muelles y Cámaras Frigoríficas
                      </span>
                      <p className="text-slate-700 mt-1 leading-relaxed">
                        {activeSpainHub.capacidades}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <Syringe className="w-3.5 h-3.5 text-[#2E741B]" />
                        Especialidad Farmacológica
                      </span>
                      <p className="text-slate-700 mt-1">
                        {activeSpainHub.cargaPrincipal}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-2">
                        <Hospital className="w-3.5 h-3.5 text-[#2E741B]" />
                        Hospitales Conectados Directamente
                      </span>
                      <ul className="space-y-1.5">
                        {activeSpainHub.hospitalesClave.map((hosp) => (
                          <li key={hosp} className="flex items-center gap-2 text-xs text-[#14360E] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E741B] shrink-0" />
                            <span>{hosp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200">
                  <a
                    href="#cotizador"
                    onClick={() => {
                      if (activeSpainHub.codigo === 'BCN') {
                        setQuoteOrigin(activeSpainHub.optionLabel);
                      } else {
                        setQuoteDest(activeSpainHub.optionLabel);
                      }
                    }}
                    className="w-full py-3 px-4 rounded-lg bg-[#2E741B] hover:bg-[#225814] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    Cotizar camión hacia/desde {activeSpainHub.ciudad}
                    <ArrowRight className="w-4 h-4 text-[#F5E626]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* ESPECTRO DE CADENA DE FRÍO CON ICONOGRAFÍA MÉDICA                     */}
        {/* ===================================================================== */}
        <section id="espectro" className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2E741B] uppercase tracking-wider">
                <FlaskConical className="w-4 h-4" />
                Espectro Térmico en Carretera
              </div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14360E] text-balance">
                Cobertura completa de -196 °C a +25 °C
              </h2>
              <p className="mt-3 text-slate-600 text-base">
                Selecciona un rango térmico para consultar la tecnología de refrigeración embarcada, tolerancia en autovía y medicamentos habituales.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-[#F4F7F2] rounded-xl border border-[#2E741B]/20 mb-8">
              {COLD_RANGES.map((range) => {
                const isSelected = range.id === activeRangeId;
                return (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => setActiveRangeId(range.id)}
                    className={`px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#2E741B] text-white shadow-sm'
                        : 'text-[#14360E] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[#F5E626]' : 'text-[#2E741B]'}`}>
                        {range.rangoCorto}
                      </span>
                      {getColdRangeIcon(range.id, isSelected)}
                    </div>
                    <div className="text-xs font-semibold mt-1 truncate">
                      {range.nombre.split(' (')[0]}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#F4F7F2] rounded-2xl border border-[#2E741B]/20 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div className="pb-5 border-b border-[#2E741B]/15 flex flex-wrap items-baseline justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-[#2E741B] font-bold">
                      Especificación Clínica en Vehículo
                    </span>
                    <h3 className="text-2xl font-bold text-[#14360E] mt-1">
                      {activeColdSpec.nombre}
                    </h3>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-[#2E741B]">
                    {activeColdSpec.rango}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Carrocería / Embalaje Validado</span>
                    <p className="text-[#14360E] font-medium mt-1 leading-relaxed">
                      {activeColdSpec.embalaje}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Autonomía Térmica en Ruta</span>
                    <p className="text-[#14360E] font-medium mt-1 leading-relaxed">
                      {activeColdSpec.autonomia}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Tolerancia y Consigna</span>
                    <p className="text-[#14360E] font-medium mt-1 leading-relaxed">
                      {activeColdSpec.tolerancia}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Instrumentación IoT</span>
                    <p className="text-[#14360E] font-medium mt-1 leading-relaxed">
                      {activeColdSpec.monitoreo}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2E741B]/15">
                  <span className="text-xs font-semibold text-slate-500 block">Protocolo de Carga y Entrega</span>
                  <p className="text-sm text-[#14360E] mt-1 leading-relaxed">
                    {activeColdSpec.protocolo}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-xl border border-[#2E741B]/20 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#14360E] uppercase tracking-wider mb-4">
                    <Pill className="w-4 h-4 text-[#2E741B]" />
                    Medicamentos y Cargas Habituales
                  </div>
                  <ul className="space-y-3">
                    {activeColdSpec.medicamentos.map((med) => (
                      <li key={med} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#2E741B] shrink-0 mt-0.5" />
                        <span>{med}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200">
                  <a
                    href="#cotizador"
                    onClick={() => setQuoteTemp(activeColdSpec.id)}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#2E741B] hover:bg-[#225814] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    Cotizar camión en este rango
                    <ArrowRight className="w-4 h-4 text-[#F5E626]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* FLOTA DE CAMIONES FRIGORÍFICOS Y UNIDADES CLÍNICAS                    */}
        {/* ===================================================================== */}
        <section id="flota" className="py-20 bg-[#F4F7F2] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2E741B] uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  Parque Móvil Certificado ATP FRC
                </div>
                <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14360E]">
                  Flota de Camiones Frigoríficos y Unidades Clínicas
                </h2>
                <p className="mt-3 text-slate-600 text-base">
                  Tráileres bi-zona de gran capacidad, rígidos hospitalarios de 18 toneladas y furgones isotermos criogénicos dedicados exclusivamente al transporte médico en España.
                </p>
              </div>

              <div className="inline-flex items-center gap-1 p-1 bg-white border border-[#2E741B]/25 rounded-lg self-start">
                {[
                  { id: 'todos', label: 'Toda la Flota' },
                  { id: 'pesado', label: 'Tráileres y Rígidos' },
                  { id: 'clinico', label: 'Unidades Clínicas' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFleetFilter(tab.id as typeof fleetFilter)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      fleetFilter === tab.id
                        ? 'bg-[#2E741B] text-white'
                        : 'text-[#14360E] hover:bg-[#F4F7F2]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFleet.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#2E741B]/20 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-56 bg-slate-100 overflow-hidden relative">
                      <img
                        src={item.imagen}
                        alt={item.modelo}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center brightness-[1.03] contrast-[1.06] saturate-[1.08]"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                    </div>
                    <div className="p-6">
                      <div className="text-xs font-mono text-[#2E741B] font-bold">
                        {item.categoria === 'pesado' ? 'Transporte Pesado FRC' : 'Unidad Clínica Especial'} · {item.certificacion}
                      </div>
                      <h3 className="text-lg font-bold text-[#14360E] mt-1">{item.modelo}</h3>
                      <p className="text-xs text-slate-500 mt-1">{item.subtitulo}</p>

                      <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs">
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-500">Capacidad:</span>
                          <span className="font-mono font-semibold text-[#14360E] text-right">{item.capacidad}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-500">Autonomía:</span>
                          <span className="font-mono font-semibold text-[#14360E] text-right">{item.autonomia}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-500">Rango Térmico:</span>
                          <span className="font-mono font-bold text-[#2E741B] text-right">{item.rangoTermico}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-[#F4F7F2] border-t border-[#2E741B]/15 grid grid-cols-2 gap-3 text-[11px]">
                    {item.especificaciones.map((spec) => (
                      <div key={spec.etiqueta}>
                        <span className="text-slate-500 block">{spec.etiqueta}</span>
                        <strong className="font-mono text-[#14360E]">{spec.valor}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* RASTREADOR SATELITAL DE CAMIONES EN TIEMPO REAL                        */}
        {/* ===================================================================== */}
        <section id="tracker" className="py-20 bg-[#2E741B] clinical-grid-bg text-white border-b border-[#225814]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#F5E626] uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  Live Cold Chain Truck Tracker
                </div>
                <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Rastreador GPS de Camiones y Telemetría Clínica en Vivo
                </h2>
                <p className="mt-3 text-white/90 text-base">
                  Audita cualquier expedición terrestre de MEDICAM en España o abre el portal dedicado <span className="font-mono text-[#F5E626]">/tracking</span> conectado a la base de datos Excel en SheetDB.
                </p>
              </div>
              <a
                href="/tracking"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToTracking(activeShipment?.codigo);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F5E626] hover:bg-[#E5D618] text-[#14360E] font-extrabold text-xs sm:text-sm transition-colors shrink-0 self-start md:self-auto"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Abrir Portal /tracking (Excel En Vivo)
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-[#173E0D] rounded-2xl border border-[#84CC16]/35 p-5 sm:p-6 mb-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTrackShipment();
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-[#F5E626] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Introduce código de expedición (ej: MDC-2026-0841)..."
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#215314] border border-white/25 text-white font-mono text-sm placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#F5E626]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={trackerLoading}
                  className="px-6 py-3 rounded-lg bg-[#F5E626] hover:bg-[#E5D618] text-[#14360E] font-extrabold text-sm transition-colors inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  {trackerLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Consultando...
                    </>
                  ) : (
                    <>
                      Auditar Camión
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-white/85">Expediciones en ruta (España):</span>
                {['MDC-2026-4542', ...Object.keys(SHIPMENT_DATABASE)].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleTrackShipment(code)}
                    className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer ${
                      activeShipment?.codigo === code
                        ? 'bg-[#F5E626] text-[#14360E] font-extrabold'
                        : 'bg-[#215314] text-white border border-white/25 hover:border-[#F5E626]'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {trackerError && (
              <div className="p-4 rounded-xl bg-red-950/75 border border-red-400/60 text-red-100 flex items-center gap-3 text-sm mb-8">
                <AlertTriangle className="w-5 h-5 text-red-300 shrink-0" />
                <span>{trackerError}</span>
              </div>
            )}

            {activeShipment && (
              <div className="bg-white text-[#14360E] rounded-2xl border border-[#2E741B]/25 p-6 sm:p-8 space-y-8 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
                      <span>{activeShipment.unidad}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeShipment.equipoFrio}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <h3 className="text-2xl font-mono font-bold text-[#14360E]">
                        {activeShipment.codigo}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E741B]">
                        <CheckCircle2 className="w-4 h-4" />
                        {activeShipment.estado} ({activeShipment.progreso} %)
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {activeShipment.producto} · <span className="font-mono font-semibold text-[#2E741B]">{activeShipment.loteClinico}</span> · {activeShipment.rangoObjetivo}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <span className="text-xs text-slate-500 block">ETA / Llegada a Hospital</span>
                    <span className="text-base font-mono font-bold text-[#14360E]">
                      {activeShipment.eta}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                    <span>{activeShipment.origen}</span>
                    <span>{activeShipment.destino}</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F4F7F2] rounded-full overflow-hidden border border-[#2E741B]/20">
                    <div
                      className="h-full bg-[#2E741B] transition-all duration-500"
                      style={{ width: `${activeShipment.progreso}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-4 rounded-lg bg-[#F4F7F2] border border-[#2E741B]/15">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <HeartPulse className="w-3.5 h-3.5 text-[#2E741B]" />
                      Temp. Caja
                    </div>
                    <div className="text-xl font-mono font-bold text-[#14360E] mt-1">
                      {activeShipment.sensores.tempActual}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F4F7F2] border border-[#2E741B]/15">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Activity className="w-3.5 h-3.5 text-[#2E741B]" />
                      Vibración Eje
                    </div>
                    <div className="text-sm font-mono font-bold text-[#14360E] mt-1.5">
                      {activeShipment.sensores.vibracionG}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F4F7F2] border border-[#2E741B]/15">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <ShieldPlus className="w-3.5 h-3.5 text-[#2E741B]" />
                      Puertas Traseras
                    </div>
                    <div className="text-sm font-mono font-bold text-[#2E741B] mt-1.5">
                      {activeShipment.sensores.aperturaPuerta}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F4F7F2] border border-[#2E741B]/15">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <BatteryCharging className="w-3.5 h-3.5 text-[#2E741B]" />
                      Autonomía Frío
                    </div>
                    <div className="text-sm font-mono font-bold text-[#14360E] mt-1.5">
                      {activeShipment.sensores.combustibleReserva}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F4F7F2] border border-[#2E741B]/15 col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <FlaskConical className="w-3.5 h-3.5 text-[#2E741B]" />
                      Humedad
                    </div>
                    <div className="text-lg font-mono font-bold text-[#14360E] mt-1">
                      {activeShipment.sensores.humedad}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-slate-200">
                  <div className="lg:col-span-7">
                    <h4 className="text-sm font-bold text-[#14360E] mb-3">
                      Registro Lineal de Estabilidad Térmica (EN 12830)
                    </h4>
                    <ThermalStabilityChart
                      points={activeShipment.curvaTermica}
                      targetMin={activeShipment.targetMin}
                      targetMax={activeShipment.targetMax}
                    />
                  </div>

                  <div className="lg:col-span-5">
                    <h4 className="text-sm font-bold text-[#14360E] mb-3">
                      Bitácora de Ruta y Cadena de Custodia
                    </h4>
                    <div className="space-y-4">
                      {activeShipment.hitos.map((hito) => (
                        <div key={hito.hora + hito.titulo} className="flex items-start gap-3 text-xs">
                          <span
                            className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                              hito.completado ? 'bg-[#2E741B]' : 'bg-slate-300'
                            }`}
                          />
                          <div>
                            <div className="font-mono text-slate-500">{hito.hora}</div>
                            <div className="font-bold text-[#14360E] text-sm">{hito.titulo}</div>
                            <p className="text-slate-600 mt-0.5 leading-relaxed">{hito.detalle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* CALCULADORA DE COTIZACIÓN EN CAMIÓN FRIGORÍFICO (ESPAÑA)              */}
        {/* ===================================================================== */}
        <section id="cotizador" className="py-20 bg-[#F4F7F2] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#2E741B]/20 p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2E741B] uppercase tracking-wider mb-2">
                  <Calculator className="w-4 h-4" />
                  Cotizador Terrestre en Tiempo Real
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14360E]">
                  Calculadora de Transporte en Camión Farmacéutico
                </h2>
                <p className="text-sm text-slate-600 mt-2 mb-6">
                  Calcula al instante la tarifa estimada y tiempo de tránsito por carretera en España según número de Euro-palés, peso, rango térmico y modalidad de camión.
                </p>

                <form onSubmit={handleQuoteSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#14360E] mb-1.5">
                        Base / Ciudad de Origen (España)
                      </label>
                      <select
                        value={quoteOrigin}
                        onChange={(e) => setQuoteOrigin(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-[#14360E] focus:ring-2 focus:ring-[#2E741B] focus:outline-none"
                      >
                        <option>BCN · Barcelona (ZAL Pharma)</option>
                        <option>MAD · Madrid (Hub Central)</option>
                        <option>VLC · Valencia (Ribarroja)</option>
                        <option>BIO · Bilbao (Corredor Norte)</option>
                        <option>SVQ · Sevilla (Plataforma Sur)</option>
                        <option>ZAZ · Zaragoza (PLAZA A-2)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#14360E] mb-1.5">
                        Ciudad / Hospital de Destino (España)
                      </label>
                      <select
                        value={quoteDest}
                        onChange={(e) => setQuoteDest(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-[#14360E] focus:ring-2 focus:ring-[#2E741B] focus:outline-none"
                      >
                        <option>MAD · Madrid (Hub Central)</option>
                        <option>BCN · Barcelona (ZAL Pharma)</option>
                        <option>VLC · Valencia (Ribarroja)</option>
                        <option>SVQ · Sevilla (Plataforma Sur)</option>
                        <option>BIO · Bilbao (Corredor Norte)</option>
                        <option>ZAZ · Zaragoza (PLAZA A-2)</option>
                        <option>SCQ · Santiago / A Coruña (Galicia)</option>
                        <option>PMI · Palma de Mallorca (Ro-Ro 380V)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#14360E] mb-1.5">
                        Peso Bruto de la Carga (kg)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={24000}
                        value={quoteWeight}
                        onChange={(e) => setQuoteWeight(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-mono text-[#14360E] focus:ring-2 focus:ring-[#2E741B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#14360E] mb-1.5">
                        Euro-palés Farmacéuticos (1 - 33)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={33}
                        value={quotePallets}
                        onChange={(e) => setQuotePallets(Math.min(33, Math.max(1, Number(e.target.value))))}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-mono text-[#14360E] focus:ring-2 focus:ring-[#2E741B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#14360E] mb-1.5">
                        Rango Térmico Requerido
                      </label>
                      <select
                        value={quoteTemp}
                        onChange={(e) => setQuoteTemp(e.target.value as ColdRangeSpec['id'])}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-[#14360E] focus:ring-2 focus:ring-[#2E741B] focus:outline-none"
                      >
                        {COLD_RANGES.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nombre} ({r.rango})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#14360E] mb-1.5">
                        Tipo de Vehículo y Servicio
                      </label>
                      <select
                        value={quoteUrgency}
                        onChange={(e) => setQuoteUrgency(e.target.value as typeof quoteUrgency)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-[#14360E] focus:ring-2 focus:ring-[#2E741B] focus:outline-none"
                      >
                        <option value="consolidado">Grupaje Refrigerado GDP (24h)</option>
                        <option value="directo">Camión Directo Dedicado (Mismo Día)</option>
                        <option value="furgon_urgente">Furgón Clínico Express (Puerta a Farmacia)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-[#14360E] mb-1.5">
                        Laboratorio / Hospital Solicitante
                      </label>
                      <input
                        type="text"
                        required
                        value={quoteCompany}
                        onChange={(e) => setQuoteCompany(e.target.value)}
                        placeholder="Ej. Hospital Clínic / Laboratorios S.A."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-[#14360E] focus:ring-2 focus:ring-[#2E741B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#14360E] mb-1.5">
                        Correo Corporativo (Respuesta desde comercial@medicam.cat)
                      </label>
                      <input
                        type="email"
                        required
                        value={quoteEmail}
                        onChange={(e) => setQuoteEmail(e.target.value)}
                        placeholder="farmacia@hospital.es"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-[#14360E] focus:ring-2 focus:ring-[#2E741B] focus:outline-none"
                      />
                    </div>
                  </div>

                  {quoteConfirmedCode && lastSubmittedExcelRow && (
                    <div className="p-4 sm:p-5 rounded-xl bg-[#2E741B]/10 border border-[#2E741B]/35 text-[#14360E] text-xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-bold flex items-center gap-1.5 text-sm text-[#2E741B]">
                          <CheckCircle2 className="w-4 h-4 text-[#2E741B]" />
                          Reserva registrada y sincronizada con Excel ({quoteConfirmedCode})
                        </div>
                        <a
                          href={`/tracking?code=${encodeURIComponent(quoteConfirmedCode)}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToTracking(quoteConfirmedCode);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2E741B] hover:bg-[#225814] text-white font-bold text-xs transition-colors"
                        >
                          Localitzar a /tracking
                          <ArrowRight className="w-3.5 h-3.5 text-[#F5E626]" />
                        </a>
                      </div>
                      <p>
                        Enviado a <strong>comercial@medicam.cat</strong> y guardado en <strong>SheetDB Excel</strong> en el orden exacto de columnas:
                      </p>
                      <div className="overflow-x-auto rounded-lg border border-[#2E741B]/25 bg-white">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-[#173E0D] text-white font-mono">
                            <tr>
                              <th className="py-1.5 px-2.5">#</th>
                              <th className="py-1.5 px-2.5">Columna Excel</th>
                              <th className="py-1.5 px-2.5">Valor Enviado desde Cotizador</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {[
                              { idx: 1, col: 'codigo_expedicion', val: lastSubmittedExcelRow.codigo_expedicion },
                              { idx: 2, col: 'empresa', val: lastSubmittedExcelRow.empresa },
                              { idx: 3, col: 'origen', val: lastSubmittedExcelRow.origen },
                              { idx: 4, col: 'destino', val: lastSubmittedExcelRow.destino },
                              { idx: 5, col: 'status', val: lastSubmittedExcelRow.status },
                              { idx: 6, col: 'location', val: lastSubmittedExcelRow.location },
                              { idx: 7, col: 'eta', val: lastSubmittedExcelRow.eta },
                            ].map((item) => (
                              <tr key={item.col}>
                                <td className="py-1.5 px-2.5 font-mono font-bold text-[#2E741B]">{item.idx}</td>
                                <td className="py-1.5 px-2.5 font-mono font-semibold text-[#14360E]">{item.col}</td>
                                <td className="py-1.5 px-2.5 text-slate-700 font-medium">{item.val}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={quoteSubmitting}
                    className="w-full py-3.5 px-6 rounded-lg bg-[#2E741B] hover:bg-[#225814] text-white font-bold text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {quoteSubmitting ? 'Transmitiendo orden a comercial@medicam.cat...' : 'Confirmar Cotización y Reservar Camión'}
                    <ArrowRight className="w-4 h-4 text-[#F5E626]" />
                  </button>
                </form>
              </div>

              <div className="lg:col-span-5 bg-[#173E0D] text-white rounded-2xl p-6 sm:p-8 border border-[#2E741B] space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#F5E626] uppercase tracking-wider font-bold">
                    Estimación Operativa por Carretera
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-mono font-bold text-white">
                      {estimatedCost.toLocaleString('es-ES')}
                    </span>
                    <span className="text-lg font-mono text-[#F5E626] font-bold">EUR</span>
                  </div>
                  <p className="text-xs text-white/80 mt-1">
                    Tarifa estimada todo incluido en España (porte en camión ATP FRC, peajes, telemetría GPS y certificado EN 12830).
                  </p>
                </div>

                <div className="pt-5 border-t border-white/15 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/80">Tiempo de Ruta Estimado:</span>
                    <strong className="font-mono text-[#F5E626]">{estimatedHours} horas</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Capacidad Reservada:</span>
                    <strong className="font-mono text-white">{quotePallets} Euro-palés ({effectiveWeight} kg)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Modalidad de Camión:</span>
                    <strong className="text-white text-right">{selectedUrgency.label}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Gestión Comercial:</span>
                    <strong className="text-[#A3E635] font-mono">comercial@medicam.cat</strong>
                  </div>
                </div>

                {/* Vista previa en vivo del orden exacto de las 7 columnas enviadas al Excel */}
                <div className="p-4 rounded-xl bg-[#102C09] border border-[#A3E635]/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#F5E626] font-bold pb-1.5 border-b border-white/10">
                    <span className="inline-flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      Columnas Excel Preescritas (1 &rarr; 7)
                    </span>
                    <span className="text-[#A3E635]">SheetDB Sync</span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    {[
                      { k: '1. codigo_expedicion', v: previewExcelColumns.codigo_expedicion },
                      { k: '2. empresa', v: previewExcelColumns.empresa },
                      { k: '3. origen', v: previewExcelColumns.origen },
                      { k: '4. destino', v: previewExcelColumns.destino },
                      { k: '5. status', v: previewExcelColumns.status },
                      { k: '6. location', v: previewExcelColumns.location },
                      { k: '7. eta', v: previewExcelColumns.eta },
                    ].map((row) => (
                      <div key={row.k} className="flex justify-between gap-3">
                        <span className="font-mono text-[#A3E635] shrink-0">{row.k}:</span>
                        <span className="text-white/90 text-right truncate">{row.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#215314] border border-white/15 text-xs text-white/90 leading-relaxed">
                  <strong className="text-[#F5E626] block mb-1">Garantía Cero Excursiones:</strong>
                  Todos los transportes en camión incluyen doble sonda calibrada UNE-EN 12830, bloqueo electrónico TAPA TSR-1 y certificado PDF validado por nuestra Persona Cualificada (QP).
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* NORMATIVA ESPAÑOLA, CALIDAD Y CONTINGENCIA EN CARRETERA               */}
        {/* ===================================================================== */}
        <section id="normativa" className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2E741B] uppercase tracking-wider">
                <ShieldPlus className="w-4 h-4" />
                Cumplimiento Sanitario en Carretera
              </div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14360E]">
                Normativa Nacional, ATP FRC y Contingencia en Ruta
              </h2>
              <p className="mt-3 text-slate-600 text-base">
                Flota auditada bajo exigencias de la AEMPS y estándares europeos de distribución terrestre para proteger cada lote médico durante todo el trayecto.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
              {REGULATIONS.map((reg) => (
                <div key={reg.codigo} className="p-6 rounded-2xl bg-[#F4F7F2] border border-[#2E741B]/20">
                  <div className="flex items-center justify-between mb-3">
                    <Award className="w-5 h-5 text-[#2E741B]" />
                    <span className="text-xs font-mono font-bold text-[#2E741B]">Vigente</span>
                  </div>
                  <h3 className="text-base font-bold text-[#14360E]">{reg.codigo}</h3>
                  <div className="text-xs font-semibold text-slate-500 mt-1">{reg.titulo}</div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">{reg.alcance}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#2E741B] text-white rounded-2xl p-6 sm:p-8 border border-[#225814]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/20">
                <div>
                  <span className="text-xs font-mono text-[#F5E626] uppercase font-bold">
                    Matriz de Respuesta Rápida QP España
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Protocolos de Contingencia ante Olas de Calor, Cortes o Desvíos
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#F5E626] font-bold">
                  SLA Asistencia en Ruta: &lt; 10 min
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {CONTINGENCY_PROTOCOLS.map((prot) => (
                  <div key={prot.escenario} className="bg-[#173E0D] rounded-xl p-5 border border-white/15 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{prot.escenario}</h4>
                      <p className="text-xs text-white/85 mt-2 leading-relaxed">{prot.accion}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/15 text-xs font-mono text-[#F5E626] font-bold">
                      {prot.sla}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===================================================================== */}
      {/* FOOTER CORPORATIVO (DOMINIO MEDICAM.CAT + BUZONES OFICIALES)          */}
      {/* ===================================================================== */}
      <footer className="bg-[#173E0D] text-white/90 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/15">
            {/* Marca, Dominio y Estructura de Correos Profesionales */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <PharmacyChaliceEmblem dark />
                <span className="text-xl font-extrabold text-white tracking-tight">MEDICAM</span>
                <span className="text-xs font-mono text-[#F5E626] ml-1 font-bold">medicam.cat</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Operador español de transporte en camión frigorífico ATP Clase FRC especializado exclusivamente en logística farmacéutica y hospitalaria en toda España.
              </p>

              {/* Estructura de Correos Profesionales @medicam.cat */}
              <div className="pt-2 space-y-2 text-xs font-mono bg-[#215314] p-4 rounded-xl border border-white/15">
                <div className="text-white flex items-center justify-between gap-2">
                  <span className="font-sans text-white/80">Atención General:</span>
                  <a href="mailto:info@medicam.cat" className="text-[#F5E626] hover:underline">info@medicam.cat</a>
                </div>
                <div className="text-white flex items-center justify-between gap-2">
                  <span className="font-sans text-white/80">Operaciones y Tráfico:</span>
                  <a href="mailto:operacions@medicam.cat" className="text-[#F5E626] hover:underline">operacions@medicam.cat</a>
                </div>
                <div className="text-white flex items-center justify-between gap-2">
                  <span className="font-sans text-white/80">Cotizaciones y Ventas:</span>
                  <a href="mailto:comercial@medicam.cat" className="text-[#A3E635] hover:underline">comercial@medicam.cat</a>
                </div>
                <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
                  <span className="font-sans text-white/80">Teléfono Central:</span>
                  <strong className="text-white">+34 932 45 88 00</strong>
                </div>
              </div>
            </div>

            {/* Red de Corredores Terrestres en España */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {HUB_NETWORK.map((hub) => (
                <div key={hub.region}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F5E626]" />
                    {hub.region}
                  </h4>
                  <p className="text-xs font-mono text-[#F5E626] mb-1.5">{hub.ciudades}</p>
                  <p className="text-xs text-white/80 leading-relaxed">{hub.detalle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/75">
            <div className="flex flex-wrap items-center gap-3">
              <span>&copy; 2026 MEDICAM (medicam.cat).</span>
              <span aria-hidden="true">·</span>
              <strong className="text-[#F5E626]">{t.academicNotice}</strong>
              <span aria-hidden="true">·</span>
              <span>Transporte Farmacéutico España · ATP FRC · AEMPS · EU GDP</span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <a
                href="/tracking"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToTracking();
                }}
                className="font-mono font-bold text-[#F5E626] hover:underline"
              >
                Portal /tracking
              </a>
              <button type="button" onClick={() => setLegalModal('gdp')} className="hover:text-[#F5E626] transition-colors cursor-pointer">
                Manual Calidad GDP
              </button>
              <button type="button" onClick={() => setLegalModal('atp')} className="hover:text-[#F5E626] transition-colors cursor-pointer">
                Condiciones Transporte ATP FRC
              </button>
              <button type="button" onClick={() => setLegalModal('privacidad')} className="hover:text-[#F5E626] transition-colors cursor-pointer">
                Privacidad y EN 12830
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Legal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-[#173E0D]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#2E741B]/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-[#14360E]">
                {legalModal === 'gdp' && 'Manual de Calidad GDP Carretera (AEMPS / 2013/C 343/01)'}
                {legalModal === 'atp' && 'Condiciones Generales de Transporte Terrestre ATP FRC'}
                {legalModal === 'privacidad' && 'Protección de Datos y Trazabilidad UNE-EN 12830'}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-3 leading-relaxed">
              {legalModal === 'gdp' && (
                <p>
                  Toda la flota de camiones frigoríficos de MEDICAM (medicam.cat) dentro de España cumple las directrices europeas y nacionales de Buenas Prácticas de Distribución de medicamentos supervisadas por la AEMPS y nuestra Persona Cualificada (QP).
                </p>
              )}
              {legalModal === 'atp' && (
                <p>
                  Los transportes nacionales por carretera de MEDICAM operan bajo Acuerdo ATP Clase FRC, Ley de Ordenación de los Transportes Terrestres (LOTT) y estándar de seguridad antirrobo TAPA TSR-1. Tráfico: operacions@medicam.cat.
                </p>
              )}
              {legalModal === 'privacidad' && (
                <p>
                  Los registros telemétricos de temperatura y eventos de custodia electrónica se conservan con firma digital conforme a UNE-EN 12830, Anexo 11 y LOPDGDD / RGPD. Contacto general: info@medicam.cat.
                </p>
              )}
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 rounded-lg bg-[#2E741B] hover:bg-[#225814] text-white text-xs font-bold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
