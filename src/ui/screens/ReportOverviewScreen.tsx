import { ChevronRight, Diamond, FileText, Share2, User } from 'lucide-react'
import { Button } from '../components/Button'
import { ScreenHeader } from '../components/ScreenHeader'
import { useAppStore } from '@core/state/store'
import type { FaceFeatureMetric } from '@core/types'

/** Level → dot color mapping for key-feature metrics. */
const LEVEL_DOT: Record<NonNullable<FaceFeatureMetric['level']>, string> = {
  high: 'bg-orange-500',
  medium: 'bg-brand-400',
  low: 'bg-ink-tertiary',
}

export function ReportOverviewScreen() {
  const currentReport = useAppStore((s) => s.currentReport)
  const navigateTo = useAppStore((s) => s.navigateTo)
  const setActiveTab = useAppStore((s) => s.setActiveTab)

  const shareButton = (
    <button
      type="button"
      aria-label="分享报告"
      className="p-1 active:scale-90 transition-transform"
    >
      <Share2 size={20} className="text-ink-secondary" />
    </button>
  )

  // ── Empty state ──
  if (!currentReport) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
        <ScreenHeader title="我的脸型报告" rightSlot={shareButton} />
        <div className="flex flex-col items-center justify-center gap-4 flex-1 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-200 flex items-center justify-center">
            <FileText size={32} className="text-ink-secondary" />
          </div>
          <p className="text-sm text-ink-secondary">暂无报告，请先进行脸型分析</p>
          <Button variant="primary" onClick={() => setActiveTab('home')}>
            去分析
          </Button>
        </div>
      </div>
    )
  }

  const report = currentReport

  return (
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
      <ScreenHeader title="我的脸型报告" rightSlot={shareButton} />

      <div className="flex flex-col gap-4 px-4 pb-8 pt-2 overflow-y-auto">
        {/* ── Profile card ── */}
        <div className="bg-white rounded-card p-4 shadow-sm flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-brand-200 flex items-center justify-center shrink-0">
            <User size={36} className="text-ink" />
          </div>
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-xs text-ink-tertiary">你的脸型</span>
            <span className="text-2xl font-bold text-ink truncate">
              {report.faceShapeDisplayName}
            </span>
            <span className="inline-flex items-center self-start bg-lime/20 text-lime rounded-full px-2 py-0.5 text-xs font-medium">
              {report.confidence}%匹配度
            </span>
          </div>
        </div>

        {/* ── Key features ── */}
        <div>
          <h2 className="text-sm font-semibold text-ink mb-2">关键特征</h2>
          <div className="bg-white rounded-card p-4 grid grid-cols-2 gap-4">
            {report.keyFeatures.map((feature) => (
              <div key={feature.label} className="flex flex-col gap-1">
                <span className="text-xs text-ink-tertiary">{feature.label}</span>
                <span className="text-sm font-medium text-ink flex items-center gap-1.5">
                  {feature.level && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${LEVEL_DOT[feature.level]}`}
                    />
                  )}
                  {feature.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Premium unlock banner ── */}
        {!report.unlocked && (
          <div className="bg-gradient-to-r from-pink/10 to-brand/10 rounded-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center shrink-0">
              <Diamond size={20} className="text-pink" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-0.5">
              <span className="text-sm font-semibold text-ink">
                解锁完整版报告 &amp; 试戴功能
              </span>
              <span className="text-xs text-ink-secondary">
                包含完整风格指南，更多镜框推荐，AI虚拟试戴
              </span>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-lg font-bold text-ink">¥19.9</span>
              <Button size="sm">立即解锁</Button>
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <Button size="lg" onClick={() => navigateTo('frame-recommendation')}>
          查看镜框推荐
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  )
}
