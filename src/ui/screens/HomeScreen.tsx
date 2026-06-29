import { Camera, Check, Sparkles, Upload, X } from 'lucide-react'
import { useAppStore } from '@core/state/store'

const FEATURES = ['精准识别面部特征', '推荐最适合的镜框', '专属风格建议']

export function HomeScreen() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white">
      {/* Top bar: logo + close */}
      <div className="flex items-center justify-between px-5 pt-safe pb-2 h-12">
        <div className="flex items-center gap-1">
          <span className="text-xl font-bold text-ink">VisuTry</span>
          <Sparkles size={16} className="text-brand fill-brand" />
        </div>
        <button type="button" aria-label="关闭" className="p-1 -mr-1 active:scale-90 transition-transform">
          <X size={22} className="text-ink" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 px-5 pt-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-ink">AI 脸型分析</h1>
        <p className="text-sm text-ink-secondary mt-1">找到更适合你的镜框</p>

        {/* Feature list */}
        <div className="flex flex-col gap-3 mt-8">
          {FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
                <Check size={12} className="text-lime" strokeWidth={3} />
              </div>
              <span className="text-sm text-ink-primary">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="px-5 pb-8 pt-4 space-y-3 pb-safe">
        <button
          type="button"
          onClick={() => navigateTo('upload')}
          className="w-full h-13 py-3.5 bg-brand text-ink font-semibold text-base rounded-btn flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-brand"
        >
          <Camera size={20} />
          拍照分析
        </button>
        <button
          type="button"
          onClick={() => navigateTo('upload')}
          className="w-full h-12 py-3 bg-white text-ink-primary font-medium text-sm rounded-btn border border-ink-border flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Upload size={18} className="text-ink-secondary" />
          从相册上传
        </button>
      </div>
    </div>
  )
}
