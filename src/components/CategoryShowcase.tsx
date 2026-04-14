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
          <button
            key={product.id}
            onClick={() => onProductClick(product)}
            className={`group flex flex-col bg-background cursor-pointer text-left w-full${i === 0 ? ' col-span-2' : ''}`}
          >
            {/* 图片区：灰底留在图片层，不扩散到文字条 */}
            <div
              className={`relative overflow-hidden ${i === 0 ? 'aspect-[3/2]' : 'aspect-[3/4] bg-muted'}`}
              style={i === 0 ? { backgroundColor: '#F7F7F7' } : undefined}
            >
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-contain ${i === 0 ? 'scale-[1.20] group-hover:scale-[1.24]' : 'scale-100 group-hover:scale-[1.04]'}`}
                style={{ transition: 'transform 1000ms cubic-bezier(0.45, 0, 0.55, 1)' }}
              />
            </div>

            {/* 文字条：白底，无灰色分割感 */}
            <div className="px-1 pt-3 pb-4 space-y-0.5">
              <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">{product.category}</p>
              <p className="text-[12px] font-light text-foreground tracking-wide">{product.name}</p>
            </div>
          </button>
        ))}
      </motion.div>
    </section>
  )
}
