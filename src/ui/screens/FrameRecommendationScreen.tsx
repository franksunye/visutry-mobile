import { ChevronLeft } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import type { FrameRecommendationItem } from '@core/types'

export function FrameRecommendationScreen() {
  const currentReport = useAppStore((s) => s.currentReport)
  const goBack = useAppStore((s) => s.goBack)
  const navigateTo = useAppStore((s) => s.navigateTo)

  const frames = currentReport?.bestFrames ?? []

  return (
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-12 pt-safe shrink-0 bg-white">
        <button type="button" onClick={goBack} className="p-1 -ml-1 active:scale-90 transition-transform">
          <ChevronLeft size={24} className="text-ink" />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold text-ink">推荐镜框</h1>
          <span className="bg-brand text-ink rounded-full px-2 py-0.5 text-[10px] font-medium">
            为你推荐 TOP 3
          </span>
        </div>
        <div className="w-7" />
      </header>

      <div className="flex flex-col gap-3 px-4 pb-8 pt-3 overflow-y-auto no-scrollbar flex-1">
        {/* Segmented control */}
        <div className="bg-ink-border/60 rounded-full p-1 flex">
          <div className="flex-1 text-center py-1.5 text-sm font-medium text-ink bg-white rounded-full shadow-sm">
            推荐镜框
          </div>
          <div className="flex-1 text-center py-1.5 text-sm text-ink-tertiary">
            适合镜框
          </div>
        </div>

        {/* Recommendation cards */}
        {frames.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-sm text-ink-tertiary">暂无镜框推荐</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {frames.map((frame) => (
              <FrameCard key={frame.rank} frame={frame} />
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={() => navigateTo('size-suggestion')}
          className="w-full h-13 py-3.5 bg-brand text-ink font-semibold text-base rounded-btn flex items-center justify-center gap-1 active:scale-[0.98] transition-transform shadow-brand mt-2"
        >
          查看更多镜框
        </button>
      </div>
    </div>
  )
}

function FrameCard({ frame }: { frame: FrameRecommendationItem }) {
  return (
    <div className="bg-white rounded-card p-4 shadow-card flex items-center gap-4">
      {/* Glasses illustration */}
      <div className="w-16 h-16 rounded-btn bg-ink-bg flex items-center justify-center shrink-0">
        <GlassesIllustration type={frame.type} />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-base font-semibold text-ink">{frame.displayName}</span>
        <span className="text-xs text-ink-secondary">{frame.reason}</span>
      </div>

      {/* Match score */}
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold shrink-0 ${
        frame.matchScore >= 90 ? 'bg-lime/20 text-lime' : frame.matchScore >= 85 ? 'bg-brand/20 text-brand-700' : 'bg-orange-100 text-orange-600'
      }`}>
        {frame.matchScore}% 适合度
      </span>
    </div>
  )
}

/** Simple line-drawing glasses illustrations by type */
function GlassesIllustration({ type }: { type: string }) {
  const stroke = '#666666'
  if (type === 'round') {
    return (
      <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
        <circle cx="10" cy="12" r="7" stroke={stroke} strokeWidth="1.5" />
        <circle cx="30" cy="12" r="7" stroke={stroke} strokeWidth="1.5" />
        <line x1="17" y1="12" x2="23" y2="12" stroke={stroke} strokeWidth="1.5" />
      </svg>
    )
  }
  if (type === 'aviator') {
    return (
      <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
        <path d="M3 8 L17 8 L15 18 Q10 20 5 16 Z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M23 8 L37 8 L35 18 Q30 20 25 16 Z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="17" y1="9" x2="23" y2="9" stroke={stroke} strokeWidth="1.5" />
      </svg>
    )
  }
  // square
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
      <rect x="3" y="6" width="14" height="12" rx="2" stroke={stroke} strokeWidth="1.5" />
      <rect x="23" y="6" width="14" height="12" rx="2" stroke={stroke} strokeWidth="1.5" />
      <line x1="17" y1="12" x2="23" y2="12" stroke={stroke} strokeWidth="1.5" />
    </svg>
  )
}
