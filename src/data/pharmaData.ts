export interface ColdRangeSpec {
  id: 'criogenico' | 'ultracongelado' | 'congelado' | 'refrigerado' | 'ambiente';
  nombre: string;
  rango: string;
  rangoCorto: string;
  tolerancia: string;
  embalaje: string;
  autonomia: string;
  monitoreo: string;
  protocolo: string;
  medicamentos: string[];
  colorAccent: string;
  targetMin: number;
  targetMax: number;
}

export interface FleetItem {
  id: string;
  categoria: 'pesado' | 'clinico';
  modelo: string;
  subtitulo: string;
  capacidad: string;
  autonomia: string;
  rangoTermico: string;
  certificacion: string;
  especificaciones: { etiqueta: string; valor: string }[];
  imagen: string;
}

export interface TelemetryPoint {
  hora: string;
  temp: number;
  fase: string;
}

export interface RoadShipment {
  codigo: string;
  unidad: string;
  vehiculo: string;
  origen: string;
  destino: string;
  producto: string;
  loteClinico: string;
  rangoObjetivo: string;
  targetMin: number;
  targetMax: number;
  equipoFrio: string;
  estado: 'En ruta' | 'Última Milla Hospital' | 'Entregado' | 'En cámara GDP';
  progreso: number;
  eta: string;
  sensores: {
    tempActual: string;
    vibracionG: string;
    aperturaPuerta: string;
    combustibleReserva: string;
    humedad: string;
  };
  hitos: { hora: string; titulo: string; detalle: string; completado: boolean }[];
  curvaTermica: TelemetryPoint[];
}

export interface SpainRoadHub {
  codigo: string;
  ciudad: string;
  plataforma: string;
  comunidad: string;
  corredor: string;
  tiempoDesdeBase: string;
  hospitalesClave: string[];
  capacidades: string;
  cargaPrincipal: string;
  svgX: number;
  svgY: number;
  optionLabel: string;
}

export const HERO_TELEMETRY_TRUCKS = [
  {
    id: 'MDC-104',
    unidad: 'Unidad MDC-104 · Tráiler Bi-Zona ATP FRC',
    ruta: 'Barcelona (ZAL) → Madrid (Autovía A-2)',
    origenCode: 'BCN',
    destinoCode: 'MAD',
    carga: 'Anticuerpos Monoclonales mAb',
    lote: 'Lote #AEMPS-4402',
    temp: 4.3,
    velocidad: '86 km/h',
    humedad: '41.2 %',
    sello: 'Precintado · 0 aperturas',
  },
  {
    id: 'MDC-218',
    unidad: 'Unidad MDC-218 · Camión Rígido 18 t FRC',
    ruta: 'Madrid → Sevilla (Autovía A-4)',
    origenCode: 'MAD',
    destinoCode: 'SVQ',
    carga: 'Vacunas Biológicas ARNm',
    lote: 'Lote #VAC-8810',
    temp: -71.8,
    velocidad: '88 km/h',
    humedad: '28.5 %',
    sello: 'Precintado · 0 aperturas',
  },
  {
    id: 'MDC-305',
    unidad: 'Unidad MDC-305 · Furgón Clínico Isotermo',
    ruta: 'Barcelona → Palma (Ro-Ro 380V Conectado)',
    origenCode: 'BCN',
    destinoCode: 'PMI',
    carga: 'Terapia Génica CAR-T · Cryoport',
    lote: 'Lote #CART-019',
    temp: -191.4,
    velocidad: 'Enlace 380V',
    humedad: '14.0 %',
    sello: 'Custodia QP · AEMPS',
  },
];

export const SPAIN_HUBS: SpainRoadHub[] = [
  {
    codigo: 'BCN',
    ciudad: 'Barcelona',
    plataforma: 'Centro Farmacéutico ZAL Port (Sede Central)',
    comunidad: 'Cataluña',
    corredor: 'Eje Mediterráneo AP-7 & Autovía A-2',
    tiempoDesdeBase: 'Base Principal · Salida inmediata < 30 min',
    hospitalesClave: ['Hospital Clínic de Barcelona', 'Hospital Vall d’Hebron', 'Hospital de Sant Pau'],
    capacidades: '8 muelles herméticos climatizados (+2/+8 °C, -25 °C) y depósito criogénico LN2',
    cargaPrincipal: 'Terapias CAR-T, ensayos clínicos y biotecnología',
    svgX: 432,
    svgY: 132,
    optionLabel: 'BCN · Barcelona (ZAL Pharma)',
  },
  {
    codigo: 'MAD',
    ciudad: 'Madrid',
    plataforma: 'Hub Terrestre Central Madrid (A-2 / M-50)',
    comunidad: 'Comunidad de Madrid',
    corredor: 'Autovías A-2, A-4, A-6 y A-1',
    tiempoDesdeBase: '6 h 15 min en tráiler directo desde Barcelona',
    hospitalesClave: ['Hospital Universitario La Paz', 'Hospital 12 de Octubre', 'Hospital Ramón y Cajal'],
    capacidades: 'Cámara GDP multi-temperatura con carga eléctrica nocturna para toda la flota',
    cargaPrincipal: 'Vacunas, hemoderivados y oncología hospitalaria',
    svgX: 256,
    svgY: 168,
    optionLabel: 'MAD · Madrid (Hub Central)',
  },
  {
    codigo: 'VLC',
    ciudad: 'Valencia',
    plataforma: 'Base Logística Sanitaria Ribarroja (A-3 / AP-7)',
    comunidad: 'Comunidad Valenciana',
    corredor: 'Autopista AP-7 & Autovía A-3',
    tiempoDesdeBase: '3 h 30 min desde BCN / 3 h 45 min desde MAD',
    hospitalesClave: ['Hospital Universitari i Politècnic La Fe', 'Hospital Clínico de Valencia'],
    capacidades: 'Transferencia rápida muelle a hospital en menos de 15 minutos',
    cargaPrincipal: 'Insulinas, reactivos IVD y sueros hospitalarios',
    svgX: 356,
    svgY: 208,
    optionLabel: 'VLC · Valencia (Ribarroja)',
  },
  {
    codigo: 'SVQ',
    ciudad: 'Sevilla',
    plataforma: 'Plataforma Frigorífica Sur (Autovía A-4)',
    comunidad: 'Andalucía',
    corredor: 'Autovía A-4 Madrid – Andalucía',
    tiempoDesdeBase: '5 h 30 min en ruta directa nocturna desde Madrid',
    hospitalesClave: ['Hospital Universitario Virgen del Rocío', 'Hospital Virgen Macarena'],
    capacidades: 'Equipos de frío reforzados para olas de calor estival (+45 °C exterior)',
    cargaPrincipal: 'Anticuerpos monoclonales y plasma sanguíneo',
    svgX: 178,
    svgY: 288,
    optionLabel: 'SVQ · Sevilla (Plataforma Sur)',
  },
  {
    codigo: 'BIO',
    ciudad: 'Bilbao',
    plataforma: 'Centro Clínico Corredor Norte (AP-68)',
    comunidad: 'País Vasco',
    corredor: 'Autopista AP-68 & Autovía A-1',
    tiempoDesdeBase: '4 h 15 min desde MAD / 5 h 45 min desde BCN',
    hospitalesClave: ['Hospital Universitario Cruces', 'Hospital Universitario Basurto'],
    capacidades: 'Cobertura capilar para hospitales de País Vasco, Navarra, La Rioja y Cantabria',
    cargaPrincipal: 'Biológicos refrigerados y diagnóstico clínico',
    svgX: 282,
    svgY: 66,
    optionLabel: 'BIO · Bilbao (Corredor Norte)',
  },
  {
    codigo: 'SCQ',
    ciudad: 'A Coruña / Santiago',
    plataforma: 'Base Atlántica Galicia (A-6 / AP-9)',
    comunidad: 'Galicia',
    corredor: 'Autovía del Noroeste A-6 & AP-9',
    tiempoDesdeBase: '6 h 20 min desde Madrid en doble conductor',
    hospitalesClave: ['CHUS Santiago', 'CHUAC A Coruña', 'Hospital Álvaro Cunqueiro (Vigo)'],
    capacidades: 'Distribución capilar diaria en furgones isotermos para las cuatro provincias',
    cargaPrincipal: 'Vacunas del calendario gallego y fármacos hospitalarios',
    svgX: 112,
    svgY: 74,
    optionLabel: 'SCQ · Santiago / A Coruña (Galicia)',
  },
  {
    codigo: 'ZAZ',
    ciudad: 'Zaragoza',
    plataforma: 'Nodo Intermedio PLAZA (Km 318 A-2)',
    comunidad: 'Aragón',
    corredor: 'Eje A-2 Barcelona–Madrid & AP-68',
    tiempoDesdeBase: '3 h 05 min desde BCN / 3 h 15 min desde MAD',
    hospitalesClave: ['Hospital Universitario Miguel Servet', 'Hospital Clínico Lozano Blesa'],
    capacidades: 'Punto de relevo de conductores, recarga eléctrica 400V y backup térmico',
    cargaPrincipal: 'Lotes hospitalarios y consolidado interregional',
    svgX: 344,
    svgY: 118,
    optionLabel: 'ZAZ · Zaragoza (PLAZA A-2)',
  },
  {
    codigo: 'PMI',
    ciudad: 'Palma de Mallorca',
    plataforma: 'Base Balear (Enlace Camión Ro-Ro 380V)',
    comunidad: 'Islas Baleares',
    corredor: 'Puerto Barcelona / Valencia ↔ Palma (Camión Conectado)',
    tiempoDesdeBase: 'Travesía nocturna en camión frigorífico enchufado 380V',
    hospitalesClave: ['Hospital Universitari Son Espases', 'Hospital Son Llàtzer'],
    capacidades: 'El tráiler viaja conectado a la red eléctrica del buque con telemetría 4G continua',
    cargaPrincipal: 'Terapia celular, oncología y suministros hospitalarios',
    svgX: 462,
    svgY: 198,
    optionLabel: 'PMI · Palma de Mallorca (Ro-Ro 380V)',
  },
];

export const COLD_RANGES: ColdRangeSpec[] = [
  {
    id: 'criogenico',
    nombre: 'Criogénico (LN2 Vapor Seco)',
    rango: '-196 °C a -150 °C',
    rangoCorto: '-196 / -150 °C',
    tolerancia: '± 0.0 °C sobre umbral -150 °C (MKT crítico)',
    embalaje: 'Tanques secos Cryoport / Dry Shipper en anclaje antivibración dentro de furgón climatizado',
    autonomia: 'Hasta 336 horas (14 días) autónomos en carretera',
    monitoreo: 'Sonda PT100 criogénica inmersa + geolocalización 5G continua en España',
    protocolo: 'Entrega directa en mano en sala blanca o unidad de terapia celular del hospital.',
    medicamentos: [
      'Terapias génicas y celulares CAR-T autólogas',
      'Células madre hematopoyéticas (CPH)',
      'Líneas celulares maestras y bancos virales',
      'Muestras reproductivas y biopsias oncológicas',
    ],
    colorAccent: '#0284C7',
    targetMin: -196,
    targetMax: -150,
  },
  {
    id: 'ultracongelado',
    nombre: 'Ultra-congelado (Deep Frozen)',
    rango: '-80 °C a -60 °C',
    rangoCorto: '-80 / -60 °C',
    tolerancia: '± 2.0 °C en punto de consigna (-70 °C nominal)',
    embalaje: 'Congeladores activos Stirling / VIP en furgón y embalaje hielo seco ADR controlado',
    autonomia: '120 horas validado en ruta con alimentación auxiliar del camión',
    monitoreo: 'Registrador dual calibrado con alarma instantánea al puesto de control',
    protocolo: 'Compresor eléctrico de respaldo en cabina y muelle térmico cerrado en destino.',
    medicamentos: [
      'Vacunas ARNm y plataformas de ácido nucleico',
      'Vectores virales adenoasociados (AAV)',
      'Enzimas terapéuticas altamente inestables',
      'Reactivos biológicos de secuenciación genómica',
    ],
    colorAccent: '#0284C7',
    targetMin: -80,
    targetMax: -60,
  },
  {
    id: 'congelado',
    nombre: 'Congelado Estándar',
    rango: '-25 °C a -15 °C',
    rangoCorto: '-25 / -15 °C',
    tolerancia: '± 1.5 °C durante todo el trayecto puerta a puerta en España',
    embalaje: 'Cajas isotermas reforzadas ATP Clase FRC con evaporador bi-zona de alta potencia',
    autonomia: 'Autonomía continua en ruta y toma eléctrica 400V en estacionamiento',
    monitoreo: '6 sondas distribuidas en caja + detector magnético de apertura de puertas',
    protocolo: 'Pre-enfriamiento obligatorio del camión a -22 °C antes de abrir muelle de laboratorio.',
    medicamentos: [
      'Plasma sanguíneo fresco congelado y crioprecipitados',
      'Reactivos de diagnóstico in vitro (IVD)',
      'Inmunoglobulinas y factores de coagulación',
      'Sueros hiperinmunes y péptidos bioactivos',
    ],
    colorAccent: '#0284C7',
    targetMin: -25,
    targetMax: -15,
  },
  {
    id: 'refrigerado',
    nombre: 'Refrigerado Clínico',
    rango: '+2 °C a +8 °C',
    rangoCorto: '+2 / +8 °C',
    tolerancia: 'Estabilidad estricta (+5.0 °C nominal · cero riesgo de congelación)',
    embalaje: 'Tráileres y furgones ATP Clase FRC con cortinas de aire y mamparo divisor bi-zona',
    autonomia: 'Control térmico continuo motor + modo eléctrico silencioso urbano',
    monitoreo: 'Telemetría cada 60 segundos conforme a UNE-EN 12830 y EU GDP',
    protocolo: 'Descarga directa en muelle de farmacia hospitalaria sin ruptura de precinto.',
    medicamentos: [
      'Insulinas humanas y análogos recombinantes',
      'Anticuerpos monoclonales (mAb) oncológicos e inmunológicos',
      'Vacunas del calendario nacional español',
      'Hormonas de crecimiento y eritropoyetina',
    ],
    colorAccent: '#008744',
    targetMin: 2,
    targetMax: 8,
  },
  {
    id: 'ambiente',
    nombre: 'Ambiente Controlado (CRT)',
    rango: '+15 °C a +25 °C',
    rangoCorto: '+15 / +25 °C',
    tolerancia: 'Aislamiento activo frente al verano e invierno peninsular (-10 °C / +45 °C)',
    embalaje: 'Carrocería isoterma climatizada con bomba de calor y refrigeración automática (+20 °C)',
    autonomia: 'Control térmico activo 24h incluso con el camión estacionado',
    monitoreo: 'Termógrafo homologado EN 12830 con descarga automática en PDF a la entrega',
    protocolo: 'Estacionamiento vigilado TAPA TSR-1 y trazabilidad continua de temperatura.',
    medicamentos: [
      'Fármacos sólidos de alto valor en blísters sensibles',
      'Kits de ensayos clínicos Fase I, II y III (AEMPS)',
      'Analgésicos parenterales y soluciones intravenosas',
      'Dispositivos médicos implantables con recubrimiento activo',
    ],
    colorAccent: '#0284C7',
    targetMin: 15,
    targetMax: 25,
  },
];

export const FLEET_ITEMS: FleetItem[] = [
  {
    id: 'trailer-bizona-frc',
    categoria: 'pesado',
    modelo: 'Tráiler Frigorífico Bi-Zona ATP Clase FRC',
    subtitulo: 'Transporte troncal entre centros farmacéuticos de la Península',
    capacidad: '33 Euro-palés · Doble compartimento independiente',
    autonomia: '1.200 km sin repostaje · Equipo autónomo dual',
    rangoTermico: '-25 °C y +2/+8 °C simultáneos en la misma caja',
    certificacion: 'ATP FRC · EU GDP · Seguridad TAPA TSR-1',
    especificaciones: [
      { etiqueta: 'Capacidad', valor: '33 Euro-palés' },
      { etiqueta: 'Sondas internas', valor: '8 puntos calibrados' },
      { etiqueta: 'Bloqueo remoto', valor: 'Cerradura electrónica' },
      { etiqueta: 'Mapeo térmico', valor: 'Verano / Invierno' },
    ],
    imagen: '/src/assets/images/hero_pharma_truck_spain_1795018963010.jpg',
  },
  {
    id: 'rigido-18t-gdp',
    categoria: 'pesado',
    modelo: 'Camión Rígido Farmacéutico 18 t',
    subtitulo: 'Distribución hospitalaria de media capacidad con trampilla retráctil',
    capacidad: '18 Euro-palés · Mamparo móvil regulable',
    autonomia: 'Rutas interregionales diarias España',
    rangoTermico: '-25 °C a +25 °C (Refrigerado / Congelado / CRT)',
    certificacion: 'AEMPS / EU GDP · UNE-EN 12830',
    especificaciones: [
      { etiqueta: 'Carga útil', valor: '9.400 kg' },
      { etiqueta: 'Plataforma', valor: 'Elevadora 2.000 kg' },
      { etiqueta: 'Toma nocturna', valor: '400 V / 32 A' },
      { etiqueta: 'Cortina de frío', valor: 'Láminas PVC sanitarias' },
    ],
    imagen: '/src/assets/images/fleet_heavy_reefer_truck_1795018963053.jpg',
  },
  {
    id: 'furgon-clinico-35t',
    categoria: 'clinico',
    modelo: 'Furgón Clínico Isotermo 3,5 t (Última Milla)',
    subtitulo: 'Acceso directo a farmacia hospitalaria y centros sanitarios urbanos',
    capacidad: '4 Euro-palés o 12 cajas clínicas homologadas',
    autonomia: 'Servicio urbano e interprovincial urgente',
    rangoTermico: '-80 °C (con módulo activo) / +2 a +25 °C',
    certificacion: 'Etiqueta Ambiental ECO/CERO · EU GDP',
    especificaciones: [
      { etiqueta: 'Entrega directa', valor: 'Puerta a Farmacia' },
      { etiqueta: 'Compresor', valor: 'Eléctrico silencioso' },
      { etiqueta: 'Tiempo espera', valor: 'Respaldo batería 12h' },
      { etiqueta: 'Sensores', valor: 'GPS + Apertura puerta' },
    ],
    imagen: '/src/assets/images/fleet_clinical_delivery_van_1795018963295.jpg',
  },
  {
    id: 'trailer-doble-piso',
    categoria: 'pesado',
    modelo: 'Tráiler Doble Piso Alta Capacidad Hospitalaria',
    subtitulo: 'Grandes volúmenes de sueroterapia, diálisis y campañas de vacunación',
    capacidad: '66 Euro-palés en doble altura validada',
    autonomia: 'Corredores BCN – MAD – SVQ – VLC',
    rangoTermico: '+2 °C a +8 °C / +15 °C a +25 °C',
    certificacion: 'ATP FRC · Certificación TAPA TSR-1',
    especificaciones: [
      { etiqueta: 'Capacidad', valor: '66 Euro-palés' },
      { etiqueta: 'Estabilidad', valor: 'Suspensión neumática' },
      { etiqueta: 'Homologación', valor: 'Mapeo térmico 3D' },
      { etiqueta: 'Conductores', valor: 'Doble tripulación QP' },
    ],
    imagen: '/src/assets/images/hero_pharma_truck_spain_1795018963010.jpg',
  },
  {
    id: 'modulo-criogenico-cabina',
    categoria: 'clinico',
    modelo: 'Furgón Criogénico Terapia Celular (-196 °C)',
    subtitulo: 'Unidad especializada para traslado hospital a hospital de células CAR-T',
    capacidad: 'Hasta 6 tanques Cryoport Dry Vapor en bancada antivibración',
    autonomia: '336 horas autónomas de vapor seco LN2',
    rangoTermico: '-196 °C a -150 °C (Cero nitrógeno líquido libre)',
    certificacion: 'AEMPS · EU Annex 11 · Custodia QP',
    especificaciones: [
      { etiqueta: 'Estabilizador', valor: 'Bancada neumática' },
      { etiqueta: 'Sonda interna', valor: 'PT100 Dual 5G' },
      { etiqueta: 'Entrega', valor: 'Sala blanca / Quirófano' },
      { etiqueta: 'Seguridad', valor: 'Precinto biométrico' },
    ],
    imagen: '/src/assets/images/fleet_clinical_delivery_van_1795018963295.jpg',
  },
  {
    id: 'unidad-ultrafrio-stirling',
    categoria: 'clinico',
    modelo: 'Camión Ligero con Ultracongelador Activo (-80 °C)',
    subtitulo: 'Transporte sin hielo seco mediante motores criogénicos Stirling embarcados',
    capacidad: '3.200 litros útiles ultra-congelados',
    autonomia: 'Ilimitada con alternador reforzado del vehículo',
    rangoTermico: '-86 °C a -40 °C regulable grado a grado',
    certificacion: 'UNE-EN 12830 · Validación ISTA 7D',
    especificaciones: [
      { etiqueta: 'Tecnología', valor: 'Motor Stirling Dual' },
      { etiqueta: 'Sin hielo seco', valor: 'Cero sublimación CO2' },
      { etiqueta: 'Precisión', valor: '± 0.8 °C nominal' },
      { etiqueta: 'Toma exterior', valor: '230 V Hospital' },
    ],
    imagen: '/src/assets/images/fleet_heavy_reefer_truck_1795018963053.jpg',
  },
];

export const SHIPMENT_DATABASE: Record<string, RoadShipment> = {
  'MDC-2026-0841': {
    codigo: 'MDC-2026-0841',
    unidad: 'Unidad MDC-104 · Tráiler Bi-Zona ATP FRC',
    vehiculo: 'Tractora Euro 6 + Semirremolque FRC (Matrícula 4820-MDC)',
    origen: 'Barcelona (ZAL Port · Centro Farmacéutico)',
    destino: 'Madrid (Hospital Universitario La Paz)',
    producto: 'Vacunas ARNm Pediátricas y Adultos',
    loteClinico: 'Lote #ES-2026-884A · AEMPS Validado',
    rangoObjetivo: '-80 °C a -60 °C (Ultra-congelado)',
    targetMin: -80,
    targetMax: -60,
    equipoFrio: 'Módulo Stirling Ultra-Frío + Redundancia VIP',
    estado: 'En ruta',
    progreso: 68,
    eta: '18/11/2026 · 14:40 CET',
    sensores: {
      tempActual: '-71.4 °C',
      vibracionG: '0.04 G (Suspensión estable)',
      aperturaPuerta: 'Precintado · 0 aperturas',
      combustibleReserva: '89 % (Autonomía 940 km)',
      humedad: '26.4 % HR',
    },
    hitos: [
      { hora: '08:15 CET', titulo: 'Carga en muelle climatizado Barcelona (ZAL)', detalle: 'Pre-enfriamiento verificado a -72.0 °C y sellado electrónico de caja.', completado: true },
      { hora: '10:05 CET', titulo: 'Paso por área segura Lleida (Autovía A-2)', detalle: 'Inspección automática de sondas y equipo eléctrico sin detenciones.', completado: true },
      { hora: '11:45 CET', titulo: 'Relevo de conductor en Zaragoza (PLAZA Km 318)', detalle: 'Cambio de tripulación en 12 min manteniendo precinto y curva térmica plana.', completado: true },
      { hora: '14:40 CET', titulo: 'Descarga directa en Farmacia Hospital La Paz (Madrid)', detalle: 'Muelle clínico reservado para recepción farmacéutica y firma QP.', completado: false },
    ],
    curvaTermica: [
      { hora: '08:15', temp: -72.1, fase: 'Muelle BCN' },
      { hora: '09:00', temp: -71.8, fase: 'A-2 Igualada' },
      { hora: '10:05', temp: -71.2, fase: 'Lleida' },
      { hora: '11:00', temp: -71.5, fase: 'Monegros' },
      { hora: '11:45', temp: -71.6, fase: 'Zaragoza' },
      { hora: '12:30', temp: -71.5, fase: 'Calatayud' },
      { hora: '13:15', temp: -71.4, fase: 'Guadalajara' },
      { hora: '13:45', temp: -71.4, fase: 'Actual A-2' },
    ],
  },
  'MDC-2026-0912': {
    codigo: 'MDC-2026-0912',
    unidad: 'Unidad MDC-218 · Camión Rígido 18 t FRC',
    vehiculo: 'Rígido Farmacéutico 18 t (Matrícula 9104-MDC)',
    origen: 'Madrid (Hub Farmacéutico Central)',
    destino: 'Sevilla (Hospital Univ. Virgen del Rocío)',
    producto: 'Anticuerpos Monoclonales mAb-Oncología',
    loteClinico: 'Lote #ONC-2026-119 · Cadena +2/+8 °C',
    rangoObjetivo: '+2 °C a +8 °C (Refrigerado Clínico)',
    targetMin: 2,
    targetMax: 8,
    equipoFrio: 'Equipo Carrier Supra Bi-Zona + 6 Sondas EN 12830',
    estado: 'Última Milla Hospital',
    progreso: 92,
    eta: '18/11/2026 · 15:15 CET',
    sensores: {
      tempActual: '+4.8 °C',
      vibracionG: '0.03 G (Estable)',
      aperturaPuerta: 'Precintado · 0 aperturas',
      combustibleReserva: '74 % (Autonomía 680 km)',
      humedad: '42.1 % HR',
    },
    hitos: [
      { hora: '08:40 CET', titulo: 'Despacho validado en Hub Central Madrid', detalle: 'Caja pre-acondicionada a +5.0 °C y comprobación de alarmas GSM.', completado: true },
      { hora: '11:10 CET', titulo: 'Tránsito Autovía A-4 (Despeñaperros)', detalle: 'Temperatura exterior 31 °C compensada con estabilidad interna de +4.7 °C.', completado: true },
      { hora: '13:45 CET', titulo: 'Paso por Córdoba rumbo Sevilla', detalle: 'Ruta libre de incidencias, batería de respaldo al 100 %.', completado: true },
      { hora: '14:55 CET', titulo: 'Acceso a recinto Hospital Virgen del Rocío', detalle: 'Aproximación al muelle de Farmacia Hospitalaria para entrega certificada.', completado: true },
    ],
    curvaTermica: [
      { hora: '08:40', temp: 4.9, fase: 'Hub MAD' },
      { hora: '09:40', temp: 5.0, fase: 'Madridejos' },
      { hora: '10:40', temp: 4.7, fase: 'Valdepeñas' },
      { hora: '11:40', temp: 4.6, fase: 'Bailén' },
      { hora: '12:40', temp: 4.8, fase: 'Córdoba' },
      { hora: '13:40', temp: 5.0, fase: 'Écija' },
      { hora: '14:30', temp: 4.9, fase: 'Sevilla SE-30' },
      { hora: '14:55', temp: 4.8, fase: 'Hospital' },
    ],
  },
  'MDC-2026-0735': {
    codigo: 'MDC-2026-0735',
    unidad: 'Unidad MDC-305 · Furgón Clínico + Ro-Ro 380V',
    vehiculo: 'Furgón Clínico Isotermo (Matrícula 3308-MDC)',
    origen: 'Barcelona (Laboratorio Terapia Celular)',
    destino: 'Palma de Mallorca (Hospital Son Espases)',
    producto: 'Terapia Génica CAR-T Autóloga (Paciente Único)',
    loteClinico: 'Lote #CART-BALEAR-07 · Protocolo Quirófano',
    rangoObjetivo: '-196 °C a -150 °C (Criogénico LN2)',
    targetMin: -196,
    targetMax: -150,
    equipoFrio: 'Cryoport Express Cryosphere en Bancada Neumática',
    estado: 'Entregado',
    progreso: 100,
    eta: 'Entregado · 18/11/2026 09:42 CET',
    sensores: {
      tempActual: '-191.2 °C',
      vibracionG: '0.01 G (Bancada neumática)',
      aperturaPuerta: 'Recepcionado en Sala Blanca',
      combustibleReserva: '96 % (Carga eléctrica plena)',
      humedad: '12.5 % HR',
    },
    hitos: [
      { hora: '21:15 CET', titulo: 'Recogida directa en laboratorio celular Barcelona', detalle: 'Anclaje de tanque Cryosphere y validación previa de sonda PT100.', completado: true },
      { hora: '22:45 CET', titulo: 'Embarque Ro-Ro nocturno conectado a 380V', detalle: 'Furgón conectado a red eléctrica del buque con reporte telemétrico satelital.', completado: true },
      { hora: '07:15 CET', titulo: 'Desembarque prioritario en Puerto de Palma', detalle: 'Salida directa hacia Vía de Cintura rumbo al Hospital Son Espases.', completado: true },
      { hora: '09:42 CET', titulo: 'Entrega certificada en Hematología Son Espases', detalle: 'Firma biométrica del farmacéutico receptor y envío de certificado EN 12830.', completado: true },
    ],
    curvaTermica: [
      { hora: '21:15', temp: -192.4, fase: 'Lab BCN' },
      { hora: '22:45', temp: -192.0, fase: 'Puerto BCN' },
      { hora: '01:00', temp: -191.8, fase: 'Ro-Ro 380V' },
      { hora: '04:00', temp: -191.6, fase: 'Travesía' },
      { hora: '07:15', temp: -191.5, fase: 'Puerto PMI' },
      { hora: '08:15', temp: -191.3, fase: 'Última Milla' },
      { hora: '09:00', temp: -191.1, fase: 'Recepción' },
      { hora: '09:42', temp: -191.2, fase: 'Entregado' },
    ],
  },
};

export const REGULATIONS = [
  {
    codigo: 'AEMPS (España)',
    titulo: 'Agencia Española de Medicamentos y Productos Sanitarios',
    alcance: 'Cumplimiento estricto de las guías sanitarias nacionales en transporte terrestre, trazabilidad por lote y recepción en farmacia hospitalaria.',
  },
  {
    codigo: 'EU GDP Carretera (2013/C 343/01)',
    titulo: 'Buenas Prácticas de Distribución Terrestre',
    alcance: 'Mapeo térmico anual verano/invierno en cada camión, cualificación IQ/OQ/PQ de rutas y control CAPA bajo Persona Cualificada (QP).',
  },
  {
    codigo: 'ATP Clase FRC & EN 12830',
    titulo: 'Vehículos Isotermos Reforzados y Termógrafos',
    alcance: 'Flota certificada ATP Clase FRC (-20 °C a +25 °C) equipada con registradores de temperatura calibrados anualmente según UNE-EN 12830.',
  },
  {
    codigo: 'TAPA TSR-1 & ISO 23412',
    titulo: 'Seguridad en Ruta y Cadena de Frío',
    alcance: 'Máxima seguridad antirrobo en carretera mediante geocercas, bloqueo remoto de puertas y paradas exclusivamente en áreas vigiladas.',
  },
];

export const CONTINGENCY_PROTOCOLS = [
  {
    escenario: 'Olas de calor (+45 °C en autovía) o paradas prolongadas en ruta',
    accion: 'Activación automática de la segunda etapa del compresor Bi-Zona y conexión a toma eléctrica 400V en nuestra base intermedia más cercana.',
    sla: '< 10 minutos estabilización térmica',
  },
  {
    escenario: 'Corte de autovía por DANA, nieve o incidencia de tráfico',
    accion: 'Despacho inmediato de camión de relevo desde nuestra base en Barcelona, Zaragoza, Madrid o Sevilla para trasbordo en muelle cerrado GDP.',
    sla: '< 45 minutos activación unidad relevo',
  },
  {
    escenario: 'Verificación de lote por Farmacia Hospitalaria o Laboratorio',
    accion: 'Generación instantánea en ruta del certificado PDF UNE-EN 12830 con histórico minuto a minuto validado por nuestra Persona Cualificada (QP).',
    sla: 'Disponibilidad inmediata en tiempo real',
  },
];

export const HUB_NETWORK = [
  {
    region: 'Corredor Centro y Noreste',
    ciudades: 'Barcelona (ZAL) · Madrid (M-50) · Zaragoza (PLAZA) · Bilbao',
    detalle: 'Bases propias con muelles climatizados herméticos y relevos diarios en las autovías A-2, AP-68 y A-1.',
  },
  {
    region: 'Arco Mediterráneo y Sur',
    ciudades: 'Valencia · Murcia · Sevilla · Málaga',
    detalle: 'Cobertura nocturna y diurna por AP-7, A-3 y A-4 con furgones isotermos de última milla hospitalaria.',
  },
  {
    region: 'Noroeste y Enlace Ro-Ro Balear',
    ciudades: 'A Coruña · Santiago · Vigo · Palma de Mallorca (380V)',
    detalle: 'Rutas directas por A-6/AP-9 y embarque nocturno en camión frigorífico enchufado a red 380V para Baleares.',
  },
];
