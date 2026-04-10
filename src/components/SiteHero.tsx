import { motion } from 'motion/react'

const ease = [0.165, 0.84, 0.44, 1] as const

export function SiteHero() {
  return (
    <section className="min-h-screen bg-background flex items-center justify-center pt-16">
      <motion.div
        className="text-center max-w-3xl mx-auto px-6 space-y-8"
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

        {/* 副标题 */}
        <p className="text-[14px] text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
          专注汽车雷达核心部件研发与制造，以毫米级精度重新定义主动安全边界。
        </p>

        {/* 按钮组 */}
        <div className="flex items-center justify-center gap-8 pt-2">
          <a
            href="#products"
            className="group relative text-[12px] tracking-[2px] uppercase border-b border-foreground pb-0.5 text-foreground hover:text-muted-foreground transition-colors duration-300"
          >
            浏览产品系列
          </a>
          <a
            href="mailto:sales@autoradar.cn"
            className="group relative text-[12px] tracking-[2px] uppercase text-muted-foreground border-b border-muted-foreground pb-0.5 hover:text-foreground hover:border-foreground transition-colors duration-300"
          >
            联系销售团队
          </a>
        </div>
      </motion.div>
    </section>
  )
}
