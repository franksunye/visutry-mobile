import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { useAppStore } from '@core/state/store'
import { FACE_SHAPE_DISPLAY_NAMES, type FaceAnalysisReport } from '@core/types'

const RADIUS = 70
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const TARGET_PERCENT = 78

const COMPLETED_STEPS = ['识别面部关键点', '分析脸型特征', '计算镜框比例']
const ACTIVE_STEP = '生成分析报告'

export function AnalyzingScreen() {
  const goBack = useAppStore((s) => s.goBack)
  const navigateTo = useAppStore((s) => s.navigateTo)
  const setActiveTab = useAppStore((s) => s.setActiveTab)
  const setCurrentReport = useAppStore((s) => s.setCurrentReport)
  const addToHistory = useAppStore((s) => s.addToHistory)
  const capturedImageUrl = useAppStore((s) => s.capturedImageUrl)

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const duration = 3000
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setProgress(TARGET_PERCENT * t)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      if (cancelled) return

      const report: FaceAnalysisReport = {
        id: `report-${Date.now()}`,
        createdAt: new Date().toISOString(),
        faceShape: 'square',
        faceShapeDisplayName: FACE_SHAPE_DISPLAY_NAMES.square,
        confidence: 92,
        photoUrl: capturedImageUrl ?? undefined,
        summary: '你的脸型属于方形脸，下颌线条分明、轮廓硬朗。建议选择带有圆润曲线的镜框，柔和面部轮廓。',
        keyFeatures: [
          { label: '脸长脸宽比', value: '1.23:1', level: 'high' },
          { label: '下颌线', value: '明显', level: 'high' },
          { label: '颧骨', value: '中等', level: 'medium' },
          { label: '面部轮廓', value: '方形', level: 'high' },
        ],
        bestFrames: [
          { rank: 1, type: 'round', displayName: '圆形镜框', matchScore: 92, reason: '柔和曲线平衡方脸轮廓', stylingNote: '适合日常通勤' },
          { rank: 2, type: 'aviator', displayName: '飞行员框', matchScore: 89, reason: '经典款式修饰脸型', stylingNote: '适合休闲场合' },
          { rank: 3, type: 'square', displayName: '方形镜框', matchScore: 86, reason: '几何感强增强个性', stylingNote: '适合时尚搭配' },
        ],
        avoidFrames: ['方形大框', '窄长方框'],
        sizeSuggestion: {
          frameWidth: '138-142mm',
          lensHeight: '42-46mm',
          templeLength: '145-150mm',
          wearingTips: ['镜框宽度与脸宽接近或略宽', '镜片高度适中，避免过小', '鼻托合适避免镜框滑落'],
        },
        unlocked: true,
      }

      setCurrentReport(report)
      addToHistory(report)
      setActiveTab('report')
      navigateTo('report-overview')
    }, 3500)

    return () => { cancelled = true; clearTimeout(timer) }
  }, [capturedImageUrl, setCurrentReport, addToHistory, setActiveTab, navigateTo])

  const dashOffset = CIRCUMFERENCE * (1 - progress / 100)
  const percent = Math.round(progress)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white">
      <ScreenHeader title="AI分析中" subtitle="预计需要10-15秒" onBack={goBack} />

      <div className="flex flex-col flex-1 px-6 pb-8 pt-6 items-center">
        {/* Circular progress — larger, more prominent */}
        <div className="relative" style={{ width: 160, height: 160 }}>
          <svg width={160} height={160} viewBox="0 0 160 160" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="analyzingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF689A" />
                <stop offset="50%" stopColor="#FFDB4D" />
                <stop offset="100%" stopColor="#8BF44B" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle cx={80} cy={80} r={RADIUS} fill="none" strokeWidth={10} stroke="#F0F0F0" />
            {/* Progress */}
            <circle
              cx={80}
              cy={80}
              r={RADIUS}
              fill="none"
              strokeWidth={10}
              stroke="url(#analyzingGrad)"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 80 80)"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-ink">{percent}%</span>
            <span className="text-xs text-ink-tertiary mt-1">正在处理...</span>
          </div>
        </div>

        {/* Progress checklist — circular badges */}
        <div className="mt-12 w-full max-w-xs space-y-4">
          {COMPLETED_STEPS.map((step) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-lime/15 flex items-center justify-center shrink-0">
                <Check size={16} className="text-lime" strokeWidth={3} />
              </div>
              <span className="text-sm text-ink-primary">{step}</span>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-brand/15 flex items-center justify-center shrink-0">
              <Loader2 size={16} className="text-brand animate-spin" />
            </div>
            <span className="text-sm text-ink-primary">{ACTIVE_STEP}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
