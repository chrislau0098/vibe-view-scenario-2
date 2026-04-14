import { useEffect, useRef } from 'react'

const VERT = /* glsl */`
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAG = /* glsl */`
precision mediump float;
uniform float u_time;
uniform vec2  u_resolution;
uniform float u_dpr;

/* ── precision-stable hash (mediump friendly) ─────────────────── */
float hash(vec2 p) {
  p = fract(p * vec2(0.1031, 0.1030));
  p += dot(p, p.yx + 33.33);
  return fract((p.x + p.y) * p.x);
}

/* ── bilinear value noise with quintic smoothstep ─────────────── */
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(hash(i),               hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

/* ── FBM 4 octaves — rotation removes axis-aligned banding ───── */
float fbm(vec2 p) {
  float v   = 0.0;
  float amp = 0.5;
  mat2  rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v   += amp * vnoise(p);
    p    = rot * p * 2.0;
    amp *= 0.5;
  }
  return v / 0.9375;  // normalise to [0, 1]
}

void main() {
  vec2  fc  = gl_FragCoord.xy;
  vec2  uv  = vec2(fc.x, u_resolution.y - fc.y) / u_resolution;

  // Aspect-correct so beams are round rather than stretched
  float aspect = u_resolution.x / u_resolution.y;
  vec2  uvA    = vec2(uv.x * aspect, uv.y);

  // Scroll through noise space — genuine drift, no visible period
  float t = u_time * 0.08;
  vec2  p = uvA * 2.8 + vec2(t * 0.9, t * 0.55);

  // Raw FBM then contrast shaping: beam zones emerge sharply
  float raw    = fbm(p);
  float shaped = smoothstep(0.44, 0.70, raw);  // below 44 % → pure dark
  shaped        = pow(shaped, 2.0);             // crush midtones, punch peaks

  // Dot grid — 15 CSS px cell, dot radius scales with beam intensity
  float cellSz  = 15.0 * u_dpr;
  float dotRad  = mix(0.2, 2.1, shaped) * u_dpr;  // 0.2 px (sub-pixel) → 2.1 px
  vec2  fromCtr = abs(fract(fc / cellSz) - 0.5) * cellSz;
  float isDot   = step(fromCtr.x, dotRad) * step(fromCtr.y, dotRad);

  float dotAlpha = shaped * 0.58;  // 0 in dark zones, 0.58 at peak

  vec3 bg     = vec3(0.992);                     // #FDFDFD
  vec3 dotCol = vec3(0.118, 0.110, 0.102);       // warm near-black

  gl_FragColor = vec4(mix(bg, dotCol, isDot * dotAlpha), 1.0);
}
`

export function PixelBeamsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    function compileShader(type: number, src: string) {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('[PixelBeams] shader error:', gl.getShaderInfoLog(s))
      }
      return s
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[PixelBeams] link error:', gl.getProgramInfoLog(prog))
    }
    gl.useProgram(prog)

    // Full-screen quad
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes  = gl.getUniformLocation(prog, 'u_resolution')
    const uDpr  = gl.getUniformLocation(prog, 'u_dpr')

    let animId: number
    const start = performance.now()

    function resize() {
      const dpr = window.devicePixelRatio
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
