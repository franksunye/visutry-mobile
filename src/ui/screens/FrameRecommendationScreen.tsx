import { Glasses, Lock } from 'lucide-react'
import { Button } from '../components/Button'
import { ScreenHeader } from '../components/ScreenHeader'
import { useAppStore } from '@core/state/store'
import type { FrameRecommendationItem } from '@core/types'

const RANK_STYLE: Record<number, string> = {
  1: 'bg-lime/20 text-lime',
  2: 'bg-brand/20 text-brand-700',
  3: 'bg-orange-200 text-orange-600',
}

function scorePillClass(score: number): string {
  if (score >= 90) return 'bg-lime/15 text-lime'
  if (score >= 85) return 'bg-brand/15 text-brand-700'
  return 'bg-orange-100 text-orange-600'
}

export function FrameRecommendationScreen() {
  const currentReport = useAppStore((s) => s.currentReport)
  const goBack = useAppStore((s) => s.goBack)
  const navigateTo = useAppStore((s) => s.navigateTo)

  const frames = currentReport?.bestFrames ?? []

  return (
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
      <ScreenHeader
        title="推荐镜框"
        onBack={goBack}
        rightSlot={
          <span className="bg-brand/15 text-brand-700 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap">
            TOP 3
          </span>
        }
      />

      <div className="flex flex-col gap-4 px-4 pb-8 pt-2 overflow-y-auto no-scrollbar">
        {/* Segmented control */}
        <div className="bg-ink-border/50 rounded-btn p-1 flex">
          <div className="flex-1 text-center py-1.5 text-sm font-semibold text-ink bg-white rounded-[20px] shadow-sm">
            为你推荐 TOP 3
          </div>
          <div className="flex-1 text-center py-1.5 text-sm text-ink-tertiary">
            适合镜框
          </div>
        </div>

        {/* Recommendation list */}
        {frames.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-sm text-ink-tertiary">暂无镜框推荐</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {frames.map((frame, idx) => (
              <FrameCard key={frame.rank} frame={frame} delay={idx * 0.1} />
            ))}
          </div>
        )}

        {/* CTA */}
        <Button variant="outline" size="lg" onClick={() => navigateTo('size-suggestion')}>
          <Lock size={18} />
          查看更多镜框
        </Button>
      </div>
    </div>
  )
}

function FrameCard({ frame, delay }: { frame: FrameRecommendationItem; delay: number }) {
  return (
    <div
      className="bg-white rounded-card p-4 shadow-float flex items-center gap-3 animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Rank badge */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${RANK_STYLE[frame.rank] ?? 'bg-ink-border text-ink'}`}>
        {frame.rank}
      </div>

      {/* Glasses illustration placeholder */}
      <div className="w-14 h-14 rounded-btn bg-brand-50 flex items-center justify-center shrink-0">
        <Glasses size={28} className="text-ink-secondary" strokeWidth={1.5} />
      </div>

      {/* Frame info */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-base font-semibold text-ink truncate">{frame.displayName}</span>
        <span className="text-xs text-ink-secondary line-clamp-1">{frame.reason}</span>
        <span className="text-xs text-ink-tertiary line-clamp-1">{frame.stylingNote}</span>
      </div>

      {/* Match score pill */}
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold shrink-0 ${scorePillClass(frame.matchScore)}`}>
        {frame.matchScore}%
      </span>
    </div>
  )
}
