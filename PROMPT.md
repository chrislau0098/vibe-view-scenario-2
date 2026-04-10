# Execution Prompt — vibe-view-scenario-2

> 将此文件内容完整复制给另一个 Claude 对话，作为项目启动指令。

---

## 任务说明

你的任务是在 `/Users/nova-macmini/Library/CloudStorage/Dropbox/coding-playground/vibe-view-scenario-2` 目录下，基于 B&O（Bang & Olufsen）官网风格，为 AutoRadar 汽车雷达部件生成一个完整的产品展示网站。

**开始前必读：**
1. 读取项目根目录的 `CLAUDE.md`（技术栈、依赖、数据模型）
2. 读取项目根目录的 `DESIGN.md`（B&O 风格完整设计规范）
3. 读取 `src/data/products.ts`（产品数据，共 10 款）

---

## 目标效果

- 风格参照：Bang & Olufsen 官网 (bang-olufsen.com/en/int/speakers)
- 核心关键词：**极简奢华 · 克制 · 编辑感 · 精密**
- 背景：纯白 / 极浅灰
- 文字：近黑 (#191817)，大量使用全大写 + 宽字距
- 产品图：竖向比例 (3:4)，大面积展示，无圆角
- 交互：hover 下划线动效 (scaleX)，产品图 opacity 变化

### ⚡️ 关键风格特征：规则中的局部破格

这是本项目与普通产品列表页最大的差异点，必须实现：

**在整体严整的网格布局中，有 2-3 处有意识的"破格"设计，用来突出重点内容、制造视觉节奏。**

具体要求：
1. **ProductGrid 错位排列**：偶数列产品卡片整体 `mt-8`，奇数列从顶部开始，形成砖墙式错位
2. **超大背景文字**：ProductFeature 中，当前产品的编号（如 "PJ001"）用极大字号（text-[180px] 或更大）作为绝对定位的背景装饰层，opacity-[0.035]，position absolute，overflow hidden，不参与布局
3. **节奏段落**：ProductGrid 和 ProductFeature 之间插入一个全宽的"Quote Section"——单行大字（clamp(36px,5vw,64px)），字重 300，内容是品牌 tagline，无其他元素，制造视觉停顿
4. **不对称图文**：ProductFeature 的图文比例为 `lg:grid-cols-[3fr_2fr]`（图60%，文40%），而非等分，让产品图占主导

---

## 页面架构

构建以下 6 个组件，在 `App.tsx` 中组合：

```
<SiteNav />          固定顶部导航
<SiteHero />         全屏 Hero，极简
<ProductGrid />      全部产品 4 列网格，偶数列错位排列 ← 破格①
<QuoteSection />     全宽单行大字，节奏停顿 ← 破格②
<ProductFeature />   精选在售产品，不对称图文 + 超大背景编号 ← 破格③
<ContactSection />   询价 CTA
<SiteFooter />       极简页脚
```

### QuoteSection 规格
```
bg-background，py-20，border-t border-border/20
单行文字，居中：
  text-[clamp(32px,5vw,64px)] font-light tracking-[-1px] text-foreground/80
  内容："感知每一毫秒的精度"  或  "Precision Engineered · Designed to Last"
无其他元素，纯文字，极度留白
whileInView 入场：opacity 0→1, y 12→0，duration 0.8s
```

---

## 各组件详细规格

### SiteNav
```
高度：h-16 md:h-[100px]
背景：bg-background/95 backdrop-blur-sm（无 border-b）
布局：三列 grid（左:导航链接 | 中:品牌名 | 右:CTA）
品牌名：大写，text-[13px] tracking-[4px] font-light
导航链接：text-[11px] tracking-[2px] uppercase，hover 时显示下方 1px 线（scaleX 0→1 动效）
CTA："联系我们"，无背景，仅文字+下划线
入场：opacity 0→1，duration 0.6s
```

### SiteHero
```
高度：min-h-screen，纯白背景
内容居中（水平+垂直）
结构从上到下：
  1. Eyebrow：text-[11px] tracking-[4px] uppercase text-muted-foreground
     文字："Automotive Radar · Precision Components"
  2. 主标题：
     clamp(48px,6vw,80px)，font-weight 300，tracking -1px
     两行，第二行用 <br>
     例："精密雷达感知\n驱动智驾未来"
  3. 副标题：text-[14px] text-muted-foreground font-light，max-w-md，居中
  4. 两个按钮（水平排列，gap-6）：
     主："浏览产品系列"→ #products，text-[12px] tracking-[2px] uppercase，border-b border-foreground pb-0.5，无背景
     次："联系销售团队"→ mailto:，同样文字样式，text-muted-foreground

背景：纯白，无任何装饰元素
动效：整体 opacity 0→1, y 20→0，duration 0.8s，ease [0.165, 0.84, 0.44, 1]
```

### ProductGrid（核心组件）
```
id="products"，bg-background，py-24
Section Header（左对齐）：
  - Eyebrow：text-[11px] tracking-[3px] uppercase text-muted-foreground
    文字："Full Product Line"
  - 标题：text-3xl font-light tracking-tight，文字："完整产品系列"
  - 数量：text-[13px] text-muted-foreground，"10 款型号 · 4 条产品线"

网格：grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2，mt-12

每张产品卡：
  - 下架产品：opacity-40，无 hover 效果
  - 图片容器：aspect-[3/4]，overflow-hidden，bg-card
    - <img> object-cover，hover 时 opacity 0.85→1.0，transition-opacity duration-300
  - 信息区：pt-3 pb-4，space-y-1
    - 类别标签：text-[10px] tracking-[3px] uppercase text-muted-foreground
    - 产品名：text-[13px] tracking-[2px] uppercase font-normal text-foreground
      hover 时显示 1px 下划线（用 relative + after 伪元素，scaleX 动效）
    - 价格：text-[13px] font-light text-foreground/70

卡片入场：whileInView stagger，delay: i * 0.04，duration 0.5s
```

### ProductFeature（精选展示）
```
仅展示 activeProducts（status === '上架'）中前 3 款
bg-card（极浅灰 #FAFAFA），py-32，border-t border-border/30

每款产品：左右交替全宽布局（lg:grid grid-cols-2），min-h-[600px]
图片侧：无圆角（rounded-none），aspect 自适应，overflow-hidden，bg-background
  - 图片 object-cover
  - 无 hover scale（B&O 不用 scale，只用 opacity）
文字侧：px-12 lg:px-20，flex flex-col justify-center，space-y-8
  结构：
    ① Eyebrow：text-[10px] tracking-[3px] uppercase text-muted-foreground
       内容：产品编码 + " · " + 产品类别
    ② 产品名：text-[clamp(28px,3vw,44px)] font-light tracking-tight uppercase
    ③ Tagline：text-[15px] text-muted-foreground font-light leading-relaxed
    ④ 规格列表（替代卡片式规格）：
       border-t border-border，space-y-0
       每行：flex justify-between，border-b border-border/50，py-3
         左：text-[11px] tracking-[2px] uppercase text-muted-foreground（label）
         右：text-[13px] font-light（value）
    ⑤ 价格+CTA（border-t border-border pt-6）：
       价格：text-[11px] tracking-[2px] uppercase text-muted-foreground + 换行 + text-xl font-light
       CTA 按钮：text-[12px] tracking-[2px] uppercase，无背景，仅 border-b border-foreground pb-px
                 href：mailto:sales@autoradar.cn?subject=询价：{name}（{code}）
                 hover：text-muted-foreground，transition-colors duration-300
```

### ContactSection
```
bg-background，py-24，border-t border-border/20
最大宽度：max-w-2xl mx-auto text-center，space-y-8
Eyebrow：text-[11px] tracking-[3px] uppercase text-muted-foreground
标题：text-2xl font-light tracking-tight，"需要报价或技术咨询？"
说明：text-[14px] text-muted-foreground font-light
按钮组（flex justify-center gap-8）：
  主：text-[12px] tracking-[2px] uppercase，border-b border-foreground pb-px，href=mailto
  次：text-[12px] tracking-[2px] uppercase text-muted-foreground，border-b border-muted-foreground pb-px，href=tel
```

### SiteFooter
```
border-t border-border/20，py-12
flex justify-between items-end
左：品牌名（tracking-[3px] uppercase text-[12px] font-light） + 一行描述（text-[11px] text-muted-foreground）
右：版权信息（text-[11px] text-muted-foreground tracking-wide）
    + 数据来源（text-[11px] text-muted-foreground/60）
```

---

## CSS Token 配置（写入 src/index.css 的 :root 部分）

**重要**：shadcn init 已覆盖了 :root。用以下值替换 :root 中的 token（保留 shadcn 添加的 chart/sidebar 等无关变量）：

```css
:root {
    --background: oklch(99% 0 0);
    --foreground: oklch(11% 0.005 60);
    --card: oklch(97.5% 0 0);
    --card-foreground: oklch(11% 0.005 60);
    --secondary: oklch(95% 0 0);
    --secondary-foreground: oklch(11% 0.005 60);
    --muted: oklch(95% 0 0);
    --muted-foreground: oklch(42% 0 0);
    --border: oklch(90% 0 0);
    --input: oklch(90% 0 0);
    --primary: oklch(11% 0.005 60);
    --primary-foreground: oklch(99% 0 0);
    --ring: oklch(11% 0.005 60);
    --popover: oklch(99% 0 0);
    --popover-foreground: oklch(11% 0.005 60);
    --accent: oklch(95% 0 0);
    --accent-foreground: oklch(11% 0.005 60);
    --destructive: oklch(0.577 0.245 27.325);
    --radius: 0.125rem;   /* 极小圆角 */
}
```

---

## 动效统一规范

```tsx
// 所有动效使用此 easing，不用字符串形式
const ease = [0.165, 0.84, 0.44, 1] as const

// Hover 下划线（产品名、导航链接）
// 用 Tailwind group + after 伪元素，或 motion.span
// CSS 实现：
// after:content-[''] after:absolute after:bottom-0 after:left-0
// after:w-full after:h-px after:bg-foreground
// after:scale-x-0 after:origin-left
// group-hover:after:scale-x-100 after:transition-transform after:duration-400

// 注意：motion 的 ease 必须用数组，不能用字符串
transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}  // ✅
transition={{ duration: 0.5, ease: 'easeOut' }}               // ❌ TS 报错
```

---

## 文件结构目标

```
src/
├── data/products.ts         ✅ 已就位，勿修改
├── components/
│   ├── SiteNav.tsx
│   ├── SiteHero.tsx
│   ├── ProductGrid.tsx      ← 全部10款
│   ├── ProductFeature.tsx   ← 仅在售款
│   ├── ContactSection.tsx
│   └── SiteFooter.tsx
├── index.css                ← 更新 :root token
├── main.tsx
└── App.tsx

public/products/             ✅ 10张产品图已就位
index.html                   ✅ 无 class="dark"
```

---

## App.tsx 组合

```tsx
import { SiteNav } from '@/components/SiteNav'
import { SiteHero } from '@/components/SiteHero'
import { ProductGrid } from '@/components/ProductGrid'
import { QuoteSection } from '@/components/QuoteSection'
import { ProductFeature } from '@/components/ProductFeature'
import { ContactSection } from '@/components/ContactSection'
import { SiteFooter } from '@/components/SiteFooter'

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

export default App
```

---

## 实施 Checklist

- [ ] 读取 CLAUDE.md、DESIGN.md、products.ts
- [ ] 更新 `src/index.css` 的 `:root` token（radius 改为 0.125rem）
- [ ] `index.html` 确认无 `class="dark"`
- [ ] 创建 6 个组件文件
- [ ] 所有 motion ease 使用 `[0.165, 0.84, 0.44, 1]` 数组格式
- [ ] ProductGrid：4 列，gap-2，产品图 3:4 竖向比例
- [ ] ProductFeature：仅 activeProducts，无圆角，规格用 border-b 列表
- [ ] 所有标签/分类/按钮文字：全大写 + tracking-[2px] 以上
- [ ] 无任何有色 accent、无 box-shadow、无装饰性元素
- [ ] CTA 按钮：文字+下划线形式，无填充背景
- [ ] **破格①**：ProductGrid 偶数列 mt-8 错位排列
- [ ] **破格②**：ProductGrid 与 ProductFeature 之间插入 QuoteSection（单行大字）
- [ ] **破格③**：ProductFeature 超大背景编号（absolute，opacity-[0.035]）+ 图文比例 3fr/2fr
- [ ] `npm run build` 通过，无 TS 报错
