# AutoRadar — Design Prompt for Full Site Reconstruction

You are a senior frontend engineer. Your task is to reconstruct a complete single-page product showcase website pixel-for-pixel from this specification. Follow every instruction precisely. Do not add features, introduce new styles, or deviate from the values given.

---

## 1. Tech Stack

Install exactly the following (do not add others):

```
react@18, vite, typescript
tailwindcss@4 via @tailwindcss/vite  (NO tailwind.config.js — CSS-first config only)
motion  (import { motion } from 'motion/react')
@base-ui-components/react  (import { Dialog } from '@base-ui-components/react/dialog')
@fontsource-variable/geist
shadcn/ui  (Tailwind v4 mode, run: npx shadcn@latest init)
```

Path alias: `@/` → `./src/` — configure in both `vite.config.ts` and `tsconfig.app.json`.

`tsconfig.app.json` must include `"ignoreDeprecations": "6.0"`.

---

## 2. Global Styles — `src/index.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@fontsource-variable/geist";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: 'Geist Variable', sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, monospace;
  --color-background:       var(--background);
  --color-foreground:       var(--foreground);
  --color-card:             var(--card);
  --color-card-foreground:  var(--card-foreground);
  --color-muted:            var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border:           var(--border);
  --color-primary:          var(--primary);
  --color-primary-foreground: var(--primary-foreground);
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

**Design language:** near-white background (`oklch(99% 0 0)` ≈ `#FDFDFD`), near-black text, zero chroma — fully monochromatic B&O/Bang & Olufsen precision aesthetic. No accent colors, no gradients on content, no rounded corners (`radius: 0.125rem` is essentially sharp).

---

## 3. Animation Rules (apply everywhere)

- **`ease` must always be a cubic-bezier array — never a string:**
  - Standard enter: `[0.165, 0.84, 0.44, 1]`
  - Fast snap: `[0.45, 0, 0.55, 1]`
  - Gentle: `[0.25, 0.1, 0.25, 1]`
- Hero content uses `animate`. All other sections use `whileInView` with `viewport={{ once: true, margin: '-60px' }}`.
- **Critical — Tailwind v4 hover scale incompatibility:** `scale-[x]` in Tailwind v4 generates a standalone CSS `scale:` property, not `transform: scale()`. CSS transitions on `transform` will silently fail to capture it. **All hover scale/transform animations must use `motion/react` variant propagation:**
  - Parent button: `<motion.button initial="rest" animate="rest" whileHover="hover">`
  - Children: `<motion.img variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }} transition={{ duration: 0.28, ease: [0.45, 0, 0.55, 1] }}>`
  - Variant name `"hover"` propagates automatically from parent to all descendants that declare `variants`.

---

## 4. Data Model — `src/data/products.ts`

> **Data source:** All product records, images, and downloadable files come from a Feishu (Lark) Base at runtime. The product table below is reference-only for field names and approximate values. The authoritative values are whatever the Feishu Base returns. Do not hard-code product data into the frontend — fetch it from the API layer.

```ts
export type ProductCategory =
  '传感器' | '核心处理部件' | '发射接收部件' | '辅助设备' |
  '激光雷达' | '毫米波雷达' | '组合导航系统' | '机器人控制器'

export type ProductStatusTag = '样品' | '量产' | '在售' | '停产'

export interface Product {
  id: string          // e.g. 'RF-7701L'
  name: string        // Chinese product name
  code: string        // Display code, e.g. 'AR - PJ003'
  category: ProductCategory
  status: ProductStatusTag[]
  price: number
  tagline: string     // Full product description (first sentence used in modal)
  industry: string
  image: string       // Resolved download URL from Feishu attachment — leave as '' during scaffolding
  keyParams: string   // '；'-delimited "label：value" pairs
  detailSpecs: string
  dataSheetUrl?: string  // Resolved download URL from Feishu attachment — leave as '' if not yet fetched
}

// Parses keyParams string into [{label, value}] array
// Split by '；', for each chunk split at first '：'
export function parseKeyParams(raw: string): { label: string; value: string }[]

export function isActive(p: Product): boolean {
  return p.status.includes('在售') && !p.status.includes('停产')
}

export const products: Product[] = [ /* 20 products */ ]
export const activeProducts = products.filter(isActive)
export const categories: ProductCategory[] = [ /* 8 in order */ ]
export const categoryGroups: Record<string, Product[]> = /* grouped by category */
```

**All 20 products** (id / name / category / price):

| id | name | category | price |
|----|------|----------|-------|
| RF-7701L | 77GHz 毫米波雷达发射模块 Lite | 传感器 | 5182.29 |
| RF-7702P | 77GHz 毫米波雷达发射模块 Pro | 传感器 | 8697.15 |
| RF-7905M | 79GHz 多通道同步发射模块 Max | 传感器 | 21742.86 |
| AR-PJ003 | 汽车雷达信号处理芯片 | 核心处理部件 | 1981.93 |
| AR-PJ004 | 激光雷达反射镜组件 | 核心处理部件 | 3605.27 |
| AR-PJ005 | 前碰撞预警雷达 | 核心处理部件 | 1738.60 |
| AR-PJ006 | 车载毫米波雷达天线 | 发射接收部件 | 7792.29 |
| AR-PJ007 | 盲点监测雷达传感器 | 发射接收部件 | 8907.15 |
| AR-PJ008 | 汽车雷达数据传输线 | 发射接收部件 | 5242.29 |
| AR-PJ009 | 自适应巡航雷达校准 | 辅助设备 | 4618.57 |
| AR-LR-001 | 车规级 120° 超远距激光雷达 Pro | 激光雷达 | 22192.56 |
| AR-LR-002 | 车规级 90° 中距激光雷达 Lite | 激光雷达 | 13555.42 |
| AR-LR-005 | 车规级 120° 超远距增强激光雷达 Max | 激光雷达 | 42885.43 |
| IR-LR-001 | 迷你型 360°×40° 室内导航激光雷达 Lite | 激光雷达 | 8636.85 |
| AR-MW-001 | 车规级 77GHz 前向毫米波雷达 Pro | 毫米波雷达 | 8426.85 |
| IR-MW-006 | 工业级 77GHz 室外避障毫米波雷达 | 毫米波雷达 | 8880.93 |
| INS-001 | 车规级组合惯导系统 Lite | 组合导航系统 | 14294.94 |
| INS-005 | 工业级组合惯导系统 Lite | 组合导航系统 | 16119.35 |
| RC-100L | 入门级移动机器人控制器 Lite | 机器人控制器 | 21442.86 |
| RC-300X | 高性能机器人控制器 Plus | 机器人控制器 | 52722.87 |

The table above is for reference only. Field values (name, price, keyParams, etc.) must come from the Feishu Base at runtime. Images and datasheet files are Feishu attachment fields — their download URLs must be resolved via the API (see Section 4.5). **Do not place any product images or datasheet files in `public/`.**

---

## 4.5 Feishu Base — Data Source

**Base:** `YOegbLb4SaifeCsAjRjchRx1n5c` · **Table:** `tblyf2dtGWcr30JJ`

### Field mapping (Feishu field name → Product interface key)

| Feishu Field | Type | Product key |
|---|---|---|
| ID / 产品编号 | Text | `id`, `code` |
| 产品名称 | Text | `name` |
| 产品线 / 分类 | Single-select | `category` |
| 状态 | Multi-select | `status` |
| 销售价格 | Number | `price` |
| 产品信息 | Long text | `tagline` |
| 应用行业 | Text | `industry` |
| 产品图片 | Attachment | `image` (resolved URL) |
| 关键参数 | Long text | `keyParams` |
| 详细规格 | Long text | `detailSpecs` |
| 资料下载 | Attachment | `dataSheetUrl` (resolved URL) |

### Image and file URL resolution

Product images and datasheet files are stored as Feishu attachment fields. Their download URLs are **not** returned directly by the record list API — you must resolve them separately:

```
GET /open-apis/drive/v1/medias/{file_token}/download
```

- `file_token` is found inside the attachment field value of each record
- The response is a binary stream; obtain a pre-signed URL or serve via proxy
- **Do not use `drive +download` shortcut** — it returns 403 for bitable attachments; use the raw API endpoint above
- During scaffolding / code generation, set `image: ''` and `dataSheetUrl: ''` as empty-string placeholders; the data-fetching layer will populate them at runtime

### Product data at runtime

- Fetch all records from the table using the Feishu Base API (`+record-list` or equivalent)
- Map each record to the `Product` interface using the field mapping above
- The number of products, their names, prices, and parameter values are determined entirely by what the Base contains — do not assume exactly 20 products or any specific field values

---

## 5. Page Architecture — `src/App.tsx`

```
<div min-h-screen bg-background text-foreground antialiased>
  <SiteNav />                              ← fixed, z-50
  <main>
    <SiteHero />
    <CategoryShowcase onProductClick />    ← id="products"
    <QuoteSection />
    <ProductFeature onProductClick />
    <ContactSection />                     ← id="contact"
  </main>
  <SiteFooter />
  <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
</div>
```

State: `const [activeProduct, setActiveProduct] = useState<Product | null>(null)` — pass `setActiveProduct` as `onProductClick` to CategoryShowcase and ProductFeature.

---

## 6. Components

### 6.1 SiteNav

- Container: `fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm`
- Inner: `max-w-7xl mx-auto px-6 h-[100px] grid grid-cols-3 items-center`

Three columns:
1. **Left — nav links** `['产品系列', '技术规格', '应用场景']`
   - Each `<a>`: `text-[11px] tracking-[2px] uppercase text-foreground/70 hover:text-foreground transition-colors duration-300 group relative`
   - Underline: `absolute bottom-0 left-0 w-full h-px bg-foreground scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400` (CSS group-hover is fine here — no scale on the element itself)
2. **Center — brand** `<a href="/">AutoRadar</a>`: `text-[16px] tracking-[4px] uppercase font-light text-foreground`, `text-center`
3. **Right — CTA** "联系我们" `href="#contact"`, same style as nav links, `justify-end`

Entry: `motion.header` `opacity: 0→1`, duration 0.6s.

---

### 6.2 SiteHero

```
<section relative min-h-screen bg-background flex items-center justify-center pt-16 overflow-hidden>
  <ASCIIBeamsCanvas />
  <div /* radial gradient overlay */ />
  <motion.div /* content */ />
</section>
```

**Radial gradient overlay** — `pointer-events-none absolute inset-0`, inline style:
```
background: radial-gradient(ellipse 70% 55% at 50% 40%, oklch(99% 0 0) 30%, oklch(99% 0 0 / 0) 100%)
```
This fades the canvas to white at center, keeping title text legible.

**Content** — `motion.div relative z-10 text-center mx-auto px-6 space-y-8`, `opacity:0,y:20→1,0`, duration 0.8s:
- Eyebrow: `text-[11px] tracking-[4px] uppercase text-muted-foreground` — "Automotive Radar · Precision Components"
- H1: `font-light tracking-[-1px] text-foreground leading-tight`, `fontSize: clamp(48px, 6vw, 80px)` — "精密雷达感知<br/>驱动智驾未来"
- Body: `text-[15px] font-light text-foreground/70 leading-relaxed whitespace-nowrap` — "专注汽车雷达核心部件研发与制造，以毫米级精度重新定义主动安全边界。"
- CTAs: `flex items-center justify-center gap-8 pt-2`
  - Primary `href="#products"`: `text-[12px] tracking-[2px] uppercase border-b border-foreground pb-0.5 text-foreground hover:text-muted-foreground transition-colors duration-300` — "浏览产品系列"
  - Secondary `href="mailto:sales@autoradar.cn"`: same size, `text-muted-foreground border-muted-foreground`, hover → foreground — "联系销售团队"

---

### 6.3 ASCIIBeamsCanvas — WebGL + Glyph Atlas

> **Architecture:** The entire animation runs on the GPU. Do NOT use Canvas 2D `fillText` in a render loop — that causes ~14k–22k main-thread draw calls per frame and will visibly jank. Use WebGL with a pre-rendered glyph atlas texture instead.

**Rendering pipeline:**
1. `buildGlyphAtlas()` — render all chars once to a Canvas 2D; upload as WebGL `TEXTURE_2D`
2. Full-screen quad, one `gl.drawArrays` per animation frame
3. Fragment shader: FBM domain warp → character selection → atlas sample → output pixel

#### 6.3.1 Constants

```ts
const CHARS = ['.', ':', '-', '=', '+', '*', '#', '%', '@', '0', '1']
const CHAR_COUNT = 11
const CELL_W = 8, CELL_H = 12   // CSS pixels
const FONT_SIZE = 9              // px
const ATLAS_SCALE = 2            // 2× for retina
// Atlas canvas: 176 × 24 px  (11 chars × 16px each)
```

#### 6.3.2 Glyph Atlas

```
canvas.width = 176, canvas.height = 24
ctx.fillStyle = '#ffffff'; ctx.fillRect(full)
ctx.font = '18px "Geist Mono", ui-monospace, monospace'  // FONT_SIZE * ATLAS_SCALE
ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#000000'
for each char i: ctx.fillText(char, (i + 0.5) * 16, 12)
```

#### 6.3.3 WebGL Setup

```ts
// REQUIRED — before texImage2D:
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
// Canvas 2D origin: top-left. WebGL texture v=0: bottom-left.
// This flag corrects the Y-axis so atlasV = cellFrac.y works without manual inversion.

gl.texImage2D(TEXTURE_2D, 0, RGBA, RGBA, UNSIGNED_BYTE, atlasCanvas)
gl.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, LINEAR)
gl.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, LINEAR)
gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, CLAMP_TO_EDGE)
gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, CLAMP_TO_EDGE)
gl.uniform1i(uAtlas, 0)
```

Uniforms: `u_time` (float s), `u_resolution` (vec2 physical px), `u_dpr` (float), `u_atlas` (sampler2D unit 0).

Resize (via ResizeObserver on the canvas element):
```ts
const dpr = window.devicePixelRatio || 1
canvas.width  = canvas.offsetWidth  * dpr
canvas.height = canvas.offsetHeight * dpr
gl.viewport(0, 0, canvas.width, canvas.height)
gl.uniform1f(uDpr, dpr)
```

Draw loop: set `u_time` and `u_resolution`, call `gl.drawArrays(TRIANGLE_STRIP, 0, 4)`, then `requestAnimationFrame`.

Cleanup: `cancelAnimationFrame` + `ro.disconnect()` in `useEffect` return.

#### 6.3.4 Vertex Shader

Full-screen quad passthrough. Attribute `a_position`. Buffer: `[-1,-1, 1,-1, -1,1, 1,1]`.

#### 6.3.5 Fragment Shader — copy verbatim

```glsl
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
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
  return mix(mix(hash(i),           hash(i+vec2(1,0)), u.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
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

  /* Domain-warped FBM
     Layer 1 FBM output offsets the input to Layer 2,
     producing Unicorn Studio-style non-linear organic motion.
     Opposite signs on wx/wy warp offset create swirl rather than shear. */
  float t    = u_time * 0.12;
  float px   = vx * 2.2;
  float py   = vy * 2.2;
  float warp = fbm(vec2(px + t*0.18, py + t*0.12)) - 0.5;
  float wx   = px + warp * 1.8 + t * 0.28;
  float wy   = py - warp * 1.4 + t * 0.18;
  float raw  = fbm(vec2(wx, wy));

  /* Contrast shaping:
     smoothstep low=0.18 → ~70% of cells receive a character
     pow exponent 1.8 → peak area stays visible, not over-concentrated */
  float s      = smoothstep(0.18, 0.72, raw);
  float shaped = pow(s, 1.8);

  vec3 bg = vec3(0.992);
  if (shaped <= 0.01) {
    gl_FragColor = vec4(bg, 1.0);
    return;
  }

  float charIdx  = min(floor(shaped * CHAR_N), CHAR_N - 1.0);
  float dotAlpha = shaped * 0.32;

  /* Atlas is tiled horizontally: char i occupies u ∈ [i/N, (i+1)/N]
     UNPACK_FLIP_Y = true means v=cellFrac.y is correct without manual flip */
  float atlasU = (charIdx + cellFrac.x) / CHAR_N;
  float atlasV = cellFrac.y;
  float ink    = 1.0 - texture2D(u_atlas, vec2(atlasU, atlasV)).r;

  gl_FragColor = vec4(mix(bg, vec3(0.0), ink * dotAlpha), 1.0);
}
```

**JSX:** `<canvas ref={canvasRef} className="pointer-events-none absolute inset-0 w-full h-full" aria-hidden="true" />`

---

### 6.4 CategoryShowcase

Section: `id="products" bg-background py-24`

Header block (`max-w-7xl mx-auto px-6 mb-12`):
- Eyebrow: `text-[11px] tracking-[3px] uppercase text-muted-foreground` — "Products"
- H2: `text-2xl font-light tracking-tight` — "产品系列"

Grid (`max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-0.5`), wrapped in `motion.div whileInView opacity:0,y:16→1,0 duration:0.6s`.

Show **7 products** (one representative per category):

| Category | ID |
|----------|----|
| 传感器 | RF-7702P |
| 核心处理部件 | AR-PJ003 |
| 发射接收部件 | AR-PJ007 |
| 激光雷达 | AR-LR-001 |
| 毫米波雷达 | AR-MW-001 |
| 组合导航系统 | INS-001 |
| 机器人控制器 | RC-100L |

**Each item** — `motion.button` with `initial="rest" animate="rest" whileHover="hover"` `text-left w-full`:
- First item (`i === 0`): `col-span-2`

Image container:
- First: `aspect-[3/2]` + `backgroundColor: '#F7F7F7'` (inline, not Tailwind)
- Others: `aspect-[3/4] bg-muted`
- Add `overflow-hidden relative`
- Child: `motion.img object-contain w-full h-full`, variants `{ rest: { scale: 1 }, hover: { scale: 1.04 } }`, transition `duration:0.28 ease:[0.45,0,0.55,1]`

Text strip: `px-1 pt-3 pb-4`
- Category: `text-[10px] tracking-[3px] uppercase text-muted-foreground`
- Name: `text-[14px] font-light tracking-wide text-foreground relative inline-block`
  - Underline `motion.span`: `absolute bottom-0 left-0 h-px w-full bg-foreground`, `style={{ originX: 0 }}`, variants `{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }`, transition `duration:0.28 ease:[0.25,0.1,0.25,1]`

---

### 6.5 QuoteSection

Section: `bg-background py-20`

Single `motion.p` centered (`max-w-7xl mx-auto px-6 text-center`), `whileInView opacity:0,y:12→1,0 duration:0.8s`:
- Text: "感知每一毫米的精度"
- Style: `font-light tracking-[-1px] text-foreground/80`, `fontSize: clamp(32px, 5vw, 64px)`

---

### 6.6 ProductFeature

Section: `bg-card py-24`

Show **5 products** in order: `['RF-7701L', 'AR-PJ005', 'IR-LR-001', 'IR-MW-006', 'INS-005']`

Each row — `motion.div whileInView opacity:0,y:16→1,0 duration:0.6s`:
```
grid lg:grid-cols-[6fr_4fr]
border-b border-border/20
relative overflow-hidden
```
Odd rows (index 1, 3) reverse columns: `lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1`

**Decorative background number** (`position:absolute z-0`):
- `font-bold text-foreground opacity-[0.035] leading-none`, `fontSize: 180px`
- `bottom: -20px`, right-aligned for even rows, left-aligned for odd rows
- Text: `product.id.replace('AR-', '')` — produces e.g. "PJ005"

**Image side** (`relative z-10 overflow-hidden bg-background min-h-[400px]`):
- `<button>` fills with `absolute inset-0 w-full h-full block`, clicking → `onProductClick(product)`
- `<img>` with `object-cover w-full h-full`

**Text side** (`relative z-10 px-12 lg:px-20 py-[200px] flex flex-col justify-center space-y-6 bg-card`):
1. Eyebrow: `text-[10px] tracking-[3px] uppercase text-muted-foreground` — "{code} · {category}"
2. Name: `font-light tracking-tight uppercase leading-tight text-pretty`, `fontSize: clamp(24px, 2.4vw, 38px)`
3. Params table: `border-t border-border`, first **4** params from `parseKeyParams(product.keyParams).slice(0, 4)`
   - Row: `flex justify-between items-start border-b border-border py-4 gap-4`
   - Label: `text-[11px] leading-[1.5] tracking-[2px] uppercase text-muted-foreground shrink-0`
   - Value: `text-[13px] leading-[1.5] font-light text-foreground text-right`
4. CTAs: `pt-2 flex items-center gap-8`
   - "查看详情": `text-[14px] tracking-[2px] uppercase border-b border-foreground pb-px text-foreground hover:text-muted-foreground hover:border-muted-foreground transition-colors duration-300`
   - "询价咨询": `<a href="mailto:sales@autoradar.cn?subject=询价：{name}（{code}）">`, same size, starts muted, hover → foreground

---

### 6.7 ContactSection

Section: `id="contact" bg-background py-24 border-t border-border/20`

Content: `max-w-2xl mx-auto px-6 text-center space-y-8`, `motion.div whileInView opacity:0,y:16→1,0 duration:0.6s`:
- Eyebrow: `text-[11px] tracking-[3px] uppercase text-muted-foreground` — "Contact"
- H2: `text-2xl font-light tracking-tight` — "需要报价或技术咨询？"
- Body: `text-[14px] text-muted-foreground font-light leading-relaxed` — "我们的销售工程师团队将在一个工作日内回复，提供专属的技术方案与报价。"
- Links: `flex justify-center gap-8 pt-2`
  - Primary `href="mailto:sales@autoradar.cn"`: `text-[12px] tracking-[2px] uppercase border-b border-foreground pb-px text-foreground` hover → muted — "发送邮件咨询"
  - Secondary `href="tel:+86-400-000-0000"`: same size, `text-muted-foreground border-muted-foreground`, hover → foreground — "电话：400-000-0000"
  - Both: `transition-colors duration-300`

---

### 6.8 SiteFooter

```
<footer border-t border-border/20 py-12>
  <div max-w-7xl mx-auto px-6 flex justify-between items-end>
    <div space-y-1>
      "AutoRadar"                          text-[12px] tracking-[3px] uppercase font-light text-foreground
      "汽车雷达核心部件 · 精密感知技术"    text-[11px] text-muted-foreground
    </div>
    <div text-right space-y-1>
      "© 2026 AutoRadar. All rights reserved."    text-[11px] text-muted-foreground
      "数据来源：飞书多维表格 · 产品管理"         text-[11px] text-muted-foreground/60
    </div>
  </div>
</footer>
```

---

### 6.9 ProductModal

```tsx
import { Dialog } from '@base-ui-components/react/dialog'
import { motion } from 'motion/react'

<Dialog.Root open={product !== null} onOpenChange={(open) => { if (!open) onClose() }}>
  <Dialog.Portal>
    <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-[60]" />
    <Dialog.Popup className="fixed inset-0 z-[61] flex items-center justify-center p-4 md:p-10 overflow-y-auto">
      {product && (
        <motion.div
          className="bg-background w-full max-w-5xl max-h-[92vh] overflow-y-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.165, 0.84, 0.44, 1] }}
        >
```

**Sticky header** (`sticky top-0 z-10 bg-background px-10 md:px-14 pt-10 pb-7 flex items-start justify-between border-b border-border/20`):
- Left (`space-y-1.5`):
  - `text-[10px] tracking-[3px] uppercase text-muted-foreground` — "{code} · {category}"
  - `text-2xl font-light tracking-tight text-foreground leading-snug` — product name
- Right: `<Dialog.Close>` — `text-[11px] tracking-[2px] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 mt-1 shrink-0 ml-8` — "关闭"

**Body** (`grid md:grid-cols-2`):

Left panel — `bg-card p-10 flex items-center justify-center min-h-[380px]`:
- `<img>` with `w-full max-h-[440px] object-contain`

Right panel — `px-10 md:px-14 py-14 flex flex-col gap-10`:

1. Tagline: `text-[13px] text-muted-foreground font-light leading-relaxed`
   — `product.tagline.split('。')[0] + '。'`

2. Params grid: `grid grid-cols-2 gap-x-6 gap-y-0 border-t border-border`
   — all params from `parseKeyParams(product.keyParams)` (no slice limit)
   - Cell: `py-3 border-b border-border/40`
   - Label: `text-[10px] tracking-[2px] uppercase text-muted-foreground leading-none mb-2.5`
   - Value: `text-[14px] font-light text-foreground leading-snug`

3. Price: `<div>`
   - Label: `text-[10px] tracking-[2px] uppercase text-muted-foreground` — "参考价格"
   - Value: `text-[18px] font-light text-foreground mt-1` — `¥{product.price.toLocaleString()}`

4. CTA row: `flex gap-8 border-t border-border/30 pt-6`
   - "下载资料": `<a href="/datasheet.zip" download>` — `text-[11px] tracking-[2px] uppercase text-muted-foreground border-b border-muted-foreground pb-px hover:text-foreground hover:border-foreground transition-colors duration-200`
   - "询价咨询": `<a href="mailto:sales@autoradar.cn?subject=询价：{name}（{code}）">` — `text-[11px] tracking-[2px] uppercase text-foreground border-b border-foreground pb-px hover:text-muted-foreground hover:border-muted-foreground transition-colors duration-200`

---

## 7. Critical Implementation Notes

### 7.1 GLSL Reserved Keywords
`half`, `input`, `output`, `texture` are reserved in GLSL ES 1.0. Using them as variable names causes **silent shader compilation failure** — blank canvas, no runtime error unless you call `gl.getShaderInfoLog()`. Always log shader errors:
```ts
if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
  console.error('shader error:', gl.getShaderInfoLog(s))
```

### 7.2 WebGL Texture Y-Axis Flip
Canvas 2D origin is top-left (y increases downward). WebGL texture UV origin is bottom-left (v increases upward). Call `gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)` before `texImage2D`. After that, `atlasV = cellFrac.y` in the shader is correct without any manual flip.

### 7.3 Tailwind v4 — No tailwind.config.js
All theme values live inside `@theme inline { }` in CSS. The `shadcn/ui` init writes a `shadcn/tailwind.css` file that provides component base styles. Do not create `tailwind.config.js` or `tailwind.config.ts`.

### 7.4 motion/react Variant Propagation
`whileHover="hover"` on a parent `motion.X` automatically propagates the `"hover"` variant name to all descendant `motion.X` elements that declare a `variants` prop with a `"hover"` key. No event handlers or state needed in children.

### 7.5 shadcn Dialog Import Path
```ts
import { Dialog } from '@base-ui-components/react/dialog'
// NOT from '@radix-ui' or 'shadcn/ui' directly
```

---

## 8. File Structure

```
src/
  App.tsx
  index.css
  main.tsx
  components/
    SiteNav.tsx
    SiteHero.tsx
    ASCIIBeamsCanvas.tsx
    CategoryShowcase.tsx
    QuoteSection.tsx
    ProductFeature.tsx
    ContactSection.tsx
    SiteFooter.tsx
    ProductModal.tsx
  data/
    products.ts
public/
  (no product images or datasheet files — all resolved at runtime from Feishu Base)
```
