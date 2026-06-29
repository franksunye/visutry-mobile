import { Check, Lock, Share2 } from 'lucide-react'
import { Button } from '../components/Button'
import { ScreenHeader } from '../components/ScreenHeader'
import { useAppStore } from '@core/state/store'

export function SizeSuggestionScreen() {
  const currentReport = useAppStore((s) => s.currentReport)
  const goBack = useAppStore((s) => s.goBack)

  const size = currentReport?.sizeSuggestion

  const shareButton = (
    <button
      type="button"
      aria-label="分享"
      className="p-1 active:scale-90 transition-transform"
    >
      <Share2 size={20} className="text-ink-secondary" />
    </button>
  )

  return (
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
      <ScreenHeader title="尺寸建议" onBack={goBack} rightSlot={shareButton} />

      {!size ? (
        <div className="flex flex-col items-center justify-center gap-3 flex-1 px-6 text-center">
          <p className="text-sm text-ink-tertiary">暂无尺寸建议</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-4 pb-8 pt-2 overflow-y-auto">
          {/* ── Face diagram card ── */}
          <div className="bg-white rounded-card p-4 flex flex-col items-center gap-3 shadow-card">
            <FaceDiagram />
            <div className="flex flex-col items-center gap-1">
              <span className="bg-brand text-ink rounded-btn px-3 py-1 text-sm font-medium">
                中号
              </span>
              <span className="text-xs text-ink-tertiary">建议镜框尺寸</span>
            </div>
          </div>

          {/* ── Size specs card ── */}
          <div className="bg-white rounded-card p-4 space-y-3 shadow-card">
            <SpecRow label="镜框总宽" value={size.frameWidth} />
            <SpecRow label="镜片高度" value={size.lensHeight} />
            <SpecRow label="镜腿长度" value={size.templeLength} />
          </div>

          {/* ── Wearing tips card ── */}
          <div className="bg-white rounded-card p-4 shadow-card">
            <h2 className="text-sm font-semibold text-ink mb-2">佩戴建议</h2>
            <ul className="space-y-2">
              {size.wearingTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check size={16} className="text-lime shrink-0 mt-0.5" />
                  <span className="text-sm text-ink-primary">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── CTA (premium, pink lock feel) ── */}
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink to-pink-dark text-white shadow-pink"
          >
            <Lock size={18} />
            去试戴
          </Button>
        </div>
      )}
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink-secondary">{label}</span>
      <span className="text-sm font-semibold text-ink">{value}</span>
    </div>
  )
}

/** Simple SVG face outline with measurement callout lines. */
function FaceDiagram() {
  const faint = '#EDEDED'
  const stroke = '#ABABAB'
  const accent = '#FF689A'

  return (
    <svg
      viewBox="0 0 200 176"
      className="w-40 h-36"
      fill="none"
      aria-label="脸型尺寸示意图"
      role="img"
    >
      {/* Guide lines from face edges to callouts */}
      <line x1="44" y1="28" x2="44" y2="20" stroke={faint} strokeWidth="1" />
      <line x1="156" y1="28" x2="156" y2="20" stroke={faint} strokeWidth="1" />
      <line x1="156" y1="28" x2="180" y2="28" stroke={faint} strokeWidth="1" />
      <line x1="156" y1="156" x2="180" y2="156" stroke={faint} strokeWidth="1" />

      {/* Width callout (top) */}
      <line x1="44" y1="20" x2="156" y2="20" stroke={accent} strokeWidth="1.5" />
      <line x1="44" y1="16" x2="44" y2="24" stroke={accent} strokeWidth="1.5" />
      <line x1="156" y1="16" x2="156" y2="24" stroke={accent} strokeWidth="1.5" />

      {/* Height callout (right) */}
      <line x1="180" y1="28" x2="180" y2="156" stroke={accent} strokeWidth="1.5" />
      <line x1="176" y1="28" x2="184" y2="28" stroke={accent} strokeWidth="1.5" />
      <line x1="176" y1="156" x2="184" y2="156" stroke={accent} strokeWidth="1.5" />

      {/* Face outline */}
      <ellipse cx="100" cy="92" rx="56" ry="64" stroke={stroke} strokeWidth="2" />

      {/* Jaw suggestion */}
      <path
        d="M58 112 Q100 158 142 112"
        stroke="#FFDB4D"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Eyes */}
      <line x1="72" y1="86" x2="86" y2="86" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="114" y1="86" x2="128" y2="86" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
