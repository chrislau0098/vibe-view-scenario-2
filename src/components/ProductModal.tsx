import { Dialog } from '@base-ui/react/dialog'
import { motion } from 'motion/react'
import type { Product } from '@/data/products'
import { parseKeyParams } from '@/data/products'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  return (
    <Dialog.Root open={product !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/50 z-[60]" />
        <Dialog.Popup className="fixed inset-0 z-[61] flex items-center justify-center p-4 md:p-10 overflow-y-auto">
          {product && (
            <motion.div
              className="bg-background w-full max-w-5xl max-h-[92vh] overflow-y-auto"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.165, 0.84, 0.44, 1] as const }}
            >
              {/* Header — 吸顶，滚动时不随内容移动 */}
              <div className="sticky top-0 z-10 bg-background px-6 md:px-14 pt-7 md:pt-10 pb-6 md:pb-7 flex items-start justify-between border-b border-border/20">
                <div className="space-y-1.5">
                  <p className="text-[10px] tracking-[3px] uppercase text-muted-foreground">
                    {product.code} · {product.category}
                  </p>
                  <h2 className="text-2xl font-light tracking-tight text-foreground leading-snug">
                    {product.name}
                  </h2>
                </div>
                <Dialog.Close className="text-[11px] tracking-[2px] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 mt-1 shrink-0 ml-8">
                  关闭
                </Dialog.Close>
              </div>

              {/* Body — 左图右文双列 */}
              <div className="grid md:grid-cols-2">

                {/* 左侧：图片区，带内边距，object-contain 防止裁切 */}
                <div className="bg-card p-10 flex items-center justify-center min-h-[380px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full max-h-[440px] object-contain"
                  />
                </div>

                {/* 右侧：内容区 */}
                <div className="px-6 md:px-14 py-10 md:py-14 flex flex-col gap-10">

                  {/* 产品简介（首句） */}
                  <p className="text-[13px] text-muted-foreground font-light leading-relaxed">
                    {product.tagline.split('。')[0]}。
                  </p>

                  {/* 关键参数：2 列网格，全量展示，无 slice */}
                  {parseKeyParams(product.keyParams).length > 0 && (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-0 border-t border-border">
                      {parseKeyParams(product.keyParams).map((param) => (
                        <div key={param.label} className="py-3 border-b border-border/40">
                          <p className="text-[10px] tracking-[2px] uppercase text-muted-foreground leading-none mb-2.5">
                            {param.label}
                          </p>
                          <p className="text-[14px] font-light text-foreground leading-snug">
                            {param.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 参考价格 */}
                  <div>
                    <p className="text-[10px] tracking-[2px] uppercase text-muted-foreground">参考价格</p>
                    <p className="text-[18px] font-light text-foreground mt-1">
                      ¥{product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-8 border-t border-border/30 pt-6">
                    <a
                      href="/datasheet.zip"
                      download
                      className="text-[11px] tracking-[2px] uppercase text-muted-foreground border-b border-muted-foreground pb-px hover:text-foreground hover:border-foreground transition-colors duration-200"
                    >
                      下载资料
                    </a>
                    <a
                      href={`mailto:sales@autoradar.cn?subject=询价：${product.name}（${product.code}）`}
                      className="text-[11px] tracking-[2px] uppercase text-foreground border-b border-foreground pb-px hover:text-muted-foreground hover:border-muted-foreground transition-colors duration-200"
                    >
                      询价咨询
                    </a>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
