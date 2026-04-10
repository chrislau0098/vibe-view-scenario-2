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
