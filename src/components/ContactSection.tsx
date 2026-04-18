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
        <div className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-8 pt-2">
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
