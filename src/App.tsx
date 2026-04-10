import { SiteNav } from '@/components/SiteNav'
import { SiteHero } from '@/components/SiteHero'
import { ProductGrid } from '@/components/ProductGrid'
import { QuoteSection } from '@/components/QuoteSection'
import { ProductFeature } from '@/components/ProductFeature'
import { ContactSection } from '@/components/ContactSection'
import { SiteFooter } from '@/components/SiteFooter'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteNav />
      <main>
        <SiteHero />
        <ProductGrid />
        <QuoteSection />
        <ProductFeature />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
