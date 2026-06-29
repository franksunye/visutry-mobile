import { Check, RotateCcw, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Button } from '../components/Button'
import { useAppStore } from '@core/state/store'
import type { CanonicalFaceShape } from '@core/types'

const SHAPE_LABELS: Record<CanonicalFaceShape, string> = {
  oval: 'Oval',
  round: 'Round',
  square: 'Square',
  heart: 'Heart',
  diamond: 'Diamond',
  oblong: 'Oblong',
  triangle: 'Triangle',
}

export function ResultScreen() {
  const geometry = useAppStore((s) => s.localGeometry)
  const recommendation = useAppStore((s) => s.recommendation)
  const reset = useAppStore((s) => s.reset)
  const setStep = useAppStore((s) => s.setStep)

  if (!geometry || geometry.status !== 'measured') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[100dvh] px-6 text-center">
        <p className="text-slate-400">
          {geometry?.warnings[0] ?? 'Could not analyze face shape.'}
        </p>
        <Button onClick={() => setStep('photo')}>Try Again</Button>
      </div>
    )
  }

  const shape = geometry.measuredShape ?? 'oval'
  const confidence = geometry.measuredConfidence
    ? Math.round(geometry.measuredConfidence * 100)
    : null

  return (
    <div className="flex flex-col h-full min-h-[100dvh] px-6 pt-safe pb-safe overflow-y-auto">
      {/* Result header */}
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center ring-1 ring-brand-500/20">
          <Check className="text-brand-400" size={32} />
        </div>
        <div className="text-center space-y-1">
          <p className="text-slate-400 text-sm">Your face shape is</p>
          <h2 className="text-4xl font-bold text-white">
            {SHAPE_LABELS[shape]}
          </h2>
          {confidence !== null && (
            <p className="text-slate-500 text-xs">
              {confidence}% confidence
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      {recommendation && (
        <div className="bg-slate-900/50 rounded-2xl p-5 space-y-4 border border-slate-800">
          <div className="flex items-start gap-3">
            <Sparkles className="text-brand-400 shrink-0 mt-0.5" size={18} />
            <p className="text-slate-300 text-sm leading-relaxed">
              {recommendation.summary}
            </p>
          </div>

          {/* Best frames */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wide">
              <ThumbsUp size={14} />
              Recommended Frames
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendation.bestFrames.map((frame) => (
                <span
                  key={frame}
                  className="px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-300 text-sm border border-brand-500/20"
                >
                  {frame}
                </span>
              ))}
            </div>
          </div>

          {/* Avoid frames */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wide">
              <ThumbsDown size={14} />
              Frames to Avoid
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendation.avoidFrames.map((frame) => (
                <span
                  key={frame}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-sm border border-slate-700"
                >
                  {frame}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Geometry details */}
      {geometry.ratios && (
        <details className="mt-4 bg-slate-900/30 rounded-2xl p-4 border border-slate-800">
          <summary className="text-slate-400 text-sm cursor-pointer">
            Detailed measurements
          </summary>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <Ratio label="Face aspect ratio" value={geometry.ratios.faceAspectRatio} />
            <Ratio label="Jaw-to-cheek" value={geometry.ratios.jawToCheekWidth} />
            <Ratio label="Forehead-to-cheek" value={geometry.ratios.foreheadToCheekWidth} />
            <Ratio label="Cheek-to-face" value={geometry.ratios.cheekToFaceWidth} />
          </div>
        </details>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 py-6">
        <Button variant="secondary" size="lg" onClick={() => reset()}>
          <RotateCcw className="mr-2" size={18} />
          Start Over
        </Button>
      </div>
    </div>
  )
}

function Ratio({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-300 font-mono">{value.toFixed(3)}</span>
    </div>
  )
}
