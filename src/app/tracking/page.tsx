'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Compass,
  AlertCircle,
  CheckCircle2,
  Truck,
  Warehouse,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  Navigation as NavigationIcon,
  HeartPulse,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  FileSpreadsheet,
  Cross,
  ThermometerSnowflake,
} from 'lucide-react';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/fst1vl3p3sehx';

interface TrackingData {
  codigo_expedicion: string;
  empresa: string;
  origen: string;
  destino: string;
  status: string;
  location: string;
  eta: string;
  isLocalDemo?: boolean;
}

const LOCAL_DEMO_FALLBACKS: Record<string, TrackingData> = {
  'MDC-2026-0841': {
    codigo_expedicion: 'MDC-2026-0841',
    empresa: 'Hospital Universitari Vall d’Hebron',
    origen: 'BCN · Barcelona (ZAL Pharma)',
    destino: 'MAD · Madrid (Hospital Universitario La Paz)',
    status: 'En trànsit',
    location: 'Autovía A-2 · Zaragoza KM 318 (Enlace Peninsular)',
    eta: '18/11/2026 · 14:30 CET',
    isLocalDemo: true,
  },
  'MDC-2026-0912': {
    codigo_expedicion: 'MDC-2026-0912',
    empresa: 'Institut Català d’Oncologia',
    origen: 'MAD · Madrid (Hub Central)',
    destino: 'SVQ · Sevilla (Hospital Virgen del Rocío)',
    status: 'Lliurat',
    location: 'Muelle Farmacia Hospitalaria · Sevilla',
    eta: '18/11/2026 · Entregado 09:40 CET',
    isLocalDemo: true,
  },
  'MDC-2026-1044': {
    codigo_expedicion: 'MDC-2026-1044',
    empresa: 'Laboratorio BioFarma Valencia',
    origen: 'VLC · Valencia (Ribarroja)',
    destino: 'PMI · Palma de Mallorca (Hospital Son Espases)',
    status: 'En magatzem',
    location: 'Muelle Climatizado Puerto de Valencia · Embarque 380V',
    eta: '19/11/2026 · 07:30 CET',
    isLocalDemo: true,
  },
};

function PharmacyChaliceEmblem() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <circle cx="22" cy="24" r="14" stroke="#14360E" strokeWidth="2.3" />
      <circle cx="22" cy="24" r="6" stroke="#14360E" strokeWidth="2" />
      <path
        d="M16 32V24C16 20.6863 18.6863 18 22 18C25.3137 18 28 20.6863 28 24V32"
        stroke="#14360E"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M14.5 11.5H29.5C28.5 15.5 25.5 17.8 22 17.8C18.5 17.8 15.5 15.5 14.5 11.5Z"
        stroke="#14360E"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path
        d="M22 11.5V6.5C22 4.8 23.6 3.8 25.4 4.3C27 4.7 27.6 6.2 26.8 7.6C25.9 9 23.2 9.4 22 11.5Z"
        stroke="#2E741B"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="22" cy="24" r="2.2" fill="#2E741B" />
    </svg>
  );
}

function navigateSpa(path: string) {
  if (typeof window !== 'undefined' && window.history?.pushState) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (typeof window !== 'undefined') {
    window.location.href = path;
  }
}

function normalizeSheetRow(row: Record<string, unknown>, fallbackCode: string): TrackingData {
  const getVal = (...keys: string[]) => {
    for (const key of keys) {
      for (const rowKey of Object.keys(row)) {
        if (rowKey.trim().toLowerCase() === key.toLowerCase()) {
          const val = String(row[rowKey] ?? '').trim();
          if (val) return val;
        }
      }
    }
    return '';
  };

  return {
    codigo_expedicion: getVal('codigo_expedicion', 'tracking_code', 'codi', 'code') || fallbackCode,
    empresa: getVal('empresa', 'client', 'cliente', 'titular') || 'Laboratorio / Hospital España',
    origen: getVal('origen', 'origin') || 'Base Barcelona ZAL',
    destino: getVal('destino', 'destination', 'desti') || 'Destino Hospitalario España',
    status: getVal('status', 'estat', 'estado') || 'En magatzem',
    location: getVal('location', 'ubicacio', 'ubicacion') || 'Muelle Climatizado GDP',
    eta: getVal('eta', 'data', 'fecha') || 'Pendiente confirmación',
    isLocalDemo: false,
  };
}

export default function TrackingPage() {
  const [inputCode, setInputCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingData | null>(null);
  const [sheetCodes, setSheetCodes] = useState<string[]>([]);
  const [liveOrderedRows, setLiveOrderedRows] = useState<TrackingData[]>([]);

  // Barra de Progrés Visual (Timeline):
  // - 'Lliurat' -> 100% verda
  // - 'En trànsit' -> 50% blava
  // - 'En magatzem' (o 'En cámara GDP') -> 10%
  const getProgressConfig = (statusStr: string) => {
    const s = (statusStr || '').toLowerCase().trim();

    if (
      s.includes('lliurat') ||
      s.includes('entregad') ||
      s.includes('delivered') ||
      s.includes('completat')
    ) {
      return {
        percent: 100,
        colorClass: 'bg-green-500',
        textColorClass: 'text-green-700',
        badgeBg: 'bg-green-100 text-green-800 border-green-300',
        label: 'Lliurat',
        rawStatus: statusStr,
        stage: 3,
      };
    }

    if (
      s.includes('trànsit') ||
      s.includes('transit') ||
      s.includes('tránsito') ||
      s.includes('ruta') ||
      s.includes('camino')
    ) {
      return {
        percent: 50,
        colorClass: 'bg-blue-500',
        textColorClass: 'text-blue-700',
        badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
        label: 'En trànsit',
        rawStatus: statusStr,
        stage: 2,
      };
    }

    return {
      percent: 10,
      colorClass: 'bg-amber-500',
      textColorClass: 'text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      label: statusStr || 'En magatzem',
      rawStatus: statusStr || 'En magatzem',
      stage: 1,
    };
  };

  const executeSearch = async (codeToSearch: string) => {
    const query = codeToSearch.trim();
    if (!query) {
      setError('Codi no trobat');
      setResult(null);
      return;
    }

    setInputCode(query);
    setIsLoading(true);
    setError(null);

    try {
      let matchedRow: Record<string, unknown> | null = null;

      // 1. Consulta directa a SheetDB segons la columna real del Excel (codigo_expedicion)
      try {
        const res = await fetch(
          `${SHEETDB_URL}/search?codigo_expedicion=${encodeURIComponent(query)}&casesensitive=false`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          matchedRow = data[0];
        }
      } catch {
        // Continuar amb lectura de taula completa en viu
      }

      // 2. Fallback: lectura en viu sense memòria cau de tota la taula SheetDB
      // (cobreix tant codigo_expedicion com tracking_code o formats verticals)
      if (!matchedRow) {
        try {
          const allRes = await fetch(`${SHEETDB_URL}?_nc=${Date.now()}`, { cache: 'no-store' });
          const rows = await allRes.json();
          if (Array.isArray(rows) && rows.length > 0) {
            const upperQuery = query.toUpperCase();
            const foundRow = rows.find((r: Record<string, unknown>) => {
              const codeVal = String(
                r.codigo_expedicion ?? r.tracking_code ?? r['tracking_code '] ?? ''
              )
                .trim()
                .toUpperCase();
              return codeVal === upperQuery;
            });
            if (foundRow) {
              matchedRow = foundRow;
            }
          }
        } catch {
          // Continuar cap a verificació
        }
      }

      if (matchedRow) {
        setResult(normalizeSheetRow(matchedRow, query));
        return;
      }

      // 3. Si el codi pertany a les expedicions locals predefinides de MEDICAM
      const localDemo = LOCAL_DEMO_FALLBACKS[query.toUpperCase()];
      if (localDemo) {
        setResult(localDemo);
        return;
      }

      // 4. Array buit -> missatge d'error vermell estricte 'Codi no trobat'
      setResult(null);
      setError('Codi no trobat');
    } catch {
      setResult(null);
      setError('Codi no trobat');
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega codis reals disponibles a l'Excel (ordenats de Fila 1 més recent a més antiga) i comprova ?code=
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${SHEETDB_URL}?_nc=${Date.now()}`, { cache: 'no-store' });
        const rows = await res.json();
        if (active && Array.isArray(rows)) {
          const validRows = rows
            .filter((r: Record<string, unknown>) =>
              String(r.codigo_expedicion ?? r.tracking_code ?? '').trim() !== ''
            )
            .map((r: Record<string, unknown>) =>
              normalizeSheetRow(r, String(r.codigo_expedicion ?? r.tracking_code ?? '').trim())
            );
          setLiveOrderedRows(validRows);
          setSheetCodes(Array.from(new Set(validRows.map((v) => v.codigo_expedicion))));
        }
      } catch {
        // Silenciós si l'API no respon en càrrega inicial
      }
    })();

    const params = new URLSearchParams(window.location.search);
    const initialCode = params.get('code');
    if (initialCode && initialCode.trim()) {
      executeSearch(initialCode.trim());
    }

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(inputCode);
  };

  const progress = result ? getProgressConfig(result.status) : null;

  // Les 7 columnes exactes preescrites a l'Excel en el seu ordre oficial
  const orderedExcelColumns = result
    ? [
        { order: 1, col: 'codigo_expedicion', label: "Codi d'Expedició", val: result.codigo_expedicion },
        { order: 2, col: 'empresa', label: 'Empresa / Hospital', val: result.empresa },
        { order: 3, col: 'origen', label: 'Origen', val: result.origen },
        { order: 4, col: 'destino', label: 'Destí', val: result.destino },
        { order: 5, col: 'status', label: 'Estat Actual (Excel)', val: result.status },
        { order: 6, col: 'location', label: 'Ubicació Actual', val: result.location },
        { order: 7, col: 'eta', label: 'Data Prevista / ETA', val: result.eta },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#F4F7F2] text-[#14360E] flex flex-col justify-between selection:bg-[#F5E626] selection:text-[#14360E]">
      {/* Barra Operativa Superior Institucional */}
      <div className="bg-[#173E0D] text-white border-b border-[#2E741B] text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#F5E626] font-semibold">
              <HeartPulse className="w-3.5 h-3.5 text-[#F5E626]" />
              Portal de Seguiment Farmacèutic · SheetDB En Viu
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
            <span className="hidden md:inline-flex items-center gap-1.5 text-white/90 font-mono">
              <Phone className="w-3.5 h-3.5 text-[#A3E635]" />
              <strong>+34 932 45 88 00</strong>
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[#F5E626] font-semibold">
            <GraduationCap className="w-4 h-4 text-[#F5E626] shrink-0" />
            <span>Web Académica · Proyecto educativo sin actividad comercial real</span>
          </span>
        </div>
      </div>

      {/* Capçalera Blanca Institucional MEDICAM */}
      <header className="sticky top-0 z-30 bg-white border-b-2 border-[#2E741B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateSpa('/');
            }}
            className="flex items-center gap-3 whitespace-nowrap"
          >
            <PharmacyChaliceEmblem />
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#14360E] block leading-none">
                MEDICAM
              </span>
              <span className="text-[11px] font-mono font-bold text-[#2E741B]">
                medicam.cat/tracking
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/#cotizador"
              onClick={(e) => {
                e.preventDefault();
                navigateSpa('/');
                setTimeout(() => {
                  document.getElementById('cotizador')?.scrollIntoView({ behavior: 'smooth' });
                }, 120);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#2E741B]/30 text-xs font-bold text-[#2E741B] hover:bg-[#F4F7F2] transition-colors"
            >
              <ThermometerSnowflake className="w-3.5 h-3.5" />
              Nou Enviament (Cotitzador)
            </a>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateSpa('/');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2E741B] hover:bg-[#225814] text-white text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#F5E626]" />
              Tornar a l'Inici
            </a>
          </div>
        </div>
      </header>

      {/* Contingut Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Capçalera del Cercador */}
        <div className="text-center max-w-2xl mx-auto mb-9">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E741B]/10 border border-[#2E741B]/25 text-[#2E741B] text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-[#2E741B]" />
            Traçabilitat en Temps Real &middot; Excel SheetDB API
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#14360E] tracking-tight">
            Localitza el teu enviament
          </h1>

          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Introdueix el codi d’expedició generat pel cotitzador o registrat al full de càlcul per consultar en viu l’origen, destí, ubicació actual i l’estat del camió frigorífic.
          </p>
        </div>

        {/* Formulari de Cerca */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-[#2E741B]/25 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#2E741B] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Escriu el codi (ex: MDC-2026-4542)..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F4F7F2] border border-[#2E741B]/25 text-[#14360E] placeholder-slate-400 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2E741B] focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-7 py-3 rounded-xl bg-[#2E741B] hover:bg-[#225814] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#F5E626]" />
                  <span>Cercant...</span>
                </>
              ) : (
                <>
                  <Cross className="w-4 h-4 text-[#F5E626]" />
                  <span>Cercar</span>
                </>
              )}
            </button>
          </form>

          {/* Xips de codis disponibles directament a SheetDB */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold">Codis a l’Excel en viu:</span>
            {(sheetCodes.length > 0 ? sheetCodes : ['MDC-2026-4542']).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => executeSearch(code)}
                className={`font-mono px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                  result?.codigo_expedicion.toUpperCase() === code.toUpperCase()
                    ? 'bg-[#2E741B] text-white border-[#2E741B] font-bold'
                    : 'bg-[#F4F7F2] text-[#14360E] border-[#2E741B]/25 hover:border-[#2E741B]'
                }`}
              >
                {code}
              </button>
            ))}
            <span className="text-slate-400 mx-1 hidden sm:inline">|</span>
            <span className="text-slate-500">Demo local:</span>
            {Object.keys(LOCAL_DEMO_FALLBACKS).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => executeSearch(code)}
                className="font-mono px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-[#2E741B] hover:text-[#2E741B] transition-colors cursor-pointer"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Missatge d'Error Vermell Estricte: 'Codi no trobat' */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 flex items-center gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="font-bold text-sm text-red-800">{error}</p>
              <p className="text-xs text-red-700 mt-0.5">
                No existeix cap fila amb aquest codi a la columna <span className="font-mono font-bold">codigo_expedicion</span> del full de SheetDB.
              </p>
            </div>
          </div>
        )}

        {/* Targeta Neta de Resultats */}
        {result && progress && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl border border-[#2E741B]/25">
              {/* Capçalera del Resultat */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-slate-500">
                    <span>Expedició Terrestre ATP FRC</span>
                    {!result.isLocalDemo && (
                      <span className="text-[#2E741B] font-mono">&bull; Sincronitzat amb Excel</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <h2 className="text-2xl sm:text-3xl font-mono font-extrabold text-[#14360E]">
                      {result.codigo_expedicion}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${progress.badgeBg}`}>
                      {result.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-[#2E741B]" />
                    <span>Empresa / Centre: <strong className="text-[#14360E]">{result.empresa}</strong></span>
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <div className="bg-[#F4F7F2] px-3.5 py-2 rounded-xl border border-[#2E741B]/15 sm:text-right">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block">
                      Data Prevista (ETA)
                    </span>
                    <span className="text-sm sm:text-base font-mono font-bold text-[#14360E]">
                      {result.eta}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => executeSearch(result.codigo_expedicion)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E741B] hover:underline cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    Recarregar dades de l’Excel
                  </button>
                </div>
              </div>

              {/* BARRA DE PROGRÉS VISUAL (TIMELINE)
                  - 'Lliurat' -> 100% verda
                  - 'En trànsit' -> 50% blava
                  - 'En magatzem' -> 10%
              */}
              <div className="py-8">
                <div className="flex items-center justify-between mb-3 text-xs font-bold">
                  <span className="text-slate-500 uppercase tracking-wider">
                    Barra de Progrés Visual (Timeline)
                  </span>
                  <span className={`font-mono text-sm ${progress.textColorClass}`}>
                    {progress.percent}% &bull; {progress.label}
                  </span>
                </div>

                <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${progress.colorClass}`}
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-5 text-center">
                  {/* Etapa 1: En magatzem (10%) */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors ${
                        progress.percent >= 10
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Warehouse className="w-4 h-4" />
                    </div>
                    <span className={`text-xs ${progress.percent >= 10 ? 'text-[#14360E] font-bold' : 'text-slate-400 font-semibold'}`}>
                      En magatzem
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">10% (Càmera GDP)</span>
                  </div>

                  {/* Etapa 2: En trànsit (50% blava) */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors ${
                        progress.percent >= 50
                          ? 'bg-blue-500 text-white shadow-xs ring-4 ring-blue-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className={`text-xs ${progress.percent >= 50 ? 'text-blue-700 font-bold' : 'text-slate-400 font-semibold'}`}>
                      En trànsit
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">50% (Autovia)</span>
                  </div>

                  {/* Etapa 3: Lliurat (100% verda) */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors ${
                        progress.percent >= 100
                          ? 'bg-green-500 text-white shadow-xs ring-4 ring-green-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className={`text-xs ${progress.percent >= 100 ? 'text-green-700 font-bold' : 'text-slate-400 font-semibold'}`}>
                      Lliurat
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">100% (Farmàcia)</span>
                  </div>
                </div>
              </div>

              {/* Targeta de Dades Principals: Origen, Destí, Data prevista (ETA) i Ubicació actual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                <div className="p-4 rounded-2xl bg-[#F4F7F2] border border-[#2E741B]/20 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#2E741B] text-[#F5E626] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block">
                      Origen
                    </span>
                    <p className="text-sm font-bold text-[#14360E] mt-0.5">{result.origen}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F7F2] border border-[#2E741B]/20 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#173E0D] text-[#F5E626] flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block">
                      Destí
                    </span>
                    <p className="text-sm font-bold text-[#14360E] mt-0.5">{result.destino}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F7F2] border border-[#2E741B]/20 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <NavigationIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block">
                      Ubicació Actual
                    </span>
                    <p className="text-sm font-bold text-blue-700 mt-0.5">{result.location}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F7F2] border border-[#2E741B]/20 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block">
                      Data Prevista (ETA)
                    </span>
                    <p className="text-sm font-bold text-[#14360E] mt-0.5 font-mono">{result.eta}</p>
                  </div>
                </div>
              </div>

              {/* Detall Ordenat de les 7 Columnes Preescrites a l'Excel vinculades amb el Cotitzador */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2E741B] uppercase tracking-wider">
                    <FileSpreadsheet className="w-4 h-4" />
                    Estructura de Columnes Sincronitzades (Excel &harr; Cotitzador)
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Ordre oficial 1 &rarr; 7
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#2E741B]/20">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#173E0D] text-white font-mono">
                      <tr>
                        <th className="py-2.5 px-3 w-10">#</th>
                        <th className="py-2.5 px-3">Columna Excel</th>
                        <th className="py-2.5 px-3">Camp Funcional</th>
                        <th className="py-2.5 px-3">Valor Registrat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {orderedExcelColumns.map((row) => (
                        <tr key={row.col} className="hover:bg-[#F4F7F2]/70">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#2E741B]">{row.order}</td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-[#14360E]">{row.col}</td>
                          <td className="py-2.5 px-3 text-slate-600">{row.label}</td>
                          <td className="py-2.5 px-3 font-semibold text-[#14360E]">{row.val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2E741B]" />
                  Dades validades sota normativa ATP FRC, AEMPS i EU GDP.
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  API SheetDB: fst1vl3p3sehx
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Llistat Ordenat de Cotitzacions de l'Excel (Fila 1 més recent -> anterior) */}
        {liveOrderedRows.length > 0 && (
          <div className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#2E741B]/20">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E741B] uppercase tracking-wider">
                  <FileSpreadsheet className="w-4 h-4" />
                  Registre Ordenat a l'Excel (Més recent a Fila 1 &rarr; Anterior)
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clica qualsevol fila per consultar la seva fitxa i barra de progrés.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#14360E] bg-[#F4F7F2] px-2.5 py-1 rounded-md border border-[#2E741B]/20">
                {liveOrderedRows.length} expedicions actives
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#173E0D] text-white font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Fila</th>
                    <th className="py-2.5 px-3">Codi</th>
                    <th className="py-2.5 px-3">Empresa</th>
                    <th className="py-2.5 px-3">Ruta (Origen &rarr; Destí)</th>
                    <th className="py-2.5 px-3">Estat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {liveOrderedRows.map((row, idx) => (
                    <tr
                      key={row.codigo_expedicion + idx}
                      onClick={() => executeSearch(row.codigo_expedicion)}
                      className="hover:bg-[#F4F7F2] cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-[#2E741B]">#{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#14360E] whitespace-nowrap">
                        {row.codigo_expedicion}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{row.empresa}</td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {row.origen} &rarr; {row.destino}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#2E741B] whitespace-nowrap">
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Peu de Pàgina Corporatiu MEDICAM */}
      <footer className="bg-[#173E0D] text-white/85 text-xs py-6 border-t border-[#2E741B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span>&copy; 2026 MEDICAM (medicam.cat)</span>
            <span>&bull;</span>
            <strong className="text-[#F5E626]">Web Académica · Proyecto educativo sin actividad comercial real</strong>
          </div>
          <p className="font-mono text-white/75">
            info@medicam.cat &bull; comercial@medicam.cat
          </p>
        </div>
      </footer>
    </div>
  );
}
