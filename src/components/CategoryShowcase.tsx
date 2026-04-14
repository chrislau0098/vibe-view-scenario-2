import { motion } from 'motion/react'
import { products } from '@/data/products'
import type { Product } from '@/data/products'

const SHOWCASE_IDS: Record<string, string> = {
  '传感器': 'RF-7702P',
  '核心处理部件': 'AR-PJ003',
  '发射接收部件': 'AR-PJ007',
  '激光雷达': 'AR-LR-001',
  '毫米波雷达': 'AR-MW-001',
  '组合导航系统': 'INS-001',
  '机器人控制器': 'RC-100L',
}

const CATEGORY_ORDER = [
  '传感器',
  '核心处理部件',
  '发射接收部件',
  '激光雷达',
  '毫米波雷达',
  '组合导航系统',
  '机器人控制器',
]

interface CategoryShowcaseProps {
  onProductClick: (p: Product) => void
}

export function CategoryShowcase({ onProductClick }: CategoryShowcaseProps) {
  const showcaseProducts = CATEGORY_ORDER
    .map((category) => products.find((p) => p.id === SHOWCASE_IDS[category]) ?? null)
    .filter((p): p is Product => p !== null)

  return (
    <section id="products" className="bg-background py-24">
      <div className="max-w-7xl mx-auto px-6 mb-12 space-y-2">
        <p className="text-[11px] tracking-[3px] uppercase text-muted-foreground">Products</p>
        <h2 className="text-2xl font-light tracking-tight text-foreground">产品系列</h2>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-0.5"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] as const }}
      >
        {showcaseProducts.map((product, i) => (
          <motion.button
            key={product.id}
            onClick={() => onProductClick(product)}
            className={`flex flex-col bg-background cursor-pointer text-left w-full${i === 0 ? ' col-span-2' : ''}`}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            {/* 图片区：灰底留在图片层，不扩散到文字条 */}
            <div
              className={`relative overflow-hidden ${i === 0 ? 'aspect-[3/2]' : 'aspect-[3/4] bg-muted'}`}
              style={i === 0 ? { backgroundColor: '#F7F7F7' } : undefined}
            >
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
                variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
                transition={{ duration: 0.28, ease: [0.45, 0, 0.55, 1] as const }}
              />
            </div>

            {/* 文字条：白底，无灰色分割感 */}
            <div className="px-1 pt-3 pb-4 space-y-0.5">
              <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">{product.category}</p>
              <p className="text-[14px] font-light text-foreground tracking-wide relative inline-block">
                {product.name}
                <motion.span
                  className="absolute bottom-0 left-0 h-px w-full bg-foreground"
                  style={{ originX: 0 }}
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const }}
                />
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
}
