import { motion } from 'motion/react'
import { products, parseKeyParams } from '@/data/products'
import type { Product } from '@/data/products'

const ease = [0.165, 0.84, 0.44, 1] as const

const FEATURED_IDS = ['RF-7701L', 'AR-PJ005', 'IR-LR-001', 'IR-MW-006', 'INS-005']

export function ProductFeature({ onProductClick }: { onProductClick: (p: Product) => void }) {
  const featured = FEATURED_IDS.map(id => products.find(p => p.id === id)!)

  return (
    <section className="bg-card py-24">
      <div className="max-w-7xl mx-auto px-6 space-y-0">
        {featured.map((product, i) => {
          const isReversed = i % 2 === 1
          const bgNum = product.id.replace('AR-', '')

          return (
            <motion.div
              key={product.id}
              className={`relative overflow-hidden grid lg:grid-cols-[6fr_4fr] border-b border-border/20 ${isReversed ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease }}
            >
              {/* 超大背景编号 — 破格 */}
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
              <div className="relative z-10 overflow-hidden bg-background min-h-[400px]">
                <button
                  className="w-full h-full block absolute inset-0"
                  onClick={() => onProductClick(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>

              {/* 文字侧 */}
              <div className="relative z-10 px-12 lg:px-20 py-[200px] flex flex-col justify-center space-y-6 bg-card">
                {/* Eyebrow */}
                <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">
                  {product.code} · {product.category}
                </p>

                {/* 产品名：text-balance 防止孤字换行 */}
                <h3
                  className="font-light tracking-tight uppercase text-foreground leading-tight text-pretty"
                  style={{ fontSize: 'clamp(24px, 2.4vw, 38px)' }}
                >
                  {product.name}
                </h3>

                {/* 规格列表：只展示 4 条核心参数 */}
                <div className="border-t border-border">
                  {parseKeyParams(product.keyParams).slice(0, 4).map((param) => (
                    <div
                      key={param.label}
                      className="flex justify-between border-b border-border py-3 gap-4"
                    >
                      <span className="text-[11px] tracking-[2px] uppercase text-muted-foreground shrink-0">
                        {param.label}
                      </span>
                      <span className="text-[13px] font-light text-foreground text-right">
                        {param.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA — 不加 border-t，上方最后一行参数的 border-b 已作分割 */}
                <div className="pt-2 flex items-center gap-8">
                  <button
                    onClick={() => onProductClick(product)}
                    className="text-[12px] tracking-[2px] uppercase border-b border-foreground pb-px text-foreground hover:text-muted-foreground hover:border-muted-foreground transition-colors duration-300"
                  >
                    查看详情
                  </button>
                  <a
                    href={`mailto:sales@autoradar.cn?subject=询价：${product.name}（${product.code}）`}
                    className="text-[12px] tracking-[2px] uppercase text-muted-foreground border-b border-muted-foreground pb-px hover:text-foreground hover:border-foreground transition-colors duration-300"
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
