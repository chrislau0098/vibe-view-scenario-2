# Design System: Minimalist Luxury — B&O Inspired

> **Reference:** Bang & Olufsen (bang-olufsen.com) visual language
> **Keywords:** Minimalist Luxury · Restrained · Editorial · Precision
> **Applicable Scope:** Industrial product showcase, premium brand site, precision-tech portfolio — any scenario where the product itself is the sole visual protagonist

---

## 1. Visual Theme & Atmosphere

A surgically restrained, gallery-airy interface that communicates luxury through absence. The atmosphere is that of a high-end showroom — expansive white walls, a single object under soft light, and typography so quiet it whispers authority. Every element earns its place; decoration is treated as noise.

| Dimension | Rating | Description |
|-----------|--------|-------------|
| **Density** | 2/10 — Art Gallery Airy | Extreme whitespace. Sections breathe with 96–200px vertical padding. Card padding minimal (12–16px), information sparse |
| **Variance** | 5/10 — Controlled Asymmetric | Strict grid baseline with intentional "breaks" — asymmetric image/text splits (57:43), col-span jumps, oversized ghost typography. Breaks are surgical, never chaotic |
| **Motion** | 4/10 — Fluid Restrained | Smooth ease-out transitions (600–800ms). No spring physics, no bouncing, no perpetual loops. Motion communicates entrance, never draws attention to itself |

**Design Philosophy:**
- Near-black + pure white duotone — virtually no other colors intervene
- Generous whitespace replaces decorative elements
- The product (image) is the only visual protagonist
- Typography is lightweight, uppercase, letter-spaced — conveys precision, not power
- Interaction feels fluid but never theatrical

---

## 2. Color Palette & Roles

All colors in OKLCH color space for perceptual uniformity. **Zero accent color** — the darkest neutral is the only "emphasis."

| Semantic Name | Value | Role |
|---------------|-------|------|
| **Canvas White** | `oklch(99% 0 0)` | Primary background surface, Hero background |
| **Surface Ash** | `oklch(97.5% 0 0)` | Card fill, image container background, feature text-side background |
| **Whisper Gray** | `oklch(95% 0 0)` | Secondary/muted surface, subtle section differentiation |
| **Warm Ink** | `oklch(11% 0.005 60)` | Primary text, brand name, headings — near-black with warm micro-tint |
| **Steel Muted** | `oklch(42% 0 0)` | Secondary text, metadata, eyebrow labels, timestamps |
| **Border Veil** | `oklch(90% 0 0)` | Structural borders, input outlines — always used at 20–40% opacity |
| **Destructive** | `oklch(57.7% 0.245 27.325)` | Error states only, never decorative |

### Color Principles
- **Zero accent color.** No blue, no purple, no gold. The only "emphasis" is Warm Ink itself
- Backgrounds: always white or near-white. Never warm-tinted, never cool-tinted
- Hierarchy is communicated through weight and opacity, not hue
- Borders always at reduced opacity (`border-border/20` to `border-border/40`) — barely visible structural lines
- Focus ring uses Warm Ink — same as foreground, not a separate highlight color

### Dark Mode Tokens (optional, pre-configured)
| Semantic Name | Value |
|---------------|-------|
| Canvas | `oklch(14.5% 0 0)` |
| Surface | `oklch(20.5% 0 0)` |
| Foreground | `oklch(98.5% 0 0)` |
| Muted Foreground | `oklch(70.8% 0 0)` |
| Border | `oklch(100% 0 0 / 10%)` |

---

## 3. Typography Rules

### Font Stack
- **Sans:** `'Geist Variable', sans-serif` — primary typeface for everything
- **Mono:** `'Geist Mono', ui-monospace, monospace` — product codes, technical specs, WebGL glyph atlas
- **Dependency:** `@fontsource-variable/geist`

### Type Scale

| Level | Size | Weight | Letter-Spacing | Case | Usage |
|-------|------|--------|----------------|------|-------|
| Display | `clamp(48px, 6vw, 80px)` | 300 | -1px | Mixed | Hero headline |
| Section Heading | `text-2xl` to `text-3xl` | 300 | tracking-tight | Mixed | Section titles |
| Feature Heading | `clamp(24px, 2.4vw, 38px)` | 300 | tracking-tight | Uppercase | Feature block titles |
| Pull Quote | `clamp(32px, 5vw, 64px)` | 300 | -1px | Mixed | Full-width rhythm breaker |
| Eyebrow | 10–11px | 400 | 3–4px | Uppercase | Section labels, category tags |
| Item Name | 13–14px | 400 | 2px | Uppercase | Card titles |
| Body | 13–15px | 300 | normal to wide | Mixed | Descriptions, subtitles |
| Price (card) | 13px | 300 | — | — | Inline price display |
| Price (detail) | 18px | 300 | — | — | Modal / feature price |
| Nav Link | 11px | 400 | 2px | Uppercase | Navigation |
| Brand Mark | 16px | 300 | 4px | Uppercase | Centered brand name in nav |
| CTA | 11–14px | 400 | 2px | Uppercase | Action links |
| Mono / Code | 10–11px | 400 | normal | — | Product codes, spec metadata |

### Core Typographic Rules
- **Large display text:** weight 300 (ultra-light) + negative letter-spacing. Feels precise, not loud
- **Small labels:** uppercase + wide letter-spacing replaces bold. Never use font-weight > 400 on text below 16px
- **No bold body text.** Emphasis through color depth or spacing, never weight (except headings)
- **Line length:** Body text constrained to 65ch maximum via container width
- **Banned fonts:** Inter, system-ui defaults, any generic serif. Geist only

---

## 4. Spacing & Layout Principles

### Spacing Scale (8px base unit)

| Context | Value | Note |
|---------|-------|------|
| Section vertical padding | `py-24` (96px) | Generous breathing room between sections |
| Quote section padding | `py-20` (80px) | Slightly tighter for rhythm breaker |
| Feature text-side padding | `py-[200px]` | Extreme — intentionally luxurious vertical space |
| Card grid gap | `gap-0.5` (2px) | Near-seamless grid, images almost touching |
| Card info padding | `pt-3 pb-4` (12px / 16px) | Minimal, low information density |
| Content container | `max-w-7xl mx-auto px-6` | Consistent horizontal containment |
| Modal body padding | `px-10 md:px-14, py-14` | Generous internal breathing room |
| Section sub-header | `mt-20, border-t pt-5 mb-6` | Thin divider + space before grid |

### Layout Patterns

**Navigation:** Fixed top, three-column CSS Grid (`grid-cols-3`). Left: nav links. Center: brand mark. Right: CTA. Height `h-16` mobile, `h-[100px]` desktop. Background `bg-background/95 backdrop-blur-sm`. No bottom border.

**Product Grid:** `grid grid-cols-2 md:grid-cols-4 gap-0.5`. Images at `aspect-[3/4]` (portrait). Featured items use `col-span-2` + `aspect-[3/2]` (landscape) to break the rhythm.

**Feature Block (alternating):** Two-column `grid-cols-[8fr_6fr]` — image-heavy asymmetry (57:43). Even rows reverse column order. Each block separated by `border-b border-border/20`.

**Detail Modal:** Full overlay (`z-60` backdrop, `z-61` popup). Two-column body: left image on Surface Ash background (`object-contain`), right text with specs and CTA. Sticky header with close button (text, no icon).

**Pull Quote:** Full-width centered single line. Breaks the card-grid rhythm, creates a breathing pause between dense sections.

### Responsive Rules
- **Mobile-first collapse (< 768px):** All multi-column layouts collapse to single column
- **Typography scaling:** All display text uses `clamp()`. Body text minimum 13px
- **Touch targets:** All interactive elements minimum 44px tap area
- **Container padding:** `px-6` (24px) on all breakpoints — no horizontal squeeze on mobile
- **Navigation:** Desktop horizontal links, mobile adapts to simplified layout
- **Viewport height:** Use `min-h-screen`, never `h-screen` (iOS Safari viewport jump)

---

## 5. Component Stylings

### Buttons / CTA
**No solid buttons anywhere.** All CTAs are text + bottom border (underline):

```
/* Primary CTA — dark text, dark underline */
text-foreground border-b border-foreground pb-px
hover: text-muted-foreground border-muted-foreground

/* Secondary CTA — muted text, muted underline */
text-muted-foreground border-b border-muted-foreground pb-px
hover: text-foreground border-foreground
```
- Always uppercase, 11–14px, tracking-[2px]
- Hover inverts the primary/secondary color relationship
- `transition-colors duration-200` or `duration-300`
- CTAs appear in pairs (primary + secondary), horizontally spaced `gap-8`

### Cards (Product Grid)
- No border, no shadow, no rounded corners (`--radius: 0.125rem` ≈ 2px max)
- Background: Surface Ash for image area, Canvas White for info area
- Image: `object-cover` with `opacity-90` default → `opacity-100` on hover
- Info zone: eyebrow (category, 10px uppercase) → name (13px uppercase, hover underline) → price (13px, font-light)
- Maximum 2 font sizes per card — no exceptions

### Cards (Showcase — with motion variants)
- Image: `object-contain` (product floating on Surface Ash)
- Hover: scale 1→1.04 via `motion/react` variant propagation (not CSS transition — see Motion section for why)
- Underline animation via `motion.span` with `variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}`

### Modal / Detail View
- Max width `max-w-5xl`, max height `max-h-[92vh]`, scrollable
- Sticky header: product code + name + text close button
- Two-column body on desktop, single column on mobile
- Spec table: no background, only `border-b` dividers. Label 10px / Value 14px / `py-3` per cell
- Price displayed at 18px font-light
- CTA row: underline links only, no solid buttons

### Navigation Bar
- `fixed top-0 w-full z-50`
- `bg-background/95 backdrop-blur-sm` — no bottom border line
- Brand mark centered, all links uppercase 11px with hover underline animation
- No hamburger menu icon — text-based interaction only

### Footer
- `border-t border-border/20 py-12`
- Two-end justified: brand info left, copyright right
- All text 11–12px, font-light or muted color

---

## 6. Motion & Interaction

### Engine
`motion/react` (framer-motion v11+). Import as `import { motion } from 'motion/react'`.

### Easing Curves — Two Only

| Curve | Value | Character | Usage |
|-------|-------|-----------|-------|
| **Standard** | `[0.165, 0.84, 0.44, 1]` | Confident ease-out, fast landing | Section entrance, card stagger, modal, nav |
| **Hero** | `[0.16, 1, 0.3, 1]` | Aggressive ease-out, very slow settle | Hero block entrance only |

**CRITICAL: Easing must be cubic-bezier arrays, never strings.** `ease: 'easeOut'` causes TypeScript errors with motion/react. Always use `ease: [0.165, 0.84, 0.44, 1]`.

### Entrance Animations

| Element | Initial | Animate/WhileInView | Duration | Trigger |
|---------|---------|---------------------|----------|---------|
| Hero content | `opacity:0, y:20` | `opacity:1, y:0` | 800ms (Hero curve) | `animate` (immediate) |
| Section block | `opacity:0, y:16` | `opacity:1, y:0` | 600ms (Standard curve) | `whileInView`, once, margin `-60px` |
| Card (stagger) | `opacity:0, y:12` | `opacity:1, y:0` | 500ms, delay `i*0.04` | `whileInView`, once |
| Section group (stagger) | Same as section | Same | 600ms, delay `si*0.05` | `whileInView`, once |
| Navigation | `opacity:0` | `opacity:1` | 600ms (Standard curve) | `animate` (immediate) |
| Modal panel | `opacity:0, y:12` | `opacity:1, y:0` | 400ms (Standard curve) | `animate` (immediate) |
| Pull quote | `opacity:0, y:12` | `opacity:1, y:0` | 800ms (Standard curve) | `whileInView`, once |

### Hover Interactions

| Element | Effect | Duration | Implementation |
|---------|--------|----------|----------------|
| Grid image | opacity 0.90→1.0 + scale 1→1.03 | 600ms / 1000ms | CSS inline `transition` on `<img>` |
| Showcase image | scale 1→1.04 | 280ms | `motion.img` with `variants` |
| Text link / item name | 1px underline scaleX 0→1 from left | 280–400ms | CSS `group-hover` or `motion.span` variants |
| Color transitions | foreground ↔ muted-foreground | 200–300ms | CSS `transition-colors` |

### Hover Underline — Two Implementation Paths

**Path A: CSS `group-hover`** — simpler, for elements where parent is a plain `<div>` or `<a>`.
```
<span class="absolute bottom-0 left-0 w-full h-px bg-foreground
  scale-x-0 origin-left group-hover:scale-x-100
  transition-transform duration-300" />
```

**Path B: motion variant propagation** — required when Tailwind v4's `scale-[x]` generates standalone CSS `scale:` property (not `transform: scale()`), causing CSS `group-hover` transitions to silently fail.
```tsx
// Parent: whileHover="hover", child inherits via variants
<motion.span
  style={{ originX: 0 }}
  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
  transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
/>
```
**When to use Path B:** Whenever the hover target is a `<motion.button>` or `<motion.div>` that already uses `whileHover` for image scaling. The variant propagation pattern ensures both image scale and underline animate from the same hover trigger.

### Motion Anti-Patterns
- No spring physics — this aesthetic is precision, not playfulness
- No perpetual loops or infinite animations (except WebGL background)
- No bounce, no overshoot, no elastic
- No `transition: transform` on elements using Tailwind v4 `scale-[x]` utility (use motion variants instead)

---

## 7. Generative Background Effects (WebGL)

For Hero sections requiring ambient visual texture, use WebGL full-screen effects rather than static backgrounds or CSS gradients. The effect should be barely perceptible — atmospheric, not attention-grabbing.

### ASCII Beam Pattern (Proven Implementation)

**Technique:** WebGL fragment shader + glyph atlas. All computation on GPU, main thread only calls `drawArrays` once per frame.

**Glyph Atlas Construction:**
- Character set: `.:-=+*#%@01` (11 chars, ordered by visual density from sparse to dense)
- Rendered to a single-row Canvas 2D at 2x Retina scale, uploaded as `TEXTURE_2D`
- Font: Geist Mono, cell size 8x12 CSS pixels
- **Must call** `gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)` before `texImage2D` — Canvas 2D origin (top-left) vs WebGL texture origin (bottom-left)

**Fragment Shader Core:**
- Domain warping: two-layer FBM (4 octaves, 37deg rotation matrix `mat2(0.8,-0.6,0.6,0.8)`)
- Quintic smoothstep for C2 continuity: `f*f*f*(f*(f*6-15)+10)`
- Hash: mediump-safe `fract(p * vec2(0.1031, 0.1030))` + dot expansion
- Contrast shaping: `smoothstep(0.18, 0.72, raw)` then `pow(s, 1.8)` → ~70% character coverage
- Character opacity: `shaped * 0.32` — very subtle, text remains fully readable
- Background: `vec3(0.992)` matching Canvas White

**Speed Control:** `u_time * 0.88` — slow enough to feel ambient, fast enough to notice movement.

**Readability Mask:** Radial gradient overlay above Canvas:
```css
background: radial-gradient(ellipse 70% 55% at 50% 40%, oklch(99% 0 0) 30%, oklch(99% 0 0 / 0) 100%);
```
Center clear zone ensures headline text remains readable; effect visible at edges.

### Tuning Principles (smoothstep + pow)
- `smoothstep(low, high, x)`: lower `low` → more cells enter transition zone → higher character coverage
- `pow(s, n)`: higher `n` → peak zones shrink (fewer dense black chars); lower `n` → flatter distribution
- Current `smoothstep(0.18, 0.72) + pow(1.8)` is calibrated for "barely visible ambient texture"

### Performance Constraints
- **Full-screen character/pixel effects MUST use WebGL + glyph atlas.** Canvas 2D `fillText()` per cell per frame causes 14k–22k main-thread draw calls at 1440p — unacceptable jank
- Always check `gl.getShaderInfoLog()` in compile step — GLSL errors are silent (blank canvas, no console error)
- **GLSL reserved words** (`half`, `input`, `output`) cause silent shader compile failure — never use as variable names
- ResizeObserver + Canvas: use `ctx.setTransform(dpr,0,0,dpr,0,0)` not `ctx.scale(dpr,dpr)` — the latter accumulates on repeated resize

---

## 8. Controlled Grid-Breaking (Asymmetric Tension)

The signature visual technique: **within strict grid order, intentionally break alignment at specific points** to create tension and direct attention. This is what separates the design from generic grid layouts.

### Permitted Break Types

**1. Ghost Typography**
Oversized text (120–200px) as a decorative background layer. `position: absolute`, `opacity-[0.03–0.05]`, outside layout flow. Creates depth without competing with content. Use product codes, section numbers, or abstract characters.

**2. Asymmetric Column Splits**
Image/text columns at unequal ratios (`8fr/6fr`, `7fr/5fr`) instead of 50/50. The compressed text side + generous padding creates a floating effect.

**3. Col-Span Rhythm Breaks**
In a uniform grid, specific items expand to `col-span-2` with different aspect ratios. This breaks the equal-width repetition and creates visual anchor points. Place sparingly (e.g., 1 in every 5–7 items).

**4. Pull Quote Interruption**
A full-width centered oversized text block between dense grid sections. Creates a breathing pause, resets the viewer's rhythm before the next content block.

**5. Image Bleed**
Hero or feature images extending to container edge with zero padding, filling the viewer's peripheral vision.

### Break Principles
- **Maximum 2–3 breaks per full page.** The rest must remain strictly aligned
- **Every break must have purpose:** emphasize the most important item, or create rhythm breathing
- **Breaks never touch color:** the palette remains uniform. Breaks happen only in geometry, position, and scale
- **Alternate direction:** If one feature block has image-left, the next has image-right

---

## 9. Anti-Patterns (NEVER DO)

### Color Bans
- No colored accents — no blue, no purple, no gold, no teal
- No warm or cool tinted backgrounds — white and neutral gray only
- No gradient text, no gradient backgrounds (except the WebGL readability mask)
- No pure black `#000000` — use Warm Ink `oklch(11% 0.005 60)` with its warm micro-tint

### Typography Bans
- No Inter font — ever
- No generic serif fonts (Times, Georgia, Garamond)
- No bold (font-weight > 400) on body text — emphasis through color depth only
- No more than 2 font sizes in a single card component

### Component Bans
- No solid filled buttons — text + underline only
- No box-shadow or drop-shadow on any element
- No rounded corners beyond 2px (`--radius: 0.125rem`)
- No icon buttons — all interactions use text labels
- No decorative graphics (icon backgrounds, colored blocks, line ornaments)
- No loading spinners — use skeletal shimmer if needed

### Layout Bans
- No 3-column equal card rows — use 2-col or 4-col with col-span breaks
- No centered Hero with symmetric left-right padding (for variance > 4)
- No overlapping elements (except Ghost Typography at < 5% opacity)
- No horizontal scroll on any viewport

### Motion Bans
- No spring physics, no bounce, no elastic overshoot
- No perpetual UI animations (infinite spin, pulse, float)
- No `ease: 'easeOut'` string — must be cubic-bezier array `[n, n, n, n]`
- No CSS `group-hover` scale transitions when using Tailwind v4 `scale-[x]` utility — use motion variant propagation instead

### AI Generation Bans
- No blue-purple gradients + Inter font + nested cards ("AI default aesthetic")
- No emoji anywhere in the interface
- No AI copywriting cliches ("Elevate", "Seamless", "Unleash", "Next-Gen", "Cutting-Edge")
- No filler UI text ("Scroll to explore", "Swipe down", bouncing scroll arrows)
- No generic placeholder names ("John Doe", "Acme Corp")
- No round demo numbers (`99.99%`, `10,000+`)

---

## 10. Mood Board

```
Precision · Restraint · Luxury · Silence

If this design could speak, it would say:
"We don't need to speak."
```

B&O design is subtraction taken to its extreme — every element must justify its existence. Remove everything that can be removed. What remains is the design.
