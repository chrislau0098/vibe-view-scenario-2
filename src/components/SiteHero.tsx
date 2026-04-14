import { motion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const

const W = 1440
const H = 900
const VH = H + 80  // viewBox 底部预留缓冲，防止末尾波浪被 slice 裁切
const WAVE_COLOR = 'oklch(72% 0.04 65)'

function scrollDist(wl: number): number {
  return Math.ceil(W / wl) * wl
}

function sinePath(y: number, amplitude: number, wavelength: number): string {
  const scroll = scrollDist(wavelength)
  const total  = Math.ceil((scroll + W) / wavelength) * wavelength
  const hw = wavelength / 2
  const qw = wavelength / 4
  let d = `M 0 ${y}`
  for (let x = 0; x < total; x += wavelength) {
    d += ` C ${x + qw} ${y - amplitude} ${x + hw - qw} ${y - amplitude} ${x + hw} ${y}`
    d += ` C ${x + hw + qw} ${y + amplitude} ${x + wavelength - qw} ${y + amplitude} ${x + wavelength} ${y}`
  }
  return d
}

const waves = [
  { y: 0.13 * H, amp: 14, wl: 500, dur: 30, op: 0.55, del:   0, breathe: 8.3  },
  { y: 0.26 * H, amp: 19, wl: 580, dur: 38, op: 0.40, del: -11, breathe: 11.9 },
  { y: 0.40 * H, amp: 11, wl: 420, dur: 25, op: 0.50, del:  -5, breathe: 7.4  },
  { y: 0.53 * H, amp: 22, wl: 540, dur: 34, op: 0.38, del: -16, breathe: 13.1 },
  { y: 0.66 * H, amp: 16, wl: 470, dur: 32, op: 0.45, del:  -8, breathe: 9.6  },
  { y: 0.79 * H, amp: 13, wl: 460, dur: 27, op: 0.42, del: -20, breathe: 6.8  },
  { y: 0.87 * H, amp: 18, wl: 520, dur: 36, op: 0.38, del:  -3, breathe: 12.4 },
]

export function SiteHero() {
  return (
    <section className="relative min-h-screen bg-background flex items-center justify-center pt-16 overflow-hidden">

      <svg
        className="pointer-events-none absolute inset-0 w-full h-full"
        viewBox={`0 0 ${W} ${VH}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {waves.map((w, i) => (
          <motion.path
            key={i}
            d={sinePath(w.y, w.amp, w.wl)}
            fill="none"
            stroke={WAVE_COLOR}
            strokeWidth={1.2}
            initial={{ opacity: w.op * 0.4 }}
            animate={{
              x: [0, -scrollDist(w.wl)],
              opacity: [w.op * 0.25, w.op * 0.65],
            }}
            transition={{
              x: {
                duration: w.dur,
                repeat: Infinity,
                ease: 'linear',
                delay: w.del,
              },
              opacity: {
                duration: w.breathe,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatType: 'mirror',
                delay: i * 1.1,
              },
            }}
          />
        ))}
      </svg>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 40%, oklch(99% 0 0) 30%, oklch(99% 0 0 / 0) 100%)',
        }}
      />

      <motion.div
        className="relative z-10 text-center mx-auto px-6 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
      >
        <p className="text-[11px] tracking-[4px] uppercase text-muted-foreground">
          Automotive Radar · Precision Components
        </p>

        <h1
          className="font-light tracking-[-1px] text-foreground leading-tight"
          style={{ fontSize: 'clamp(48px, 6vw, 80px)' }}
        >
          精密雷达感知
          <br />
          驱动智驾未来
        </h1>

        <p className="text-[14px] text-muted-foreground font-light leading-relaxed whitespace-nowrap">
          专注汽车雷达核心部件研发与制造，以毫米级精度重新定义主动安全边界。
        </p>

        <div className="flex items-center justify-center gap-8 pt-2">
          <a
            href="#products"
            className="text-[12px] tracking-[2px] uppercase border-b border-foreground pb-0.5 text-foreground hover:text-muted-foreground transition-colors duration-300"
          >
            浏览产品系列
          </a>
          <a
            href="mailto:sales@autoradar.cn"
            className="text-[12px] tracking-[2px] uppercase text-muted-foreground border-b border-muted-foreground pb-0.5 hover:text-foreground hover:border-foreground transition-colors duration-300"
          >
            联系销售团队
          </a>
        </div>
      </motion.div>
    </section>
  )
}
