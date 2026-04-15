import { useEffect, useRef } from 'react'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CHARS = ['.', ':', '-', '=', '+', '*', '#', '%', '@', '0', '1'] as const
const CHAR_COUNT = CHARS.length   // 11

// Cell dimensions in CSS pixels (must match FRAG shader constants)
const CELL_W = 8
const CELL_H = 12
const FONT_SIZE = 9

// Glyph atlas rendered at 2× for retina sharpness
const ATLAS_SCALE = 2
const ATLAS_TILE_W = CELL_W * ATLAS_SCALE   // 16 px per tile
const ATLAS_TILE_H = CELL_H * ATLAS_SCALE   // 24 px per tile

// ---------------------------------------------------------------------------
// Glyph atlas — render all chars once to a Canvas 2D, then upload to GPU
// ---------------------------------------------------------------------------
function buildGlyphAtlas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width  = CHAR_COUNT * ATLAS_TILE_W
  canvas.height = ATLAS_TILE_H

  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font         = `${FONT_SIZE * ATLAS_SCALE}px "Geist Mono", ui-monospace, monospace`
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle    = '#000000'
  CHARS.forEach((ch, i) => ctx.fillText(ch, (i + 0.5) * ATLAS_TILE_W, ATLAS_TILE_H / 2))

  return canvas
}

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------
const VERT = /* glsl */`
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAG = /* glsl */`
precision mediump float;
uniform float     u_time;
uniform vec2      u_resolution;  /* physical pixels */
uniform float     u_dpr;
uniform sampler2D u_atlas;

/* ── mediump-stable hash ──────────────────────────────────────────── */
float hash(vec2 p) {
  p = fract(p * vec2(0.1031, 0.1030));
  p += dot(p, p.yx + 33.33);
  return fract((p.x + p.y) * p.x);
}

/* ── bilinear value noise with quintic smoothstep ─────────────────── */
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
  return mix(mix(hash(i),           hash(i+vec2(1,0)), u.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}

/* ── 4-octave FBM with 37° rotation (prevents axis-aligned banding) ─ */
float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  mat2  rot = mat2(0.8,-0.6, 0.6,0.8);
  for (int i = 0; i < 4; i++) {
    v   += amp * vnoise(p);
    p    = rot * p * 2.0;
    amp *= 0.5;
  }
  return v / 0.9375;
}

/* ── Cell layout (must match JS constants) ────────────────────────── */
const float CELL_W_CSS  = 8.0;
const float CELL_H_CSS  = 12.0;
const float CHAR_N      = 11.0;

void main() {
  /* ── Cell index and intra-cell fraction ───────────────────────── */
  float cW       = CELL_W_CSS * u_dpr;
  float cH       = CELL_H_CSS * u_dpr;
  vec2  cellIdx  = floor(gl_FragCoord.xy / vec2(cW, cH));
  vec2  cellFrac = fract(gl_FragCoord.xy / vec2(cW, cH));

  /* ── Normalised cell UV (aspect-corrected) ────────────────────── */
  vec2  nCells = floor(u_resolution / vec2(cW, cH));
  float aspect = u_resolution.x / u_resolution.y;
  float vx     = (cellIdx.x / nCells.x) * aspect;
  float vy     =  cellIdx.y / nCells.y;

  /* ── Domain-warped FBM — identical params to ASCIIBeamsCanvas.tsx ─
     t          = elapsed * 0.88
     warp layer = fbm(p + t*{0.18,0.12}) − 0.5
     main field = fbm(warped + t*{0.28,0.18})
  ────────────────────────────────────────────────────────────────── */
  float t    = u_time * 0.88;
  float px   = vx * 2.2;
  float py   = vy * 2.2;
  float warp = fbm(vec2(px + t*0.18, py + t*0.12)) - 0.5;
  float wx   = px + warp*1.8 + t*0.28;
  float wy   = py - warp*1.4 + t*0.18;
  float raw  = fbm(vec2(wx, wy));

  /* ── Contrast shaping (same as JS) ───────────────────────────── */
  float s      = smoothstep(0.18, 0.72, raw);
  float shaped = pow(s, 1.8);

  vec3 bg = vec3(0.992);
  if (shaped <= 0.01) {
    gl_FragColor = vec4(bg, 1.0);
    return;
  }

  /* ── Character selection + alpha ──────────────────────────────── */
  float charIdx  = min(floor(shaped * CHAR_N), CHAR_N - 1.0);
  float dotAlpha = shaped * 0.32;

  /* ── Sample glyph atlas ───────────────────────────────────────── */
  // Atlas is horizontally tiled: char i occupies u ∈ [i/N, (i+1)/N]
  // UNPACK_FLIP_Y_WEBGL=true → canvas-top maps to v=1, so no V flip needed
  float atlasU = (charIdx + cellFrac.x) / CHAR_N;
  float atlasV = cellFrac.y;
  float ink    = 1.0 - texture2D(u_atlas, vec2(atlasU, atlasV)).r;

  gl_FragColor = vec4(mix(bg, vec3(0.0), ink * dotAlpha), 1.0);
}
`

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ASCIIBeamsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    /* ── Compile shaders ──────────────────────────────────────── */
    function compile(type: number, src: string) {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error('[ASCII] shader error:', gl.getShaderInfoLog(s))
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER,   VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      console.error('[ASCII] link error:', gl.getProgramInfoLog(prog))
    gl.useProgram(prog)

    /* ── Full-screen quad ─────────────────────────────────────── */
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    /* ── Uniforms ─────────────────────────────────────────────── */
    const uTime  = gl.getUniformLocation(prog, 'u_time')
    const uRes   = gl.getUniformLocation(prog, 'u_resolution')
    const uDpr   = gl.getUniformLocation(prog, 'u_dpr')
    const uAtlas = gl.getUniformLocation(prog, 'u_atlas')

    /* ── Glyph atlas texture ──────────────────────────────────── */
    const atlasCanvas = buildGlyphAtlas()
    const tex = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)   // canvas-top → v=1
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.uniform1i(uAtlas, 0)

    /* ── Resize + draw loop ───────────────────────────────────── */
    let animId: number
    const start = performance.now()

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform1f(uDpr, dpr)
    }

    function draw() {
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animId = requestAnimationFrame(draw)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
