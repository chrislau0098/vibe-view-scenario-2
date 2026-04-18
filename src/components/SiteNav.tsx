import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const ease = [0.165, 0.84, 0.44, 1] as const

const NAV_LINKS = ['产品系列', '技术规格', '应用场景']

export function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.header
        className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease }}
      >
        {/* Desktop nav — 3-column grid */}
        <div className="hidden md:grid max-w-7xl mx-auto px-6 h-[100px] grid-cols-3 items-center">
          <nav className="flex items-center gap-8">
            {NAV_LINKS.map((label) => (
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

        {/* Mobile nav — logo left, hamburger right */}
        <div className="md:hidden flex items-center justify-between px-6 h-16">
          <a href="/" className="text-[15px] tracking-[4px] uppercase font-light text-foreground">
            AutoRadar
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col items-center justify-center gap-[5px] w-8 h-8"
            aria-label={open ? '关闭菜单' : '打开菜单'}
          >
            <motion.span
              className="block w-5 h-px bg-foreground origin-center"
              animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.28, ease }}
            />
            <motion.span
              className="block w-5 h-px bg-foreground origin-center"
              animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.28, ease }}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            <nav className="flex flex-col items-center gap-10">
              {[...NAV_LINKS, '联系我们'].map((label, i) => (
                <motion.a
                  key={label}
                  href={label === '联系我们' ? '#contact' : '#'}
                  className="text-[13px] tracking-[4px] uppercase text-foreground/60 hover:text-foreground transition-colors duration-200"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease, delay: 0.05 + i * 0.07 }}
                >
                  {label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
