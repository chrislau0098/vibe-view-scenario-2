export function SiteFooter() {
  return (
    <footer className="border-t border-border/20 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 sm:gap-0">
        <div className="space-y-1">
          <p className="text-[12px] tracking-[3px] uppercase font-light text-foreground">
            AutoRadar
          </p>
          <p className="text-[11px] text-muted-foreground">
            汽车雷达核心部件 · 精密感知技术
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[11px] text-muted-foreground tracking-wide">
            © 2026 AutoRadar. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground/60">
            数据来源：飞书多维表格 · 产品管理
          </p>
        </div>
      </div>
    </footer>
  )
}
