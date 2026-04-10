import { motion } from 'motion/react'
import { products } from '@/data/products'

const ease = [0.165, 0.84, 0.44, 1] as const

/**
 * 4 列网格，每 10 个产品中，位置 4 和 9 放大展示（col-span-2）。
 *
 * 行高自动对齐原理：
 *   普通卡  1 列宽，aspect-[3/4] → 高 = W × 4/3
 *   放大卡  2 列宽，aspect-[3/2] → 高 = 2W × 2/3 = W × 4/3  ✓ 等高
 *
 * 每 10 个产品填满 3 行：
 *   行 1：[0][1][2][3]
 *   行 2：[4 feat ×2][5][6]
 *   行 3：[7][8][9 feat ×2]
 */
function isFeatured(i: number): boolean {
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
            39 款型号 · 7 条产品线
          </p>
        </motion.div>

        {/* 产品网格 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-12">
          {products.map((product, i) => {
            const isActive = product.status === '上架'
            const featured = isFeatured(i)

            return (
              <motion.div
                key={product.id}
                className={featured ? 'col-span-2' : ''}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (i % 10) * 0.04, ease }}
              >
                <div className={`group ${!isActive ? 'opacity-40 pointer-events-none' : ''}`}>
                  {/* 图片区：普通 3:4 竖版，放大 3:2 横版，行高自动对齐 */}
                  <div className={`overflow-hidden bg-card ${featured ? 'aspect-[3/2]' : 'aspect-[3/4]'}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full object-cover ${
                        isActive
                          ? 'opacity-90 group-hover:opacity-100 transition-opacity duration-300'
                          : ''
                      }`}
                    />
                  </div>

                  {/* 信息区 */}
                  <div className="pt-3 pb-4 space-y-1">
                    <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">
                      {product.category}
                    </p>
                    <p className="relative inline-block text-[13px] tracking-[2px] uppercase font-normal text-foreground group cursor-default">
                      <span className="relative">
                        {product.name}
                        {isActive && (
                          <span className="absolute bottom-0 left-0 w-full h-px bg-foreground scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                        )}
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
      </div>
    </section>
  )
}
