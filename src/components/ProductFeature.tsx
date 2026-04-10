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
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
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
