# Design Prompt — vibe-view-scenario-2（AutoRadar 产品展示网站）

> 将此文件内容完整复制给另一个 LLM，作为从零重建该网站的设计指导文件。
> 本文件基于已完成的实现编写，所有代码均已验证可运行。

---

## 一、项目定位与风格基因

**目标**：为 AutoRadar 汽车雷达部件品牌构建一个产品展示网站，风格参照 Bang & Olufsen 官网。

**核心关键词**：极简奢华 · 克制 · 编辑感 · 精密工业

**视觉语言**：
- 背景纯白，大量留白，无任何有色 accent
- 近黑文字，广泛使用全大写 + 极宽字距
- 产品图竖向比例 3:4，无圆角，大面积展示
- 无 box-shadow，无填充式按钮，无圆角卡片
- 所有 CTA 均为"文字 + 底部单线"形式

**破格设计（关键）**：整体严整网格中，有 3 处有意识的视觉破格，制造节奏与层次：
1. **破格①** ProductGrid：每 10 张产品中位置 4 和 9 放大展示（col-span-2，aspect-[3/2]）
2. **破格②** QuoteSection：ProductGrid 与 ProductFeature 之间插入全宽单行大字，制造视觉停顿
3. **破格③** ProductFeature：超大背景编号（opacity-[0.035]）+ 不对称图文比例（3fr:2fr）

---

## 二、技术栈

```
React 18 + Vite + TypeScript
Tailwind CSS 4（@tailwindcss/vite，CSS-first，无 tailwind.config.js）
motion（framer-motion v11+）→ import { motion } from 'motion/react'
shadcn/ui（Tailwind v4 模式，已初始化）
@fontsource-variable/geist（Geist Sans Variable）
路径别名：@/ → ./src/
```

**重要约束**：
- `motion` 的 `ease` 必须用 cubic-bezier 数组，不能用字符串（TypeScript 类型不兼容）
  ```tsx
  transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}  // ✅
  transition={{ duration: 0.5, ease: 'easeOut' }}               // ❌ TS 报错
  ```
- Section 入场用 `whileInView`，Hero 用 `animate`

---

## 三、数据模型

```ts
export interface Product {
  id: string           // 'AR-PJ001', 'AR-LR-001', 'INS-001' 等
  name: string         // 中文产品名
  code: string         // 'AR - PJ001' 原始格式
  category: '传感器' | '核心处理部件' | '发射接收部件' | '辅助设备' | '激光雷达' | '毫米波雷达' | '组合导航系统'
  status: '上架' | '下架'
  price: number
  cost: number
  stock: number
  tagline: string      // 产品信息第一句
  industry: string     // 应用行业
  image: string        // '/products/AR-PJ001.jpg'
  specs: { label: string; value: string }[]  // 4 条技术参数
}

// 导出：products（全部39款）、activeProducts（仅上架）、categories、categoryGroups
```

---

## 四、CSS Token 配置

写入 `src/index.css` 的 `:root` 部分（保留 shadcn 添加的 chart/sidebar 等变量）：

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@fontsource-variable/geist";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
    --font-sans: 'Geist Variable', sans-serif;
    --font-mono: 'Geist Mono', ui-monospace, monospace;
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-border: var(--border);
    --color-ring: var(--ring);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
    --radius-2xl: calc(var(--radius) * 1.8);
    --font-heading: var(--font-sans);
    /* ... 保留其他 shadcn 生成的 token ... */
}

:root {
    --background: oklch(99% 0 0);           /* 近纯白 */
    --foreground: oklch(11% 0.005 60);      /* 近黑，略带暖色 */
    --card: oklch(97.5% 0 0);               /* 极浅灰，用于区分区块 */
    --card-foreground: oklch(11% 0.005 60);
    --secondary: oklch(95% 0 0);
    --secondary-foreground: oklch(11% 0.005 60);
    --muted: oklch(95% 0 0);
    --muted-foreground: oklch(42% 0 0);     /* 中灰，用于辅助文字 */
    --border: oklch(90% 0 0);               /* 极淡分割线 */
    --input: oklch(90% 0 0);
    --primary: oklch(11% 0.005 60);
    --primary-foreground: oklch(99% 0 0);
    --ring: oklch(11% 0.005 60);
    --popover: oklch(99% 0 0);
    --popover-foreground: oklch(11% 0.005 60);
    --accent: oklch(95% 0 0);
    --accent-foreground: oklch(11% 0.005 60);
    --destructive: oklch(0.577 0.245 27.325);
    --radius: 0.125rem;   /* 极小圆角，接近直角 */
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
  html { @apply font-sans; }
}

/* 无障碍：减少动效 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 五、页面结构

```tsx
// App.tsx
function App() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteNav />
      <main>
        <SiteHero />
        <ProductGrid />
        <QuoteSection />
        <ProductFeature />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  )
}
```

---

## 六、组件完整代码

### 6.1 SiteNav.tsx

```tsx
import { motion } from 'motion/react'

const ease = [0.165, 0.84, 0.44, 1] as const

export function SiteNav() {
  return (
    <motion.header
      className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 md:h-[100px] grid grid-cols-3 items-center">
        {/* 左：导航链接 */}
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

        {/* 中：品牌名 */}
        <div className="text-center">
          <a
            href="/"
            className="text-[13px] tracking-[4px] uppercase font-light text-foreground"
          >
            AutoRadar
          </a>
        </div>

        {/* 右：CTA */}
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
```

---

### 6.2 SiteHero.tsx（含波纹动画）

**波纹动画技术要点**：
- SVG viewBox 固定为 1440×900，`preserveAspectRatio="xMidYMid slice"`
- 每条波纹是正弦曲线路径，用三次贝塞尔控制点模拟
- 水平位移 `x` 和透明度 `opacity` 分别配置独立的 transition，实现互不干扰的动画
- **关键**：`scrollDist = Math.ceil(W / wavelength) * wavelength`，使滚动距离为波长的整数倍，防止无缝循环抖动
- 7 条波纹各有不同的 y 位置、振幅、波长、滚动速度、透明度基值、初始偏移
- 透明度呼吸：`repeatType: 'mirror'`，使用非整数倍的呼吸周期（8.3, 11.9, 7.4…），确保各波纹永不同步
- 波纹颜色：`oklch(72% 0.04 65)`（带极淡暖色调的中灰）
- 径向渐变遮罩：中心白色不透明 → 边缘透明，让波纹在边缘自然消散

```tsx
import { motion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const

const W = 1440
const H = 900
const WAVE_COLOR = 'oklch(72% 0.04 65)'

function scrollDist(wl: number): number {
  // 滚动距离必须是波长的整数倍，否则无缝循环时会有位移跳跃
  return Math.ceil(W / wl) * wl
}

function sinePath(y: number, amplitude: number, wavelength: number): string {
  const scroll = scrollDist(wavelength)
  const total  = Math.ceil((scroll + W) / wavelength) * wavelength
  const hw = wavelength / 2
  const qw = wavelength / 4
  let d = `M 0 ${y}`
  for (let x = 0; x < total; x += wavelength) {
    d += ` C ${x + qw} ${y - amplitude} ${x + hw - qw} ${y - amplitude} ${x + hw} ${y}`
    d += ` C ${x + hw + qw} ${y + amplitude} ${x + wavelength - qw} ${y + amplitude} ${x + wavelength} ${y}`
  }
  return d
}

const waves = [
  { y: 0.13 * H, amp: 14, wl: 500, dur: 30, op: 0.55, del:   0, breathe: 8.3  },
  { y: 0.26 * H, amp: 19, wl: 580, dur: 38, op: 0.40, del: -11, breathe: 11.9 },
  { y: 0.40 * H, amp: 11, wl: 420, dur: 25, op: 0.50, del:  -5, breathe: 7.4  },
  { y: 0.53 * H, amp: 22, wl: 540, dur: 34, op: 0.38, del: -16, breathe: 13.1 },
  { y: 0.66 * H, amp: 16, wl: 470, dur: 32, op: 0.45, del:  -8, breathe: 9.6  },
  { y: 0.79 * H, amp: 13, wl: 460, dur: 27, op: 0.42, del: -20, breathe: 6.8  },
  { y: 0.92 * H, amp: 18, wl: 520, dur: 36, op: 0.38, del:  -3, breathe: 12.4 },
]

export function SiteHero() {
  return (
    <section className="relative min-h-screen bg-background flex items-center justify-center pt-16 overflow-hidden">

      {/* 波纹 SVG 层 */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {waves.map((w, i) => (
          <motion.path
            key={i}
            d={sinePath(w.y, w.amp, w.wl)}
            fill="none"
            stroke={WAVE_COLOR}
            strokeWidth={1.2}
            initial={{ opacity: w.op * 0.4 }}
            animate={{
              x: [0, -scrollDist(w.wl)],
              opacity: [w.op * 0.25, w.op * 0.65],
            }}
            transition={{
              x: {
                duration: w.dur,
                repeat: Infinity,
                ease: 'linear',
                delay: w.del,
              },
              opacity: {
                duration: w.breathe,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatType: 'mirror',
                delay: i * 1.1,
              },
            }}
          />
        ))}
      </svg>

      {/* 径向渐变遮罩：中心不透明白色 → 边缘透明，营造柔和焦点感 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 40%, oklch(99% 0 0) 30%, oklch(99% 0 0 / 0) 100%)',
        }}
      />

      {/* Hero 文字内容 */}
      <motion.div
        className="relative z-10 text-center mx-auto px-6 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
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

        <p className="text-[14px] text-muted-foreground font-light leading-relaxed whitespace-nowrap">
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
```

---

### 6.3 ProductGrid.tsx（按产品线分类展示）

**关键设计决策**：
- 产品按 4 条产品线分区，每区有标题和产品数量
- 每区内，位置 4 和 9（从 0 计）的卡片放大展示（`col-span-2`，`aspect-[3/2]`），其余为 `aspect-[3/4]`
- `gap-0.5`（2px）使放大卡与普通卡的高度误差控制在 <1px（`gap-2` 会产生 ~5px 的错位）
- hover 下划线用 `absolute span` + `scale-x-0 → scale-x-100`，**不要**在产品名 `<p>` 上加 `group` 类（会遮蔽外层 `div.group`）
- 图片 hover 放大用纯 CSS transition，使用 sinusoidal easing：`cubic-bezier(0.45, 0, 0.55, 1)`，时长 1000ms，感觉"呼吸"般柔和

```tsx
import { motion } from 'motion/react'
import { products, type ProductCategory } from '@/data/products'

const ease = [0.165, 0.84, 0.44, 1] as const

// 4 条展示产品线（将 7 个细分类合并）
const SECTIONS: { label: string; en: string; cats: ProductCategory[] }[] = [
  { label: '雷达核心部件', en: 'Core Radar Components', cats: ['传感器', '核心处理部件', '发射接收部件', '辅助设备'] },
  { label: '激光雷达',     en: 'LiDAR',                 cats: ['激光雷达'] },
  { label: '毫米波雷达',   en: 'Millimeter-Wave Radar', cats: ['毫米波雷达'] },
  { label: '组合导航系统', en: 'Integrated Navigation',  cats: ['组合导航系统'] },
]

// 每 10 个产品中，位置 4 和 9 放大展示（col-span-2）
function isFeatured(i: number) {
  const pos = i % 10
  return pos === 4 || pos === 9
}

export function ProductGrid() {
  return (
    <section id="products" className="bg-background py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-[11px] tracking-[3px] uppercase text-muted-foreground">
            Full Product Line
          </p>
          <h2 className="text-3xl font-light tracking-tight text-foreground">
            完整产品系列
          </h2>
          <p className="text-[13px] text-muted-foreground">
            39 款型号 · 4 条产品线
          </p>
        </motion.div>

        {/* 按产品线分区 */}
        {SECTIONS.map((section, si) => {
          const sectionProducts = products.filter(p => section.cats.includes(p.category))

          return (
            <motion.div
              key={section.label}
              className="mt-20"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: si * 0.05, ease }}
            >
              {/* 产品线标题 */}
              <div className="flex items-end justify-between border-t border-border/40 pt-5 mb-6">
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">
                    {section.en}
                  </p>
                  <h3 className="text-xl font-light tracking-tight text-foreground">
                    {section.label}
                  </h3>
                </div>
                <p className="text-[12px] text-muted-foreground/60 tabular-nums pb-0.5">
                  {sectionProducts.length} 款
                </p>
              </div>

              {/* 产品网格 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
                {sectionProducts.map((product, i) => {
                  const featured = isFeatured(i)

                  return (
                    <motion.div
                      key={product.id}
                      className={featured ? 'col-span-2' : ''}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.5, delay: (i % 10) * 0.04, ease }}
                    >
                      <div className="group">
                        {/* 图片区 */}
                        <div className={`relative overflow-hidden bg-card ${featured ? 'aspect-[3/2]' : 'aspect-[3/4]'}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover opacity-90 scale-100 group-hover:opacity-100 group-hover:scale-[1.03]"
                            style={{ transition: 'opacity 600ms ease, transform 1000ms cubic-bezier(0.45, 0, 0.55, 1)' }}
                          />
                        </div>

                        {/* 信息区 */}
                        <div className="pt-3 pb-4 space-y-1">
                          <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">
                            {product.category}
                          </p>
                          <p className="relative inline-block text-[13px] tracking-[2px] uppercase font-normal text-foreground">
                            <span className="relative">
                              {product.name}
                              {/* hover 下划线：注意 span 不加 group，由外层 div.group 控制 */}
                              <span className="absolute bottom-0 left-0 w-full h-px bg-foreground scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                            </span>
                          </p>
                          <p className="text-[13px] font-light text-foreground/70">
                            ¥{product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}

      </div>
    </section>
  )
}
```

---

### 6.4 QuoteSection.tsx（视觉节奏停顿）

```tsx
import { motion } from 'motion/react'

const ease = [0.165, 0.84, 0.44, 1] as const

export function QuoteSection() {
  return (
    <section className="bg-background py-20 border-t border-border/20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.p
          className="font-light tracking-[-1px] text-foreground/80"
          style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease }}
        >
          感知每一毫秒的精度
        </motion.p>
      </div>
    </section>
  )
}
```

---

### 6.5 ProductFeature.tsx（精选旗舰展示）

**关键设计决策**：
- 从三条主力产品线各选一款旗舰：激光雷达 · 毫米波雷达 · 组合导航系统
- 图文交替排列（奇数项反转），图片比例 3:2（宽屏感）
- 超大背景编号取自 `product.id.replace('AR-', '')`，绝对定位，opacity-[0.035]
- 图文比例 `lg:grid-cols-[3fr_2fr]`，图片侧占 60%
- 规格用 border-b 分割线列表（而非卡片）
- 图片 hover：同 ProductGrid，sinusoidal easing，1000ms

```tsx
import { motion } from 'motion/react'
import { products } from '@/data/products'

const ease = [0.165, 0.84, 0.44, 1] as const

// 从三条主力产品线各选一款旗舰：激光雷达 · 毫米波雷达 · 组合导航系统
const FEATURED_IDS = ['AR-LR-001', 'AR-MW-001', 'INS-002']

export function ProductFeature() {
  const featured = FEATURED_IDS.map(id => products.find(p => p.id === id)!)

  return (
    <section className="bg-card py-32 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-6 space-y-0">
        {featured.map((product, i) => {
          const isReversed = i % 2 === 1
          const bgNum = product.id.replace('AR-', '')

          return (
            <motion.div
              key={product.id}
              className={`relative overflow-hidden grid lg:grid-cols-[3fr_2fr] min-h-[600px] border-b border-border/20 ${isReversed ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease }}
            >
              {/* 超大背景编号 — 破格③ */}
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

              {/* 图片侧 */}
              <div className="relative z-10 overflow-hidden bg-background">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-90 scale-100 hover:opacity-100 hover:scale-[1.03]"
                  style={{ transition: 'opacity 600ms ease, transform 1000ms cubic-bezier(0.45, 0, 0.55, 1)' }}
                />
              </div>

              {/* 文字侧 */}
              <div className="relative z-10 px-12 lg:px-20 py-16 flex flex-col justify-center space-y-8 bg-card">
                {/* Eyebrow */}
                <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">
                  {product.code} · {product.category}
                </p>

                {/* 产品名 */}
                <h3
                  className="font-light tracking-tight uppercase text-foreground leading-tight"
                  style={{ fontSize: 'clamp(28px, 3vw, 44px)' }}
                >
                  {product.name}
                </h3>

                {/* Tagline */}
                <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                  {product.tagline}
                </p>

                {/* 规格列表 */}
                <div className="border-t border-border">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex justify-between border-b border-border/50 py-3"
                    >
                      <span className="text-[11px] tracking-[2px] uppercase text-muted-foreground">
                        {spec.label}
                      </span>
                      <span className="text-[13px] font-light text-foreground">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 价格 + CTA */}
                <div className="border-t border-border pt-6 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] tracking-[2px] uppercase text-muted-foreground">
                      参考价格
                    </p>
                    <p className="text-xl font-light text-foreground mt-1">
                      ¥{product.price.toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={`mailto:sales@autoradar.cn?subject=询价：${product.name}（${product.code}）`}
                    className="group relative text-[12px] tracking-[2px] uppercase border-b border-foreground pb-px text-foreground hover:text-muted-foreground hover:border-muted-foreground transition-colors duration-300"
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
```

---

### 6.6 ContactSection.tsx

```tsx
import { motion } from 'motion/react'

const ease = [0.165, 0.84, 0.44, 1] as const

export function ContactSection() {
  return (
    <section id="contact" className="bg-background py-24 border-t border-border/20">
      <motion.div
        className="max-w-2xl mx-auto px-6 text-center space-y-8"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
      >
        <p className="text-[11px] tracking-[3px] uppercase text-muted-foreground">
          Contact
        </p>
        <h2 className="text-2xl font-light tracking-tight text-foreground">
          需要报价或技术咨询？
        </h2>
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
```

---

### 6.7 SiteFooter.tsx

```tsx
export function SiteFooter() {
  return (
    <footer className="border-t border-border/20 py-12">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[12px] tracking-[3px] uppercase font-light text-foreground">
            AutoRadar
          </p>
          <p className="text-[11px] text-muted-foreground">
            汽车雷达核心部件 · 精密感知技术
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[11px] text-muted-foreground tracking-wide">
            © 2026 AutoRadar. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground/60">
            数据来源：飞书多维表格 · 产品管理
          </p>
        </div>
      </div>
    </footer>
  )
}
```

---

## 七、动效设计原则（Emil Kowalski）

从已应用的动效规范中提炼：

1. **永远不从 0 开始 scale**：`scale-x-0` 的下划线用 `origin-left`，从宽度折叠，而非从点展开
2. **入场 ease-out**：`[0.165, 0.84, 0.44, 1]` — 快速加速后缓慢收尾，感觉自信
3. **Hero ease 更弹性**：`[0.16, 1, 0.3, 1]` — 夸张的 overshoot 感，适合首屏
4. **图片放大用 sinusoidal**：`cubic-bezier(0.45, 0, 0.55, 1)` + 1000ms，感觉像"呼吸"而非机械伸缩
5. **stagger 用 delay 而非 staggerChildren**：`delay: i * 0.04`，控制更精确
6. **whileInView margin**：`-60px` 让动效在元素即将进入视口时提前触发，更流畅
7. **opacity 初始值不为 0**：波纹用 `initial={{ opacity: w.op * 0.4 }}`，避免"出现"感
8. **repeatType: 'mirror'**：呼吸动效用 mirror 而非 reverse，确保无缝循环且无跳跃

---

## 八、常见错误与规避

| 错误 | 正确做法 |
|------|---------|
| `ease: 'easeOut'`（字符串） | `ease: [0.165, 0.84, 0.44, 1]`（数组） |
| `gap-2` 导致放大卡与普通卡高度不对齐 | `gap-0.5`（2px），将误差控制在 <1px |
| 在内层 `<p>` 加 `group` 类 | 只在外层容器 `<div>` 加 `group`，内层直接用 `group-hover:` |
| 波纹循环抖动 | `scrollDist = Math.ceil(W/wl)*wl`，确保滚动距离为波长整数倍 |
| 所有波纹同时呼吸 | 使用非整数倍的 breathe 周期（8.3, 11.9, 7.4…）+ `delay: i * 1.1` |
| 产品图灰色（图片不存在） | 确认 `public/products/` 目录有全部图片，命名与 `product.image` 字段完全匹配 |
| `import { motion } from 'framer-motion'` | `import { motion } from 'motion/react'`（此项目用 motion v11+） |
| `activeProducts` 过滤后找不到 FEATURED_IDS | 直接从 `products`（全量）中 find，不用 activeProducts |

---

## 九、实施 Checklist

- [ ] 读取 `CLAUDE.md`（技术栈、路径别名、动效规范）
- [ ] 读取 `src/data/products.ts`（了解数据结构和产品 ID）
- [ ] 更新 `src/index.css` 的 `:root` token（radius 改为 0.125rem）
- [ ] 确认 `index.html` 无 `class="dark"`
- [ ] 创建 7 个组件文件（含 QuoteSection）
- [ ] 所有 motion ease 使用数组格式
- [ ] SiteHero：波纹 SVG + 径向渐变遮罩 + 文字内容
- [ ] ProductGrid：按 4 条产品线分区，`gap-0.5`，featured 位置 4/9
- [ ] QuoteSection：单行大字，极度留白
- [ ] ProductFeature：FEATURED_IDS 指向真实存在的产品 ID，超大背景编号
- [ ] ContactSection：两个文字+下划线 CTA
- [ ] SiteFooter：极简两栏
- [ ] 无有色 accent，无 box-shadow，无填充式按钮，无圆角卡片
- [ ] `npm run build` 无 TS 报错
