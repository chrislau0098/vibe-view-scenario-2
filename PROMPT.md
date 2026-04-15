# AutoRadar — Complete Site Reconstruction Prompt

You are a senior frontend engineer. Your task is to build a complete single-page product showcase website from scratch using the exact specification below. The output must be **100% faithful** to the original design — every font size, spacing value, color token, animation parameter, and WebGL shader must match exactly.

## Requirements

1. Write all code into a **single file: `src/App.tsx`**. Do not split into multiple component files.
2. All product data, images, and downloadable files come from a **Feishu (Lark) Base** at runtime. Do not hard-code any product content. Leave `image` and `dataSheetUrl` as empty strings `""` during scaffolding; they will be populated from the Feishu API response.
3. Reproduce the **WebGL ASCII canvas** effect exactly — the GLSL shader code below must be copied verbatim. Do not rewrite it.
4. Use **Tailwind CSS v4** (CSS-first, no `tailwind.config.js`) and **`motion/react`** for all animations. Never use string easing values; always use cubic-bezier arrays.
5. For hover animations involving scale transforms, use **`motion/react` variant propagation** — Tailwind v4's `scale-[x]` utility generates a standalone CSS `scale:` property that CSS `transition` cannot capture.
6. The `src/index.css` file must be created exactly as specified in Section 2.

---

## 1. Tech Stack

```bash
npm create vite@latest . -- --template react-ts
npm install motion @base-ui-components/react @fontsource-variable/geist
npm install -D tailwindcss@next @tailwindcss/vite tw-animate-css
npx shadcn@latest init   # select Tailwind v4 mode
```

**`vite.config.ts`** — add `@tailwindcss/vite` plugin and `@/` alias:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

**`tsconfig.app.json`** — add paths and suppress deprecation warnings:
```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] },
    "ignoreDeprecations": "6.0"
  }
}
```

---

## 2. `src/index.css` — Complete (copy verbatim)

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@fontsource-variable/geist";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: 'Geist Variable', sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, monospace;
  --color-background:         var(--background);
  --color-foreground:         var(--foreground);
  --color-card:               var(--card);
  --color-card-foreground:    var(--card-foreground);
  --color-muted:              var(--muted);
  --color-muted-foreground:   var(--muted-foreground);
  --color-border:             var(--border);
  --color-input:              var(--input);
  --color-primary:            var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-ring:               var(--ring);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
}

:root {
  --background:         oklch(99% 0 0);
  --foreground:         oklch(11% 0.005 60);
  --card:               oklch(97.5% 0 0);
  --card-foreground:    oklch(11% 0.005 60);
  --muted:              oklch(95% 0 0);
  --muted-foreground:   oklch(42% 0 0);
  --border:             oklch(90% 0 0);
  --input:              oklch(90% 0 0);
  --primary:            oklch(11% 0.005 60);
  --primary-foreground: oklch(99% 0 0);
  --ring:               oklch(11% 0.005 60);
  --radius:             0.125rem;
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
  html { @apply font-sans; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Design language:** near-white `oklch(99% 0 0)` background, near-black `oklch(11% 0.005 60)` text, zero chroma. No accent colors, no rounded corners (`--radius: 0.125rem` is essentially sharp). B&O / Bang & Olufsen precision aesthetic.

---

## 3. `src/App.tsx` — Complete (copy verbatim)

```tsx
import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { Dialog } from '@base-ui-components/react/dialog'

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type ProductCategory =
  | '传感器' | '核心处理部件' | '发射接收部件' | '辅助设备'
  | '激光雷达' | '毫米波雷达' | '组合导航系统' | '机器人控制器'

type ProductStatusTag = '样品' | '量产' | '在售' | '停产'

interface Product {
  id: string
  name: string
  code: string
  category: ProductCategory
  status: ProductStatusTag[]
  price: number
  tagline: string
  industry: string
  image: string       // tmp_url from Feishu attachment field; '' while loading
  keyParams: string   // '；'-delimited "label：value" pairs
  detailSpecs: string
  dataSheetUrl?: string  // tmp_url from Feishu attachment field; omit if empty
}

// ─────────────────────────────────────────────────────────────
// FEISHU DATA SOURCE
// Base token : YOegbLb4SaifeCsAjRjchRx1n5c
// Table ID   : tblyf2dtGWcr30JJ
// Auth token : set VITE_FEISHU_ACCESS_TOKEN in .env
// ─────────────────────────────────────────────────────────────

const FEISHU_BASE = 'https://open.feishu.cn/open-apis'
const APP_TOKEN  = 'YOegbLb4SaifeCsAjRjchRx1n5c'
const TABLE_ID   = 'tblyf2dtGWcr30JJ'

// Feishu bitable attachment fields return [{tmp_url, file_token, name, size}]
// tmp_url is a time-limited public URL — use it directly as <img src>
// It does NOT require an Authorization header.

function getAttachmentUrl(field: unknown): string {
  if (!Array.isArray(field) || field.length === 0) return ''
  return (field[0] as { tmp_url?: string }).tmp_url ?? ''
}

function getTextValue(field: unknown): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'number') return String(field)
  if (Array.isArray(field)) return field.map((v: any) => v.text ?? v).join('')
  return String(field)
}

function getNumber(field: unknown): number {
  return typeof field === 'number' ? field : parseFloat(String(field)) || 0
}

function getMultiSelect(field: unknown): string[] {
  if (!field) return []
  if (Array.isArray(field)) return field.map((v: any) => v.text ?? v)
  return [(field as any).text ?? field]
}

function mapRecord(fields: Record<string, unknown>): Product | null {
  const id   = getTextValue(fields['产品编号'] ?? fields['ID'])
  const name = getTextValue(fields['产品名称'])
  if (!id || !name) return null
  return {
    id,
    name,
    code:         getTextValue(fields['产品编号'] ?? fields['code']),
    category:     getTextValue(fields['产品线'] ?? fields['分类']) as ProductCategory,
    status:       getMultiSelect(fields['状态']) as ProductStatusTag[],
    price:        getNumber(fields['销售价格'] ?? fields['价格']),
    tagline:      getTextValue(fields['产品信息'] ?? fields['tagline']),
    industry:     getTextValue(fields['应用行业']),
    image:        getAttachmentUrl(fields['产品图片']),
    keyParams:    getTextValue(fields['关键参数']),
    detailSpecs:  getTextValue(fields['详细规格']),
    dataSheetUrl: getAttachmentUrl(fields['资料下载']) || undefined,
  }
}

async function fetchAllProducts(): Promise<Product[]> {
  const token = (import.meta as any).env?.VITE_FEISHU_ACCESS_TOKEN as string
  if (!token) {
    console.warn('[Feishu] VITE_FEISHU_ACCESS_TOKEN not set — returning empty product list')
    return []
  }
  const headers = { 'Authorization': `Bearer ${token}` }
  const results: Product[] = []
  let pageToken = ''

  do {
    const url = `${FEISHU_BASE}/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records?page_size=100${pageToken ? `&page_token=${pageToken}` : ''}`
    const res  = await fetch(url, { headers })
    const data = await res.json()
    if (data.code !== 0) { console.error('[Feishu] API error:', data.msg); break }
    for (const item of data.data.items) {
      const p = mapRecord(item.fields)
      if (p) results.push(p)
    }
    pageToken = data.data.has_more ? data.data.page_token : ''
  } while (pageToken)

  return results
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function parseKeyParams(raw: string): { label: string; value: string }[] {
  if (!raw) return []
  return raw.split('；').map(pair => {
    const i = pair.indexOf('：')
    if (i === -1) return null
    return { label: pair.slice(0, i).trim(), value: pair.slice(i + 1).trim() }
  }).filter(Boolean) as { label: string; value: string }[]
}

// ─────────────────────────────────────────────────────────────
// WEBGL ASCII CANVAS
// Architecture: glyph atlas pre-rendered on Canvas 2D, uploaded
// as a WebGL texture. One draw call per frame — zero CPU fillText.
// ─────────────────────────────────────────────────────────────

const CHARS      = ['.', ':', '-', '=', '+', '*', '#', '%', '@', '0', '1']
const CHAR_COUNT = 11
const CELL_W     = 8   // CSS px
const CELL_H     = 12  // CSS px
const ATLAS_SCALE = 2  // render atlas at 2× for retina sharpness

function buildGlyphAtlas(): HTMLCanvasElement {
  const canvas  = document.createElement('canvas')
  canvas.width  = CHAR_COUNT * CELL_W * ATLAS_SCALE   // 176 px
  canvas.height = CELL_H * ATLAS_SCALE                  // 24 px
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle    = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font         = `${9 * ATLAS_SCALE}px "Geist Mono", ui-monospace, monospace`
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle    = '#000000'
  CHARS.forEach((ch, i) =>
    ctx.fillText(ch, (i + 0.5) * CELL_W * ATLAS_SCALE, (CELL_H * ATLAS_SCALE) / 2)
  )
  return canvas
}

// Vertex shader — full-screen quad passthrough
const VERT_SRC = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`

// Fragment shader — DO NOT MODIFY — mathematical precision required
const FRAG_SRC = `
precision mediump float;
uniform float     u_time;
uniform vec2      u_resolution;
uniform float     u_dpr;
uniform sampler2D u_atlas;

float hash(vec2 p) {
  p = fract(p * vec2(0.1031, 0.1030));
  p += dot(p, p.yx + 33.33);
  return fract((p.x + p.y) * p.x);
}

float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
  return mix(mix(hash(i),           hash(i+vec2(1,0)), u.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  mat2 rot = mat2(0.8,-0.6, 0.6,0.8);
  for (int i = 0; i < 4; i++) {
    v   += amp * vnoise(p);
    p    = rot * p * 2.0;
    amp *= 0.5;
  }
  return v / 0.9375;
}

const float CELL_W_CSS = 8.0;
const float CELL_H_CSS = 12.0;
const float CHAR_N     = 11.0;

void main() {
  float cW = CELL_W_CSS * u_dpr;
  float cH = CELL_H_CSS * u_dpr;
  vec2 cellIdx  = floor(gl_FragCoord.xy / vec2(cW, cH));
  vec2 cellFrac = fract(gl_FragCoord.xy / vec2(cW, cH));

  vec2  nCells = floor(u_resolution / vec2(cW, cH));
  float aspect = u_resolution.x / u_resolution.y;
  float vx = (cellIdx.x / nCells.x) * aspect;
  float vy =  cellIdx.y / nCells.y;

  float t    = u_time * 0.12;
  float px   = vx * 2.2;
  float py   = vy * 2.2;
  float warp = fbm(vec2(px + t*0.18, py + t*0.12)) - 0.5;
  float wx   = px + warp*1.8 + t*0.28;
  float wy   = py - warp*1.4 + t*0.18;
  float raw  = fbm(vec2(wx, wy));

  float s      = smoothstep(0.18, 0.72, raw);
  float shaped = pow(s, 1.8);

  vec3 bg = vec3(0.992);
  if (shaped <= 0.01) { gl_FragColor = vec4(bg, 1.0); return; }

  float charIdx  = min(floor(shaped * CHAR_N), CHAR_N - 1.0);
  float dotAlpha = shaped * 0.32;
  float atlasU   = (charIdx + cellFrac.x) / CHAR_N;
  float atlasV   = cellFrac.y;
  float ink      = 1.0 - texture2D(u_atlas, vec2(atlasU, atlasV)).r;

  gl_FragColor = vec4(mix(bg, vec3(0.0), ink * dotAlpha), 1.0);
}
`

function ASCIIBeamsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS))
        console.error('[ASCII] shader error:', gl!.getShaderInfoLog(s))
      return s
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT_SRC))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG_SRC))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      console.error('[ASCII] link error:', gl.getProgramInfoLog(prog))
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime  = gl.getUniformLocation(prog, 'u_time')
    const uRes   = gl.getUniformLocation(prog, 'u_resolution')
    const uDpr   = gl.getUniformLocation(prog, 'u_dpr')
    const uAtlas = gl.getUniformLocation(prog, 'u_atlas')

    // Upload glyph atlas — UNPACK_FLIP_Y corrects canvas (top-left) vs WebGL (bottom-left) Y origin
    const atlasCanvas = buildGlyphAtlas()
    const tex = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.uniform1i(uAtlas, 0)

    let animId: number
    const start = performance.now()

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas!.width  = canvas!.offsetWidth  * dpr
      canvas!.height = canvas!.offsetHeight * dpr
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
      gl!.uniform1f(uDpr, dpr)
    }

    function draw() {
      gl!.uniform1f(uTime, (performance.now() - start) / 1000)
      gl!.uniform2f(uRes, canvas!.width, canvas!.height)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      animId = requestAnimationFrame(draw)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    animId = requestAnimationFrame(draw)

    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}

// ─────────────────────────────────────────────────────────────
// SITENAV
// ─────────────────────────────────────────────────────────────

function SiteNav() {
  return (
    <motion.header
      className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] as const }}
    >
      <div className="max-w-7xl mx-auto px-6 h-[100px] grid grid-cols-3 items-center">
        <nav className="flex items-center gap-8">
          {['产品系列', '技术规格', '应用场景'].map((label) => (
            <a
              key={label}
              href="#"
              className="group relative text-[11px] tracking-[2px] uppercase text-foreground/70 hover:text-foreground transition-colors duration-300"
            >
              {label}
              <span className="absolute bottom-0 left-0 w-full h-px bg-foreground scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400" />
            </a>
          ))}
        </nav>
        <div className="text-center">
          <a href="/" className="text-[16px] tracking-[4px] uppercase font-light text-foreground">
            AutoRadar
          </a>
        </div>
        <div className="flex justify-end">
          <a
            href="#contact"
            className="group relative text-[11px] tracking-[2px] uppercase text-foreground/70 hover:text-foreground transition-colors duration-300"
          >
            联系我们
            <span className="absolute bottom-0 left-0 w-full h-px bg-foreground scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400" />
          </a>
        </div>
      </div>
    </motion.header>
  )
}

// ─────────────────────────────────────────────────────────────
// SITEHERO
// ─────────────────────────────────────────────────────────────

function SiteHero() {
  return (
    <section className="relative min-h-screen bg-background flex items-center justify-center pt-16 overflow-hidden">
      <ASCIIBeamsCanvas />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 40%, oklch(99% 0 0) 30%, oklch(99% 0 0 / 0) 100%)',
        }}
      />
      <motion.div
        className="relative z-10 text-center mx-auto px-6 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <p className="text-[11px] tracking-[4px] uppercase text-muted-foreground">
          Automotive Radar · Precision Components
        </p>
        <h1
          className="font-light tracking-[-1px] text-foreground leading-tight"
          style={{ fontSize: 'clamp(48px, 6vw, 80px)' }}
        >
          精密雷达感知
          <br />
          驱动智驾未来
        </h1>
        <p className="text-[15px] font-light text-foreground/70 leading-relaxed whitespace-nowrap">
          专注汽车雷达核心部件研发与制造，以毫米级精度重新定义主动安全边界。
        </p>
        <div className="flex items-center justify-center gap-8 pt-2">
          <a
            href="#products"
            className="text-[12px] tracking-[2px] uppercase border-b border-foreground pb-0.5 text-foreground hover:text-muted-foreground transition-colors duration-300"
          >
            浏览产品系列
          </a>
          <a
            href="mailto:sales@autoradar.cn"
            className="text-[12px] tracking-[2px] uppercase text-muted-foreground border-b border-muted-foreground pb-0.5 hover:text-foreground hover:border-foreground transition-colors duration-300"
          >
            联系销售团队
          </a>
        </div>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// CATEGORYSHOWCASE
// Displays one representative product per category, in the order
// defined below. If a category has no products, it is skipped.
// ─────────────────────────────────────────────────────────────

const CATEGORY_ORDER: ProductCategory[] = [
  '传感器', '核心处理部件', '发射接收部件',
  '激光雷达', '毫米波雷达', '组合导航系统', '机器人控制器',
]

function CategoryShowcase({
  products,
  onProductClick,
}: {
  products: Product[]
  onProductClick: (p: Product) => void
}) {
  const showcaseProducts = CATEGORY_ORDER
    .map((cat) => products.find((p) => p.category === cat))
    .filter((p): p is Product => p !== undefined)

  return (
    <section id="products" className="bg-background py-24">
      <div className="max-w-7xl mx-auto px-6 mb-12 space-y-2">
        <p className="text-[11px] tracking-[3px] uppercase text-muted-foreground">Products</p>
        <h2 className="text-2xl font-light tracking-tight text-foreground">产品系列</h2>
      </div>
      <motion.div
        className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-0.5"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] as const }}
      >
        {showcaseProducts.map((product, i) => (
          <motion.button
            key={product.id}
            onClick={() => onProductClick(product)}
            className={`flex flex-col bg-background cursor-pointer text-left w-full${i === 0 ? ' col-span-2' : ''}`}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <div
              className={`relative overflow-hidden${i === 0 ? ' aspect-[3/2]' : ' aspect-[3/4] bg-muted'}`}
              style={i === 0 ? { backgroundColor: '#F7F7F7' } : undefined}
            >
              {product.image ? (
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
                  transition={{ duration: 0.28, ease: [0.45, 0, 0.55, 1] as const }}
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </div>
            <div className="px-1 pt-3 pb-4 space-y-0.5">
              <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">{product.category}</p>
              <p className="text-[14px] font-light text-foreground tracking-wide relative inline-block">
                {product.name}
                <motion.span
                  className="absolute bottom-0 left-0 h-px w-full bg-foreground"
                  style={{ originX: 0 }}
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const }}
                />
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// QUOTESECTION
// ─────────────────────────────────────────────────────────────

function QuoteSection() {
  return (
    <section className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.p
          className="font-light tracking-[-1px] text-foreground/80"
          style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] as const }}
        >
          感知每一毫米的精度
        </motion.p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// PRODUCTFEATURE
// Shows one product per featured category, left-right alternating.
// Image col : text col = 8fr : 6fr
// ─────────────────────────────────────────────────────────────

const FEATURED_CATEGORIES: ProductCategory[] = [
  '传感器', '核心处理部件', '激光雷达', '毫米波雷达', '组合导航系统',
]

function ProductFeature({
  products,
  onProductClick,
}: {
  products: Product[]
  onProductClick: (p: Product) => void
}) {
  const featured = FEATURED_CATEGORIES
    .map((cat) => products.find((p) => p.category === cat))
    .filter((p): p is Product => p !== undefined)

  return (
    <section className="bg-card py-24">
      <div className="max-w-7xl mx-auto px-6 space-y-0">
        {featured.map((product, i) => {
          const isReversed = i % 2 === 1
          const bgNum = product.id.replace('AR-', '')
          return (
            <motion.div
              key={product.id}
              className={`relative overflow-hidden grid lg:grid-cols-[8fr_6fr] border-b border-border/20${isReversed ? ' lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] as const }}
            >
              <span
                className="absolute select-none pointer-events-none font-bold text-foreground opacity-[0.035] z-0 leading-none"
                style={{
                  fontSize: '180px',
                  bottom: '-20px',
                  right: isReversed ? 'auto' : '-20px',
                  left: isReversed ? '-20px' : 'auto',
                }}
              >
                {bgNum}
              </span>
              <div className="relative z-10 overflow-hidden bg-background min-h-[400px]">
                <button
                  className="w-full h-full block absolute inset-0"
                  onClick={() => onProductClick(product)}
                >
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </button>
              </div>
              <div className="relative z-10 px-12 lg:px-20 py-[200px] flex flex-col justify-center space-y-6 bg-card">
                <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">
                  {product.code} · {product.category}
                </p>
                <h3
                  className="font-light tracking-tight uppercase text-foreground leading-tight text-pretty"
                  style={{ fontSize: 'clamp(24px, 2.4vw, 38px)' }}
                >
                  {product.name}
                </h3>
                <div className="border-t border-border">
                  {parseKeyParams(product.keyParams).slice(0, 4).map((param) => (
                    <div key={param.label} className="flex justify-between items-start border-b border-border py-4 gap-4">
                      <span className="text-[11px] leading-[1.5] tracking-[2px] uppercase text-muted-foreground shrink-0">
                        {param.label}
                      </span>
                      <span className="text-[13px] leading-[1.5] font-light text-foreground text-right">
                        {param.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex items-center gap-8">
                  <button
                    onClick={() => onProductClick(product)}
                    className="text-[14px] tracking-[2px] uppercase border-b border-foreground pb-px text-foreground hover:text-muted-foreground hover:border-muted-foreground transition-colors duration-300"
                  >
                    查看详情
                  </button>
                  <a
                    href={`mailto:sales@autoradar.cn?subject=询价：${product.name}（${product.code}）`}
                    className="text-[14px] tracking-[2px] uppercase text-muted-foreground border-b border-muted-foreground pb-px hover:text-foreground hover:border-foreground transition-colors duration-300"
                  >
                    询价咨询
                  </a>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// CONTACTSECTION
// ─────────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" className="bg-background py-24 border-t border-border/20">
      <motion.div
        className="max-w-2xl mx-auto px-6 text-center space-y-8"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] as const }}
      >
        <p className="text-[11px] tracking-[3px] uppercase text-muted-foreground">Contact</p>
        <h2 className="text-2xl font-light tracking-tight text-foreground">需要报价或技术咨询？</h2>
        <p className="text-[14px] text-muted-foreground font-light leading-relaxed">
          我们的销售工程师团队将在一个工作日内回复，提供专属的技术方案与报价。
        </p>
        <div className="flex justify-center gap-8 pt-2">
          <a
            href="mailto:sales@autoradar.cn"
            className="text-[12px] tracking-[2px] uppercase border-b border-foreground pb-px text-foreground hover:text-muted-foreground hover:border-muted-foreground transition-colors duration-300"
          >
            发送邮件咨询
          </a>
          <a
            href="tel:+86-400-000-0000"
            className="text-[12px] tracking-[2px] uppercase text-muted-foreground border-b border-muted-foreground pb-px hover:text-foreground hover:border-foreground transition-colors duration-300"
          >
            电话：400-000-0000
          </a>
        </div>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SITEFOOTER
// ─────────────────────────────────────────────────────────────

function SiteFooter() {
  return (
    <footer className="border-t border-border/20 py-12">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[12px] tracking-[3px] uppercase font-light text-foreground">AutoRadar</p>
          <p className="text-[11px] text-muted-foreground">汽车雷达核心部件 · 精密感知技术</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[11px] text-muted-foreground tracking-wide">© 2026 AutoRadar. All rights reserved.</p>
          <p className="text-[11px] text-muted-foreground/60">数据来源：飞书多维表格 · 产品管理</p>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────
// PRODUCTMODAL
// ─────────────────────────────────────────────────────────────

function ProductModal({
  product,
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  return (
    <Dialog.Root open={product !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-[60]" />
        <Dialog.Popup className="fixed inset-0 z-[61] flex items-center justify-center p-4 md:p-10 overflow-y-auto">
          {product && (
            <motion.div
              className="bg-background w-full max-w-5xl max-h-[92vh] overflow-y-auto"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.165, 0.84, 0.44, 1] as const }}
            >
              {/* Sticky header */}
              <div className="sticky top-0 z-10 bg-background px-10 md:px-14 pt-10 pb-7 flex items-start justify-between border-b border-border/20">
                <div className="space-y-1.5">
                  <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">
                    {product.code} · {product.category}
                  </p>
                  <h2 className="text-2xl font-light tracking-tight text-foreground leading-snug">
                    {product.name}
                  </h2>
                </div>
                <Dialog.Close className="text-[11px] tracking-[2px] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 mt-1 shrink-0 ml-8">
                  关闭
                </Dialog.Close>
              </div>

              {/* Body */}
              <div className="grid md:grid-cols-2">
                {/* Image panel */}
                <div className="bg-card p-10 flex items-center justify-center min-h-[380px]">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full max-h-[440px] object-contain" />
                  ) : (
                    <div className="w-full h-[440px] bg-muted" />
                  )}
                </div>

                {/* Content panel */}
                <div className="px-10 md:px-14 py-14 flex flex-col gap-10">
                  <p className="text-[13px] text-muted-foreground font-light leading-relaxed">
                    {product.tagline.split('。')[0]}。
                  </p>

                  {parseKeyParams(product.keyParams).length > 0 && (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-0 border-t border-border">
                      {parseKeyParams(product.keyParams).map((param) => (
                        <div key={param.label} className="py-3 border-b border-border/40">
                          <p className="text-[10px] tracking-[2px] uppercase text-muted-foreground leading-none mb-2.5">
                            {param.label}
                          </p>
                          <p className="text-[14px] font-light text-foreground leading-snug">
                            {param.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] tracking-[2px] uppercase text-muted-foreground">参考价格</p>
                    <p className="text-[18px] font-light text-foreground mt-1">
                      ¥{product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-8 border-t border-border/30 pt-6">
                    {product.dataSheetUrl && (
                      <a
                        href={product.dataSheetUrl}
                        download
                        className="text-[11px] tracking-[2px] uppercase text-muted-foreground border-b border-muted-foreground pb-px hover:text-foreground hover:border-foreground transition-colors duration-200"
                      >
                        下载资料
                      </a>
                    )}
                    <a
                      href={`mailto:sales@autoradar.cn?subject=询价：${product.name}（${product.code}）`}
                      className="text-[11px] tracking-[2px] uppercase text-foreground border-b border-foreground pb-px hover:text-muted-foreground hover:border-muted-foreground transition-colors duration-200"
                    >
                      询价咨询
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ─────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────

export default function App() {
  const [products, setProducts]           = useState<Product[]>([])
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchAllProducts().then(setProducts).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteNav />
      <main>
        <SiteHero />
        <CategoryShowcase products={products} onProductClick={setActiveProduct} />
        <QuoteSection />
        <ProductFeature products={products} onProductClick={setActiveProduct} />
        <ContactSection />
      </main>
      <SiteFooter />
      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </div>
  )
}
```

---

## 4. Environment Variable

Create `.env` in project root:

```
VITE_FEISHU_ACCESS_TOKEN=your_feishu_user_or_app_access_token
```

The Feishu access token is used to authenticate requests to the Base API. The product images use `tmp_url` from the attachment field response — these are temporary public URLs that do **not** require the Authorization header and can be used directly in `<img src>`.

---

## 5. Known Pitfalls

| Issue | Cause | Fix |
|---|---|---|
| Blank canvas, no error | GLSL variable named `half`, `input`, or `output` — reserved keywords | Rename variable; always log `gl.getShaderInfoLog()` |
| Characters appear upside-down | Missing `UNPACK_FLIP_Y_WEBGL` before `texImage2D` | Already in the code above — do not remove it |
| Hover scale animation does nothing | Tailwind v4 `scale-[x]` generates CSS `scale:` not `transform: scale()` | Use `motion/react` variant propagation as shown above |
| No products loaded | `VITE_FEISHU_ACCESS_TOKEN` not set | Add to `.env` and restart dev server |
| Feishu API 403 on images | Using drive `+download` shortcut on bitable attachments | Use `tmp_url` from the record's attachment field directly |
