import { ChevronRight, Diamond, FileText, Share2, User } from 'lucide-react'
import { Button } from '../components/Button'
import { ScreenHeader } from '../components/ScreenHeader'
import { useAppStore } from '@core/state/store'
import type { FaceFeatureMetric } from '@core/types'

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
    <button type="button" aria-label="分享报告" className="p-1 active:scale-90 transition-transform">
      <Share2 size={20} className="text-ink-secondary" />
    </button>
  )

  if (!currentReport) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
        <ScreenHeader title="我的脸型报告" rightSlot={shareButton} />
        <div className="flex flex-col items-center justify-center gap-4 flex-1 px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center">
            <FileText size={36} className="text-ink-tertiary" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium text-ink-primary">暂无报告</p>
            <p className="text-sm text-ink-tertiary">请先进行脸型分析</p>
          </div>
          <Button variant="primary" onClick={() => setActiveTab('home')}>去分析</Button>
        </div>
      </div>
    )
  }

  const report = currentReport

  return (
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
      <ScreenHeader title="我的脸型报告" rightSlot={shareButton} />

      <div className="flex flex-col gap-4 px-4 pb-8 pt-2 overflow-y-auto no-scrollbar">
        {/* ── Profile card ── */}
        <div className="bg-white rounded-card p-4 shadow-card flex items-center gap-4 animate-fade-in-up">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center ring-2 ring-white shadow-sm">
              <User size={36} className="text-ink-secondary" />
            </div>
            {report.photoUrl && (
              <img
                src={report.photoUrl}
                alt=""
                className="absolute inset-0 w-20 h-20 rounded-full object-cover ring-2 ring-white"
              />
            )}
          </div>
          {/* Result */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-xs text-ink-tertiary">你的脸型</span>
            <span className="text-2xl font-bold text-ink truncate">{report.faceShapeDisplayName}</span>
            <span className="inline-flex items-center self-start bg-lime/15 text-lime rounded-full px-2.5 py-1 text-xs font-semibold">
              {report.confidence}% 匹配度
            </span>
          </div>
        </div>

        {/* ── Key features ── */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-sm font-semibold text-ink mb-2 px-1">关键特征</h2>
          <div className="bg-white rounded-card p-4 shadow-card">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {report.keyFeatures.map((feature) => (
                <div key={feature.label} className="flex flex-col gap-1">
                  <span className="text-xs text-ink-tertiary">{feature.label}</span>
                  <span className="text-sm font-semibold text-ink flex items-center gap-1.5">
                    {feature.level && (
                      <span className={`w-2 h-2 rounded-full ${LEVEL_DOT[feature.level]}`} />
                    )}
                    {feature.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Premium unlock banner ── */}
        {!report.unlocked && (
          <div className="bg-gradient-to-r from-pink/8 to-brand/8 rounded-card p-4 flex items-center gap-3 shadow-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink/20 to-brand/20 flex items-center justify-center shrink-0">
              <Diamond size={22} className="text-pink" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-0.5">
              <span className="text-sm font-semibold text-ink">解锁完整版报告 & 试戴</span>
              <span className="text-xs text-ink-secondary">完整风格指南，更多镜框推荐，AI虚拟试戴</span>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-lg font-bold text-ink">¥19.9</span>
              <button className="bg-brand text-ink text-xs font-semibold rounded-btn px-3 py-1.5 active:scale-95 transition-transform">
                立即解锁
              </button>
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="pt-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button size="lg" onClick={() => navigateTo('frame-recommendation')}>
            查看镜框推荐
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}
