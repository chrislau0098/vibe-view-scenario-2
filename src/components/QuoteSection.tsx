import { motion } from 'motion/react'

const ease = [0.165, 0.84, 0.44, 1] as const

export function QuoteSection() {
  return (
    <section className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.p
          className="font-light tracking-[-1px] text-foreground/80"
          style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease }}
        >
          感知每一毫米的精度
        </motion.p>
      </div>
    </section>
  )
}
