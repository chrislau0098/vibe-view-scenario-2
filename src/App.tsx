import { useState } from 'react'
import { Agentation } from 'agentation'
import { SiteNav } from '@/components/SiteNav'
import { SiteHero } from '@/components/SiteHero'
import { CategoryShowcase } from '@/components/CategoryShowcase'
import { QuoteSection } from '@/components/QuoteSection'
import { ProductFeature } from '@/components/ProductFeature'
import { ContactSection } from '@/components/ContactSection'
import { SiteFooter } from '@/components/SiteFooter'
import { ProductModal } from '@/components/ProductModal'
import type { Product } from '@/data/products'

function App() {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteNav />
      <main>
        <SiteHero />
        <CategoryShowcase onProductClick={setActiveProduct} />
        <QuoteSection />
        <ProductFeature onProductClick={setActiveProduct} />
        <ContactSection />
      </main>
      <SiteFooter />
      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      {import.meta.env.DEV && <Agentation />}
    </div>
  )
}

export default App
