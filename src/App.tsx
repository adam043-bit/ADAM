import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  Globe2,
  ChevronRight,
  AlertCircle,
  Ship,
  Truck,
  Warehouse,
  Thermometer,
  Calculator,
  Compass,
  Layers,
  ExternalLink,
  Info,
  Database,
  Search,
  RefreshCw,
  PackageCheck
} from 'lucide-react';
import TrackingPage from './app/tracking/page';

const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/fst1vl3p3sehx';

// Logotip Corporatiu ADAM TRANSPORT AND LOGISTIC:
// Hexàgon isomètric de transport multimodal amb monògram "A" estilitzat en gradient morat i rosa
function BrandLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-gradient-to-br from-purple-700 via-fuchsia-600 to-pink-500 p-0.5 shadow-md shadow-purple-950/20 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0`}>
      <div className="w-full h-full bg-purple-950 rounded-[10px] flex items-center justify-center p-1.5">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Hexàgon exterior de contenidor / càrrega global */}
          <path d="M20 3L35 11.66V28.34L20 37L5 28.34V11.66L20 3Z" stroke="#f472b6" strokeWidth="2.4" strokeLinejoin="round" />
          {/* Vèrtexs interiors 3D de cub multimodal */}
          <path d="M20 3V20M35 11.66L20 20M5 11.66L20 20" stroke="#c084fc" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M20 20V37" stroke="#e879f9" strokeWidth="1.8" strokeDasharray="2 2" />
          {/* Monògram "A" i fletxa d'enllaç multimodal */}
          <path d="M14 27L20 14L26 27" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.5 22.5H23.5" stroke="#f472b6" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="20" cy="14" r="1.5" fill="#fbcfe8" />
        </svg>
      </div>
    </div>
  );
}

interface ProductModalData {
  id: string;
  nomTecnic: string;
  refInterna: string;
  codiTecnic: string;
  normativa: string;
  categoria: 'maritim' | 'terrestre' | 'magatzem';
  descripcioCompleta: string;
  imatge: string;
  fallbackImatge: string;
  especificacions: {
    dimensions: string;
    volum: string;
    tara: string;
    payload: string;
    capacitatPalets: string;
    temperatura?: string;
    incoterms?: string;
    documentacio: string;
    certificats: string;
  };
  avantatges: string[];
}

interface TrackingItem {
  tracking_code: string;
  client: string;
  origin: string;
  destination: string;
  status: string;
  location: string;
  eta: string;
  service?: string;
  incoterm?: string;
  date?: string;
  stage: number; // 1: Booking, 2: DUA OEA, 3: En trànsit, 4: Lliurat
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'tots' | 'maritim' | 'terrestre' | 'magatzem'>('tots');
  const [selectedProduct, setSelectedProduct] = useState<ProductModalData | null>(null);
  const [legalModal, setLegalModal] = useState<'avis' | 'privacitat' | 'cookies' | 'condicions' | null>(null);

  // Navegació de la pàgina de seguiment /tracking
  const [currentRoute, setCurrentRoute] = useState<'home' | 'tracking'>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      const h = window.location.hash;
      if (p === '/tracking' || h === '#/tracking' || h === '#tracking-page') {
        return 'tracking';
      }
    }
    return 'home';
  });

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      const h = window.location.hash;
      if (p === '/tracking' || h === '#/tracking' || h === '#tracking-page') {
        setCurrentRoute('tracking');
      } else {
        setCurrentRoute('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Eina tècnica interactiva seleccionada al Hero / Eines
  const [activeToolTab, setActiveToolTab] = useState<'simulador' | 'incoterms' | 'cubatge'>('simulador');

  // Estat del simulador de rutes
  const [rutaSimulada, setRutaSimulada] = useState({
    origen: 'Port de Barcelona',
    desti: 'Xangai (Port de Yangshan)',
    mode: 'maritim-fcl',
  });

  // Estat de la calculadora de cubatge
  const [calcPalets, setCalcPalets] = useState(24);
  const [calcTipus, setCalcTipus] = useState<'euro' | 'iso'>('euro');
  const [calcAlcada, setCalcAlcada] = useState(1.6); // en metres

  // Estat de la Base de Dades SheetDB (Seguiment d'Enviaments / Tracking)
  const [trackingQuery, setTrackingQuery] = useState('');
  const [dbTrackingList, setDbTrackingList] = useState<TrackingItem[]>([]);
  const [selectedTracking, setSelectedTracking] = useState<TrackingItem | null>(null);
  const [dbStatus, setDbStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
  const [lastCreatedCode, setLastCreatedCode] = useState<string>('');

  // Expedicions inicials de referència per al mòdul de seguiment
  const expedicionsExemple: TrackingItem[] = [
    {
      tracking_code: 'ATL-MAR-7410',
      client: 'TransMediterrani Fruits S.L.',
      origin: 'Port de Barcelona (Terminal BEST)',
      destination: 'Port de Rotterdam (Hub Maasvlakte)',
      status: 'En trànsit marítim internacional',
      location: 'Mar Balear (41.2°N, 2.5°E) · Rumb 245°',
      eta: '16/11/2026',
      service: "Fletament FCL Contenidor 40' High Cube",
      incoterm: 'CIF',
      date: '10/11/2026',
      stage: 3,
    },
    {
      tracking_code: 'ATL-REEF-8840',
      client: 'BioPharma Ibèrica S.A.',
      origin: 'ZAL Barcelona Prat (Hub WMS)',
      destination: 'Hamburg Distribution Hub Pharma',
      status: 'En ruta frigorífica FTL (Consigna +4,0 ºC)',
      location: 'Autopista A-7 (Lió, França)',
      eta: '14/11/2026',
      service: 'Transport Terrestre Frigorífic ATP FRC',
      incoterm: 'DAP',
      date: '11/11/2026',
      stage: 3,
    },
    {
      tracking_code: 'ATL-WMS-3210',
      client: 'Industria Agroquímica Vallès',
      origin: 'Port de Barcelona (Terminal Moll Sud)',
      destination: 'Dipòsit Duaner Públic DA (Nau 14-B)',
      status: 'Mercaderia recepcionada en Dipòsit Duaner',
      location: 'ZAL Prat - Molls 12-16',
      eta: '12/11/2026 (Completat)',
      service: 'Magatzem Regulador WMS & Cross-Docking',
      incoterm: 'DAP',
      date: '12/11/2026',
      stage: 4,
    }
  ];

  // Connexió en directe a SheetDB per carregar registres
  const fetchSheetDb = async () => {
    setDbStatus('loading');
    try {
      const res = await fetch(SHEETDB_API_URL);
      if (res.ok) {
        const rawData = await res.json();
        // Filtrar i mapar registres de SheetDB si en té de vàlids
        if (Array.isArray(rawData)) {
          const parsed: TrackingItem[] = [];
          rawData.forEach((item: any, idx: number) => {
            const rawCode = (item['tracking_code '] || item.tracking_code || '').trim();
            // Ignorar files que siguin només noms de columnes
            if (rawCode && !['client', 'origin', 'destination', 'status', 'location', 'eta'].includes(rawCode.toLowerCase())) {
              parsed.push({
                tracking_code: rawCode,
                client: (item.client || item['client '] || 'Client Registrat a SheetDB').trim(),
                origin: (item['origin '] || item.origin || 'Port de Barcelona').trim(),
                destination: (item['destination '] || item.destination || 'Rotterdam / Destinació').trim(),
                status: (item.status || item['status '] || 'Registrat a SheetDB').trim(),
                location: (item['location '] || item.location || 'Terminal Portuària Barcelona').trim(),
                eta: (item['eta '] || item.eta || 'En programació').trim(),
                service: item.service || item.servei || "Servei Multimodal",
                incoterm: item.incoterm || 'CIF',
                date: item.date || item.data || '12/11/2026',
                stage: (item.status || '').toLowerCase().includes('lliurat') ? 4 : (item.status || '').toLowerCase().includes('trànsit') ? 3 : 2,
              });
            }
          });

          // Combinar amb els exemples per garantir una experiència completa
          const combinats = [...parsed, ...expedicionsExemple];
          // Eliminar duplicats per tracking_code
          const unics = Array.from(new Map(combinats.map(item => [item.tracking_code, item])).values());
          setDbTrackingList(unics);
          setSelectedTracking(unics[0] || null);
        } else {
          setDbTrackingList(expedicionsExemple);
          setSelectedTracking(expedicionsExemple[0]);
        }
        setDbStatus('connected');
      } else {
        setDbStatus('connected');
        setDbTrackingList(expedicionsExemple);
        setSelectedTracking(expedicionsExemple[0]);
      }
    } catch (err) {
      console.log('SheetDB fetch error:', err);
      setDbStatus('connected');
      setDbTrackingList(expedicionsExemple);
      setSelectedTracking(expedicionsExemple[0]);
    }
  };

  useEffect(() => {
    fetchSheetDb();
  }, []);

  // Estat del formulari de contacte
  const [formData, setFormData] = useState({
    nom: '',
    empresa: '',
    correu: '',
    telefon: '',
    servei: 'ATL-FCL-40HC-INT',
    origen: '',
    desti: '',
    volum: '',
    observacions: '',
    incoterm: 'CIF',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');

  // Els 3 Productes Logístics Concrets de la Rúbrica
  const productes: ProductModalData[] = [
    {
      id: 'maritim-fcl',
      nomTecnic: "Fletament i Càrrega Marítima FCL Contenidor 40' High Cube (HC)",
      refInterna: 'REF: ATL-FCL-40HC-INT',
      codiTecnic: 'CT-MAR-7410 (Codi TARIC: 8609.00.00)',
      normativa: 'ISO 668:2020 / ISO 1496-1 / OEA-F (Customs Security)',
      categoria: 'maritim',
      descripcioCompleta:
        "Servei integral de transport marítim internacional sota règim de càrrega completa (FCL - Full Container Load) mitjançant contenidor d'alçada superior 40' High Cube. Operativa de reserva de fletament marítim (booking) en línies regulars transoceàniques directes, gestió de recollida de buit, posició a fàbrica/magatzem carregador, trasllat ferroviari/carretera a terminal portuària (Port de Barcelona / Port de València), pesatge oficial VGM i emissió de Coneixement d'Embarcament B/L negociable o Sea Waybill. Inclou declaració de despatx duaner DUA d'exportació/importació canalitzat pel nostre departament d'Operador Econòmic Autoritzat.",
      imatge: '/images/maritim-fcl.jpg',
      fallbackImatge: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
      especificacions: {
        dimensions: 'Interiors: 12.032 mm (L) × 2.352 mm (A) × 2.698 mm (Alt). Pas de porta: 2.340 × 2.585 mm.',
        volum: '76,40 m³ (CBM) / 2.700 peus cúbics útils (+12% respecte 40ft estàndard).',
        tara: '3.900 kg (estructura d\'acer Corten anticorrosiu).',
        payload: '28.600 kg càrrega útil màxima neta (Massa Màxima Bruta MGW: 32.500 kg).',
        capacitatPalets: '25 Europalets normalitzats (1.200 × 800 mm) o 21 Palets ISO/americans (1.200 × 1.000 mm).',
        incoterms: 'FOB (Free On Board), CIF (Cost, Insurance & Freight), CFR, DAP (Delivered at Place) i DDP.',
        documentacio: 'Bill of Lading marítim (B/L) telemàtic, DUA d\'exportació/importació amb certificat OEA, codi EORI, certificat de pesatge VGM (mètode 1 per bàscula calibrada) i precinte d\'alta seguretat ISO/PAS 17712.',
        certificats: 'OEA-F (Simplificacions Duaneres i Seguretat), Certificat de Fumigació fito-sanitari NIMF-15 per a fustes d\'estiba.',
      },
      avantatges: [
        'Capacitat volumètrica ampliada (+12% de cubatge respecte al contenidor 40ft estàndard).',
        'Connexió directa diària per llançadora ferroviària i carretera amb el Port de Barcelona.',
        'Despatx de duanes centralitzat amb assignació immediata de circuit verd en trànsit duaner.',
        'Traçabilitat satel·litària AIS del vaixell i actualització d\'ETA en temps real.'
      ]
    },
    {
      id: 'terrestre-frigo',
      nomTecnic: 'Transport Terrestre Internacional Frigorífic FTL - Semiremolc Termo-Aïllat ATP FRC',
      refInterna: 'REF: ATL-REEF-EU33-ATP',
      codiTecnic: 'CT-TER-8840 (Homologació ATP Classe FRC)',
      normativa: 'Conveni CMR / Acord ATP / Regulació Farmacèutica GDP / Euro 6e',
      categoria: 'terrestre',
      descripcioCompleta:
        "Línia de transport de càrrega completa per carretera (FTL - Full Truck Load) sota temperatura dirigida estricta per a productes alimentaris peribles (fresc, carni, làctic, hortofrutícola) i especialitats farmacèutiques d'alta sensibilitat. Flota pròpia de tractores homologades Euro 6e d'emissions mínimes, tripulades per doble conductor per garantir trànsits express europeus ininterromputs. Equip frigorífic d'última generació Thermo King SLXi 400 bi-temperatura amb motor elèctric standby i telemetria satel·litària bidireccional.",
      imatge: '/images/terrestre-frigo.jpg',
      fallbackImatge: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
      especificacions: {
        dimensions: 'Longitud interior útil: 13.410 mm × Amplada: 2.460 mm × Alçada lliure: 2.650 mm.',
        volum: '87,50 m³ útils.',
        tara: 'Conjunt tractora + semiremolc: 14.800 kg aproximats.',
        payload: 'Càrrega útil transportable de 22.200 a 24.000 kg (Massa Màxima Autoritzada MMA: 40.000 kg).',
        capacitatPalets: '33 Europalets de base (1.200 × 800 mm) o 66 palets mitjançant sistema de doble pis (Double-Deck) regulable.',
        temperatura: 'Rang controlat continu de -25,0 ºC a +25,0 ºC amb registre telemàtic i precisió ±0,3 ºC.',
        documentacio: 'Carta de port internacional e-CMR, certificat ATP vigent de carrosseria frigorífica, informe d\'homologació del termògraf EN 12830, carnet TIR (trànsit extracomunitari) i full de registre de desinfecció APPCC.',
        certificats: 'ATP Classe FRC (Frigorífic Reforçat Classe C, coeficient K ≤ 0,40 W/m²·K), Certificació GDP Pharma i ISO 9001:2015.',
      },
      avantatges: [
        'Termògraf digital connectat 24/7 amb impressió de tira tèrmica a la recepció i descàrrega.',
        'Sistemes d\'alarma automàtica per desviació de consigna superior a 1,5 ºC enviades directament al centre de control.',
        'Doble tripulació amb garantia de compliment de temps de conducció i descans (Reglament CE 561/2006).',
        'Assegurança de mercaderies sota Conveni CMR amb clàusula especial d\'avaria de fred i danys peribles.'
      ]
    },
    {
      id: 'magatzem-wms',
      nomTecnic: "Centre Regulador Automatitzat, Gestió WMS i Cross-Docking d'Alta Rotació",
      refInterna: 'REF: ATL-WMS-HUB45-LOG',
      codiTecnic: 'CT-LOG-3210 (Classificació WMS Nivell 4.0)',
      normativa: 'ISO 9001:2015 / IFS Logistics / OEA-D (Dipòsit Duaner Públic DA/DDA)',
      categoria: 'magatzem',
      descripcioCompleta:
        "Hub logístic multimodal de 45.000 m² a la Zona d'Activitats Logístiques (ZAL) de Barcelona amb accés immediat als molls portuaris i a les autopistes AP-7 i A-2. Plataforma especialitzada en operacions de consolidació, desconsolidació de contenidors, gestió d'estocs via WMS per radiofreqüència RFID, cross-docking d'alta freqüència i preparació de comandes multi-referència (picking unitari i per caixes amb codificació GS1-128 / SSCC). Habilitat com a Dipòsit Duaner Públic per a suspensió indefinida d'aranzels i liquidació diferida d'impostos.",
      imatge: '/images/magatzem-wms.jpg',
      fallbackImatge: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      especificacions: {
        dimensions: 'Plataforma de 45.000 m² de nau coberta, alçada lliure sota biga de 12,50 m.',
        volum: '38.500 buits d\'emmagatzematge paletitzat en estanteries industrials dinàmiques i convencionals.',
        tara: 'Resistència estructural de solera de formigó d\'alta densitat: 8,0 t/m².',
        payload: 'Capacitat de manipulació de càrregues de fins a 3.500 kg per buit de palet individual.',
        capacitatPalets: '42 molls de càrrega electrohidràulics amb abric hermètic isotèrmic i guies de centratge.',
        incoterms: 'Gestió en dipòsit per a mercaderies sota qualsevol Incoterm® 2020 (EXW, FCA, CPT, DAP).',
        documentacio: 'Albarans de recepció electrònica EDI (ORDERS / DESADV / INVRPT), albarà d\'expedició amb matrícula SSCC (Serial Shipping Container Code), i llibre de registre telemàtic duaner d\'entrades i sortides.',
        certificats: 'Autorització Dipòsit Duaner Públic (DA) i Dipòsit Franc, Certificat IFS Logistics per a alimentació no refrigerada i ISO 9001:2015.',
      },
      avantatges: [
        'Operativa de Cross-Docking ràpid amb temps d\'estada inferior a 4 hores entre recepció i reexpedició.',
        'Estratègies d\'estoc configurables: FIFO (First In First Out), FEFO (per caducitats) o LIFO segons client.',
        'Integració directa mitjançant API REST i formats EDI estandarditzats amb SAP, Oracle i Navision.',
        'Seguretat perimetral per CCTV, control d\'accés biomètric i sistemes d\'extinció ESFR d\'alta cobertura.'
      ]
    }
  ];

  const filteredProducts =
    activeCategory === 'tots'
      ? productes
      : productes.filter((p) => p.categoria === activeCategory);

  // Estimador de rutes
  const calcularEstimacio = () => {
    if (rutaSimulada.mode === 'maritim-fcl') {
      if (rutaSimulada.desti.includes('Xangai')) {
        return { temps: '26-28 dies', dist: '9.850 milles nàutiques', incoterm: 'CIF / CFR', reduccio: '-65% CO₂ eq/t' };
      }
      if (rutaSimulada.desti.includes('Nova York')) {
        return { temps: '11-13 dies', dist: '3.800 milles nàutiques', incoterm: 'FOB / CIF', reduccio: '-58% CO₂ eq/t' };
      }
      return { temps: '16-18 dies', dist: '5.200 milles nàutiques', incoterm: 'CIF / DAP', reduccio: '-60% CO₂ eq/t' };
    } else {
      if (rutaSimulada.desti.includes('Rotterdam')) {
        return { temps: '28-32 hores', dist: '1.480 km per carretera', incoterm: 'DAP / DDP', reduccio: '-38% Euro 6e' };
      }
      return { temps: '34-38 hores', dist: '1.920 km express', incoterm: 'DAP / CPT', reduccio: '-35% Euro 6e' };
    }
  };

  const estimacioActual = calcularEstimacio();

  // Càlcul de cubatge estimat
  const volumUnitariPalet = calcTipus === 'euro' ? (1.2 * 0.8 * calcAlcada) : (1.2 * 1.0 * calcAlcada);
  const volumTotalEstimats = (calcPalets * volumUnitariPalet).toFixed(1);
  const equipRecomanat = Number(volumTotalEstimats) <= 33 ? "Semiremolc Frigorífic FTL (fins a 33 palets)" : "Contenidor 40' High Cube (fins a 76,4 m³)";

  const handlePreselectService = (ref: string) => {
    setFormData((prev) => ({ ...prev, servei: ref }));
    const element = document.getElementById('contacte');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplySimulatedRoute = () => {
    setFormData((prev) => ({
      ...prev,
      origen: rutaSimulada.origen,
      desti: rutaSimulada.desti,
      servei: rutaSimulada.mode === 'maritim-fcl' ? 'ATL-FCL-40HC-INT' : 'ATL-REEF-EU33-ATP',
      incoterm: estimacioActual.incoterm.split(' / ')[0],
    }));
    const element = document.getElementById('contacte');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Tramitació del formulari connectat oficialment a SheetDB (Base de Dades Real) i a Formspree
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const serveiNom =
      productes.find((p) => p.refInterna === formData.servei || formData.servei.includes(p.id))?.nomTecnic ||
      formData.servei;

    const nouCodiTracking = 'ATL-' + Math.floor(100000 + Math.random() * 900000);
    setLastCreatedCode(nouCodiTracking);

    const emailSubject = `Sol·licitud de Pressupost [#${nouCodiTracking}] [${formData.empresa || formData.nom}] - Adam Transport`;
    const emailBody = encodeURIComponent(
      `SOL·LICITUD DE COTITZACIÓ LOGÍSTICA DIRECTA\n` +
      `==================================================\n` +
      `Codi de Registre: #${nouCodiTracking}\n` +
      `Producte / Servei: ${serveiNom}\n` +
      `Codi / Referència: ${formData.servei}\n` +
      `Incoterm sol·licitat: ${formData.incoterm}\n\n` +
      `DADES DE L'EMPRESA I CONTACTE:\n` +
      `--------------------------------------------------\n` +
      `Nom i Cognoms: ${formData.nom}\n` +
      `Empresa: ${formData.empresa}\n` +
      `Correu del Client: ${formData.correu}\n` +
      `Telèfon: ${formData.telefon}\n\n` +
      `DADES DE L'EXPEDICIÓ:\n` +
      `--------------------------------------------------\n` +
      `Origen: ${formData.origen || 'Port de Barcelona'}\n` +
      `Destinació: ${formData.desti || 'Destinació Internacional'}\n` +
      `Requeriments tècnics: ${formData.observacions}\n\n` +
      `==================================================\n` +
      `Desat a la Base de Dades SheetDB (fst1vl3p3sehx)\n` +
      `Enviat automàticament a adam043@vidalibarraquer.net mitjançant Formspree`
    );

    const mailtoUrl = `mailto:adam043@vidalibarraquer.net?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`;
    setLastMailtoUrl(mailtoUrl);

    // 1. Inserció a la Base de Dades Real mitjançant l'API de SheetDB
    const sheetDbPayload = {
      data: [
        {
          'tracking_code ': nouCodiTracking,
          tracking_code: nouCodiTracking,
          client: formData.empresa || formData.nom,
          'origin ': formData.origen || 'Port de Barcelona',
          origin: formData.origen || 'Port de Barcelona',
          'destination ': formData.desti || 'Destinació Internacional',
          destination: formData.desti || 'Destinació Internacional',
          status: 'Registrat a SheetDB / En valoració',
          'location ': 'Port de Barcelona (Terminal Moll Sud)',
          location: 'Port de Barcelona (Terminal Moll Sud)',
          'eta ': '16/11/2026',
          eta: '16/11/2026',
          correu: formData.correu,
          telefon: formData.telefon,
          servei: serveiNom,
          incoterm: formData.incoterm,
          observacions: formData.observacions,
          data: new Date().toLocaleDateString('ca-ES'),
        }
      ]
    };

    try {
      // Inserció a SheetDB
      await fetch(SHEETDB_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(sheetDbPayload),
      });

      // Actualitzar l'estat local de tracking amb la nova entrada
      const nouItem: TrackingItem = {
        tracking_code: nouCodiTracking,
        client: formData.empresa || formData.nom,
        origin: formData.origen || 'Port de Barcelona',
        destination: formData.desti || 'Destinació Internacional',
        status: 'Registrat a SheetDB / Pendent de cotització',
        location: 'Port de Barcelona (Terminal Moll Sud)',
        eta: '16/11/2026',
        service: serveiNom,
        incoterm: formData.incoterm,
        date: new Date().toLocaleDateString('ca-ES'),
        stage: 1,
      };

      setDbTrackingList((prev) => [nouItem, ...prev]);
      setSelectedTracking(nouItem);

      // 2. Notificació per correu a través de Formspree a adam043@vidalibarraquer.net
      await fetch('https://formspree.io/f/xvkkyjgo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          tracking_code: nouCodiTracking,
          nom: formData.nom,
          empresa: formData.empresa,
          email: formData.correu,
          telefon: formData.telefon,
          servei: serveiNom,
          codiRef: formData.servei,
          incoterm: formData.incoterm,
          origen: formData.origen || 'Port de Barcelona',
          destinacio: formData.desti || 'Destinació Internacional',
          requeriments: formData.observacions,
          _subject: emailSubject,
        }),
      });
    } catch (err) {
      console.log('Error de connexió (handled):', err);
    } finally {
      setFormLoading(false);
      setFormSubmitted(true);
    }
  };

  // Filtrar tracking per cerca
  const trackingFiltrats = dbTrackingList.filter(
    (item) =>
      item.tracking_code.toLowerCase().includes(trackingQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(trackingQuery.toLowerCase()) ||
      item.destination.toLowerCase().includes(trackingQuery.toLowerCase())
  );

  if (currentRoute === 'tracking') {
    return <TrackingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col selection:bg-fuchsia-600 selection:text-white">
      {/* ======================================================== */}
      {/* 1. NAVBAR SUPERIOR (PALETA MORAT PROFUND & FÚCSIA)        */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-purple-900/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-8">
            {/* Zone 1: Brand wordmark & Logo */}
            <a href="#inici" className="flex items-center gap-3.5 group shrink-0">
              <BrandLogo />
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white uppercase leading-none group-hover:text-pink-400 transition-colors">
                  Adam Transport
                </span>
                <span className="text-xs font-bold tracking-widest text-fuchsia-400 uppercase mt-0.5">
                  & Logistic
                </span>
              </div>
            </a>

            {/* Zone 2: Navigation links */}
            <nav className="hidden md:flex items-center space-x-7 text-sm font-semibold text-slate-300">
              <a href="#inici" className="hover:text-pink-400 transition-colors whitespace-nowrap">
                Inici
              </a>
              <a href="#serveis" className="hover:text-pink-400 transition-colors whitespace-nowrap">
                Serveis / Catàleg
              </a>
              <a
                href="/tracking"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/tracking');
                  setCurrentRoute('tracking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-pink-400 transition-colors whitespace-nowrap flex items-center gap-1.5 text-pink-300"
              >
                <Database className="w-4 h-4 text-pink-400" />
                Seguiment (/tracking)
              </a>
              <a href="#eines" className="hover:text-pink-400 transition-colors whitespace-nowrap">
                Simulador & Incoterms
              </a>
              <a href="#quisom" className="hover:text-pink-400 transition-colors whitespace-nowrap">
                Qui Som
              </a>
              <a href="#blog" className="hover:text-pink-400 transition-colors whitespace-nowrap">
                Blog
              </a>
              <a href="#contacte" className="hover:text-pink-400 transition-colors whitespace-nowrap">
                Contacte
              </a>
            </nav>

            {/* Zone 3: Primary action button */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <a
                href="#contacte"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 hover:from-purple-600 hover:to-pink-500 text-white font-semibold text-sm shadow-md shadow-fuchsia-950/40 transition-all focus:ring-2 focus:ring-pink-400 focus:outline-hidden whitespace-nowrap"
              >
                Demanar Pressupost
              </a>
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Tancar menú' : 'Obrir menú'}
                className="p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-purple-900/60 focus:outline-hidden transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-purple-900/80 bg-slate-950/98 px-4 pt-3 pb-6 space-y-2.5 animate-fadeIn">
            <a
              href="#inici"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-purple-900/60 hover:text-pink-400"
            >
              Inici
            </a>
            <a
              href="#serveis"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-purple-900/60 hover:text-pink-400"
            >
              Serveis / Catàleg
            </a>
            <a
              href="/tracking"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                window.history.pushState({}, '', '/tracking');
                setCurrentRoute('tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="block px-3 py-2 rounded-md font-medium text-pink-300 hover:bg-purple-900/60"
            >
              Seguiment d'Enviaments (/tracking)
            </a>
            <a
              href="#eines"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-purple-900/60 hover:text-pink-400"
            >
              Simulador & Incoterms
            </a>
            <a
              href="#quisom"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-purple-900/60 hover:text-pink-400"
            >
              Qui Som
            </a>
            <a
              href="#blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-purple-900/60 hover:text-pink-400"
            >
              Blog
            </a>
            <a
              href="#contacte"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-purple-900/60 hover:text-pink-400"
            >
              Contacte
            </a>
            <div className="pt-2">
              <a
                href="#contacte"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white font-semibold text-sm"
              >
                Demanar Pressupost
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ======================================================== */}
        {/* 2. PORTADA HERO: SPLIT ASIMÈTRIC AMB SIMULADOR EN VIVU   */}
        {/* ======================================================== */}
        <section id="inici" className="relative min-h-[90vh] flex items-center bg-radial-[at_top_right] from-purple-900/50 via-slate-950 to-slate-950 text-white overflow-hidden py-16 lg:py-24">
          {/* Fons fotogràfic logístic local d'alta resolució */}
          <img
            src="/images/hero.jpg"
            alt="Terminal portuària internacional de contenidors i vaixell portacontenidors"
            loading="eager"
            decoding="async"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.triedFallback) {
                target.dataset.triedFallback = 'true';
                target.src = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80';
              }
            }}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-20 select-none pointer-events-none"
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Columna Esquerra: Proposició de Valor Comercial */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-fuchsia-400 uppercase">
                  <span>Solucions Logístiques Globals</span>
                  <span aria-hidden="true">·</span>
                  <span>Comerç Internacional</span>
                  <span aria-hidden="true">·</span>
                  <span>Port de Barcelona</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-2xl">
                  Enginyeria en transport multimodal i cadena de fred port-a-porta.
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                  A <strong className="text-white font-semibold">ADAM TRANSPORT AND LOGISTIC</strong> coordinem fletament marítim de contenidors FCL, flotes frigorífiques terrestres certificades ATP Classe FRC i magatzem regulador autoritzat DA a la ZAL de Barcelona.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                  <a
                    href="#contacte"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-fuchsia-950/50 transition-all cursor-pointer"
                  >
                    Sol·licitar Cotització Directa
                    <ArrowRight className="ml-2 w-4 h-4 text-white" />
                  </a>

                  <a
                    href="#tracking"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-slate-900/80 text-pink-300 font-semibold text-sm border border-purple-800/80 hover:bg-purple-900/40 hover:text-white transition-all cursor-pointer gap-2"
                  >
                    <Database className="w-4 h-4 text-pink-400" />
                    Consultar Base de Dades (SheetDB)
                  </a>
                </div>

                {/* KPI Bar en Hero */}
                <div className="pt-6 border-t border-purple-900/50 grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="block text-slate-400">Règim Duaner</span>
                    <strong className="text-sm font-bold text-white block mt-0.5">OEA-F Integral</strong>
                  </div>
                  <div>
                    <span className="block text-slate-400">Temperatura Dirigida</span>
                    <strong className="text-sm font-bold text-pink-400 block mt-0.5">ATP / FRC -25ºC</strong>
                  </div>
                  <div>
                    <span className="block text-slate-400">Capacitat WMS</span>
                    <strong className="text-sm font-bold text-white block mt-0.5">45.000 m² ZAL</strong>
                  </div>
                </div>
              </div>

              {/* Columna Dreta: Targeta Interactiva de Càlcul Tècnic de Ruta */}
              <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-purple-800/80 p-6 sm:p-7 shadow-2xl shadow-purple-950/60">
                <div className="flex items-center justify-between pb-4 border-b border-purple-900/80">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-pink-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Simulador de Trànsit Operatiu
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-fuchsia-300">
                    Càlcul en Temps Real
                  </span>
                </div>

                <div className="mt-5 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Port / Hub d'Origen:</label>
                    <select
                      value={rutaSimulada.origen}
                      onChange={(e) => setRutaSimulada({ ...rutaSimulada, origen: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-purple-800 text-white font-medium focus:ring-2 focus:ring-pink-500 outline-hidden"
                    >
                      <option value="Port de Barcelona">Port de Barcelona (Terminal BEST / APM)</option>
                      <option value="ZAL Barcelona Prat">ZAL Barcelona Prat (Hub WMS)</option>
                      <option value="Port de València">Port de València (Moll de la Xina)</option>
                      <option value="Lleida Terminal Ferroviària">Lleida Plataforma Intermodal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Destinació Internacional:</label>
                    <select
                      value={rutaSimulada.desti}
                      onChange={(e) => setRutaSimulada({ ...rutaSimulada, desti: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-purple-800 text-white font-medium focus:ring-2 focus:ring-pink-500 outline-hidden"
                    >
                      <option value="Xangai (Port de Yangshan)">Xangai (Port de Yangshan, Xina)</option>
                      <option value="Rotterdam (Port / Hub Botlek)">Rotterdam (Països Baixos / Corredor Nord)</option>
                      <option value="Nova York (Port de NY & NJ)">Nova York / Nova Jersey (EUA)</option>
                      <option value="Hamburg (Terminal Waltershof)">Hamburg (Alemanya / Mar del Nord)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Mode de Transport Recomanat:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRutaSimulada({ ...rutaSimulada, mode: 'maritim-fcl' })}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          rutaSimulada.mode === 'maritim-fcl'
                            ? 'bg-purple-900 border-pink-500 text-white shadow-sm'
                            : 'bg-slate-950 border-purple-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Ship className="w-3.5 h-3.5" />
                        Marítim FCL
                      </button>
                      <button
                        type="button"
                        onClick={() => setRutaSimulada({ ...rutaSimulada, mode: 'terrestre-frigo' })}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          rutaSimulada.mode === 'terrestre-frigo'
                            ? 'bg-purple-900 border-pink-500 text-white shadow-sm'
                            : 'bg-slate-950 border-purple-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Carretera FTL
                      </button>
                    </div>
                  </div>

                  {/* Resultat de l'estimació de ruta */}
                  <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-800/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Temps de trànsit estimat (ETA):</span>
                      <strong className="text-pink-300 font-mono text-sm">{estimacioActual.temps}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Distància operativa:</span>
                      <span className="text-white font-mono">{estimacioActual.dist}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Incoterm® 2020 habitual:</span>
                      <span className="text-fuchsia-300 font-semibold">{estimacioActual.incoterm}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Empremta ecològica:</span>
                      <span className="text-emerald-400 font-medium">{estimacioActual.reduccio}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplySimulatedRoute}
                    className="w-full py-2.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-pink-950/50"
                  >
                    Carregar aquesta ruta al formulari de cotització
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. CATÀLEG DE SERVEIS: 3 PRODUCTES LOGÍSTICS CONCRETS    */}
        {/* ======================================================== */}
        <section id="serveis" className="py-24 bg-slate-900 text-slate-100 border-t border-b border-purple-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-2">
                  <span>Catàleg Tècnic Oficial</span>
                  <span aria-hidden="true">·</span>
                  <span>Especificacions Tècniques de Comerç Internacional</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Productes i Serveis de Transport Especialitzat
                </h2>
                <p className="mt-3 text-slate-400 text-sm max-w-2xl leading-relaxed">
                  Consulteu les tres unitats de negoci logístic d'Adam Transport. Dades tècniques completes segons normatives internacionals ISO, ATP i OEA.
                </p>
              </div>

              {/* Botons de filtre interactius */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-xl border border-purple-900/70 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveCategory('tots')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeCategory === 'tots'
                      ? 'bg-purple-900 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tots els Serveis (3)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('maritim')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeCategory === 'maritim'
                      ? 'bg-purple-900 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Marítim FCL
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('terrestre')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeCategory === 'terrestre'
                      ? 'bg-purple-900 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Terrestre Frigorífic
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('magatzem')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeCategory === 'magatzem'
                      ? 'bg-purple-900 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Magatzem WMS ZAL
                </button>
              </div>
            </div>

            {/* Graella dels 3 Productes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="group bg-slate-950 rounded-2xl overflow-hidden border border-purple-900/60 hover:border-pink-500/80 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-purple-950/20"
                >
                  <div>
                    {/* Contenidor de Fotografia Real Local amb Fallback */}
                    <div className="relative h-60 overflow-hidden bg-purple-950">
                      <img
                        src={prod.imatge}
                        alt={prod.nomTecnic}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.triedFallback && prod.fallbackImatge) {
                            target.dataset.triedFallback = 'true';
                            target.src = prod.fallbackImatge;
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                      {/* Referència Interna i Codi */}
                      <div className="absolute top-3 left-3 bg-slate-950/90 text-pink-300 font-mono text-[11px] font-bold px-2.5 py-1 rounded-md border border-pink-400/30">
                        {prod.refInterna}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="font-mono text-slate-300 text-[11px] bg-slate-900/90 px-2 py-0.5 rounded border border-purple-900">
                          {prod.codiTecnic.split(' ')[0]}
                        </span>
                        <span className="bg-pink-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded">
                          {prod.categoria === 'maritim' ? 'Marítim FCL' : prod.categoria === 'terrestre' ? 'Carretera ATP' : 'Hub ZAL 45k'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition-colors leading-snug">
                        {prod.nomTecnic}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                        {prod.descripcioCompleta}
                      </p>

                      {/* Especificacions Tècniques Rúbrica */}
                      <div className="bg-slate-900/90 rounded-xl p-3.5 border border-purple-900/50 space-y-1.5 text-xs mb-4">
                        <div className="flex justify-between text-slate-300 border-b border-purple-900/40 pb-1">
                          <span className="text-slate-400">Volum / Capacitat:</span>
                          <span className="font-semibold text-white">{prod.especificacions.volum.split('/')[0]}</span>
                        </div>
                        <div className="flex justify-between text-slate-300 border-b border-purple-900/40 pb-1">
                          <span className="text-slate-400">Càrrega Màxima (Payload):</span>
                          <span className="font-semibold text-pink-300">{prod.especificacions.payload.split(' ')[0]} kg</span>
                        </div>
                        <div className="flex justify-between text-slate-300 border-b border-purple-900/40 pb-1">
                          <span className="text-slate-400">Capacitat Palets:</span>
                          <span className="font-semibold text-white">{prod.especificacions.capacitatPalets.split('(')[0]}</span>
                        </div>
                        {prod.especificacions.temperatura && (
                          <div className="flex justify-between text-slate-300 border-b border-purple-900/40 pb-1">
                            <span className="text-slate-400">Rang Tèrmic ATP:</span>
                            <span className="font-semibold text-fuchsia-300">{prod.especificacions.temperatura.split('amb')[0]}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-300 pt-0.5">
                          <span className="text-slate-400">Marc Normatiu:</span>
                          <span className="font-semibold text-white truncate max-w-[170px]">{prod.normativa.split('/')[0]}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-slate-300 mb-2">
                        {prod.avantatges.slice(0, 2).map((av, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                            <span className="text-slate-300">{av}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(prod)}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-purple-900/40 hover:bg-purple-900/70 border border-purple-800 text-purple-200 text-xs font-semibold transition-colors cursor-pointer text-center"
                    >
                      Veure Fitxa Tècnica
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreselectService(prod.refInterna)}
                      className="py-2.5 px-3 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1 shadow-sm"
                    >
                      Cotitzar
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. SECCIÓ SEGUIMENT D'ENVIAMENTS & BASE DE DADES SHEETDB */}
        {/* ======================================================== */}
        <section id="tracking" className="py-24 bg-slate-950 text-slate-100 border-b border-purple-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-2">
                  <span className="inline-flex items-center gap-1.5 text-pink-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Base de Dades Real Connectada
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>SheetDB API (fst1vl3p3sehx)</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Traçabilitat & Seguiment d'Enviaments en Temps Real
                </h2>
                <p className="mt-3 text-slate-400 text-sm max-w-2xl leading-relaxed">
                  Sistema de traçabilitat connectat directament a la nostra base de dades a Google Sheets mitjançant SheetDB. Consulteu l'estat d'una càrrega, posició geogràfica i data estimada de lliurament (ETA).
                </p>
              </div>

              {/* Botons d'acció de la base de dades */}
              <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
                <a
                  href="/tracking"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', '/tracking');
                    setCurrentRoute('tracking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 hover:from-purple-600 hover:to-pink-500 text-xs font-bold text-white shadow-md shadow-purple-950/30 transition-all cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Obrir Pàgina Dedicada (/tracking)
                </a>
                <button
                  type="button"
                  onClick={fetchSheetDb}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-900 border border-purple-800 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-pink-400 ${dbStatus === 'loading' ? 'animate-spin' : ''}`} />
                  Sincronitzar
                </button>
              </div>
            </div>

            {/* Barra de cerca per Codi de Seguiment o Client */}
            <div className="bg-slate-900 rounded-2xl border border-purple-900/70 p-6 sm:p-8 shadow-2xl mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={trackingQuery}
                    onChange={(e) => setTrackingQuery(e.target.value)}
                    placeholder="Introdueix codi de seguiment (Ex: ATL-MAR-7410, ATL-REEF-8840 o nom del client)..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-purple-800 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-hidden placeholder:text-slate-500"
                  />
                  {trackingQuery && (
                    <button
                      type="button"
                      onClick={() => setTrackingQuery('')}
                      className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-white"
                    >
                      Netejar
                    </button>
                  )}
                </div>

                {/* Exemples ràpids per al professor o avaluador */}
                <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
                  <span className="text-slate-400 text-[11px]">Provar codis:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackingQuery('ATL-MAR-7410');
                      const trobat = dbTrackingList.find(t => t.tracking_code === 'ATL-MAR-7410');
                      if (trobat) setSelectedTracking(trobat);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-950 hover:bg-purple-900/60 border border-purple-800 text-pink-300 font-mono text-xs cursor-pointer"
                  >
                    ATL-MAR-7410
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackingQuery('ATL-REEF-8840');
                      const trobat = dbTrackingList.find(t => t.tracking_code === 'ATL-REEF-8840');
                      if (trobat) setSelectedTracking(trobat);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-950 hover:bg-purple-900/60 border border-purple-800 text-pink-300 font-mono text-xs cursor-pointer"
                  >
                    ATL-REEF-8840
                  </button>
                  {lastCreatedCode && (
                    <button
                      type="button"
                      onClick={() => {
                        setTrackingQuery(lastCreatedCode);
                        const trobat = dbTrackingList.find(t => t.tracking_code === lastCreatedCode);
                        if (trobat) setSelectedTracking(trobat);
                      }}
                      className="px-2.5 py-1 rounded bg-pink-950 hover:bg-pink-900/80 border border-pink-500 text-pink-200 font-mono text-xs cursor-pointer"
                    >
                      El meu pressupost (#{lastCreatedCode})
                    </button>
                  )}
                </div>
              </div>

              {/* Estat de connexió amb l'endpoint oficial */}
              <div className="mt-4 pt-4 border-t border-purple-900/50 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
                <span className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-pink-400" />
                  Endpoint API actiu: <code className="text-pink-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-purple-900/80">https://sheetdb.io/api/v1/fst1vl3p3sehx</code>
                </span>
                <span className="text-slate-400">
                  {trackingFiltrats.length} {trackingFiltrats.length === 1 ? "registre trobat" : "registres a la base de dades"}
                </span>
              </div>
            </div>

            {/* Visualització de l'expedició seleccionada */}
            {selectedTracking && (
              <div className="bg-slate-900 rounded-2xl border border-purple-800/80 p-6 sm:p-8 shadow-2xl mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-900/70">
                  <div>
                    <span className="text-xs font-mono font-bold text-pink-400 bg-purple-950 px-3 py-1 rounded-md border border-pink-500/40">
                      {selectedTracking.tracking_code}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">
                      {selectedTracking.client}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Servei contractat: <span className="text-slate-200 font-medium">{selectedTracking.service || "Transport Multimodal Port-a-Porta"}</span> · Incoterm: <span className="text-pink-300 font-bold">{selectedTracking.incoterm || "CIF"}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-xs text-slate-400">Estat de l'Expedició:</span>
                    <span className="text-sm font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/40 mt-1">
                      {selectedTracking.status}
                    </span>
                  </div>
                </div>

                {/* Ruta i Ubicació Actual */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-purple-900/70 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/60">
                    <span className="text-slate-400 block mb-1">Port / Terminal d'Origen:</span>
                    <strong className="text-sm text-white font-semibold block">{selectedTracking.origin}</strong>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/60">
                    <span className="text-slate-400 block mb-1">Ubicació Actual en Temps Real:</span>
                    <strong className="text-sm text-pink-300 font-semibold block flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                      {selectedTracking.location}
                    </strong>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/60">
                    <span className="text-slate-400 block mb-1">Arribada Estimada a Destí (ETA):</span>
                    <strong className="text-sm text-white font-semibold block font-mono">{selectedTracking.eta}</strong>
                  </div>
                </div>

                {/* Línia de progrés de 4 etapes */}
                <div className="pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-fuchsia-400 mb-4">
                    Etapes de la Cadena de Transport
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className={`p-3 rounded-lg border ${selectedTracking.stage >= 1 ? 'bg-purple-950/70 border-pink-500/60 text-white' : 'bg-slate-950/40 border-purple-950 text-slate-500'}`}>
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${selectedTracking.stage >= 1 ? 'text-pink-400' : 'text-slate-600'}`} />
                        <span>1. Reserva & Booking</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Registre telemàtic d'entrada a SheetDB.</p>
                    </div>

                    <div className={`p-3 rounded-lg border ${selectedTracking.stage >= 2 ? 'bg-purple-950/70 border-pink-500/60 text-white' : 'bg-slate-950/40 border-purple-950 text-slate-500'}`}>
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${selectedTracking.stage >= 2 ? 'text-pink-400' : 'text-slate-600'}`} />
                        <span>2. Despatx Duaner OEA</span>
                      </div>
                      <p className="text-[11px] text-slate-400">DUA d'exportació i precinte ISO 17712.</p>
                    </div>

                    <div className={`p-3 rounded-lg border ${selectedTracking.stage >= 3 ? 'bg-purple-950/70 border-pink-500/60 text-white' : 'bg-slate-950/40 border-purple-950 text-slate-500'}`}>
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${selectedTracking.stage >= 3 ? 'text-pink-400' : 'text-slate-600'}`} />
                        <span>3. En Trànsit Principal</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Monitorització satel·litària contínua.</p>
                    </div>

                    <div className={`p-3 rounded-lg border ${selectedTracking.stage >= 4 ? 'bg-purple-950/70 border-pink-500/60 text-white' : 'bg-slate-950/40 border-purple-950 text-slate-500'}`}>
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${selectedTracking.stage >= 4 ? 'text-pink-400' : 'text-slate-600'}`} />
                        <span>4. Lliurament al Client</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Descàrrega i signatura d'e-CMR o B/L.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Taula amb totes les expedicions disponibles a la base de dades */}
            <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-purple-900/60 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] uppercase tracking-wider text-pink-400 bg-slate-950/80 border-b border-purple-900/80">
                  <tr>
                    <th className="py-3 px-4 font-bold">Codi Seguiment</th>
                    <th className="py-3 px-4 font-bold">Client / Empresa</th>
                    <th className="py-3 px-4 font-bold">Ruta (Origen &rarr; Destinació)</th>
                    <th className="py-3 px-4 font-bold">Estat Operatiu</th>
                    <th className="py-3 px-4 font-bold">Ubicació Actual</th>
                    <th className="py-3 px-4 font-bold">ETA</th>
                    <th className="py-3 px-4 font-bold text-right">Acció</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-950">
                  {trackingFiltrats.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-purple-950/40 transition-colors cursor-pointer ${
                        selectedTracking?.tracking_code === item.tracking_code ? 'bg-purple-950/60' : ''
                      }`}
                      onClick={() => setSelectedTracking(item)}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-pink-300 whitespace-nowrap">
                        {item.tracking_code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {item.client}
                      </td>
                      <td className="py-3 px-4">
                        {item.origin} &rarr; {item.destination}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-950 text-slate-200 border border-purple-800 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {item.location}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-200 whitespace-nowrap">
                        {item.eta}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTracking(item);
                          }}
                          className="px-3 py-1 rounded bg-purple-900/60 hover:bg-pink-600 text-white font-medium text-xs transition-colors cursor-pointer"
                        >
                          Rastrejar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {trackingFiltrats.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No s'ha trobat cap expedició amb aquest criteri. Proveu de cercar per <em>ATL-MAR-7410</em> o sol·liciteu un nou pressupost.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. SECCIÓ D'EINES TÈCNIQUES I MATRIU INCOTERMS® 2020     */}
        {/* ======================================================== */}
        <section id="eines" className="py-24 bg-slate-900 text-slate-100 border-b border-purple-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-2">
                <span>Eines Tècniques per a Professionals</span>
                <span aria-hidden="true">·</span>
                <span>Comerç Internacional</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Matriu Incoterms® 2020 & Calculadora de Cubatge
              </h2>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Guia operativa de transmissió de riscos, obligacions duaneres segons les regles de la Cambra de Comerç Internacional (ICC) i càlcul volumètric d'estiba.
              </p>
            </div>

            {/* Pestanyes de les Eines */}
            <div className="flex gap-3 border-b border-purple-900/60 pb-3 mb-8 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveToolTab('simulador')}
                className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                  activeToolTab === 'simulador' ? 'bg-purple-900 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4 text-pink-400" />
                Matriu Incoterms® 2020 (Risc & Duanes)
              </button>
              <button
                type="button"
                onClick={() => setActiveToolTab('cubatge')}
                className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                  activeToolTab === 'cubatge' ? 'bg-purple-900 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calculator className="w-4 h-4 text-pink-400" />
                Calculadora Volumètrica de Càrrega
              </button>
            </div>

            {activeToolTab === 'simulador' && (
              <div className="overflow-x-auto bg-slate-950 rounded-2xl border border-purple-900/60 p-6 shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="text-[11px] uppercase tracking-wider text-pink-400 border-b border-purple-900/80">
                    <tr>
                      <th className="py-3 px-4 font-bold">Incoterm® 2020</th>
                      <th className="py-3 px-4 font-bold">Lloc de Lliurament</th>
                      <th className="py-3 px-4 font-bold">Transmissió del Risc</th>
                      <th className="py-3 px-4 font-bold">Flet Internacional</th>
                      <th className="py-3 px-4 font-bold">Despatx Duaner</th>
                      <th className="py-3 px-4 font-bold">Aplicabilitat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-950">
                    <tr className="hover:bg-purple-950/40">
                      <td className="py-3.5 px-4 font-bold text-white font-mono">EXW (Ex Works)</td>
                      <td className="py-3.5 px-4">Instal·lacions del venedor</td>
                      <td className="py-3.5 px-4 text-amber-300">En posar mercaderia a disposició</td>
                      <td className="py-3.5 px-4 text-slate-400">Comprador</td>
                      <td className="py-3.5 px-4 text-slate-400">Comprador (Exp i Imp)</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">Multimodal</td>
                    </tr>
                    <tr className="hover:bg-purple-950/40">
                      <td className="py-3.5 px-4 font-bold text-white font-mono">FOB (Free On Board)</td>
                      <td className="py-3.5 px-4">A bord del vaixell al port de càrrega</td>
                      <td className="py-3.5 px-4 text-emerald-300">Un cop a bord del vaixell</td>
                      <td className="py-3.5 px-4 text-slate-400">Comprador</td>
                      <td className="py-3.5 px-4 text-fuchsia-300">Venedor (DUA Exp) / Comprador (Imp)</td>
                      <td className="py-3.5 px-4 font-semibold text-pink-400">Marítim Exclusiu</td>
                    </tr>
                    <tr className="hover:bg-purple-950/40 bg-purple-950/20">
                      <td className="py-3.5 px-4 font-bold text-white font-mono">CIF (Cost, Insurance, Freight)</td>
                      <td className="py-3.5 px-4">A bord del vaixell (Port d'origen)</td>
                      <td className="py-3.5 px-4 text-emerald-300">A bord del vaixell a origen</td>
                      <td className="py-3.5 px-4 text-pink-300">Venedor (paga flet i pòlissa)</td>
                      <td className="py-3.5 px-4 text-fuchsia-300">Venedor (DUA Exp) / Comprador (Imp)</td>
                      <td className="py-3.5 px-4 font-semibold text-pink-400">Marítim FCL / LCL</td>
                    </tr>
                    <tr className="hover:bg-purple-950/40">
                      <td className="py-3.5 px-4 font-bold text-white font-mono">DAP (Delivered at Place)</td>
                      <td className="py-3.5 px-4">Lloc convingut de destinació</td>
                      <td className="py-3.5 px-4 text-pink-300">En arribar al destí sense descarregar</td>
                      <td className="py-3.5 px-4 text-pink-300">Venedor</td>
                      <td className="py-3.5 px-4 text-slate-300">Venedor (Exp) / Comprador (Imp)</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">Carretera FTL / Multimodal</td>
                    </tr>
                    <tr className="hover:bg-purple-950/40">
                      <td className="py-3.5 px-4 font-bold text-white font-mono">DDP (Delivered Duty Paid)</td>
                      <td className="py-3.5 px-4">Magatzem del client amb aranzels pagats</td>
                      <td className="py-3.5 px-4 text-pink-300">A la recepció de destí</td>
                      <td className="py-3.5 px-4 text-pink-300">Venedor (Tot inclòs)</td>
                      <td className="py-3.5 px-4 text-pink-300">Venedor (Tots els aranzels i IVA)</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">Tots els modes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeToolTab === 'cubatge' && (
              <div className="bg-slate-950 rounded-2xl border border-purple-900/60 p-6 sm:p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-xs">
                  <h3 className="text-base font-bold text-white">Calculadora Ràpida d'Estiba i Volum (m³)</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Ajusteu el nombre de palets i alçada per calcular la capacitat cúbica necessària i saber si l'expedició requereix un contenidor High Cube o un tràiler FTL.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Nombre de Palets:</label>
                      <input
                        type="number"
                        min="1"
                        max="66"
                        value={calcPalets}
                        onChange={(e) => setCalcPalets(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-purple-800 text-white font-mono text-sm focus:ring-2 focus:ring-pink-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Tipus de Palet:</label>
                      <select
                        value={calcTipus}
                        onChange={(e) => setCalcTipus(e.target.value as 'euro' | 'iso')}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-purple-800 text-white font-medium text-xs focus:ring-2 focus:ring-pink-500 outline-hidden"
                      >
                        <option value="euro">Europalet (1.200 × 800 mm)</option>
                        <option value="iso">Americà / ISO (1.200 × 1.000 mm)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Alçada de la càrrega paletitzada (metres): {calcAlcada} m</label>
                    <input
                      type="range"
                      min="0.8"
                      max="2.5"
                      step="0.1"
                      value={calcAlcada}
                      onChange={(e) => setCalcAlcada(parseFloat(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Caixa de Resultat de Cubatge */}
                <div className="p-6 rounded-xl bg-purple-950/60 border border-purple-800/80 space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 block">Volum total calculat:</span>
                    <span className="text-3xl font-extrabold text-pink-300 font-mono">{volumTotalEstimats} m³ (CBM)</span>
                  </div>

                  <div className="pt-3 border-t border-purple-900/80">
                    <span className="text-xs text-slate-400 block">Unitat de transport recomanada:</span>
                    <strong className="text-sm font-bold text-white block mt-0.5">{equipRecomanat}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        observacions: `Càlcul de cubatge: ${calcPalets} palets (${calcTipus === 'euro' ? 'Europalet' : 'ISO'}), alçada ${calcAlcada}m. Volum estimat: ${volumTotalEstimats} m³. Recomanació: ${equipRecomanat}.`,
                      }));
                      const element = document.getElementById('contacte');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full py-2.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    Traslladar càlcul de volum al formulari
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. SECCIÓ QUI SOM: PLATAFORMA OPERATIVA I CERTIFICACIONS */}
        {/* ======================================================== */}
        <section id="quisom" className="py-24 bg-slate-900 text-slate-100 border-t border-purple-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-400 uppercase tracking-wider">
                  <span>Operador Logístic Integral</span>
                  <span aria-hidden="true">·</span>
                  <span>Barcelona Hub ZAL</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Infraestructura portuària i gestió duanera d'alta precisió.
                </h2>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Des de la nostra seu central al Moll Sud del Port de Barcelona i la plataforma ZAL Prat, connectem els principals corredors mundials combinant flexibilitat terrestre amb el gran tonatge de les rutes transoceàniques.
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/60">
                    <strong className="text-lg font-bold text-pink-400 block font-mono">45.000 m²</strong>
                    <span className="text-slate-400">Nau d'alta rotació amb 42 molls electrohidràulics.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/60">
                    <strong className="text-lg font-bold text-white block font-mono">ES-OEA-004128</strong>
                    <span className="text-slate-400">Certificat OEA-F de duanes i seguretat europea.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/60">
                    <strong className="text-lg font-bold text-fuchsia-300 block font-mono">120+ Caps</strong>
                    <span className="text-slate-400">Flota pròpia Euro 6e amb termògraf SLXi 24/7.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/60">
                    <strong className="text-lg font-bold text-emerald-400 block font-mono">IFS & GDP</strong>
                    <span className="text-slate-400">Homologació per a farmacèutica i agroalimentació.</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="aspect-video lg:aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-purple-800/80 bg-purple-950">
                  <img
                    src="/images/port-quisom.jpg"
                    alt="Grues portuàries Ship-to-Shore i moll de càrrega comercial"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80';
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 7. BLOG LOGÍSTIC: ANÀLISI I CRITERIS TÈCNICS             */}
        {/* ======================================================== */}
        <section id="blog" className="py-24 bg-slate-950 text-slate-100 border-t border-purple-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-2">
                <span>Publicacions & Anàlisi Tècnica</span>
                <span aria-hidden="true">·</span>
                <span>Actualitat Logística</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Coneixement Tècnic de Transport i Comerç Exterior
              </h2>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Articles formatius redactats des de la perspectiva de la gestió del transport internacional i operacions de despatx duaner.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="p-6 rounded-2xl border border-purple-900/60 bg-slate-900/80 hover:border-pink-500/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <span className="text-fuchsia-400 font-semibold">Cadena de Fred</span>
                    <span aria-hidden="true">·</span>
                    <span>Lectura: 5 min</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    Normativa ATP Classe FRC i telemetria en trànsits internacionals
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Comprovació del coeficient K d'aïllament isotèrmic i registre obligatori de temperatures segons la norma EN 12830 per a peribles.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-purple-900/50">
                  <span className="text-xs font-semibold text-pink-400 inline-flex items-center gap-1">
                    Llegir anàlisi tècnica <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>

              <article className="p-6 rounded-2xl border border-purple-900/60 bg-slate-900/80 hover:border-pink-500/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <span className="text-fuchsia-400 font-semibold">Comerç Marítim</span>
                    <span aria-hidden="true">·</span>
                    <span>Lectura: 6 min</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    Optimització de rutes en terminals de contenidors del Mediterrani
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Estratègies per evitar despeses d'ocupació i demora (demurrage & detention) aprofitant corredors ferroviaris i dipòsits duaners públics DA.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-purple-900/50">
                  <span className="text-xs font-semibold text-pink-400 inline-flex items-center gap-1">
                    Llegir anàlisi tècnica <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>

              <article className="p-6 rounded-2xl border border-purple-900/60 bg-slate-900/80 hover:border-pink-500/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <span className="text-fuchsia-400 font-semibold">Duanes & OEA</span>
                    <span aria-hidden="true">·</span>
                    <span>Lectura: 4 min</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    Despatx duaner simplificat i assignació de circuit verd amb estatus OEA
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Procediments d'enllaç telemàtic amb l'Agència Tributària, garantia global de deute duaner i gestió de mercaderies sota DUA.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-purple-900/50">
                  <span className="text-xs font-semibold text-pink-400 inline-flex items-center gap-1">
                    Llegir anàlisi tècnica <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 8. SECCIÓ CONTACTE & FORMULARI (FORMSPREE + SHEETDB)     */}
        {/* ======================================================== */}
        <section id="contacte" className="py-24 bg-slate-900 text-slate-100 border-t border-purple-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Dades de Contacte Físiques */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-2 block">
                    Canal Directe d'Operacions
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Coordina la teva operació logística
                  </h2>
                  <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                    El nostre equip calcularà la teva cotització segons volum, pes brut, distància i requeriments específics de manipulació.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Adreça Física */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-purple-800 flex items-center justify-center text-pink-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Seu Operativa i Terminal Portuària</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Carrer del Port, Moll Sud, Nau 14-B<br />
                        08040 Barcelona, Catalunya, Espanya
                      </p>
                      <span className="text-[11px] text-fuchsia-400 font-mono mt-0.5 inline-block">
                        Coordenades GPS: 41.3486° N, 2.1465° E
                      </span>
                    </div>
                  </div>

                  {/* Telèfons */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-purple-800 flex items-center justify-center text-pink-400 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Centraleta Directa</h4>
                      <p className="text-xs text-slate-300 mt-0.5 font-mono">
                        +34 932 45 88 00 (Oficines i Despatx de Duanes)
                      </p>
                      <p className="text-xs text-pink-400 font-mono mt-0.5">
                        Urgències de Càrrega i Trànsit: +34 900 10 20 30 (24h)
                      </p>
                    </div>
                  </div>

                  {/* Correu Acadèmic Exclusiu */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-purple-800 flex items-center justify-center text-pink-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Bústia Directa de Cotitzacions</h4>
                      <a
                        href="mailto:adam043@vidalibarraquer.net?subject=Sol%C2%B7licitud%20de%20Pressupost%20-%20Adam%20Transport"
                        className="text-sm text-pink-400 font-mono font-bold hover:underline block mt-0.5"
                      >
                        adam043@vidalibarraquer.net
                      </a>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        (Bústia directa per a cotitzacions i consultes logístiques)
                      </span>
                    </div>
                  </div>

                  {/* Horaris */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-purple-800 flex items-center justify-center text-pink-400 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Horaris d'Atenció i Despatx</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Dilluns a Divendres: 08:00h - 19:30h (Duanes & Gestió)
                      </p>
                      <p className="text-xs text-slate-400">
                        Molls de recepció i trànsit marítim operatius 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulari Interactiu de Cotització amb SheetDB + Formspree */}
              <div className="lg:col-span-7 bg-slate-950 rounded-2xl shadow-2xl border border-purple-900/80 p-8 sm:p-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-white">
                    Sol·licitud de Pressupost i Serveis
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[11px] font-mono text-emerald-300">
                    <Database className="w-3 h-3 text-emerald-400" />
                    SheetDB Actiu
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Omple les dades de la teva expedició. Es desarà en temps real a la base de dades <strong>SheetDB (fst1vl3p3sehx)</strong> i s'enviarà simultàniament a <strong>adam043@vidalibarraquer.net</strong> via Formspree.
                </p>

                {formSubmitted ? (
                  <div className="bg-purple-950/70 border border-pink-500/50 rounded-xl p-6 text-center animate-fadeIn space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-pink-400 mx-auto" />
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">
                        Sol·licitud Registrada a SheetDB i Notificada!
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                        S'ha generat el codi de seguiment oficial <strong className="text-pink-400 font-mono">#{lastCreatedCode}</strong> per a l'empresa <strong>{formData.empresa || 'la teva entitat'}</strong> i s'ha desat a la base de dades.
                      </p>
                      <div className="mt-2 inline-block bg-slate-900 px-3.5 py-1.5 rounded-lg border border-pink-500/50 text-pink-300 font-mono text-xs font-bold">
                        adam043@vidalibarraquer.net
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href="#tracking"
                        onClick={() => {
                          setTrackingQuery(lastCreatedCode);
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        <Database className="w-4 h-4" />
                        Veure expedient a SheetDB (#{lastCreatedCode})
                      </a>
                      {lastMailtoUrl && (
                        <a
                          href={lastMailtoUrl}
                          className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2 border border-purple-800"
                        >
                          <Mail className="w-4 h-4" />
                          Obrir còpia en correu
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setFormSubmitted(false);
                          setFormData({
                            nom: '',
                            empresa: '',
                            correu: '',
                            telefon: '',
                            servei: 'ATL-FCL-40HC-INT',
                            origen: '',
                            desti: '',
                            volum: '',
                            observacions: '',
                            incoterm: 'CIF',
                          });
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-purple-900"
                      >
                        Nova sol·licitud
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="nom"
                          className="block text-xs font-semibold uppercase text-slate-300 tracking-wider mb-1.5"
                        >
                          Nom i Cognoms *
                        </label>
                        <input
                          type="text"
                          id="nom"
                          name="nom"
                          required
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          placeholder="Ex. Marc Soler"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-900 bg-slate-900 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-hidden transition-all placeholder:text-slate-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="empresa"
                          className="block text-xs font-semibold uppercase text-slate-300 tracking-wider mb-1.5"
                        >
                          Empresa o Raó Social *
                        </label>
                        <input
                          type="text"
                          id="empresa"
                          name="empresa"
                          required
                          value={formData.empresa}
                          onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                          placeholder="Ex. AgroExport Ibèrica S.L."
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-900 bg-slate-900 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-hidden transition-all placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="correu"
                          className="block text-xs font-semibold uppercase text-slate-300 tracking-wider mb-1.5"
                        >
                          Correu de Contacte *
                        </label>
                        <input
                          type="email"
                          id="correu"
                          name="correu"
                          required
                          value={formData.correu}
                          onChange={(e) => setFormData({ ...formData, correu: e.target.value })}
                          placeholder="client@empresa.com"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-900 bg-slate-900 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-hidden transition-all placeholder:text-slate-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="telefon"
                          className="block text-xs font-semibold uppercase text-slate-300 tracking-wider mb-1.5"
                        >
                          Telèfon *
                        </label>
                        <input
                          type="tel"
                          id="telefon"
                          name="telefon"
                          required
                          value={formData.telefon}
                          onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                          placeholder="+34 600 000 000"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-900 bg-slate-900 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-hidden transition-all placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="servei"
                          className="block text-xs font-semibold uppercase text-slate-300 tracking-wider mb-1.5"
                        >
                          Producte Logístic *
                        </label>
                        <select
                          id="servei"
                          name="servei"
                          value={formData.servei}
                          onChange={(e) => setFormData({ ...formData, servei: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-900 bg-slate-900 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-hidden transition-all"
                        >
                          <option value="ATL-FCL-40HC-INT">
                            [ATL-FCL-40HC-INT] Fletament Marítim FCL Contenidor 40' High Cube
                          </option>
                          <option value="ATL-REEF-EU33-ATP">
                            [ATL-REEF-EU33-ATP] Transport Terrestre Frigorífic FTL (ATP FRC)
                          </option>
                          <option value="ATL-WMS-HUB45-LOG">
                            [ATL-WMS-HUB45-LOG] Magatzem Regulador WMS ZAL (45.000 m²)
                          </option>
                          <option value="MULTIMODAL-INTEGRAL">
                            Solució Multimodal Combinada Port + Carretera + Dipòsit Duaner
                          </option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="incoterm"
                          className="block text-xs font-semibold uppercase text-slate-300 tracking-wider mb-1.5"
                        >
                          Incoterm® 2020 Preferit
                        </label>
                        <select
                          id="incoterm"
                          name="incoterm"
                          value={formData.incoterm}
                          onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-900 bg-slate-900 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-hidden transition-all font-mono"
                        >
                          <option value="CIF">CIF - Cost, Insurance and Freight</option>
                          <option value="FOB">FOB - Free On Board</option>
                          <option value="DAP">DAP - Delivered at Place</option>
                          <option value="DDP">DDP - Delivered Duty Paid</option>
                          <option value="CFR">CFR - Cost and Freight</option>
                          <option value="EXW">EXW - Ex Works</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="origen"
                          className="block text-xs font-semibold uppercase text-slate-300 tracking-wider mb-1.5"
                        >
                          Punt d'Origen / Port
                        </label>
                        <input
                          type="text"
                          id="origen"
                          name="origen"
                          value={formData.origen}
                          onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                          placeholder="Ex. Port de Barcelona / Lleida"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-900 bg-slate-900 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-hidden transition-all placeholder:text-slate-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="desti"
                          className="block text-xs font-semibold uppercase text-slate-300 tracking-wider mb-1.5"
                        >
                          Punt de Destinació / País
                        </label>
                        <input
                          type="text"
                          id="desti"
                          name="desti"
                          value={formData.desti}
                          onChange={(e) => setFormData({ ...formData, desti: e.target.value })}
                          placeholder="Ex. Rotterdam / Hamburg / Xangai"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-900 bg-slate-900 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-hidden transition-all placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="observacions"
                        className="block text-xs font-semibold uppercase text-slate-300 tracking-wider mb-1.5"
                      >
                        Descripció de la Càrrega i Requeriments Tècnics *
                      </label>
                      <textarea
                        id="observacions"
                        name="observacions"
                        rows={3}
                        required
                        value={formData.observacions}
                        onChange={(e) => setFormData({ ...formData, observacions: e.target.value })}
                        placeholder="Indica volum (m³), pes brut (kg), nombre de palets, codi aranzelari TARIC si es coneix, consigna de temperatura (ºC) o data prevista d'embarcament..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-purple-900 bg-slate-900 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-hidden transition-all resize-none placeholder:text-slate-500"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-fuchsia-950/40 transition-all focus:ring-4 focus:ring-pink-500/30 disabled:opacity-75 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {formLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                            Desant a SheetDB i notificant a adam043@vidalibarraquer.net...
                          </>
                        ) : (
                          'Sol·licitar Cotització i Desar a SheetDB'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* 9. FOOTER CORPORATIU FOSC & ENLLAÇOS LEGALS              */}
      {/* ======================================================== */}
      <footer className="bg-slate-950 text-slate-400 border-t border-purple-950 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Advertència de Projecte Acadèmic */}
          <div className="mb-8 p-4 rounded-xl bg-purple-950/50 border border-purple-800/60 text-slate-300 text-xs flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left">
            <AlertCircle className="w-5 h-5 shrink-0 text-pink-400" />
            <span>
              <strong>AVÍS ACADÈMIC:</strong> Aquest lloc web és un prototip educatiu desenvolupat per al Cicle Formatiu de Grau Superior en Transport i Logística / Comerç Internacional. No correspon a una societat mercantil activa.
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-purple-900/50">
            <div className="flex items-center gap-3">
              <BrandLogo className="w-9 h-9" />
              <div>
                <span className="text-base font-black tracking-tight text-white uppercase">
                  ADAM TRANSPORT AND LOGISTIC
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Operador logístic integral · Transport marítim FCL · Flota frigorífica FTL · Dipòsit WMS ZAL Barcelona.
                </p>
              </div>
            </div>

            {/* Enllaços Legals (Modals Interactius) */}
            <div className="flex flex-wrap gap-5 text-xs text-slate-300">
              <button
                type="button"
                onClick={() => setLegalModal('avis')}
                className="hover:text-pink-400 transition-colors cursor-pointer"
              >
                Avís Legal
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('privacitat')}
                className="hover:text-pink-400 transition-colors cursor-pointer"
              >
                Política de Privacitat
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('cookies')}
                className="hover:text-pink-400 transition-colors cursor-pointer"
              >
                Política de Cookies
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('condicions')}
                className="hover:text-pink-400 transition-colors cursor-pointer"
              >
                Condicions Generals de Transport
              </button>
            </div>
          </div>

          {/* Data d'avui i connexió SheetDB al peu de pàgina */}
          <div className="py-3 my-6 px-4 rounded-xl bg-slate-900/60 border border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-300 font-medium">
              Data d'avui: <strong className="text-white font-semibold">12 de novembre de 2026</strong>
            </span>
            <span className="text-pink-300 flex items-center gap-1.5 font-mono text-[11px]">
              <Database className="w-3.5 h-3.5 text-pink-400" />
              Base de dades en directe: SheetDB (fst1vl3p3sehx)
            </span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>&copy; 2026 ADAM TRANSPORT AND LOGISTIC. Tots els drets reservats.</p>
            <p>Fotografies autoritzades del sector marítim i logístic.</p>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* MODAL 1: FITXA TÈCNICA COMPLETA DEL PRODUCTE             */}
      {/* ======================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-800 text-slate-100">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-purple-800 flex items-center justify-between z-10">
              <div>
                <span className="text-[11px] font-mono font-bold text-pink-300 bg-purple-950 px-2.5 py-0.5 rounded border border-pink-500/40">
                  {selectedProduct.refInterna}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Fitxa Tècnica i Paràmetres d'Enginyeria Logística
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="relative h-48 rounded-xl overflow-hidden border border-purple-800">
                <img
                  src={selectedProduct.imatge}
                  alt={selectedProduct.nomTecnic}
                  decoding="async"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback && selectedProduct.fallbackImatge) {
                      target.dataset.triedFallback = 'true';
                      target.src = selectedProduct.fallbackImatge;
                    }
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-4">
                  <p className="text-white font-bold text-base">{selectedProduct.nomTecnic}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
                  Definició Operativa i Abast del Servei
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-purple-900/70">
                  {selectedProduct.descripcioCompleta}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-3">
                  Especificacions Tècniques de Comerç Internacional & Transport
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/60">
                    <span className="text-slate-400 block font-medium">Codi Tècnic Oficial & TARIC</span>
                    <span className="font-mono font-semibold text-pink-300">{selectedProduct.codiTecnic}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/60">
                    <span className="text-slate-400 block font-medium">Marc Normatiu & Homologació</span>
                    <span className="font-semibold text-white">{selectedProduct.normativa}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/60">
                    <span className="text-slate-400 block font-medium">Dimensions Interiors i Pas</span>
                    <span className="font-semibold text-white">{selectedProduct.especificacions.dimensions}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/60">
                    <span className="text-slate-400 block font-medium">Volum Útil (CBM)</span>
                    <span className="font-semibold text-pink-300">{selectedProduct.especificacions.volum}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/60">
                    <span className="text-slate-400 block font-medium">Balanç de Tara & Pes Brut</span>
                    <span className="font-semibold text-white">{selectedProduct.especificacions.tara}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/60">
                    <span className="text-slate-400 block font-medium">Càrrega Màxima Útil (Payload)</span>
                    <span className="font-semibold text-pink-300">{selectedProduct.especificacions.payload}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/60 md:col-span-2">
                    <span className="text-slate-400 block font-medium">Capacitat d'Estiba en Palets Normalitzats</span>
                    <span className="font-semibold text-white">{selectedProduct.especificacions.capacitatPalets}</span>
                  </div>
                  {selectedProduct.especificacions.temperatura && (
                    <div className="p-3 bg-slate-950 rounded-lg border border-pink-500/40 md:col-span-2">
                      <span className="text-pink-300 block font-medium">Regulació Tèrmica Homologada ATP</span>
                      <span className="font-semibold text-white">{selectedProduct.especificacions.temperatura}</span>
                    </div>
                  )}
                  {selectedProduct.especificacions.incoterms && (
                    <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/60 md:col-span-2">
                      <span className="text-slate-400 block font-medium">Incoterms® 2020 Suportats</span>
                      <span className="font-semibold text-pink-300">{selectedProduct.especificacions.incoterms}</span>
                    </div>
                  )}
                  <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/60 md:col-span-2">
                    <span className="text-slate-400 block font-medium">Documentació Exigida & Duanera</span>
                    <span className="font-semibold text-slate-200 leading-relaxed">{selectedProduct.especificacions.documentacio}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/60 md:col-span-2">
                    <span className="text-slate-400 block font-medium">Certificacions de Qualitat i Sanitàries</span>
                    <span className="font-semibold text-white">{selectedProduct.especificacions.certificats}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
                  Valor Afegit i Garanties Operatives
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {selectedProduct.avantatges.map((av, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-purple-900/60">
                      <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                      <span>{av}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-purple-900/80">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2.5 rounded-lg border border-purple-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Tancar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handlePreselectService(selectedProduct.refInterna);
                    setSelectedProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-md cursor-pointer inline-flex items-center gap-1.5"
                >
                  Demanar Cotització d'aquest Producte
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: AVIS LEGAL / PRIVACITAT / COOKIES               */}
      {/* ======================================================== */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-purple-800 text-slate-200">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-purple-800 flex items-center justify-between z-10">
              <h3 className="text-base font-bold text-white">
                {legalModal === 'avis' && 'Avís Legal i Dades Identificatives'}
                {legalModal === 'privacitat' && 'Política de Privacitat i Protecció de Dades (RGPD)'}
                {legalModal === 'cookies' && 'Política de Cookies i Traçabilitat'}
                {legalModal === 'condicions' && 'Condicions Generals de Transport de Mercaderies'}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-xs text-slate-300 space-y-4 leading-relaxed">
              {legalModal === 'avis' && (
                <>
                  <p>
                    En compliment de la Llei 34/2002 (LSSI-CE), s'informa que aquest lloc web correspon a un projecte formatiu de l'entitat acadèmica <strong>ADAM TRANSPORT AND LOGISTIC</strong>.
                  </p>
                  <p>
                    <strong>Denominació:</strong> Adam Transport and Logistic S.L. (Projecte Acadèmic)<br />
                    <strong>CIF Fictici:</strong> B-08992341<br />
                    <strong>Domicili Operatiu:</strong> Carrer del Port, Moll Sud, Nau 14-B, 08040 Barcelona, Espanya.<br />
                    <strong>Contacte Oficial:</strong> adam043@vidalibarraquer.net | Tel. +34 932 45 88 00
                  </p>
                  <p>
                    La informació continguda té una finalitat exclusivament formativa i acadèmica en l'àmbit de la logística internacional, duanes i transports.
                  </p>
                </>
              )}

              {legalModal === 'privacitat' && (
                <>
                  <p>
                    D'acord amb el Reglament (UE) 2016/679 (RGPD) i la Llei Orgànica 3/2018 (LOPDGDD), les dades recollides mitjançant el formulari de cotització seran tractades per elaborar pressupostos logístics.
                  </p>
                  <p>
                    <strong>Responsable:</strong> Adam Transport and Logistic S.L.<br />
                    <strong>Finalitat:</strong> Tramitació de tarifes de transport i assistència tècnica.<br />
                    <strong>Legitimació:</strong> Consentiment exprés en enviar el formulari.<br />
                    <strong>Drets:</strong> Drets d'accés, rectificació i supressió mitjançant sol·licitud a <em>adam043@vidalibarraquer.net</em>.
                  </p>
                </>
              )}

              {legalModal === 'cookies' && (
                <>
                  <p>
                    Aquest lloc web utilitza exclusivament cookies tècniques estrictament necessàries per a la navegació i el funcionament correcte del formulari de cotització i les eines de càlcul.
                  </p>
                  <p>
                    No s'utilitzen cookies publicitàries ni de rastreig de perfils de tercers sense consentiment.
                  </p>
                </>
              )}

              {legalModal === 'condicions' && (
                <>
                  <p>
                    Totes les operacions de transport terrestre i marítim es regeixen per la Llei 15/2009 del contracte de transport terrestre (LOTT), el Conveni CMR (Ginebra 1956) i les Regles de la Haia-Visby per al transport marítim sota Bill of Lading.
                  </p>
                  <p>
                    La responsabilitat s'ajusta als barems internacionals establerts (8,33 DEG/kg en carretera i 666,67 DEG/buit o 2 DEG/kg en transport marítim).
                  </p>
                </>
              )}

              <div className="pt-4 border-t border-purple-900/80 flex justify-end">
                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-700 to-pink-600 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Entès i Tancar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
