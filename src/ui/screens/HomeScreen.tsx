import { Camera, Check, ScanFace, Settings, ShieldCheck, Sparkles, Upload } from 'lucide-react'
import { Button } from '../components/Button'
import { useAppStore } from '@core/state/store'

const BENEFITS = ['精准识别脸型特征', '推荐适合你的镜框', '专属风格建议']

export function HomeScreen() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white overflow-y-auto no-scrollbar">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-safe pb-2">
        <span className="font-bold text-xl text-ink">VisuTry</span>
        <button
          type="button"
          aria-label="设置"
          className="p-2 -mr-2 active:scale-90 transition-transform"
        >
          <Settings size={22} className="text-ink-secondary" />
        </button>
      </div>

      {/* Hero illustration area */}
      <div className="flex flex-col items-center px-5 pt-6 pb-2">
        <div className="relative w-full flex flex-col items-center">
          {/* Gradient blob background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-brand-100 via-brand-200 to-brand-300/50 blur-xl" />
          </div>
          {/* 3D-style icon */}
          <div className="relative w-28 h-28 rounded-[28px] bg-gradient-to-br from-brand to-brand-300 flex items-center justify-center shadow-brand mt-2 mb-4">
            <ScanFace size={56} className="text-ink" strokeWidth={1.8} />
            <Sparkles size={20} className="absolute -top-1 -right-1 text-pink" fill="#FF689A" />
          </div>
        </div>

        {/* Headline */}
        <div className="text-center space-y-1.5 mt-2">
          <h1 className="text-2xl font-bold text-ink">AI脸型分析</h1>
          <p className="text-sm text-ink-secondary">找到更适合你的镜框</p>
        </div>
      </div>

      {/* Benefits card */}
      <div className="px-5 mt-6">
        <div className="bg-brand-50 rounded-card p-4 space-y-3">
          {BENEFITS.map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
                <Check size={14} className="text-lime" strokeWidth={3} />
              </div>
              <span className="text-sm text-ink-primary font-medium">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="px-5 mt-6 space-y-3">
        <Button size="lg" variant="primary" onClick={() => navigateTo('upload')}>
          <Camera size={20} />
          拍照分析
        </Button>
        <Button size="lg" variant="secondary" onClick={() => navigateTo('upload')}>
          <Upload size={20} />
          从相册上传
        </Button>
      </div>

      {/* Privacy note */}
      <div className="flex items-center justify-center gap-1.5 pt-5 pb-8">
        <ShieldCheck size={14} className="text-ink-tertiary" />
        <span className="text-xs text-ink-tertiary">照片仅分析，不做存储</span>
      </div>
    </div>
  )
}
