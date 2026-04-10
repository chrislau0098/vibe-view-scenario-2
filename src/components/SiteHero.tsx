import { motion } from 'motion/react'

const ease = [0.165, 0.84, 0.44, 1] as const

export function SiteHero() {
  return (
    <section className="relative min-h-screen bg-background flex items-center justify-center pt-16 overflow-hidden">

      {/* 纹理层：极细噪点，增加高级感 */}
      <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.035]" aria-hidden="true">
        <filter id="hero-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise)" />
      </svg>

      {/* 极淡径向渐变：中心微亮，边缘略暗，增加层次 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, oklch(98% 0 0) 0%, oklch(96% 0 0) 100%)',
        }}
      />

      {/* 内容 */}
      <motion.div
        className="relative z-10 text-center mx-auto px-6 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
      >
        {/* Eyebrow */}
        <p className="text-[11px] tracking-[4px] uppercase text-muted-foreground">
          Automotive Radar · Precision Components
        </p>

        {/* 主标题 */}
        <h1
          className="font-light tracking-[-1px] text-foreground leading-tight"
          style={{ fontSize: 'clamp(48px, 6vw, 80px)' }}
        >
          精密雷达感知
          <br />
          驱动智驾未来
        </h1>

        {/* 副标题 — 单行不换行 */}
        <p className="text-[14px] text-muted-foreground font-light leading-relaxed whitespace-nowrap">
          专注汽车雷达核心部件研发与制造，以毫米级精度重新定义主动安全边界。
        </p>

        {/* 按钮组 */}
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
