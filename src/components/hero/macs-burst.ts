/**
 * Explosión de partículas que forma la palabra «MACS», portada línea por línea
 * de la portada de Grupo MaSa (public/portada.html: escena three.js con la
 * misma cámara, tono, aberración cromática, partículas azules con reflejo en el
 * agua, anillos, chispas, neblina, haz de luz, estrellas y bokeh). Lo único que
 * cambia es el origen y el destino de las partículas: nacen en el punto de
 * contacto de los dedos y, tras la explosión (misma fórmula), se recogen en la
 * palabra «MACS» (relleno azul, contorno blanco) en vez de en la sandalia.
 */
import * as THREE from "three";

THREE.ColorManagement.enabled = false;

export type BurstState = {
  /** 0 → 1: explosión y recogida en la palabra (uMorph de MaSa). */
  explode: number;
  /** 0 → 1: la palabra se disuelve hacia arriba (transición a la siguiente escena). */
  dissolve: number;
  /** Puntero en px del viewport (para el parallax de cámara y el empuje de partículas). */
  pointer: { x: number; y: number; inside: boolean };
};

export type MacsBurst = {
  /** Punto de contacto de los dedos en px del viewport: origen de la explosión. */
  setContact(x: number, y: number): void;
  update(state: BurstState): void;
  /** Detiene o reanuda el bucle de dibujo (la escena solo se dibuja si está en pantalla). */
  setActive(active: boolean): void;
  resize(): void;
  dispose(): void;
};

const smooth = (a: number, b: number, x: number) => {
  const n = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return n * n * (3 - 2 * n);
};

/** Puntos de la palabra: relleno y contorno, muestreados de un lienzo 2D. */
function sampleWord(word: string, family: string) {
  const W = 2048, H = 768;
  const make = () => {
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const x = cv.getContext("2d")!;
    x.font = `500 470px ${family}, Outfit, Arial, sans-serif`;
    x.textAlign = "center"; x.textBaseline = "middle";
    return x;
  };
  const a = make(); a.fillStyle = "#fff"; a.fillText(word, W / 2, H / 2 + 10);
  const b = make(); b.strokeStyle = "#fff"; b.lineWidth = 26; b.lineJoin = "round"; b.strokeText(word, W / 2, H / 2 + 10);
  const fill = a.getImageData(0, 0, W, H).data, edge = b.getImageData(0, 0, W, H).data;
  const inside: number[] = [], border: number[] = [];
  let minX = W, maxX = 0;
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
    const i = (y * W + x) * 4 + 3;
    if (fill[i] > 80) { inside.push(x, y); if (x < minX) minX = x; if (x > maxX) maxX = x; }
    else if (edge[i] > 80) border.push(x, y);
  }
  return { W, H, inside, border, width: maxX - minX };
}

export function createMacsBurst(canvas: HTMLCanvasElement, fontFamily: string): MacsBurst {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 3)); // máxima calidad (dueño): hasta 3× (4K)
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x01040a);
  scene.fog = new THREE.FogExp2(0x020711, 0.036);
  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 3.1, 17);

  // ---- aberración cromática a pantalla (EffectComposer del original, hecho a mano)
  const chroma = new THREE.ShaderMaterial({
    depthTest: false, depthWrite: false,
    uniforms: { tDiffuse: { value: null }, uResolution: { value: new THREE.Vector2(innerWidth, innerHeight) }, uStrength: { value: 2 } },
    vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
    fragmentShader: "uniform sampler2D tDiffuse;uniform vec2 uResolution;uniform float uStrength;varying vec2 vUv;void main(){vec2 center=vUv-.5;float radial=pow(clamp(length(center)*1.75,0.,1.),1.2);vec2 direction=length(center)>.0001?normalize(center):vec2(0.);vec2 offset=direction*(uStrength*radial)/uResolution;vec3 base=texture2D(tDiffuse,vUv).rgb;vec3 plusSample=texture2D(tDiffuse,vUv+offset).rgb;vec3 minusSample=texture2D(tDiffuse,vUv-offset).rgb;float plusLum=dot(plusSample,vec3(.299,.587,.114));float minusLum=dot(minusSample,vec3(.299,.587,.114));float spectralEdge=abs(plusLum-minusLum);vec3 blueTint=vec3(.015,.025,1.);vec3 redTint=vec3(1.,.012,.018);vec3 fringeTint=mix(blueTint,redTint,step(minusLum,plusLum));vec3 color=base+fringeTint*spectralEdge*1.65;color.g=max(0.,color.g-spectralEdge*.72);gl_FragColor=vec4(color,1.);}",
  });
  const tri = new THREE.BufferGeometry();
  tri.setAttribute("position", new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  tri.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
  const passScene = new THREE.Scene(), passCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const passMesh = new THREE.Mesh(tri, chroma); passMesh.frustumCulled = false; passScene.add(passMesh);
  let target: THREE.WebGLRenderTarget | null = null;
  const makeTarget = () => {
    if (target) target.dispose();
    const s = renderer.getDrawingBufferSize(new THREE.Vector2());
    target = new THREE.WebGLRenderTarget(s.x, s.y, { type: THREE.HalfFloatType, depthBuffer: true, samples: 8 });
    chroma.uniforms.tDiffuse.value = target.texture;
  };
  makeTarget();

  const group = new THREE.Group();
  group.position.set(0, -0.38, 0);
  scene.add(group);

  const U = {
    uTime: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() }, uMorph: { value: 0 }, uIntro: { value: 1 }, uOpacity: { value: 1 },
    uPointer: { value: new THREE.Vector2(-1e3, -1e3) }, uResolution: { value: new THREE.Vector2(innerWidth, innerHeight) }, uHover: { value: 0 },
    uTreeRadius: { value: 170 }, uCubeRadius: { value: 200 }, uTreeSpread: { value: 0.056 }, uCubeSpread: { value: 0.072 },
    uTreeCore: { value: 0.3 }, uCubeCore: { value: 0.7 }, uTreeRamp: { value: 1.2 }, uCubeRamp: { value: 0.8 },
    uGiro: { value: 0 }, uEspiral: { value: 0 }, uSolido: { value: 0 },
    uCenter: { value: new THREE.Vector3(0, 4, 0) }, // origen de la explosión (punto de contacto, en el grupo)
  };

  // Partícula azul de MaSa: nace en el origen (position), sale disparada desde uCenter y se recoge en aTarget (uMorph);
  // aDebris = restos que se apagan; aBlanco = contorno blanco de la palabra.
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    vertexShader: "uniform float uSolido;uniform vec3 uCenter;attribute float aSize,aPhase,aDrift,aUmbral,aDebris,aBlanco;attribute vec3 aTarget,aSphere;uniform float uTime,uPixelRatio,uMorph,uIntro,uOpacity,uHover,uTreeRadius,uCubeRadius,uTreeSpread,uCubeSpread,uTreeCore,uCubeCore,uTreeRamp,uCubeRamp,uGiro,uEspiral;uniform vec2 uPointer,uResolution;varying float vGlow,vOpacity,vDepth,vBlanco;void main(){vBlanco=aBlanco*smoothstep(.5,.9,uMorph);float m=smoothstep(0.,1.,uMorph),intro=smoothstep(0.,1.,uIntro);vec3 tp=mix(aSphere,position,intro);float wind=sin(uTime*.75+tp.y*1.65+aPhase)*(.025+smoothstep(2.5,7.,tp.y)*.14)*intro;tp.x+=wind+aDrift*mod(uTime*.16+aPhase,6.)*intro;tp.z+=sin(uTime*.55+aPhase)*.025*intro;float ang=uGiro+uEspiral*(tp.y*.55+aUmbral*.4);float cs=cos(ang),sn=sin(ang);tp.xz=vec2(tp.x*cs-tp.z*sn,tp.x*sn+tp.z*cs);vec3 dirB=normalize(tp-uCenter+vec3(.001));vec3 tgt=aTarget;vec3 p=mix(tp,tgt,m)+dirB*sin(m*3.14159)*(2.+aUmbral*6.)*(1.-aDebris*.15);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;vec2 screen=(gl_Position.xy/gl_Position.w*.5+.5)*uResolution;vec2 delta=screen-uPointer;float dist=length(delta);float radius=mix(uTreeRadius,uCubeRadius,m);float ramp=clamp(1.-dist/radius,0.,1.);ramp=ramp*ramp*(3.-2.*ramp);ramp=pow(max(ramp,.0001),mix(uTreeRamp,uCubeRamp,m));float core=mix(uTreeCore,uCubeCore,m);float softCore=mix(core,1.,smoothstep(0.,radius*.34,dist));float repel=ramp*softCore*uHover*intro*(1.-m);float spread=mix(uTreeSpread,uCubeSpread,m);gl_Position.xy+=normalize(delta+vec2(.001))*repel*spread*gl_Position.w;vDepth=clamp((-mv.z-8.)/14.,0.,1.);float depthScale=mix(1.28,.72,vDepth);gl_PointSize=aSize*depthScale*uPixelRatio*(27./-mv.z)*(1.+repel*mix(.07,.22,m))*mix(1.,1.3,uSolido);vGlow=.62+.38*sin(aPhase+uTime*1.4);vOpacity=uOpacity*(1.-aDebris*smoothstep(.5,.95,m));}",
    fragmentShader: "uniform float uSolido;varying float vGlow,vOpacity,vDepth,vBlanco;void main(){float d=length(gl_PointCoord-.5);float c=smoothstep(.19,0.,d),h=smoothstep(.5,.08,d);vec3 nearCol=vec3(.12,.82,1.),farCol=vec3(.018,.16,.72);vec3 col=mix(nearCol,farCol,vDepth);col=mix(col,vec3(.62,.97,1.),c*.55);col=mix(col,vec3(1.),vBlanco);float depthAlpha=mix(1.,.48,vDepth);float a=(c+h*.38)*mix(vGlow,1.,vBlanco)*vOpacity*depthAlpha;if(uSolido>.5&&a<.22)discard;gl_FragColor=vec4(col,a);}",
  });

  const reflectionVertexCommon = "vec4 world=modelMatrix*vec4(p,1.);float waterY=-.58;float sourceHeight=max(0.,world.y-waterY);world.y=waterY-sourceHeight*.66;float breakup=sin(sourceHeight*7.5+world.x*1.7-uTime*1.4+aPhase)*(.025+sourceHeight*.018)*mix(1.,1.55,m);world.x+=breakup+sin(world.z*3.+uTime*.55)*sourceHeight*.012;world.z+=cos(world.x*2.2-uTime*.38+aPhase)*sourceHeight*.008;vec4 mv=viewMatrix*world;gl_Position=projectionMatrix*mv;float distanceFade=exp(-sourceHeight*.22)*(1.-smoothstep(8.,11.,sourceHeight));float bands=.38+.62*pow(.5+.5*sin(sourceHeight*8.-uTime*1.3+aPhase*.15),3.);vFade=distanceFade*bands;vGlint=.55+.45*sin(aPhase+uTime*.62);gl_PointSize=aSize*mix(.78,1.1,m)*(.85+vGlint*.2)*uPixelRatio*(26./-mv.z);";
  const reflectionMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    uniforms: U,
    vertexShader: "uniform vec3 uCenter;attribute float aSize,aPhase,aDrift,aUmbral,aDebris;attribute vec3 aTarget,aSphere;uniform float uTime,uMorph,uPixelRatio,uIntro,uGiro,uEspiral,uOpacity;varying float vFade,vGlint,vMorph,vA;void main(){float m=smoothstep(0.,1.,uMorph);vMorph=m;float intro=smoothstep(0.,1.,uIntro);vec3 tp=mix(aSphere,position,intro);float wind=sin(uTime*.75+tp.y*1.65+aPhase)*(.018+smoothstep(2.5,7.,tp.y)*.08);tp.x+=wind+aDrift*mod(uTime*.16+aPhase,6.);float ang=uGiro+uEspiral*(tp.y*.55+aUmbral*.4);float cs=cos(ang),sn=sin(ang);tp.xz=vec2(tp.x*cs-tp.z*sn,tp.x*sn+tp.z*cs);vec3 dirB=normalize(tp-uCenter+vec3(.001));vec3 tgt=aTarget;vec3 p=mix(tp,tgt,m)+dirB*sin(m*3.14159)*(2.+aUmbral*6.)*(1.-aDebris*.15);vA=uOpacity*(1.-aDebris*smoothstep(.5,.95,m));" + reflectionVertexCommon + "}",
    fragmentShader: "varying float vFade,vGlint,vMorph,vA;void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);float core=smoothstep(.2,0.,d),halo=smoothstep(.5,.055,d);vec3 col=mix(vec3(.015,.28,.78),vec3(.12,.84,1.),core+vGlint*.2);gl_FragColor=vec4(col,(core+halo*.38)*vFade*.5*vA);}",
  });

  // ---- las partículas: nacen en el contacto (position), forman la palabra (aTarget) o se pierden (aDebris)
  const word = sampleWord("MACS", fontFamily);
  const N = innerWidth < 700 ? 26000 : 50000;
  const nFill = Math.round(N * 0.62), nEdge = Math.round(N * 0.08);
  const WORD_WIDTH = 9.4; // unidades de escena (la sandalia de MaSa medía 8.2)
  const scale = WORD_WIDTH / word.width;
  const toWorld = (px: number, py: number) => [(px - word.W / 2) * scale, (word.H / 2 - py) * scale, (Math.random() - 0.5) * 0.3] as const;
  const pick = (arr: number[]) => { const k = (Math.floor(Math.random() * (arr.length / 2))) * 2; return toWorld(arr[k] + Math.random() * 2, arr[k + 1] + Math.random() * 2); };

  const positions = new Float32Array(N * 3), targets = new Float32Array(N * 3), spheres = new Float32Array(N * 3);
  const sizes = new Float32Array(N), phases = new Float32Array(N), drifts = new Float32Array(N), umbral = new Float32Array(N), debris = new Float32Array(N), blanco = new Float32Array(N);
  const WORD_Y = -0.32; // en el grupo: con el grupo subido 3.9 (como en MaSa) la palabra queda centrada en pantalla
  for (let i = 0; i < N; i++) {
    umbral[i] = Math.random(); phases[i] = Math.random() * 20;
    const u = Math.cbrt(Math.random());
    sizes[i] = 1.2 + Math.random() * 2.6 + u * u * 1.3 + 0.25;
    drifts[i] = Math.random() < 0.032 ? 0.1 + Math.random() * 0.2 : 0;
    // origen: una bolita en el punto de contacto (se fija en setContact); mientras tanto, en el centro
    const e = 1 - Math.random() * 2, t = Math.random() * Math.PI * 2, r = 0.32 * u, q = Math.sqrt(1 - e * e);
    positions[i * 3] = Math.cos(t) * q * r; positions[i * 3 + 1] = e * r; positions[i * 3 + 2] = Math.sin(t) * q * r;
    spheres[i * 3] = positions[i * 3]; spheres[i * 3 + 1] = positions[i * 3 + 1]; spheres[i * 3 + 2] = positions[i * 3 + 2];
    if (i < nFill) { const [x, y, z] = pick(word.inside); targets[i * 3] = x; targets[i * 3 + 1] = y + WORD_Y; targets[i * 3 + 2] = z; }
    else if (i < nFill + nEdge) { const [x, y, z] = pick(word.border); targets[i * 3] = x; targets[i * 3 + 1] = y + WORD_Y; targets[i * 3 + 2] = z; blanco[i] = 1; }
    else { const d = 1 - Math.random() * 2, a = Math.random() * Math.PI * 2, rr = 9 + Math.random() * 9, sq = Math.sqrt(1 - d * d); targets[i * 3] = Math.cos(a) * sq * rr; targets[i * 3 + 1] = 4 + d * rr; targets[i * 3 + 2] = Math.sin(a) * sq * rr; debris[i] = 1; }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
  geometry.setAttribute("aSphere", new THREE.BufferAttribute(spheres, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aDrift", new THREE.BufferAttribute(drifts, 1));
  geometry.setAttribute("aUmbral", new THREE.BufferAttribute(umbral, 1));
  geometry.setAttribute("aDebris", new THREE.BufferAttribute(debris, 1));
  geometry.setAttribute("aBlanco", new THREE.BufferAttribute(blanco, 1));
  const particles = new THREE.Points(geometry, particleMaterial);
  particles.frustumCulled = false; particles.renderOrder = 22; group.add(particles);
  const reflection = new THREE.Points(geometry, reflectionMaterial);
  reflection.frustumCulled = false; reflection.renderOrder = 4; group.add(reflection);

  // ---- el agua
  const water = new THREE.Mesh(new THREE.PlaneGeometry(42, 26, 220, 140).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({
    uniforms: { uTime: U.uTime, uMorph: U.uMorph }, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    vertexShader: "uniform float uTime,uMorph;varying vec3 vP;varying float vH;float wave(vec2 p){float r=length(p);return sin(r*3.1-uTime*1.8)*.12*exp(-r*.065)+sin(p.x*1.35+uTime*.7)*.045+sin(p.y*1.8-uTime*.55)*.035;}void main(){vec3 p=position;float h=wave(p.xz);p.y+=h;vP=p;vH=h;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}",
    fragmentShader: "uniform float uTime;varying vec3 vP;varying float vH;void main(){float e=.06;float hx=sin((length(vP.xz+vec2(e,0.))*3.1)-uTime*1.8)*.12;float hz=sin((length(vP.xz+vec2(0.,e))*3.1)-uTime*1.8)*.12;vec3 n=normalize(vec3(vH-hx,e,vH-hz));vec3 l=normalize(vec3(-.35,1.,.25));float spec=pow(max(dot(reflect(-l,n),normalize(vec3(0.,1.,.6))),0.),36.);float wave=.5+.5*sin(length(vP.xz)*4.-uTime*1.7);float rings=pow(wave,14.4);float halo=pow(wave,5.5);float fade=exp(-length(vP.xz)*.1);float shimmer=pow(max(0.,sin(vP.x*2.8+uTime*.85)*cos(vP.z*4.2-uTime*.62)),18.)*fade;vec3 col=mix(vec3(.006,.028,.061),vec3(.022,.374,.792),rings*.5+spec);col+=vec3(.088,.605,1.)*(shimmer*.3+spec*.24+halo*fade*.045);gl_FragColor=vec4(col,.48+fade*.18+rings*.11+halo*fade*.025+shimmer*.13);}",
  }));
  water.position.set(0, -0.66, 0); water.renderOrder = 0; scene.add(water);

  // ---- chispas que viajan con los anillos
  {
    const n = 2100, angle = new Float32Array(n), band = new Float32Array(n), jitter = new Float32Array(n), size = new Float32Array(n), phase = new Float32Array(n);
    for (let i = 0; i < n; i++) { angle[i] = Math.random() * Math.PI * 2; band[i] = i % 6; jitter[i] = (Math.random() - 0.5) * 0.42; size[i] = (0.75 + Math.random() * 1.65) * 1.2; phase[i] = Math.random() * 20; }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("aAngle", new THREE.BufferAttribute(angle, 1)); g.setAttribute("aBand", new THREE.BufferAttribute(band, 1));
    g.setAttribute("aJitter", new THREE.BufferAttribute(jitter, 1)); g.setAttribute("aSize", new THREE.BufferAttribute(size, 1)); g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    const sparks = new THREE.Points(g, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, uniforms: { uTime: U.uTime, uPixelRatio: U.uPixelRatio },
      vertexShader: "attribute float aAngle,aBand,aJitter,aSize,aPhase;uniform float uTime,uPixelRatio;varying float vAlpha,vSpark;void main(){float cycle=mod(aBand*2.25+uTime*.48,13.5);float r=.7+cycle+aJitter;float angle=aAngle+sin(uTime*.12+aPhase)*.012;vec3 p=vec3(cos(angle)*r,-.51,sin(angle)*r);p.y+=sin(r*3.1-uTime*1.8)*.105*exp(-r*.06);float inner=smoothstep(.3,1.6,cycle),outer=1.-smoothstep(9.5,13.5,cycle);float flick=.68+.32*sin(aPhase+uTime*.75);vAlpha=inner*outer*flick;vSpark=pow(flick,3.);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=aSize*(1.+vSpark*.32)*uPixelRatio*(25./-mv.z);}",
      fragmentShader: "varying float vAlpha,vSpark;void main(){float d=length(gl_PointCoord-.5);float core=smoothstep(.18,0.,d),halo=smoothstep(.5,.06,d);vec3 col=mix(vec3(.015,.28,.9),vec3(.25,.92,1.),core+vSpark*.2);gl_FragColor=vec4(col,(core+halo*.38)*vAlpha*.72);}",
    }));
    sparks.frustumCulled = false; sparks.renderOrder = 3; scene.add(sparks);
  }

  const light = new THREE.PointLight(0x24c8ff, 24, 16, 2); light.position.set(0, 0.4, 1.5); scene.add(light);

  // ---- neblina detrás y haz de luz
  const mist = new THREE.Mesh(new THREE.PlaneGeometry(18, 12), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, uniforms: { uTime: U.uTime },
    vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: "varying vec2 vUv;uniform float uTime;void main(){vec2 p=vUv-.5;float radial=exp(-dot(p*vec2(1.1,1.45),p*vec2(1.1,1.45))*8.);float mist=.86+.14*sin(uTime*.18+vUv.y*5.);gl_FragColor=vec4(.015,.22,.55,radial*mist*.2);}",
  }));
  mist.position.set(0, 3.5, -3.5); mist.renderOrder = -2; scene.add(mist);
  const shaft = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 12), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: "varying vec2 vUv;void main(){float x=abs(vUv.x-.5)*2.;float shaft=pow(max(0.,1.-x),4.)*sin(vUv.y*3.14159);gl_FragColor=vec4(.03,.42,.9,shaft*.055);}",
  }));
  shaft.position.set(0, 2.6, -2.8); shaft.renderOrder = -1; scene.add(shaft);

  // ---- estrellas al fondo
  {
    const pos: number[] = [], size: number[] = [], phase: number[] = [];
    for (let i = 0; i < 950; i++) { pos.push((Math.random() - 0.5) * 34, 1 + Math.random() * 16, -5 - Math.random() * 13); size.push(0.45 + Math.random() * 1.25); phase.push(Math.random() * 20); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("aSize", new THREE.Float32BufferAttribute(size, 1)); g.setAttribute("aPhase", new THREE.Float32BufferAttribute(phase, 1));
    const stars = new THREE.Points(g, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, uniforms: { uTime: U.uTime, uPixelRatio: U.uPixelRatio },
      vertexShader: "attribute float aSize,aPhase;uniform float uTime,uPixelRatio;varying float vGlow;void main(){float twinkle=.5+.5*sin(aPhase+uTime*.34);vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=aSize*1.85*(.86+twinkle*.3)*uPixelRatio*(28./-mv.z);vGlow=.42+.58*twinkle;}",
      fragmentShader: "varying float vGlow;void main(){float d=length(gl_PointCoord-.5);float core=smoothstep(.22,0.,d),halo=smoothstep(.5,.05,d);gl_FragColor=vec4(vec3(1.),(core+halo*.68)*vGlow);}",
    }));
    stars.frustumCulled = false; stars.renderOrder = 1; scene.add(stars);
  }
  // ---- luces desenfocadas delante
  {
    const pos: number[] = [], size: number[] = [], phase: number[] = [];
    for (let i = 0; i < 42; i++) { pos.push((Math.random() - 0.5) * 24, -1 + Math.random() * 11, 5 + Math.random() * 4); size.push(10 + Math.random() * 24); phase.push(Math.random() * 20); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("aSize", new THREE.Float32BufferAttribute(size, 1)); g.setAttribute("aPhase", new THREE.Float32BufferAttribute(phase, 1));
    const bokeh = new THREE.Points(g, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, uniforms: { uTime: U.uTime, uPixelRatio: U.uPixelRatio },
      vertexShader: "attribute float aSize,aPhase;uniform float uTime,uPixelRatio;varying float vAlpha;void main(){vec3 p=position;p.x+=sin(uTime*.11+aPhase)*.35;p.y+=cos(uTime*.08+aPhase)*.2;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=aSize*uPixelRatio*(18./-mv.z);vAlpha=.035+.025*sin(uTime*.17+aPhase);}",
      fragmentShader: "varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.05,d);gl_FragColor=vec4(.1,.55,1.,a*vAlpha);}",
    }));
    bokeh.frustumCulled = false; bokeh.renderOrder = 30; scene.add(bokeh);
  }

  // ---- contacto: de píxeles del viewport al plano z=0 del grupo (en reposo, grupo en y=-.38)
  const contact = new THREE.Vector3(0, 4, 0);
  const setContact = (x: number, y: number) => {
    const ndc = new THREE.Vector3((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1, 0.5).unproject(camera);
    const dir = ndc.sub(camera.position).normalize();
    const t = -camera.position.z / dir.z; // plano z = 0
    const world = camera.position.clone().add(dir.multiplyScalar(t));
    contact.set(world.x, world.y + 0.38, 0); // al espacio del grupo (grupo en reposo)
    U.uCenter.value.copy(contact);
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const sph = geometry.getAttribute("aSphere") as THREE.BufferAttribute;
    for (let i = 0; i < N; i++) {
      pos.setXYZ(i, sph.getX(i) + contact.x, sph.getY(i) + contact.y, sph.getZ(i) + contact.z);
    }
    pos.needsUpdate = true;
  };

  const clock = new THREE.Clock();
  let last = 0, parX = 0, parY = 0;
  const state: BurstState = { explode: 0, dissolve: 0, pointer: { x: -1e3, y: -1e3, inside: false } };
  let raf = 0, disposed = false, active = true;

  const frame = () => {
    if (disposed || !active) return;
    raf = requestAnimationFrame(frame);
    const t = clock.getElapsedTime(), dt = Math.min(0.05, t - last); last = t;
    const e = state.explode, dis = state.dissolve;
    const pointerX = state.pointer.inside ? state.pointer.x / innerWidth - 0.5 : 0, pointerY = state.pointer.inside ? state.pointer.y / innerHeight - 0.5 : 0;
    U.uPointer.value.set(state.pointer.x, innerHeight - state.pointer.y);
    U.uHover.value = state.pointer.inside ? 1 : 0;
    U.uTime.value = t; U.uMorph.value = e;
    U.uOpacity.value = 1 - smooth(0, 0.85, dis);
    // como en MaSa: el conjunto sube y encoge un poco durante la explosión; al disolverse sigue subiendo
    group.position.y = -0.38 + e * 3.9 + dis * 2.6;
    group.scale.setScalar(1 - e * 0.15);
    // una vuelta completa durante la explosión; la palabra queda de frente, con un vaivén leve
    const settle = smooth(0.9, 1, e);
    const yTarget = pointerX * 0.12 * (1 - e) + e * Math.PI * 2 + Math.sin(t * 0.5) * 0.12 * settle;
    const kf = 1 - Math.exp(-dt * 2.14), kl = 1 - Math.exp(-dt * 1.83);
    group.rotation.y += (yTarget - group.rotation.y) * kf;
    group.rotation.x += (pointerY * 0.035 * (1 - e) + Math.sin(t * 0.37) * 0.05 * settle - group.rotation.x) * kl;
    const dolly = Math.sin(e * Math.PI) * 0.182;
    chroma.uniforms.uStrength.value = 1.4 + Math.sin(e * Math.PI) * 3.15;
    // parallax: el puntero suavizado desplaza la cámara (x ±.9, y ∓.5); la mirada sigue fija en (0,3.2,0)
    const kp = 1 - Math.exp(-dt * 3.2); parX += (pointerX - parX) * kp; parY += (pointerY - parY) * kp;
    camera.position.x = parX * 0.9;
    camera.position.z = 17 - dolly + Math.sin(t * 0.34) * 0.11; camera.position.y = 3.1 + Math.sin(t * 0.21) * 0.045 - parY * 0.5; camera.lookAt(0, 3.2, 0);
    renderer.setRenderTarget(target); renderer.render(scene, camera);
    renderer.setRenderTarget(null); renderer.render(passScene, passCamera);
  };
  raf = requestAnimationFrame(frame);

  return {
    setContact,
    update(next) {
      state.explode = next.explode; state.dissolve = next.dissolve; state.pointer = next.pointer;
    },
    setActive(next) {
      if (next === active || disposed) return;
      active = next;
      if (active) { last = clock.getElapsedTime(); raf = requestAnimationFrame(frame); }
      else cancelAnimationFrame(raf);
    },
    resize() {
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight, false); makeTarget();
      chroma.uniforms.uResolution.value.set(innerWidth, innerHeight);
      U.uPixelRatio.value = renderer.getPixelRatio(); U.uResolution.value.set(innerWidth, innerHeight);
    },
    dispose() {
      disposed = true; cancelAnimationFrame(raf);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | undefined;
        if (mat) mat.dispose();
      });
      target?.dispose(); renderer.dispose();
    },
  };
}
