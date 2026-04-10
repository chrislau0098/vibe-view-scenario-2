import { motion } from 'motion/react'
import { products, type ProductCategory } from '@/data/products'

const ease = [0.165, 0.84, 0.44, 1] as const

// 4 条展示产品线（将 7 个细分类合并）
const SECTIONS: { label: string; en: string; cats: ProductCategory[] }[] = [
  { label: '雷达核心部件', en: 'Core Radar Components', cats: ['传感器', '核心处理部件', '发射接收部件', '辅助设备'] },
  { label: '激光雷达',     en: 'LiDAR',                 cats: ['激光雷达'] },
  { label: '毫米波雷达',   en: 'Millimeter-Wave Radar', cats: ['毫米波雷达'] },
  { label: '组合导航系统', en: 'Integrated Navigation',  cats: ['组合导航系统'] },
]

/**
 * 每 10 个产品中，位置 4 和 9 放大展示（col-span-2）。
 * 普通卡 aspect-[3/4]，放大卡 aspect-[3/2]，gap-0.5 时高度近似等高。
 */
function isFeatured(i: number) {
  const pos = i % 10
  return pos === 4 || pos === 9
}

export function ProductGrid() {
  return (
    <section id="products" className="bg-background py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-[11px] tracking-[3px] uppercase text-muted-foreground">
            Full Product Line
          </p>
          <h2 className="text-3xl font-light tracking-tight text-foreground">
            完整产品系列
          </h2>
          <p className="text-[13px] text-muted-foreground">
            39 款型号 · 4 条产品线
          </p>
        </motion.div>

        {/* 按产品线分区 */}
        {SECTIONS.map((section, si) => {
          const sectionProducts = products.filter(p => section.cats.includes(p.category))

          return (
            <motion.div
              key={section.label}
              className="mt-20"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: si * 0.05, ease }}
            >
              {/* 产品线标题 */}
              <div className="flex items-end justify-between border-t border-border/40 pt-5 mb-6">
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">
                    {section.en}
                  </p>
                  <h3 className="text-xl font-light tracking-tight text-foreground">
                    {section.label}
                  </h3>
                </div>
                <p className="text-[12px] text-muted-foreground/60 tabular-nums pb-0.5">
                  {sectionProducts.length} 款
                </p>
              </div>

              {/* 产品网格 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
                {sectionProducts.map((product, i) => {
                  const featured = isFeatured(i)

                  return (
                    <motion.div
                      key={product.id}
                      className={featured ? 'col-span-2' : ''}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.5, delay: (i % 10) * 0.04, ease }}
                    >
                      <div className="group">
                        {/* 图片区 */}
                        <div className={`relative overflow-hidden bg-card ${featured ? 'aspect-[3/2]' : 'aspect-[3/4]'}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover opacity-90 scale-100 group-hover:opacity-100 group-hover:scale-[1.03]"
                            style={{ transition: 'opacity 600ms ease, transform 1000ms cubic-bezier(0.45, 0, 0.55, 1)' }}
                          />
                        </div>

                        {/* 信息区 */}
                        <div className="pt-3 pb-4 space-y-1">
                          <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">
                            {product.category}
                          </p>
                          <p className="relative inline-block text-[13px] tracking-[2px] uppercase font-normal text-foreground">
                            <span className="relative">
                              {product.name}
                              <span className="absolute bottom-0 left-0 w-full h-px bg-foreground scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                            </span>
                          </p>
                          <p className="text-[13px] font-light text-foreground/70">
                            ¥{product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}

      </div>
    </section>
  )
}
