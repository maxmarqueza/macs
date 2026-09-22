/**
 * Compositor de las manos del hero (adaptado de github.com/vikod3/handstouch).
 *
 * `hands-rgba.mp4` va apilado: la mitad superior trae el color y la inferior la
 * máscara alfa (blanco = opaco). Un shader mínimo toma ambas mitades del mismo
 * cuadro y pinta las manos con transparencia real en un <canvas>, sin three.js
 * ni otras dependencias. Como las dos mitades salen del mismo decodificador, la
 * silueta nunca se desfasa del color.
 */

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision mediump float;
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

/** Instante (s) con las manos casi tocándose; se usa como cuadro fijo. */
const STILL_FRAME_TIME = 4.8;

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
   * Solo en modo `scrub`: pide el cuadro del instante `time` (s). Las peticiones
   * se agrupan: si llega otra mientras el video busca, se atiende la última.
   */
  seek(time: number): void;
};

export type HandRendererOptions = {
  /**
   * `scrub`: el video no se reproduce solo; cada cuadro se pide con `seek()`
   * (p. ej. desde el scroll). Requiere un archivo con todos los cuadros clave
   * (`-g 1`), como los de `public/media/lab/`.
   */
  scrub?: boolean;
};

const FRAME_RATE = 24;

/**
 * Arranca el compositor y devuelve su controlador.
 * Lanza si WebGL no está disponible; el llamador conserva el póster estático.
 */
export function createHandRenderer(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  onReady: (ready: boolean) => void,
  { scrub = false }: HandRendererOptions = {},
): HandRenderer {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: "low-power",
  });
  if (!gl) throw new Error("WebGL no disponible");

  let resources = createResources(gl);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let stopped = false;
  let contextLost = false;
  let frameHandle: number | undefined;
  let frameIsVideoCallback = false;
  let lastTime = -1;
  let hasFrame = false;

  const draw = () => {
    if (
      stopped ||
      contextLost ||
      video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
      video.videoWidth === 0
    ) {
      return;
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!hasFrame) {
      hasFrame = true;
      onReady(true);
    }
  };

  const cancelFrame = () => {
    if (frameHandle === undefined) return;
    if (frameIsVideoCallback) video.cancelVideoFrameCallback(frameHandle);
    else cancelAnimationFrame(frameHandle);
    frameHandle = undefined;
  };

  const scheduleFrame = () => {
    if (stopped || contextLost || document.hidden || video.paused) return;
    if (typeof video.requestVideoFrameCallback === "function") {
      frameIsVideoCallback = true;
      frameHandle = video.requestVideoFrameCallback(() => {
        frameHandle = undefined;
        draw();
        scheduleFrame();
      });
    } else {
      frameIsVideoCallback = false;
      frameHandle = requestAnimationFrame(() => {
        frameHandle = undefined;
        if (video.currentTime !== lastTime) {
          draw();
          lastTime = video.currentTime;
        }
        scheduleFrame();
      });
    }
  };

  const play = () => {
    if (scrub) return;
    if (!stopped && !contextLost && !document.hidden && !reducedMotion.matches) {
      void video.play().catch(() => draw());
    }
  };

  // Modo scrub: una búsqueda a la vez; la última petición gana. Las peticiones
  // esperan a que el video tenga metadatos, y si una búsqueda no termina (p. ej.
  // el navegador se traga el evento) se libera a los 400 ms.
  let seeking = false;
  let pendingTime: number | null = null;
  let lastSeekTime = -1;
  let seekTimer: number | undefined;
  const issueSeek = () => {
    if (pendingTime === null || stopped || contextLost) return;
    if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;
    const time = pendingTime;
    pendingTime = null;
    if (time === lastSeekTime) return;
    lastSeekTime = time;
    seeking = true;
    window.clearTimeout(seekTimer);
    seekTimer = window.setTimeout(() => {
      seeking = false;
      issueSeek();
    }, 400);
    video.currentTime = time;
  };
  const seek = (time: number) => {
    if (!scrub) return;
    // Al centro del cuadro, para que el redondeo no caiga en el anterior.
    const frame = Math.max(0, Math.round(time * FRAME_RATE));
    pendingTime = (frame + 0.5) / FRAME_RATE;
    if (!seeking) issueSeek();
  };
  const onSeeked = () => {
    window.clearTimeout(seekTimer);
    draw();
    seeking = false;
    issueSeek();
  };
  const onLoadedMetadata = () => {
    if (!seeking) issueSeek();
  };
  const onPlaying = () => {
    cancelFrame();
    scheduleFrame();
  };
  const syncPlayback = () => {
    cancelFrame();
    if (scrub) {
      video.pause();
      draw();
      return;
    }
    if (document.hidden || reducedMotion.matches || contextLost) {
      video.pause();
      if (reducedMotion.matches && Number.isFinite(video.duration)) {
        video.currentTime = Math.min(STILL_FRAME_TIME, video.duration);
      }
      draw();
    } else {
      play();
    }
  };
  const onLoaded = () => {
    draw();
    syncPlayback();
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
    cancelFrame();
    video.pause();
    onReady(false);
  };
  const onContextRestored = () => {
    contextLost = false;
    resources = createResources(gl);
    resize();
    syncPlayback();
  };
  const onError = () => {
    cancelFrame();
    onReady(false);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  video.addEventListener("loadedmetadata", onLoadedMetadata);
  video.addEventListener("loadeddata", onLoaded);
  video.addEventListener("playing", onPlaying);
  video.addEventListener("seeked", onSeeked);
  video.addEventListener("error", onError);
  document.addEventListener("visibilitychange", syncPlayback);
  window.addEventListener("pointerdown", play, { passive: true });
  reducedMotion.addEventListener("change", syncPlayback);
  video.muted = true;
  resize();
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onLoaded();
  else play();

  const dispose = () => {
    stopped = true;
    cancelFrame();
    observer.disconnect();
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    window.clearTimeout(seekTimer);
    video.removeEventListener("loadedmetadata", onLoadedMetadata);
    video.removeEventListener("loadeddata", onLoaded);
    video.removeEventListener("playing", onPlaying);
    video.removeEventListener("seeked", onSeeked);
    video.removeEventListener("error", onError);
    document.removeEventListener("visibilitychange", syncPlayback);
    window.removeEventListener("pointerdown", play);
    reducedMotion.removeEventListener("change", syncPlayback);
    video.pause();
    if (!contextLost) resources.dispose();
  };

  return { dispose, seek };
}
