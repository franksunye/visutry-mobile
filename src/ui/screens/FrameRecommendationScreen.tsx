import { Lock } from 'lucide-react'
import { Button } from '../components/Button'
import { ScreenHeader } from '../components/ScreenHeader'
import { useAppStore } from '@core/state/store'
import type { FrameRecommendationItem } from '@core/types'

/** Rank → badge background/text color. */
const RANK_STYLE: Record<number, string> = {
  1: 'bg-lime text-ink',
  2: 'bg-brand text-ink',
  3: 'bg-orange-300 text-ink',
}

/** matchScore → pill color by threshold. */
function scorePillClass(score: number): string {
  if (score >= 90) return 'bg-lime/20 text-lime'
  if (score >= 85) return 'bg-brand/20 text-brand-700'
  return 'bg-orange-200 text-orange-600'
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
          <span className="bg-brand text-ink rounded-full px-2 py-0.5 text-xs whitespace-nowrap">
            为你推荐 TOP 3
          </span>
        }
      />

      <div className="flex flex-col gap-4 px-4 pb-8 pt-2 overflow-y-auto">
        {/* ── Dual tab system (visual only) ── */}
        <div className="flex gap-6 border-b border-ink-border">
          <div className="pb-2 border-b-2 border-brand text-sm font-semibold text-ink">
            为你推荐 TOP 3
          </div>
          <div className="pb-2 text-sm font-medium text-ink-tertiary">适合镜框</div>
        </div>

        {/* ── Recommendation list ── */}
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

        {/* ── CTA ── */}
        <Button variant="outline" size="lg" onClick={() => navigateTo('size-suggestion')}>
          <Lock size={18} />
          查看更多镜框
        </Button>
      </div>
    </div>
  )
}

function FrameCard({ frame }: { frame: FrameRecommendationItem }) {
  return (
    <div className="bg-white rounded-card p-4 shadow-sm flex items-center gap-3">
      {/* Rank badge */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
          RANK_STYLE[frame.rank] ?? 'bg-ink-border text-ink'
        }`}
      >
        {frame.rank}
      </div>

      {/* Frame info */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-base font-semibold text-ink truncate">{frame.displayName}</span>
        <span className="text-xs text-ink-secondary line-clamp-2">{frame.reason}</span>
        <span className="text-xs text-ink-tertiary line-clamp-2">{frame.stylingNote}</span>
      </div>

      {/* Match score pill */}
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${scorePillClass(
          frame.matchScore,
        )}`}
      >
        {frame.matchScore}%适合度
      </span>
    </div>
  )
}
