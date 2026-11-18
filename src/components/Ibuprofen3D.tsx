import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RotateCw, Pause, Play, RefreshCcw } from 'lucide-react';

type TabletFinish = 'blanco' | 'rosa';

interface Ibuprofen3DProps {
  lang?: 'es' | 'ca' | 'en';
}

const LABELS = {
  es: {
    badge: 'Ibuprofeno 600 mg · Modelo 3D Interactivo',
    hint: 'Arrastra para girar 360°',
    autoOn: 'Girando',
    autoOff: 'Pausado',
    classic: 'Blanco 600 mg',
    pink: 'Rosa Clásico',
    reset: 'Centrar',
    fallback: 'Vista 3D no disponible en este navegador',
  },
  ca: {
    badge: 'Ibuprofè 600 mg · Model 3D Interactiu',
    hint: 'Arrossega per girar 360°',
    autoOn: 'Girant',
    autoOff: 'Pausat',
    classic: 'Blanc 600 mg',
    pink: 'Rosa Clàssic',
    reset: 'Centrar',
    fallback: 'Vista 3D no disponible en aquest navegador',
  },
  en: {
    badge: 'Ibuprofen 600 mg · Interactive 3D Model',
    hint: 'Drag to spin 360°',
    autoOn: 'Spinning',
    autoOff: 'Paused',
    classic: 'White 600 mg',
    pink: 'Classic Pink',
    reset: 'Reset',
    fallback: '3D view unavailable in this browser',
  },
};

function createTabletSurfaceTexture(finish: TabletFinish, maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base pharmaceutical film coating
  const baseGrad = ctx.createLinearGradient(0, 0, 1024, 512);
  if (finish === 'blanco') {
    baseGrad.addColorStop(0, '#FCFDFB');
    baseGrad.addColorStop(0.5, '#F3F6F0');
    baseGrad.addColorStop(1, '#E8EFE4');
  } else {
    baseGrad.addColorStop(0, '#F7B7C5');
    baseGrad.addColorStop(0.5, '#EB95AA');
    baseGrad.addColorStop(1, '#DF7F98');
  }
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle compressed micro-crystalline pharmaceutical grain
  ctx.fillStyle = finish === 'blanco' ? 'rgba(20, 54, 14, 0.018)' : 'rgba(90, 18, 42, 0.028)';
  for (let i = 0; i < 3500; i++) {
    const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const y = (Math.sin(i * 78.233) * 43758.5453) % 1;
    const px = Math.abs(x) * 1024;
    const py = Math.abs(y) * 512;
    ctx.fillRect(px, py, 2, 2);
  }

  // Crisp pharmaceutical debossed stamp look
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = finish === 'blanco' ? 'rgba(20, 54, 14, 0.34)' : 'rgba(110, 20, 48, 0.42)';
  ctx.font = '700 44px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('IBUPROFENO', 330, 256);
  ctx.font = '800 54px "JetBrains Mono", monospace';
  ctx.fillText('600 mg', 690, 256);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

function createTabletBumpTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle micro-grain for realistic pressed powder coating
  for (let i = 0; i < 4000; i++) {
    const x = Math.abs((Math.sin(i * 19.31) * 43758.5453) % 1) * 1024;
    const y = Math.abs((Math.sin(i * 41.73) * 43758.5453) % 1) * 512;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.fillRect(x, y, 2, 2);
  }

  // Debossed stamp depth in bump map
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#383838';
  ctx.font = '700 44px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('IBUPROFENO', 330, 256);
  ctx.font = '800 54px "JetBrains Mono", monospace';
  ctx.fillText('600 mg', 690, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 124);
  grad.addColorStop(0, 'rgba(10, 28, 6, 0.52)');
  grad.addColorStop(0.55, 'rgba(10, 28, 6, 0.20)');
  grad.addColorStop(1, 'rgba(10, 28, 6, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function Ibuprofen3D({ lang = 'es' }: Ibuprofen3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [autoSpin, setAutoSpin] = useState(true);
  const [finish, setFinish] = useState<TabletFinish>('blanco');
  const [webglError, setWebglError] = useState(false);

  const autoSpinRef = useRef(autoSpin);
  autoSpinRef.current = autoSpin;

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pillGroupRef = useRef<THREE.Group | null>(null);
  const tabletMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const maxAnisoRef = useRef<number>(4);
  const texturesCacheRef = useRef<Partial<Record<TabletFinish, THREE.CanvasTexture>>>({});
  const requestRenderFnRef = useRef<(() => void) | null>(null);

  const l = LABELS[lang];

  // Update pill finish material dynamically without tearing down WebGL
  useEffect(() => {
    const mat = tabletMatRef.current;
    if (!mat) return;
    if (!texturesCacheRef.current[finish]) {
      texturesCacheRef.current[finish] = createTabletSurfaceTexture(finish, maxAnisoRef.current);
    }
    mat.map = texturesCacheRef.current[finish]!;
    mat.color.set(finish === 'blanco' ? 0xffffff : 0xfce7ee);
    mat.sheenColor.set(finish === 'blanco' ? 0xeef5ea : 0xffc6d6);
    mat.needsUpdate = true;
    requestRenderFnRef.current?.();
  }, [finish]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL detection
    const isSoftwareGl = (() => {
      const probe = document.createElement('canvas').getContext('webgl2');
      if (!probe) return true;
      const ext = probe.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
      const gpu = String(probe.getParameter(param));
      probe.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    maxAnisoRef.current = maxAniso;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initW = Math.max(280, container.clientWidth);
    const initH = Math.max(280, container.clientHeight);
    renderer.setSize(initW, initH);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'pan-y';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Studio environment reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(36, initW / initH, 0.1, 100);
    camera.position.set(0.3, 1.35, 5.4);
    cameraRef.current = camera;

    // 3-point warm/cool pharmaceutical studio lighting
    const hemi = new THREE.HemisphereLight(0xf6fff2, 0x16380d, 0.85);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff8eb, 2.1);
    keyLight.position.set(4.5, 6.2, 5.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xbef264, 1.35);
    rimLight.position.set(-5.0, 2.5, -4.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xf5e626, 0.45);
    fillLight.position.set(-3.0, -3.5, 3.0);
    scene.add(fillLight);

    // =========================================================================
    // COMPOSITE 3D IBUPROFEN 600 MG GLOBE ASSEMBLY (5+ procedural parts)
    // =========================================================================
    const assemblyGroup = new THREE.Group();
    // Classic Earth axial tilt (23.4 deg)
    assemblyGroup.rotation.z = THREE.MathUtils.degToRad(14);
    assemblyGroup.rotation.x = THREE.MathUtils.degToRad(12);
    scene.add(assemblyGroup);

    const pillGroup = new THREE.Group();
    pillGroupRef.current = pillGroup;
    assemblyGroup.add(pillGroup);

    // 1. Primary Silhouette: Oblong Biconvex Compressed Ibuprofen Caplet
    const pillLength = 2.45;
    const pillRadius = 0.68;
    const straightHalf = pillLength / 2 - pillRadius;

    const stadiumShape = new THREE.Shape();
    stadiumShape.absarc(straightHalf, 0, pillRadius, -Math.PI / 2, Math.PI / 2, false);
    stadiumShape.lineTo(-straightHalf, pillRadius);
    stadiumShape.absarc(-straightHalf, 0, pillRadius, Math.PI / 2, (Math.PI * 3) / 2, false);
    stadiumShape.closePath();

    const coreGeo = new THREE.ExtrudeGeometry(stadiumShape, {
      depth: 0.46,
      bevelEnabled: true,
      bevelThickness: 0.16,
      bevelSize: 0.12,
      bevelSegments: 14,
      curveSegments: 36,
    });
    coreGeo.center();

    // Sculpt smooth biconvex dome crown & subtle central score groove on Z faces
    const pos = coreGeo.attributes.position;
    const uvAttr = coreGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      let z = pos.getZ(i);

      // Smooth parabolic biconvex caplet dome
      const normX = Math.min(1, Math.abs(x) / (pillLength / 2 + 0.12));
      const normY = Math.min(1, Math.abs(y) / (pillRadius + 0.12));
      const dome = Math.max(0, 1 - 0.34 * normX * normX - 0.38 * normY * normY);
      z *= 0.84 + 0.34 * dome;

      // Crisp classic central break-score channel across front/back face
      if (Math.abs(z) > 0.24 && Math.abs(x) < 0.085) {
        const grooveProfile = Math.cos((x / 0.085) * (Math.PI / 2));
        z -= Math.sign(z) * 0.11 * Math.max(0, grooveProfile);
      }

      pos.setZ(i, z);

      // Planar normalized UVs across front/back faces so "IBUPROFENO 600 mg" maps cleanly
      const u = (x / (pillLength + 0.24)) + 0.5;
      const v = (y / (pillRadius * 2 + 0.24)) + 0.5;
      uvAttr.setXY(i, THREE.MathUtils.clamp(u, 0, 1), THREE.MathUtils.clamp(v, 0, 1));
    }
    pos.needsUpdate = true;
    uvAttr.needsUpdate = true;
    coreGeo.computeVertexNormals();
    coreGeo.computeTangents();

    const bumpTex = createTabletBumpTexture(maxAniso);
    const whiteTex = createTabletSurfaceTexture('blanco', maxAniso);
    texturesCacheRef.current.blanco = whiteTex;

    const tabletMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: whiteTex,
      bumpMap: bumpTex,
      bumpScale: 0.015,
      roughness: 0.22,
      metalness: 0.02,
      clearcoat: 0.85,
      clearcoatRoughness: 0.14,
      sheen: 0.35,
      sheenColor: new THREE.Color(0xeef5ea),
    });
    tabletMatRef.current = tabletMat;

    const coreMesh = new THREE.Mesh(coreGeo, tabletMat);
    coreMesh.castShadow = !isSoftwareGl;
    coreMesh.receiveShadow = !isSoftwareGl;
    pillGroup.add(coreMesh);

    // 2. Central Break-Score Shadow Accent Bar (visual depth on both pill faces)
    const grooveMat = new THREE.MeshStandardMaterial({
      color: 0xd6dfd2,
      roughness: 0.48,
      metalness: 0.05,
    });
    const grooveGeo = new THREE.CapsuleGeometry(0.022, pillRadius * 1.56, 6, 12);
    const grooveFront = new THREE.Mesh(grooveGeo, grooveMat);
    grooveFront.position.set(0, 0, 0.31);
    const grooveBack = new THREE.Mesh(grooveGeo, grooveMat);
    grooveBack.position.set(0, 0, -0.31);
    pillGroup.add(grooveFront, grooveBack);

    // 3. Equatorial Tablet Die Compression Collar (authentic pressed edge band)
    const collarGeo = new THREE.TorusGeometry(1.0, 0.018, 10, 64);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xe6eee2,
      roughness: 0.35,
      metalness: 0.04,
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.scale.set(1.31, 0.78, 1.0);
    pillGroup.add(collar);

    // 4. Orbital Globe Rings (making it spin and read like a pharmaceutical Earth)
    const orbitGroup = new THREE.Group();
    assemblyGroup.add(orbitGroup);

    const ringGeo1 = new THREE.TorusGeometry(1.92, 0.018, 12, 96);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xf5e626,
      roughness: 0.25,
      metalness: 0.75,
      emissive: 0x3f3c04,
      emissiveIntensity: 0.35,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = THREE.MathUtils.degToRad(68);
    ring1.rotation.y = THREE.MathUtils.degToRad(18);
    orbitGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.14, 0.012, 10, 96);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xa3e635,
      roughness: 0.3,
      metalness: 0.65,
      transparent: true,
      opacity: 0.75,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = THREE.MathUtils.degToRad(-56);
    ring2.rotation.y = THREE.MathUtils.degToRad(-28);
    orbitGroup.add(ring2);

    // 5. Instanced Cold-Chain Telemetry Satellites along the orbital ring (InstancedMesh)
    const satCount = 24;
    const satGeo = new THREE.SphereGeometry(0.036, 10, 10);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xf5e626,
      roughness: 0.2,
      metalness: 0.6,
      emissive: 0x716c0b,
      emissiveIntensity: 0.5,
    });
    const satellites = new THREE.InstancedMesh(satGeo, satMat, satCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2;
      const r = 1.92;
      dummy.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
      dummy.scale.setScalar(i % 6 === 0 ? 1.55 : 0.75);
      dummy.updateMatrix();
      satellites.setMatrixAt(i, dummy.matrix);
    }
    satellites.instanceMatrix.needsUpdate = true;
    satellites.computeBoundingSphere();
    ring1.add(satellites);

    // 6. Ground Contact Shadow below the floating Ibuprofen Globe
    const shadowTex = createContactShadowTexture();
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 3.8),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.5,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.78;
    scene.add(shadowPlane);

    // OrbitControls — allow full 360-degree Earth-like spin without hijacking page scroll
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.9;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Lifecycle & animation loop with software WebGL pacing
    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const requestSingleRender = () => {
      if (disposed) return;
      controls.update();
      renderer.render(scene, camera);
    };
    requestRenderFnRef.current = requestSingleRender;

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (autoSpinRef.current) {
        pillGroup.rotation.y += dt * 0.72;
        orbitGroup.rotation.y -= dt * 0.28;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    const handleResize = () => {
      if (!container || disposed) return;
      const w = Math.max(260, container.clientWidth);
      const h = Math.max(260, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      controls.dispose();
      coreGeo.dispose();
      grooveGeo.dispose();
      collarGeo.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      satGeo.dispose();
      tabletMat.dispose();
      grooveMat.dispose();
      collarMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      satMat.dispose();
      bumpTex.dispose();
      shadowTex.dispose();
      Object.values(texturesCacheRef.current).forEach((t) => t?.dispose());
      envRT.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleResetView = () => {
    if (cameraRef.current && controlsRef.current && pillGroupRef.current) {
      cameraRef.current.position.set(0.3, 1.35, 5.4);
      pillGroupRef.current.rotation.set(0, 0, 0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative h-[380px] sm:h-[430px] w-full rounded-2xl bg-[#173E0D]/88 border border-[#A3E635]/40 overflow-hidden shadow-2xl flex flex-col justify-between">
      {/* Top minimal semantic label */}
      <div className="relative z-10 px-5 pt-4 flex items-center justify-between gap-2 pointer-events-none">
        <div className="text-xs font-mono font-bold text-[#F5E626]">
          {l.badge}
        </div>
        <div className="text-[11px] text-white/80 flex items-center gap-1.5">
          <RotateCw className="w-3.5 h-3.5 text-[#A3E635]" />
          <span>{l.hint}</span>
        </div>
      </div>

      {/* Isolated 3D WebGL mount container */}
      {webglError ? (
        <div className="flex-1 flex items-center justify-center p-6 text-center text-sm text-white/80">
          {l.fallback}
        </div>
      ) : (
        <div
          ref={mountRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          aria-label={l.badge}
        />
      )}

      {/* Compact single bottom control dock (no backdrop-blur over WebGL) */}
      <div className="relative z-10 px-4 pb-4 flex justify-center pointer-events-none">
        <div className="pointer-events-auto inline-flex flex-wrap items-center gap-1.5 bg-[#102C09]/95 border border-white/20 rounded-xl p-1.5">
          <button
            type="button"
            onClick={() => setAutoSpin((s) => !s)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              autoSpin ? 'bg-[#F5E626] text-[#14360E]' : 'text-white hover:bg-white/10'
            }`}
          >
            {autoSpin ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {autoSpin ? l.autoOn : l.autoOff}
          </button>

          <button
            type="button"
            onClick={() => setFinish('blanco')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              finish === 'blanco' ? 'bg-[#2E741B] text-white' : 'text-white/80 hover:text-white'
            }`}
          >
            {l.classic}
          </button>

          <button
            type="button"
            onClick={() => setFinish('rosa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              finish === 'rosa' ? 'bg-[#2E741B] text-white' : 'text-white/80 hover:text-white'
            }`}
          >
            {l.pink}
          </button>

          <button
            type="button"
            onClick={handleResetView}
            title={l.reset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white/85 hover:text-[#F5E626] transition-colors cursor-pointer whitespace-nowrap"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{l.reset}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
