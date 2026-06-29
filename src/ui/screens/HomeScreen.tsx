import { Camera, Check, Settings, ShieldCheck, Upload } from 'lucide-react'
import { Button } from '../components/Button'
import { useAppStore } from '@core/state/store'

const BENEFITS = ['精准识别脸型特征', '推荐适合你的镜框', '专属风格建议']

export function HomeScreen() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg overflow-y-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-safe pb-2">
        <span className="font-bold text-xl text-ink">VisuTry</span>
        <button
          type="button"
          aria-label="设置"
          className="p-1.5 -mr-1.5 active:scale-90 transition-transform"
        >
          <Settings size={22} className="text-ink-secondary" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-5 pb-8 pt-4 gap-7">
        {/* Hero */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-ink">AI脸型分析</h1>
          <p className="text-sm text-ink-secondary">找到更适合你的镜框</p>
        </div>

        {/* Benefits */}
        <ul className="space-y-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2.5">
              <Check size={16} className="text-lime shrink-0" />
              <span className="text-sm text-ink-primary">{benefit}</span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="space-y-3">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigateTo('upload')}
          >
            <Camera size={20} />
            拍照分析
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigateTo('upload')}
          >
            <Upload size={20} />
            从相册上传
          </Button>
        </div>

        {/* Privacy note */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck size={14} className="text-ink-tertiary" />
          <span className="text-xs text-ink-tertiary">照片仅分析，不做存储</span>
        </div>
      </div>
    </div>
  )
}
