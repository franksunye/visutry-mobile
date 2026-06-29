import { Check, ChevronLeft, Share2 } from 'lucide-react'
import { useAppStore } from '@core/state/store'

export function SizeSuggestionScreen() {
  const currentReport = useAppStore((s) => s.currentReport)
  const goBack = useAppStore((s) => s.goBack)

  const size = currentReport?.sizeSuggestion

  return (
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-12 pt-safe shrink-0 bg-white">
        <button type="button" onClick={goBack} className="p-1 -ml-1 active:scale-90 transition-transform">
          <ChevronLeft size={24} className="text-ink" />
        </button>
        <h1 className="text-base font-semibold text-ink">尺寸建议</h1>
        <button type="button" className="p-1 -mr-1 active:scale-90 transition-transform">
          <Share2 size={20} className="text-ink-secondary" />
        </button>
      </header>

      {!size ? (
        <div className="flex flex-col items-center justify-center gap-3 flex-1 px-6 text-center">
          <p className="text-sm text-ink-tertiary">暂无尺寸建议</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4 pb-8 pt-3 overflow-y-auto no-scrollbar flex-1">
          {/* Size badge + face diagram */}
          <div className="bg-white rounded-card p-4 flex flex-col items-center gap-3 shadow-card">
            <FaceDiagram />
            <div className="flex flex-col items-center gap-1">
              <span className="bg-brand text-ink rounded-full px-4 py-1.5 text-sm font-semibold">
                中等
              </span>
              <span className="text-xs text-ink-tertiary">建议镜框尺寸</span>
            </div>
          </div>

          {/* Size specs */}
          <div className="bg-white rounded-card p-4 shadow-card">
            <SpecRow label="镜框总宽" value={size.frameWidth} />
            <div className="h-px bg-ink-border my-3" />
            <SpecRow label="镜片高度" value={size.lensHeight} />
            <div className="h-px bg-ink-border my-3" />
            <SpecRow label="镜腿长度" value={size.templeLength} />
          </div>

          {/* Wearing tips */}
          <div className="bg-white rounded-card p-4 shadow-card">
            <h2 className="text-sm font-semibold text-ink mb-3">佩戴建议</h2>
            <div className="flex flex-col gap-2.5">
              {size.wearingTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-lime/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-lime" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-ink-primary">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            className="w-full h-13 py-3.5 bg-brand text-ink font-semibold text-base rounded-btn flex items-center justify-center gap-1 active:scale-[0.98] transition-transform shadow-brand mt-2"
          >
            去试戴
          </button>
        </div>
      )}
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink-secondary">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  )
}

/** Minimalist face outline with measurement callouts */
function FaceDiagram() {
  const faint = '#EDEDED'
  const stroke = '#ABABAB'
  const accent = '#FF689A'

  return (
    <svg viewBox="0 0 200 180" className="w-40 h-36" fill="none" aria-label="脸型尺寸示意图" role="img">
      {/* Width callout (top) */}
      <line x1="44" y1="24" x2="156" y2="24" stroke={accent} strokeWidth="1.5" />
      <line x1="44" y1="20" x2="44" y2="28" stroke={accent} strokeWidth="1.5" />
      <line x1="156" y1="20" x2="156" y2="28" stroke={accent} strokeWidth="1.5" />

      {/* Height callout (right) */}
      <line x1="180" y1="36" x2="180" y2="152" stroke={accent} strokeWidth="1.5" />
      <line x1="176" y1="36" x2="184" y2="36" stroke={accent} strokeWidth="1.5" />
      <line x1="176" y1="152" x2="184" y2="152" stroke={accent} strokeWidth="1.5" />

      {/* Guide lines */}
      <line x1="44" y1="36" x2="44" y2="24" stroke={faint} strokeWidth="1" />
      <line x1="156" y1="36" x2="156" y2="24" stroke={faint} strokeWidth="1" />
      <line x1="156" y1="36" x2="180" y2="36" stroke={faint} strokeWidth="1" />
      <line x1="156" y1="152" x2="180" y2="152" stroke={faint} strokeWidth="1" />

      {/* Face outline */}
      <ellipse cx="100" cy="94" rx="56" ry="58" stroke={stroke} strokeWidth="2" />

      {/* Jaw suggestion */}
      <path d="M58 112 Q100 152 142 112" stroke="#FFDF4D" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <line x1="74" y1="88" x2="88" y2="88" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="112" y1="88" x2="126" y2="88" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
