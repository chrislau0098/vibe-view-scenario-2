# DESIGN.md — vibe-view-scenario-2
## 风格：B&O 极简奢华（Bang & Olufsen Inspired）

> 参考来源：Bang & Olufsen 官网 (bang-olufsen.com/en/int/speakers)
> 核心关键词：Minimalist Luxury · Restrained · Editorial · Precision

---

## 一、设计哲学

B&O 的视觉语言建立在**极度克制**之上：
- 近黑 + 纯白的双色系，几乎没有其他颜色介入
- 大量留白取代装饰性元素
- 产品本身是唯一的视觉主角
- 字体轻盈、大写、宽字距，传递精密感而非力量感
- 交互动效极为流畅，但绝不夸张

---

## 二、色彩系统

```css
:root {
    /* === 核心 === */
    --background: oklch(99% 0 0);           /* 纯白 #FFFFFF */
    --foreground: oklch(11% 0.005 60);      /* 近黑 #191817 */

    /* === 卡片 / Surface === */
    --card: oklch(97.5% 0 0);               /* 极浅灰 #FAFAFA */
    --card-foreground: oklch(11% 0.005 60);

    /* === 次级文字 === */
    --muted-foreground: oklch(42% 0 0);     /* 中灰 #737373 */

    /* === 边框 === */
    --border: oklch(90% 0 0);              /* 浅灰 #E5E5E5 */
    --secondary: oklch(95% 0 0);           /* 区块底色 */
    --secondary-foreground: oklch(11% 0.005 60);

    /* === 强调（极少使用）=== */
    --ring: oklch(11% 0.005 60);           /* 用 foreground 本身做 accent */
    --primary: oklch(11% 0.005 60);
    --primary-foreground: oklch(99% 0 0);

    /* === 其他 === */
    --muted: oklch(95% 0 0);
    --input: oklch(90% 0 0);
    --radius: 0.125rem;                    /* 极小圆角，接近直角 */
}
```

### 色彩原则
- **不使用任何品牌色 / Accent 色**（无蓝、无紫、无金）
- 唯一允许的"强调"是 foreground（近黑）本身
- 背景始终是白或极浅灰，绝不用暖色或冷色调底色
- 价格、状态等信息仅靠字重和颜色深浅区分

---

## 三、字体系统

B&O 使用自有字体 BeoSupreme，不对外提供。**替代方案：Geist Variable（已安装）配合极低字重**。

```css
@theme inline {
    --font-sans: 'Geist Variable', 'Lexend Deca', Arial, Helvetica, sans-serif;
    --font-mono: 'Geist Mono', ui-monospace, monospace;
}
```

### 字号与字重层级

| 层级 | 字号 | 字重 | 字距 | 大小写 | 用途 |
|------|------|------|------|--------|------|
| Display | clamp(40px, 5vw, 72px) | 300 | -1px | 混合 | Hero 主标题 |
| Eyebrow | 11px | 400 | 3px | 全大写 | Section 标签、分类标签 |
| Product Name | 13–14px | 400 | 2px | 全大写 | 产品卡片名称 |
| Body | 14px | 400 | normal | 混合 | 说明文字 |
| Price | 14px | 300 | 1px | — | 价格显示 |
| Nav | 12px | 400 | 2px | 全大写 | 导航链接 |
| Mono | 11px | 400 | normal | — | 产品编码 |

**核心规则：大号展示文字用 300 极细字重；小字标签用全大写 + 宽字距替代加粗。**

---

## 四、间距系统

```
Base unit:     8px
Section gap:   py-24 (96px) 或 py-32 (128px)
Card gap:      gap-2 (8px) — 极紧密网格
内容容器:      max-w-7xl mx-auto px-6 (desktop) / px-4 (mobile)
```

**极度留白**：section 之间的间距要比正常设计大 50%。产品卡片内 padding 极小（p-3 或 p-4），信息密度低。

---

## 五、动效系统

B&O 的主 Easing：**cubic-bezier(0.165, 0.84, 0.44, 1)**（强势 ease-out，快速落地）

```tsx
// 统一 easing — 所有动效使用此曲线
const ease = [0.165, 0.84, 0.44, 1]

// Section 入场
initial={{ opacity: 0, y: 16 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: '-60px' }}
transition={{ duration: 0.6, ease }}

// 卡片 stagger
transition={{ duration: 0.5, delay: i * 0.06, ease }}

// Hover underline（用 scaleX 实现）
// 元素宽度从 0 → 1，transform-origin: left
transition={{ duration: 0.4, ease }}
```

### 交互动效规范

| 场景 | 动效 | 时长 |
|------|------|------|
| 产品图 hover | opacity 0.85 → 1.0 | 300ms |
| 链接/产品名 hover | 下方 1px 线 scaleX 0→1 | 400ms |
| Section 入场 | opacity 0→1, y 16→0 | 600ms |
| 卡片 stagger | 同上，每项延迟 60ms | 500ms |
| Nav 入场 | opacity 0→1 | 600ms |

---

## 六、组件规范

### 导航栏 (SiteNav)
- `fixed top-0 w-full z-50`，高度 `h-16 md:h-20 lg:h-[100px]`
- 背景：`bg-background/95 backdrop-blur-sm`，无下边框（B&O 无边框 nav）
- 居中 Logo（品牌名）；左侧导航链接；右侧 CTA
- 所有链接：全大写，`text-[12px] tracking-[2px]`，hover 下划线动效

### 产品网格 (ProductGrid)
- **核心布局**：`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2`（极小 gap）
- 卡片：无边框，无阴影，背景 `bg-card`
- 图片区：`aspect-[3/4]`（竖向比例，B&O 标准），`object-cover`
- 图片 hover：`opacity-85 → opacity-100`，`transition-opacity duration-300`
- 信息区：`pt-3 pb-4`
  - 产品名：全大写，`text-[13px] tracking-[2px] font-normal`
  - 类别：`text-[11px] tracking-[3px] uppercase text-muted-foreground`
  - 价格：`text-[13px] font-light tracking-wide`

### Hero Section
- 全屏或 80vh，纯白背景
- 中央对齐：超细显示字体 + 短促副标题
- 无任何装饰元素（无圆形、无渐变、无线条）
- 唯一允许的视觉元素：大幅产品图（可全出血）

### 产品详情展示 (ProductShowcase)
- 全宽区块，白色背景，左右交替（与 scenario-1 同结构但不同风格）
- 图片：`aspect-[4/3]` 或 `aspect-square`，无圆角（`rounded-none` 或 `rounded-sm`）
- 产品名：H1 大字，字重 300，全大写，字距 -1px
- 规格：极简表格样式，无背景色，仅靠 border-b 分隔
- CTA 按钮：无填充，仅下划线，全大写，`text-[12px] tracking-[2px]`

---

## 七、禁止事项（B&O 风格红线）

- ❌ 任何暖色/冷色背景（统一白色系）
- ❌ 有色 accent（无蓝、无紫、无金）
- ❌ 圆角卡片（B&O 卡片接近直角，radius 最大 2px）
- ❌ 投影/阴影（无 box-shadow，无 drop-shadow）
- ❌ 实心彩色按钮（按钮只用线框或纯文字+下划线）
- ❌ 段落文字加粗（除非是 heading）
- ❌ 多于 2 种字号在同一卡片中出现
- ❌ 装饰性图形（无图标背景、无彩色块、无线条装饰）

---

## 八、局部不规则排版原则（B&O 破格法）

这是 B&O 视觉语言中最有辨识度的特征：**在严格的网格秩序中，有意识地打破某个局部的对齐规则**，制造视觉张力，引导注意力。

### 破格的几种具体形式

**1. 文字溢出网格**
大号数字或产品名称，刻意超出其所在容器边界，与相邻图片或空白区域重叠。
```
典型实现：
- 产品编号（如 PJ001）用超大字号（text-[120px]~200px）作为背景装饰层
- position: absolute，opacity-[0.04]，不参与布局流
- 文字叠在产品图上方或下方，形成隐约的深度感
```

**2. 不对称的图文比例**
同一行内，图片列与文字列不是 50/50，而是 65/35 或 70/30，甚至是 80/20。
文字列的极度压缩让文字"悬浮"在大面积图片旁边，产生张力。

**3. 错位对齐（Offset alignment）**
相邻产品卡片在垂直方向上刻意错位（不从同一水平线开始）。
```
实现：ProductGrid 中，偶数列卡片整体向下偏移 mt-8 或 mt-12
形成"砖墙式"错位排列，打破整齐行列感
```

**4. 孤立的大字**
Section 之间插入一行单独的大型引用文字（quote 或 tagline），
打破连续的卡片流，制造节奏停顿。
字号极大（clamp(40px, 6vw, 80px)），字重极细（300），行独占全宽。

**5. 图片出血**
Hero 区域或 ProductFeature 区域，图片边缘刻意延伸到容器边界甚至出血，
不留 padding，让产品充满视野。

### 使用原则

- **克制使用**：整个页面最多 2-3 处破格，其余保持严整
- **破格必须有目的**：强调最重要的产品，或制造页面节奏的呼吸点
- **破格不破色**：颜色系统始终保持统一，破格只发生在几何/位置层面

---

## 九、整体情绪板

```
精密 · 克制 · 奢华 · 沉默
如果设计在说话，它说的是"我们不需要说话"
```

B&O 的设计是"减法设计"的极致——每一个元素的存在都必须有理由。
去掉所有可以去掉的，剩下的就是设计。
