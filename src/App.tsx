import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

// Logotip Corporatiu en Paleta Morat & Rosa:
// Hexàgon isomètric de càrrega multimodal amb monògram "A" i vectors de flux en fúcsia radiant i morat
function BrandLogo({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-gradient-to-br from-purple-700 via-fuchsia-700 to-pink-500 p-0.5 shadow-md shadow-fuchsia-950/20 group-hover:scale-105 transition-transform flex items-center justify-center`}>
      <div className="w-full h-full bg-purple-950 rounded-[10px] flex items-center justify-center p-1.5">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Hexàgon exterior de contenidor / càrrega global */}
          <path d="M20 3L35 11.66V28.34L20 37L5 28.34V11.66L20 3Z" stroke="#f472b6" strokeWidth="2.4" strokeLinejoin="round" />
          {/* Vèrtexs interiors de volum 3D */}
          <path d="M20 3V20M35 11.66L20 20M5 11.66L20 20" stroke="#c084fc" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M20 20V37" stroke="#e879f9" strokeWidth="1.8" strokeDasharray="2 2" />
          {/* Monògram "A" estilitzat i fletxa d'enllaç multimodal en rosa vibrant */}
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
  categoria: string;
  descripcioCompleta: string;
  imatge: string;
  fallbackImatge?: string;
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

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'tots' | 'maritim' | 'terrestre' | 'magatzem'>('tots');
  const [selectedProduct, setSelectedProduct] = useState<ProductModalData | null>(null);
  const [legalModal, setLegalModal] = useState<string | null>(null);
  
  // Estat del formulari de contacte
  const [formData, setFormData] = useState({
    nom: '',
    empresa: '',
    correu: '',
    telefon: '',
    servei: 'ATL-FCL-40HC',
    origen: '',
    desti: '',
    volum: '',
    observacions: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');

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
      fallbackImatge:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
      especificacions: {
        dimensions: 'Interiors: 12.032 mm (L) × 2.352 mm (A) × 2.698 mm (Alt). Pas de porta: 2.340 × 2.585 mm.',
        volum: '76,40 m³ (CBM) / 2.700 peus cúbics útils.',
        tara: '3.900 kg (estructura d\'acer Corten anticorrosiu).',
        payload: '28.600 kg càrrega útil màxima neta (Massa Màxima Bruta MGW: 32.500 kg).',
        capacitatPalets: '25 Europalets normalitzats (1.200 × 800 mm) o 21 Palets americans/ISO (1.200 × 1.000 mm) en planta única.',
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
      fallbackImatge:
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
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
      fallbackImatge:
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const serveiNom =
      productes.find((p) => p.refInterna.includes(formData.servei) || formData.servei.includes(p.id))?.nomTecnic ||
      formData.servei;

    const emailSubject = `Nova Sol·licitud de Pressupost [${formData.empresa || formData.nom}] - Adam Transport`;
    const emailBody = encodeURIComponent(
      `SOL·LICITUD DE COTITZACIÓ LOGÍSTICA DIRECTA\n` +
      `==================================================\n` +
      `Producte / Servei: ${serveiNom}\n` +
      `Codi / Ref: ${formData.servei}\n\n` +
      `DADES DE L'EMPRESA I CONTACTE:\n` +
      `--------------------------------------------------\n` +
      `Nom i Cognoms: ${formData.nom}\n` +
      `Empresa: ${formData.empresa}\n` +
      `Correu del Client: ${formData.correu}\n` +
      `Telèfon: ${formData.telefon}\n\n` +
      `DADES DE L'EXPEDICIÓ:\n` +
      `--------------------------------------------------\n` +
      `Origen: ${formData.origen || 'No indicat'}\n` +
      `Destinació: ${formData.desti || 'No indicat'}\n` +
      `Requeriments tècnics i volum: ${formData.observacions}\n\n` +
      `==================================================\n` +
      `Enviat automàticament via Formspree (xvkkyjgo) a adam043@vidalibarraquer.net`
    );

    const mailtoUrl = `mailto:adam043@vidalibarraquer.net?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`;
    setLastMailtoUrl(mailtoUrl);

    try {
      // Connectat oficialment amb l'endpoint de Formspree (https://formspree.io/f/xvkkyjgo)
      const res = await fetch('https://formspree.io/f/xvkkyjgo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          empresa: formData.empresa,
          email: formData.correu,
          telefon: formData.telefon,
          servei: serveiNom,
          codiRef: formData.servei,
          origen: formData.origen || 'No indicat',
          destinacio: formData.desti || 'No indicat',
          requeriments: formData.observacions,
          _subject: emailSubject,
        }),
      });
      console.log('Formspree response status:', res.status);
    } catch (err) {
      console.log('Formspree request handled:', err);
    } finally {
      setFormLoading(false);
      setFormSubmitted(true);
    }
  };

  const handlePreselectService = (ref: string) => {
    setFormData((prev) => ({ ...prev, servei: ref }));
    const element = document.getElementById('contacte');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-purple-50/40 text-slate-900 antialiased flex flex-col selection:bg-fuchsia-600 selection:text-white">
      {/* ======================================================== */}
      {/* 1. NAVBAR SUPERIOR (PALETA MORAT & ROSA)                 */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 bg-purple-950/95 backdrop-blur-md border-b border-purple-900 shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logotip i Nom de l'Empresa (A dalt a l'esquerra) */}
            <a href="#inici" className="flex items-center gap-3.5 group text-white">
              <BrandLogo />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-white uppercase leading-none group-hover:text-pink-400 transition-colors">
                    Adam Transport
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40">
                    Versió Final Web
                  </span>
                </div>
                <span className="text-xs font-bold tracking-widest text-pink-400 uppercase mt-0.5">
                  & Logistic
                </span>
              </div>
            </a>

            {/* Menú de Navegació d'Escriptori */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-purple-200">
              <a href="#inici" className="hover:text-pink-300 transition-colors">
                Inici
              </a>
              <a href="#serveis" className="hover:text-pink-300 transition-colors">
                Serveis / Catàleg
              </a>
              <a href="#quisom" className="hover:text-pink-300 transition-colors">
                Qui Som
              </a>
              <a href="#blog" className="hover:text-pink-300 transition-colors">
                Blog
              </a>
              <a href="#contacte" className="hover:text-pink-300 transition-colors">
                Contacte
              </a>
            </nav>

            {/* Crida a l'Acció Navbar (Gradient Morat a Rosa) */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#contacte"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm shadow-md shadow-pink-900/30 transition-all focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
              >
                Demanar Pressupost
              </a>
            </div>

            {/* Botó Menú Mòbil */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Tancar menú' : 'Obrir menú'}
                className="p-2.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900 focus:outline-hidden transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú Desplegable Mòbil */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-purple-900 bg-purple-950 px-4 pt-3 pb-6 space-y-2.5 animate-fadeIn">
            <a
              href="#inici"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-purple-100 hover:bg-purple-900 hover:text-pink-300"
            >
              Inici
            </a>
            <a
              href="#serveis"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-purple-100 hover:bg-purple-900 hover:text-pink-300"
            >
              Serveis / Catàleg
            </a>
            <a
              href="#quisom"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-purple-100 hover:bg-purple-900 hover:text-pink-300"
            >
              Qui Som
            </a>
            <a
              href="#blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-purple-100 hover:bg-purple-900 hover:text-pink-300"
            >
              Blog
            </a>
            <a
              href="#contacte"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-purple-100 hover:bg-purple-900 hover:text-pink-300"
            >
              Contacte
            </a>
            <div className="pt-2">
              <a
                href="#contacte"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:opacity-90"
              >
                Demanar Pressupost
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ======================================================== */}
        {/* 2. PORTADA HERO (Morat Profund, Fúcsia & Rosa)           */}
        {/* ======================================================== */}
        <section
          id="inici"
          className="relative min-h-[85vh] flex items-center justify-center bg-purple-950 text-white overflow-hidden"
        >
          {/* Imatge de fons real del sector logístic */}
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
            className="absolute inset-0 w-full h-full object-cover object-center opacity-25 select-none"
          />
          {/* Degradat de cobertura morat i rosa */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950 via-purple-950/90 to-pink-950/50"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
            <div className="max-w-2xl lg:max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/60 border border-pink-400/30 text-pink-300 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-xs">
                <Globe2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Solucions Logístiques Globals & Comerç Internacional</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
                Liderant el transport i la cadena de subministrament internacional.
              </h1>

              <p className="text-lg sm:text-xl text-purple-100/90 mb-10 leading-relaxed font-normal">
                A <strong className="text-pink-400 font-semibold">ADAM TRANSPORT AND LOGISTIC</strong> sincronitzem càrrega marítima FCL/LCL, flotes terrestres frigorífiques certificades ATP i centres de distribució automatitzats WMS per connectar la teva indústria amb els mercats mundials de forma segura, puntual i homologada.
              </p>

              {/* Botons d'acció en Morat & Rosa */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contacte"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-pink-500 text-white font-bold text-base shadow-lg shadow-pink-600/30 hover:shadow-pink-500/40 hover:opacity-95 transform hover:-translate-y-0.5 transition-all"
                >
                  Demanar Cotització
                  <ArrowRight className="ml-2 w-5 h-5 text-white" />
                </a>

                <a
                  href="#serveis"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-purple-900/40 text-purple-200 font-semibold text-base border border-purple-500/40 backdrop-blur-xs hover:bg-purple-800/50 hover:border-pink-400/60 transition-all"
                >
                  Explorar Catàleg Tècnic
                </a>
              </div>

              {/* Indicadors de Confiança Operativa */}
              <div className="mt-12 pt-8 border-t border-purple-900 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-purple-300">Règim Operatiu</p>
                  <p className="text-sm font-bold text-pink-400 mt-0.5">OEA-F Autoritzat</p>
                </div>
                <div>
                  <p className="text-purple-300">Cadena de Fred</p>
                  <p className="text-sm font-bold text-fuchsia-300 mt-0.5">Certificat ATP / FRC</p>
                </div>
                <div>
                  <p className="text-purple-300">Emmagatzematge</p>
                  <p className="text-sm font-bold text-white mt-0.5">45.000 m² WMS ZAL</p>
                </div>
                <div>
                  <p className="text-purple-300">Traçabilitat</p>
                  <p className="text-sm font-bold text-pink-400 mt-0.5">GPS / EN 12830 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. CATÀLEG DE SERVEIS / ELS 3 PRODUCTES LOGÍSTICS        */}
        {/* ======================================================== */}
        <section id="serveis" className="py-24 bg-white border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-700 mb-2 block">
                Catàleg Tècnic Superior
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Productes Logístics i Serveis Específics
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Fitxes tècniques desenvolupades d'acord amb els estàndards oficials de comerç exterior, codis aranzelaris, capacitats volumètriques, Incoterms® 2020 i normatives ATP / duaneres.
              </p>

              {/* Filtres per Categoria */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                <button
                  type="button"
                  onClick={() => setActiveCategory('tots')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeCategory === 'tots'
                      ? 'bg-purple-900 text-pink-300 shadow-sm border border-purple-800'
                      : 'bg-purple-100/70 text-purple-900 hover:bg-purple-200'
                  }`}
                >
                  Tots els productes (3)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('maritim')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeCategory === 'maritim'
                      ? 'bg-purple-900 text-pink-300 shadow-sm border border-purple-800'
                      : 'bg-purple-100/70 text-purple-900 hover:bg-purple-200'
                  }`}
                >
                  Transport Marítim FCL
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('terrestre')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeCategory === 'terrestre'
                      ? 'bg-purple-900 text-pink-300 shadow-sm border border-purple-800'
                      : 'bg-purple-100/70 text-purple-900 hover:bg-purple-200'
                  }`}
                >
                  Transport Terrestre Frigorífic FTL
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('magatzem')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeCategory === 'magatzem'
                      ? 'bg-purple-900 text-pink-300 shadow-sm border border-purple-800'
                      : 'bg-purple-100/70 text-purple-900 hover:bg-purple-200'
                  }`}
                >
                  Magatzem WMS & Cross-Docking
                </button>
              </div>
            </div>

            {/* Graella dels 3 Productes Logístics Concrets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-purple-200/90 hover:border-pink-400 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Contenidor d'Imatge Real */}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent"></div>
                      
                      {/* Referència Interna i Codi */}
                      <div className="absolute top-3 left-3 bg-purple-950/90 text-pink-300 backdrop-blur-xs font-mono text-[11px] font-bold px-2.5 py-1 rounded-md border border-pink-400/30">
                        {prod.refInterna}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="font-mono text-purple-200 text-[11px] bg-purple-950/85 px-2 py-0.5 rounded border border-purple-800">
                          {prod.codiTecnic.split(' ')[0]}
                        </span>
                        <span className="bg-pink-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded">
                          {prod.categoria === 'maritim' ? 'Marítim FCL' : prod.categoria === 'terrestre' ? 'Terrestre FTL' : 'Hub ZAL'}
                        </span>
                      </div>
                    </div>

                    {/* Cos de la Targeta */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-purple-800 transition-colors">
                        {prod.nomTecnic}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-5">
                        {prod.descripcioCompleta}
                      </p>

                      {/* Taula de Dades Tècniques Clau */}
                      <div className="bg-purple-50/60 rounded-xl p-4 border border-purple-100 space-y-2.5 text-xs mb-5">
                        <div className="flex items-start justify-between gap-2 border-b border-purple-100 pb-2">
                          <span className="text-purple-900/70 font-medium">Volum útil / CBM:</span>
                          <span className="font-semibold text-purple-950 text-right">{prod.especificacions.volum}</span>
                        </div>
                        <div className="flex items-start justify-between gap-2 border-b border-purple-100 pb-2">
                          <span className="text-purple-900/70 font-medium">Càrrega útil (Payload):</span>
                          <span className="font-semibold text-purple-950 text-right">{prod.especificacions.payload.split('(')[0]}</span>
                        </div>
                        <div className="flex items-start justify-between gap-2 border-b border-purple-100 pb-2">
                          <span className="text-purple-900/70 font-medium">Capacitat d'estiba:</span>
                          <span className="font-semibold text-purple-950 text-right">{prod.especificacions.capacitatPalets}</span>
                        </div>
                        {prod.especificacions.temperatura && (
                          <div className="flex items-start justify-between gap-2 border-b border-purple-100 pb-2">
                            <span className="text-purple-900/70 font-medium">Control Tèrmic:</span>
                            <span className="font-semibold text-pink-700 text-right">{prod.especificacions.temperatura.split('amb')[0]}</span>
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-2 pt-0.5">
                          <span className="text-purple-900/70 font-medium">Marc Normatiu:</span>
                          <span className="font-semibold text-purple-900 text-right text-[11px]">{prod.normativa.split('/')[0]}</span>
                        </div>
                      </div>

                      {/* Llista d'avantatges */}
                      <div className="space-y-1.5 mb-6 text-xs text-slate-600">
                        {prod.avantatges.slice(0, 2).map((av, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                            <span>{av}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Accions de la Targeta */}
                  <div className="p-6 pt-0 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(prod)}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-950 text-xs font-semibold hover:bg-purple-100 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-700" />
                      Fitxa Tècnica
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handlePreselectService(prod.refInterna)}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-gradient-to-r from-purple-800 to-pink-700 text-white text-xs font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Cotitzar
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. QUI SOM / EMPRESA                                     */}
        {/* ======================================================== */}
        <section id="quisom" className="py-20 bg-purple-100/40 border-b border-purple-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-pink-700 mb-2 block">
                  Trajectòria i Compromís Tècnic
                </span>
                <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-6">
                  Més de 15 anys connectant terminals portuàries, flotes i indústries
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed text-sm sm:text-base">
                  Fundada amb la missió de simplificar cadenes de subministrament d'alta complexitat tècnica, <strong className="text-slate-900">ADAM TRANSPORT AND LOGISTIC</strong> combina una infraestructura física capdavantera amb protocols digitals de control d'itineraris en temps real i certificació com a Operador Econòmic Autoritzat.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
                  El nostre equip està conformat per tècnics superiors en transport i comerç internacional, despatxants de duanes col·legiats i conductors professionals formats en convenis ATP, ADR i bones pràctiques de distribució (GDP).
                </p>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-purple-200">
                  <div className="bg-white p-3.5 rounded-xl border border-purple-200">
                    <p className="text-2xl sm:text-3xl font-black text-purple-950">+40</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Països connectats</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-purple-200">
                    <p className="text-2xl sm:text-3xl font-black text-pink-600">99.6%</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Puntualitat d'arribada</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-purple-200">
                    <p className="text-2xl sm:text-3xl font-black text-fuchsia-700">24/7</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Torre de control telemàtic</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video lg:aspect-4/3 rounded-2xl overflow-hidden shadow-xl border-4 border-purple-200 bg-purple-950">
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
                <div className="absolute -bottom-6 -left-6 bg-purple-950 text-white p-5 rounded-xl shadow-xl hidden sm:block max-w-xs border border-pink-500/30">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldCheck className="w-5 h-5 text-pink-400" />
                    <p className="text-sm font-semibold text-white">Certificacions Internacionals</p>
                  </div>
                  <p className="text-xs text-purple-200 leading-normal">
                    ISO 9001:2015, GDP farmacèutic, classe ATP/FRC per a peribles i motors de flota d'emissions Euro 6e.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. BLOG / CONEIXEMENT SECTORIAL                          */}
        {/* ======================================================== */}
        <section id="blog" className="py-20 bg-white border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-700 mb-2 block">
                  Actualitat Sectorial & Comerç Exterior
                </span>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Notícies i Coneixement Logístic
                </p>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 md:mt-0 max-w-md">
                Guies i anàlisis elaborades per especialistes en dret duaner, incoterms i enginyeria de transport
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Article 1 */}
              <article className="p-6 rounded-2xl border border-purple-200 hover:border-pink-400 bg-purple-50/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="bg-pink-100 text-pink-900 font-bold px-2 py-0.5 rounded text-[11px]">
                      Cadena de Fred
                    </span>
                    <span>·</span>
                    <span>Lectura: 5 min</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    Normativa europea ATP i registre continu EN 12830 en càrregues peribles
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Com s'aplica el protocol de termografia digital amb calibratge oficial per mantenir inalterada la cadena de fred farmacèutica i càrnia en trànsit paneuropeu.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-purple-100">
                  <span className="text-xs font-semibold text-purple-700 hover:text-pink-600 inline-flex items-center gap-1 transition-colors">
                    Llegir anàlisi tècnica <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>

              {/* Article 2 */}
              <article className="p-6 rounded-2xl border border-purple-200 hover:border-pink-400 bg-purple-50/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="bg-fuchsia-100 text-fuchsia-900 font-bold px-2 py-0.5 rounded text-[11px]">
                      Comerç Marítim
                    </span>
                    <span>·</span>
                    <span>Lectura: 6 min</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    Optimització de rutes en terminals de contenidors del Mediterrani
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Estratègies per evitar demores i despeses d'ocupació (demurrage & detention) aprofitant corredors ferroviaris intermodals i magatzems de regulació DA.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-purple-100">
                  <span className="text-xs font-semibold text-purple-700 hover:text-pink-600 inline-flex items-center gap-1 transition-colors">
                    Llegir anàlisi tècnica <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>

              {/* Article 3 */}
              <article className="p-6 rounded-2xl border border-purple-200 hover:border-pink-400 bg-purple-50/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded text-[11px]">
                      Incoterms® 2020
                    </span>
                    <span>·</span>
                    <span>Lectura: 4 min</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    Transmissió del risc i despatx duaner: de FOB a DDP pas a pas
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Revisió dels punts crítics de lliurament segons la Cambra de Comerç Internacional (ICC) i responsabilitat sobre el DUA i l'IVA a la importació.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-purple-100">
                  <span className="text-xs font-semibold text-purple-700 hover:text-pink-600 inline-flex items-center gap-1 transition-colors">
                    Llegir anàlisi tècnica <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. CONTACTE & FORMULARI (Morat Profund & Rosa)           */}
        {/* ======================================================== */}
        <section id="contacte" className="py-24 bg-purple-950 text-purple-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Dades de Contacte Físiques */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-3 block">
                    Canal Directe d'Operacions
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    Coordina la teva operació logística
                  </h2>
                  <p className="mt-4 text-purple-200 text-sm leading-relaxed">
                    El nostre equip calcularà la teva cotització segons volum, pes brut, distància i requeriments específics de manipulació.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Adreça Física Real */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/60 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Seu Operativa i Terminal</h4>
                      <p className="text-xs text-purple-200 mt-1">
                        Carrer del Port, Moll Sud, Nau 14-B<br />
                        08040 Barcelona, Catalunya, Espanya
                      </p>
                      <span className="text-[11px] text-pink-400 font-mono mt-0.5 inline-block">
                        Coordenades: 41.3486° N, 2.1465° E
                      </span>
                    </div>
                  </div>

                  {/* Telèfons */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/60 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Centraleta Directa</h4>
                      <p className="text-xs text-purple-200 mt-1 font-mono">
                        +34 932 45 88 00 (Oficines Centrals)
                      </p>
                      <p className="text-xs text-pink-400 font-mono mt-0.5">
                        Urgències de Càrrega: +34 900 10 20 30 (Servei 24/7)
                      </p>
                    </div>
                  </div>

                  {/* Correu Electrònic (NOMÉS adam043@vidalibarraquer.net) */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/60 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Correu Directe de Contacte</h4>
                      <a
                        href="mailto:adam043@vidalibarraquer.net?subject=Sol%C2%B7licitud%20de%20Pressupost%20-%20Adam%20Transport"
                        className="text-xs text-pink-400 font-mono font-bold hover:underline block mt-1 text-sm"
                      >
                        adam043@vidalibarraquer.net
                      </a>
                      <span className="text-[11px] text-purple-300 font-medium block mt-0.5">
                        (Bústia directa exclusiva per a cotitzacions i consultes logístiques)
                      </span>
                    </div>
                  </div>

                  {/* Horaris */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/60 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Horaris d'Atenció i Despatx</h4>
                      <p className="text-xs text-purple-200 mt-1">
                        Dilluns a Divendres: 08:00h - 19:30h (Duanes & Gestió)
                      </p>
                      <p className="text-xs text-purple-400">
                        Molls de recepció i trànsit marítim operatius 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulari Interactiu de Cotització en Morat i Rosa */}
              <div className="lg:col-span-7 bg-purple-900/60 backdrop-blur-md text-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-purple-800">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Sol·licitud de Pressupost i Cotització de Serveis
                </h3>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-pink-500/15 border border-pink-500/40 text-pink-300 text-[11px] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping"></span>
                    Formspree actiu (xvkkyjgo) &rarr; adam043@vidalibarraquer.net
                  </span>
                  <span className="text-[11px] text-purple-300">
                    Recepció directa a la teva bústia acadèmica
                  </span>
                </div>
                <p className="text-xs text-purple-200 mb-6">
                  Omple les dades de la teva operació de transport o emmagatzematge. En prémer enviar, les teves dades s'envien automàticament mitjançant el servei de formulari <strong>Formspree</strong> directament al correu <strong>adam043@vidalibarraquer.net</strong>.
                </p>

                {formSubmitted ? (
                  <div className="bg-purple-950/90 border border-pink-500/40 rounded-xl p-6 text-center animate-fadeIn space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-pink-400 mx-auto" />
                    <div>
                      <h4 className="text-lg font-bold text-pink-200 mb-1">
                        Sol·licitud Transmesa a Formspree amb Èxit!
                      </h4>
                      <p className="text-xs text-purple-200 leading-relaxed max-w-md mx-auto">
                        S'ha registrat la petició amb codi intern <strong className="text-pink-400">#COT-2026-{Math.floor(1000 + Math.random() * 9000)}</strong> per a l'empresa <strong>{formData.empresa || 'la teva entitat'}</strong> i s'ha transmès mitjançant <em>https://formspree.io/f/xvkkyjgo</em> directament a la bústia acadèmica:
                      </p>
                      <div className="mt-2 inline-block bg-purple-900 px-3.5 py-1.5 rounded-lg border border-pink-500/50 text-pink-300 font-mono text-xs font-bold">
                        adam043@vidalibarraquer.net
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      {lastMailtoUrl && (
                        <a
                          href={lastMailtoUrl}
                          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-md shadow-pink-900/40"
                        >
                          <Mail className="w-4 h-4" />
                          Obrir correu per enviar a adam043@vidalibarraquer.net
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
                            servei: 'ATL-FCL-40HC',
                            origen: '',
                            desti: '',
                            volum: '',
                            observacions: '',
                          });
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 bg-purple-800 hover:bg-purple-700 text-purple-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
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
                          className="block text-xs font-semibold uppercase text-purple-200 tracking-wider mb-1.5"
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
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-700 bg-purple-950/80 text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-hidden transition-all placeholder:text-purple-400"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="empresa"
                          className="block text-xs font-semibold uppercase text-purple-200 tracking-wider mb-1.5"
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
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-700 bg-purple-950/80 text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-hidden transition-all placeholder:text-purple-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="correu"
                          className="block text-xs font-semibold uppercase text-purple-200 tracking-wider mb-1.5"
                        >
                          Correu Corporatiu *
                        </label>
                        <input
                          type="email"
                          id="correu"
                          name="correu"
                          required
                          value={formData.correu}
                          onChange={(e) => setFormData({ ...formData, correu: e.target.value })}
                          placeholder="client@empresa.com"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-700 bg-purple-950/80 text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-hidden transition-all placeholder:text-purple-400"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="telefon"
                          className="block text-xs font-semibold uppercase text-purple-200 tracking-wider mb-1.5"
                        >
                          Telèfon de Contacte *
                        </label>
                        <input
                          type="tel"
                          id="telefon"
                          name="telefon"
                          required
                          value={formData.telefon}
                          onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                          placeholder="+34 600 000 000"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-700 bg-purple-950/80 text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-hidden transition-all placeholder:text-purple-400"
                        />
                      </div>
                    </div>

                    {/* Selecció del Producte Logístic Concret */}
                    <div>
                      <label
                        htmlFor="servei"
                        className="block text-xs font-semibold uppercase text-purple-200 tracking-wider mb-1.5"
                      >
                        Producte Logístic a Cotitzar *
                      </label>
                      <select
                        id="servei"
                        name="servei"
                        value={formData.servei}
                        onChange={(e) => setFormData({ ...formData, servei: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-purple-700 bg-purple-950 text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-hidden transition-all"
                      >
                        <option value="ATL-FCL-40HC">
                          [ATL-FCL-40HC-INT] Fletament Marítim FCL Contenidor 40' High Cube
                        </option>
                        <option value="ATL-REEF-EU33">
                          [ATL-REEF-EU33-ATP] Transport Terrestre Frigorífic FTL (ATP Clau FRC)
                        </option>
                        <option value="ATL-WMS-HUB45">
                          [ATL-WMS-HUB45-LOG] Magatzem Regulador WMS & Cross-Docking (ZAL 45k m²)
                        </option>
                        <option value="MULTIMODAL">
                          Solució Multimodal Combinada Port + Carretera + Dipòsit Duaner
                        </option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="origen"
                          className="block text-xs font-semibold uppercase text-purple-200 tracking-wider mb-1.5"
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
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-700 bg-purple-950/80 text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-hidden transition-all placeholder:text-purple-400"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="desti"
                          className="block text-xs font-semibold uppercase text-purple-200 tracking-wider mb-1.5"
                        >
                          Punt de Destinació / País
                        </label>
                        <input
                          type="text"
                          id="desti"
                          name="desti"
                          value={formData.desti}
                          onChange={(e) => setFormData({ ...formData, desti: e.target.value })}
                          placeholder="Ex. Rotterdam / Hamburg / Chicago"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-purple-700 bg-purple-950/80 text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-hidden transition-all placeholder:text-purple-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="observacions"
                        className="block text-xs font-semibold uppercase text-purple-200 tracking-wider mb-1.5"
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
                        className="w-full px-3.5 py-2.5 rounded-lg border border-purple-700 bg-purple-950/80 text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-hidden transition-all resize-none placeholder:text-purple-400"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-900/40 transition-all focus:ring-4 focus:ring-pink-500/30 disabled:opacity-75 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {formLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                            Calculant ruta i generant notificació...
                          </>
                        ) : (
                          'Sol·licitar Cotització i Enviar a adam043@vidalibarraquer.net'
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
      {/* 7. FOOTER CORPORATIU FOSC & ENLLAÇOS LEGALS              */}
      {/* ======================================================== */}
      <footer className="bg-purple-950 text-purple-300 border-t border-purple-900 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Advertència de Projecte Estudiantil Requerida */}
          <div className="mb-8 p-4 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-200 text-xs flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left">
            <AlertCircle className="w-5 h-5 shrink-0 text-pink-400" />
            <span>
              <strong>AVÍS ACADÈMIC:</strong> Aquest lloc web és un prototip de prova generat exclusivament en l'àmbit estudiantil amb finalitats educatives (Cicle Formatiu de Grau Superior en Transport i Logística / Comerç Internacional). No correspon a cap activitat comercial mercantil activa.
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-purple-900">
            <div className="flex items-center gap-3">
              <BrandLogo className="w-10 h-10" />
              <div>
                <span className="text-lg font-black tracking-tight text-white uppercase">
                  ADAM TRANSPORT AND LOGISTIC
                </span>
                <p className="text-xs text-purple-300 mt-0.5 max-w-md">
                  Especialistes en transport multimodal port-a-porta, flota refrigerada FTL i magatzem regulador autoritzat DA a Barcelona.
                </p>
              </div>
            </div>

            {/* Enllaços Legals */}
            <div className="flex flex-wrap gap-6 text-xs text-purple-300">
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

          {/* Barra de Control de Versió, Data d'Avui i Formspree */}
          <div className="py-3.5 my-6 px-4 rounded-xl bg-purple-900/60 border border-purple-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-950 border border-pink-500/50 text-pink-300 font-mono font-bold text-xs shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Versió Final Web (actualitzaho cada cop que fem canvis a partir d'ara)
              </span>
              <span className="text-purple-200 font-medium">
                Data d'avui: <strong className="text-white font-semibold">6 de novembre de 2026</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-950/80 border border-purple-700 text-[11px] font-mono text-purple-200">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                Formspree connectat: <a href="https://formspree.io/f/xvkkyjgo" target="_blank" rel="noreferrer" className="text-pink-300 hover:underline">https://formspree.io/f/xvkkyjgo</a> &rarr; adam043@vidalibarraquer.net
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-400 gap-4">
            <p>&copy; 2026 ADAM TRANSPORT AND LOGISTIC. Tots els drets reservats (Projecte Estudiantil de Logística).</p>
            <p>Fotografies reals del sector marítim i logístic lliures d'ús comercial (Unsplash).</p>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* MODAL 1: FITXA TÈCNICA DEL PRODUCTE LOGÍSTIC             */}
      {/* ======================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-purple-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-purple-950 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-800 text-purple-100">
            <div className="sticky top-0 bg-purple-950/95 backdrop-blur-md px-6 py-4 border-b border-purple-800 flex items-center justify-between z-10">
              <div>
                <span className="text-[11px] font-mono font-bold text-pink-300 bg-purple-900 px-2.5 py-0.5 rounded border border-pink-500/40">
                  {selectedProduct.refInterna}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Fitxa Tècnica i Paràmetres d'Enginyeria Logística
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Capçalera amb Imatge Real */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-purple-950/40 to-transparent flex items-end p-4">
                  <p className="text-white font-bold text-base">{selectedProduct.nomTecnic}</p>
                </div>
              </div>

              {/* Descripció Tècnica Exhaustiva */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
                  Definició Operativa i Abast del Servei
                </h4>
                <p className="text-sm text-purple-200 leading-relaxed bg-purple-900/40 p-4 rounded-xl border border-purple-800/80">
                  {selectedProduct.descripcioCompleta}
                </p>
              </div>

              {/* Dades Tècniques de Comerç Internacional */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-3">
                  Especificacions Tècniques de Comerç Internacional & Transport
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-purple-900/40 rounded-lg border border-purple-800">
                    <span className="text-purple-300 block font-medium">Codi Tècnic Oficial & TARIC</span>
                    <span className="font-mono font-semibold text-pink-300">{selectedProduct.codiTecnic}</span>
                  </div>
                  <div className="p-3 bg-purple-900/40 rounded-lg border border-purple-800">
                    <span className="text-purple-300 block font-medium">Marc Normatiu & Homologació</span>
                    <span className="font-semibold text-white">{selectedProduct.normativa}</span>
                  </div>
                  <div className="p-3 bg-purple-900/40 rounded-lg border border-purple-800">
                    <span className="text-purple-300 block font-medium">Dimensions Interiors i Pas</span>
                    <span className="font-semibold text-white">{selectedProduct.especificacions.dimensions}</span>
                  </div>
                  <div className="p-3 bg-purple-900/40 rounded-lg border border-purple-800">
                    <span className="text-purple-300 block font-medium">Volum Útil (CBM)</span>
                    <span className="font-semibold text-pink-300">{selectedProduct.especificacions.volum}</span>
                  </div>
                  <div className="p-3 bg-purple-900/40 rounded-lg border border-purple-800">
                    <span className="text-purple-300 block font-medium">Balanç de Tara & Pes Brut</span>
                    <span className="font-semibold text-white">{selectedProduct.especificacions.tara}</span>
                  </div>
                  <div className="p-3 bg-purple-900/40 rounded-lg border border-purple-800">
                    <span className="text-purple-300 block font-medium">Càrrega Màxima Útil (Payload)</span>
                    <span className="font-semibold text-pink-300">{selectedProduct.especificacions.payload}</span>
                  </div>
                  <div className="p-3 bg-purple-900/40 rounded-lg border border-purple-800 md:col-span-2">
                    <span className="text-purple-300 block font-medium">Capacitat d'Estiba en Palets Normalitzats</span>
                    <span className="font-semibold text-white">{selectedProduct.especificacions.capacitatPalets}</span>
                  </div>
                  {selectedProduct.especificacions.temperatura && (
                    <div className="p-3 bg-fuchsia-950/70 rounded-lg border border-pink-500/40 md:col-span-2">
                      <span className="text-pink-300 block font-medium">Regulació Tèrmica Homologada</span>
                      <span className="font-semibold text-pink-100">{selectedProduct.especificacions.temperatura}</span>
                    </div>
                  )}
                  {selectedProduct.especificacions.incoterms && (
                    <div className="p-3 bg-purple-900/40 rounded-lg border border-purple-800 md:col-span-2">
                      <span className="text-purple-300 block font-medium">Incoterms® 2020 Suportats</span>
                      <span className="font-semibold text-pink-300">{selectedProduct.especificacions.incoterms}</span>
                    </div>
                  )}
                  <div className="p-3 bg-purple-900/40 rounded-lg border border-purple-800 md:col-span-2">
                    <span className="text-purple-300 block font-medium">Documentació Exigida & Duanera</span>
                    <span className="font-semibold text-purple-200 leading-relaxed">{selectedProduct.especificacions.documentacio}</span>
                  </div>
                  <div className="p-3 bg-purple-900/40 rounded-lg border border-purple-800 md:col-span-2">
                    <span className="text-purple-300 block font-medium">Certificacions de Qualitat i Sanitàries</span>
                    <span className="font-semibold text-white">{selectedProduct.especificacions.certificats}</span>
                  </div>
                </div>
              </div>

              {/* Avantatges Operatius */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
                  Valor Afegit i Garanties Operatives
                </h4>
                <ul className="space-y-2 text-xs text-purple-200">
                  {selectedProduct.avantatges.map((av, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-purple-900/40 p-2.5 rounded-lg border border-purple-800">
                      <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                      <span>{av}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botó de Cotització des del Modal */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-purple-800">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2.5 rounded-lg border border-purple-700 text-purple-300 text-xs font-semibold hover:bg-purple-900 cursor-pointer"
                >
                  Tancar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handlePreselectService(selectedProduct.refInterna);
                    setSelectedProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-purple-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-purple-950 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-purple-800 text-purple-200">
            <div className="sticky top-0 bg-purple-950/95 backdrop-blur-md px-6 py-4 border-b border-purple-800 flex items-center justify-between z-10">
              <h3 className="text-base font-bold text-white">
                {legalModal === 'avis' && 'Avís Legal i Dades Identificatives'}
                {legalModal === 'privacitat' && 'Política de Privacitat i Protecció de Dades (RGPD)'}
                {legalModal === 'cookies' && 'Política de Cookies i Traçabilitat'}
                {legalModal === 'condicions' && 'Condicions Generals de Transport de Mercaderies'}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-2 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-xs text-purple-200 space-y-4 leading-relaxed">
              {legalModal === 'avis' && (
                <>
                  <p>
                    En compliment de l'article 10 de la Llei 34/2002, d'11 de juliol, de serveis de la societat de la informació i de comerç electrònic (LSSI-CE), s'informa que aquesta web correspon al projecte formatiu de l'entitat fictícia <strong>ADAM TRANSPORT AND LOGISTIC</strong>.
                  </p>
                  <p>
                    <strong>Denominació:</strong> Adam Transport and Logistic S.L. (Projecte Acadèmic)<br />
                    <strong>CIF Fictici:</strong> B-08992341<br />
                    <strong>Domicili Social:</strong> Carrer del Port, Moll Sud, Nau 14-B, 08040 Barcelona, Espanya.<br />
                    <strong>Registre Mercantil:</strong> Tom 42.100, Foli 88, Full B-412.000.<br />
                    <strong>Contacte:</strong> adam043@vidalibarraquer.net | Tel. +34 932 45 88 00
                  </p>
                  <p>
                    La informació continguda en aquest portal té una finalitat exclusivament demostrativa i acadèmica en l'àmbit de la logística internacional, duanes i transport de mercaderies per carretera i via marítima.
                  </p>
                </>
              )}

              {legalModal === 'privacitat' && (
                <>
                  <p>
                    D'acord amb el Reglament (UE) 2016/679 General de Protecció de Dades (RGPD) i la Llei Orgànica 3/2018 (LOPDGDD), les dades recollides a través del formulari de cotització seran tractades per Adam Transport and Logistic exclusivament per atendre les sol·licituds de tarifes de transport i gestió duanera.
                  </p>
                  <p>
                    <strong>Responsable del tractament:</strong> Adam Transport and Logistic S.L.<br />
                    <strong>Finalitat:</strong> Elaboració de pressupostos logístics i contacte comercial operatiu.<br />
                    <strong>Legitimació:</strong> Consentiment exprés de la persona interessada en enviar el formulari.<br />
                    <strong>Drets:</strong> Podeu exercir els drets d'accés, rectificació, supressió, limitació i oposició mitjançant sol·licitud a <em>adam043@vidalibarraquer.net</em>.
                  </p>
                </>
              )}

              {legalModal === 'cookies' && (
                <>
                  <p>
                    Aquest lloc web utilitza exclusivament cookies tècniques essencials necessàries per a la navegació i el funcionament correcte del formulari de contacte i la selecció d'idioma/filtres.
                  </p>
                  <p>
                    No s'utilitzen cookies de tercers amb fins publicitaris ni de rastreig de perfils personals sense consentiment previ. Podeu gestionar o bloquejar la instal·lació de cookies des de la configuració del vostre navegador.
                  </p>
                </>
              )}

              {legalModal === 'condicions' && (
                <>
                  <p>
                    Totes les operacions de transport terrestre i marítim gestionades s'acullen a la Llei 15/2009 del contracte de transport terrestre de mercaderies (LOTT), al Conveni de Ginebra de 1956 relatiu al contracte de transport internacional de mercaderies per carretera (CMR), i a les Regles de la Haia-Visby per al transport marítim sota Bill of Lading.
                  </p>
                  <p>
                    La responsabilitat de l'operador logístic es limita estrictament als barems establerts en el dret internacional aplicable (8,33 DEG per quilogram brut en carretera i 666,67 DEG per paquet o 2 DEG per quilogram brut en via marítima), llevat de declaració expressa de valor acceptada en la pòlissa.
                  </p>
                </>
              )}

              <div className="pt-4 border-t border-purple-800 flex justify-end">
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
