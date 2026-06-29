import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react'
import { useAppStore } from '@core/state/store'

export function ReportOverviewScreen() {
  const currentReport = useAppStore((s) => s.currentReport)
  const navigateTo = useAppStore((s) => s.navigateTo)
  const setActiveTab = useAppStore((s) => s.setActiveTab)

  if (!currentReport) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-white">
        <header className="flex items-center justify-between px-4 h-12 pt-safe shrink-0">
          <div className="w-7" />
          <h1 className="text-base font-semibold text-ink">我的脸型报告</h1>
          <div className="w-7" />
        </header>
        <div className="flex flex-col items-center justify-center gap-4 flex-1 px-6 text-center">
          <p className="text-sm text-ink-tertiary">暂无报告，请先进行脸型分析</p>
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="h-12 px-6 bg-brand text-ink font-semibold text-sm rounded-btn active:scale-[0.98] transition-transform shadow-brand"
          >
            去分析
          </button>
        </div>
      </div>
    )
  }

  const report = currentReport

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-12 pt-safe shrink-0">
        <button type="button" onClick={() => { setActiveTab('report'); navigateTo('history'); }} className="p-1 -ml-1 active:scale-90 transition-transform">
          <ChevronLeft size={24} className="text-ink" />
        </button>
        <h1 className="text-base font-semibold text-ink">我的脸型报告</h1>
        <button type="button" className="p-1 -mr-1 active:scale-90 transition-transform">
          <Share2 size={20} className="text-ink-secondary" />
        </button>
      </header>

      <div className="flex flex-col gap-4 px-4 pb-8 pt-2 overflow-y-auto no-scrollbar flex-1">
        {/* Photo + result card */}
        <div className="bg-white rounded-card p-4 shadow-card flex items-center gap-4">
          {/* Photo */}
          <div className="w-24 h-28 rounded-card bg-ink-bg overflow-hidden shrink-0">
            {report.photoUrl ? (
              <img src={report.photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-brand/15" />
              </div>
            )}
          </div>
          {/* Result */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <span className="text-xs text-ink-tertiary">你的脸型</span>
            <span className="text-2xl font-bold text-ink">{report.faceShapeDisplayName}</span>
            <span className="inline-flex self-start items-center bg-brand text-ink rounded-full px-2.5 py-1 text-xs font-semibold">
              {report.confidence}% 匹配度
            </span>
          </div>
        </div>

        {/* Key features */}
        <div>
          <h2 className="text-sm font-semibold text-ink mb-2 px-1">关键特征</h2>
          <div className="bg-white rounded-card p-4 shadow-card">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {report.keyFeatures.map((feature) => (
                <div key={feature.label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-ink-tertiary">{feature.label}</span>
                  <span className="text-sm font-medium text-ink">{feature.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium unlock banner */}
        {!report.unlocked && (
          <div className="bg-brand-50 rounded-card p-4 flex items-center gap-3 shadow-card">
            <div className="flex flex-col flex-1 min-w-0 gap-0.5">
              <span className="text-sm font-semibold text-ink">解锁完整版报告 & 试戴</span>
              <span className="text-xs text-ink-secondary">完整风格指南，更多镜框推荐，AI虚拟试戴</span>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-base font-bold text-ink">¥19.9</span>
              <button className="bg-brand text-ink text-xs font-semibold rounded-btn px-3 py-1.5 active:scale-95 transition-transform">
                立即解锁
              </button>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={() => navigateTo('frame-recommendation')}
          className="w-full h-13 py-3.5 bg-brand text-ink font-semibold text-base rounded-btn flex items-center justify-center gap-1 active:scale-[0.98] transition-transform shadow-brand mt-2"
        >
          查看镜框推荐
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
