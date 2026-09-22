/**
 * Compositor de las manos (adaptado de github.com/vikod3/handstouch).
 *
 * El video va apilado: la mitad superior trae el color y la inferior la máscara
 * alfa (blanco = opaco). Un shader mínimo toma ambas mitades del mismo cuadro y
 * pinta las manos con transparencia real en un <canvas>, sin dependencias.
 *
 * Funciona en modo «scrub»: el video nunca se reproduce solo; cada cuadro se pide
 * con `seek(time)` (desde el scroll). Requiere un archivo con todos los cuadros
 * clave (`-g 1`), como `public/media/hands-scroll-*.mp4`.
 */

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

// highp cuando existe: con mediump (16 bits) la coordenada de la mitad inferior
// pierde ~1 texel sobre 2500 filas y la silueta se desplaza del color.
const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uHands;
varying vec2 vUv;
void main() {
  // Sin UNPACK_FLIP_Y, t = 0 es la primera fila del video (arriba). El
  // pequeño margen evita que el filtrado lineal mezcle las dos mitades.
  float t = mix(0.0005, 0.9995, 1.0 - vUv.y);
  vec3 color = texture2D(uHands, vec2(vUv.x, t * 0.5)).rgb;
  float alpha = texture2D(uHands, vec2(vUv.x, 0.5 + t * 0.5)).r;
  alpha = smoothstep(0.02, 0.98, alpha);
  // El canvas se compone con alfa premultiplicado.
  gl_FragColor = vec4(color * alpha, alpha);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("No se pudo crear el shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "";
    gl.deleteShader(shader);
    throw new Error(`Shader inválido: ${log}`);
  }
  return shader;
}

function createResources(gl: WebGLRenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) throw new Error("No se pudo crear el programa");
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? "";
    gl.deleteProgram(program);
    throw new Error(`Programa inválido: ${log}`);
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  // Sin conversiones de color del navegador: los valores del video pasan tal cual.
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.useProgram(program);
  gl.uniform1i(gl.getUniformLocation(program, "uHands"), 0);
  gl.disable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);

  return {
    dispose() {
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

export type HandRenderer = {
  /** Desmonta el compositor y libera la GPU. */
  dispose(): void;
  /**
   * Pide el cuadro del instante `time` (s). Las peticiones se agrupan: si llega
   * otra mientras el video busca, se atiende la última. Vale llamar antes de que
   * el video tenga datos: se atiende en cuanto los tenga.
   */
  seek(time: number): void;
};

export type HandRendererOptions = {
  /** Cuadros por segundo del video (para pedir el centro exacto de cada cuadro). */
  frameRate: number;
};

/**
 * Arranca el compositor y devuelve su controlador.
 * Lanza si WebGL no está disponible; el llamador conserva el póster estático.
 */
export function createHandRenderer(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  onReady: (ready: boolean) => void,
  { frameRate }: HandRendererOptions,
): HandRenderer {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: "high-performance",
  });
  if (!gl) throw new Error("WebGL no disponible");

  let resources = createResources(gl);
  let stopped = false;
  let contextLost = false;
  let hasFrame = false;

  const canDraw = () =>
    !stopped &&
    !contextLost &&
    video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
    video.videoWidth > 0;

  const draw = () => {
    if (!canDraw()) return false;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!hasFrame) {
      hasFrame = true;
      onReady(true);
    }
    return true;
  };

  // Una búsqueda a la vez; la última petición gana. Se dibuja cuando el cuadro
  // buscado se presenta (requestVideoFrameCallback), con `seeked` + un cuadro de
  // animación extra como respaldo (Safari a veces entrega el cuadro anterior en
  // `seeked`). Si el navegador se traga los eventos, un vigilante libera la cola.
  let seeking = false;
  let pendingTime: number | null = null;
  let lastSeekTime = -1;
  let seekTimer: number | undefined;
  let frameCallback: number | undefined;
  let extraFrame: number | undefined;

  const finishSeek = () => {
    window.clearTimeout(seekTimer);
    if (frameCallback !== undefined) {
      video.cancelVideoFrameCallback(frameCallback);
      frameCallback = undefined;
    }
    seeking = false;
    issueSeek();
  };

  const issueSeek = () => {
    if (pendingTime === null || stopped || contextLost) return;
    if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;
    const time = pendingTime;
    pendingTime = null;
    if (time === lastSeekTime) return;
    lastSeekTime = time;
    seeking = true;
    seekTimer = window.setTimeout(() => {
      lastSeekTime = -1;
      finishSeek();
    }, 400);
    if (typeof video.requestVideoFrameCallback === "function") {
      frameCallback = video.requestVideoFrameCallback(() => {
        frameCallback = undefined;
        draw();
      });
    }
    video.currentTime = time;
  };

  const seek = (time: number) => {
    // Al centro del cuadro, para que el redondeo no caiga en el anterior.
    const frame = Math.max(0, Math.round(time * frameRate));
    pendingTime = (frame + 0.5) / frameRate;
    if (!seeking) issueSeek();
  };

  const onSeeked = () => {
    if (!draw()) lastSeekTime = -1; // no se pudo pintar: permitir reintento
    if (extraFrame !== undefined) cancelAnimationFrame(extraFrame);
    extraFrame = requestAnimationFrame(() => {
      extraFrame = undefined;
      draw();
    });
    finishSeek();
  };
  const onLoadedMetadata = () => {
    if (!seeking) issueSeek();
  };
  const onLoadedData = () => {
    // Si ya hay un cuadro pedido, no pintar el 0: se pinta el pedido.
    if (pendingTime === null && !seeking) draw();
    else if (!seeking) issueSeek();
  };
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 3);
    const { width, height } = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(width * ratio));
    const h = Math.max(1, Math.round(height * ratio));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    draw();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    hasFrame = false;
    onReady(false);
  };
  const onContextRestored = () => {
    contextLost = false;
    resources = createResources(gl);
    resize();
    lastSeekTime = -1;
    issueSeek();
  };
  const onError = () => onReady(false);

  // Cambio de densidad (otro monitor): el ResizeObserver no se entera.
  let densityQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
  const onDensity = () => {
    densityQuery.removeEventListener("change", onDensity);
    densityQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    densityQuery.addEventListener("change", onDensity);
    resize();
  };
  densityQuery.addEventListener("change", onDensity);

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  video.addEventListener("loadedmetadata", onLoadedMetadata);
  video.addEventListener("loadeddata", onLoadedData);
  video.addEventListener("seeked", onSeeked);
  video.addEventListener("error", onError);
  video.muted = true;
  video.pause();
  resize();
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onLoadedData();

  const dispose = () => {
    stopped = true;
    window.clearTimeout(seekTimer);
    if (frameCallback !== undefined) video.cancelVideoFrameCallback(frameCallback);
    if (extraFrame !== undefined) cancelAnimationFrame(extraFrame);
    densityQuery.removeEventListener("change", onDensity);
    observer.disconnect();
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    video.removeEventListener("loadedmetadata", onLoadedMetadata);
    video.removeEventListener("loadeddata", onLoadedData);
    video.removeEventListener("seeked", onSeeked);
    video.removeEventListener("error", onError);
    video.pause();
    if (!contextLost) {
      resources.dispose();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  };

  return { dispose, seek };
}
