import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { useAppStore } from '@core/state/store'
import { FACE_SHAPE_DISPLAY_NAMES, type FaceAnalysisReport } from '@core/types'

// SVG ring: r=56, strokeWidth=8 → visible diameter = 2*56 + 8 = 120px
const RADIUS = 56
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const TARGET_PERCENT = 78

const COMPLETED_STEPS = [
  '识别面部关键点',
  '分析脸型特征',
  '计算镜框比例',
]
const ACTIVE_STEP = '生成分析报告'

export function AnalyzingScreen() {
  const goBack = useAppStore((s) => s.goBack)
  const navigateTo = useAppStore((s) => s.navigateTo)
  const setActiveTab = useAppStore((s) => s.setActiveTab)
  const setCurrentReport = useAppStore((s) => s.setCurrentReport)
  const addToHistory = useAppStore((s) => s.addToHistory)
  const capturedImageUrl = useAppStore((s) => s.capturedImageUrl)

  const [progress, setProgress] = useState(0)

  // Animate the ring from 0 → 78% over ~3s.
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

  // After ~3.5s, build a mock report and navigate to the report overview.
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
        summary:
          '你的脸型属于方形脸，下颌线条分明、轮廓硬朗。建议选择带有圆润曲线的镜框，柔和面部轮廓，提升整体协调感。',
        keyFeatures: [
          { label: '脸长脸宽比', value: '1.23:1', level: 'high' },
          { label: '下颌线', value: '明显', level: 'high' },
          { label: '颧骨', value: '中等', level: 'medium' },
          { label: '面部轮廓', value: '方形', level: 'high' },
        ],
        bestFrames: [
          {
            rank: 1,
            type: 'round',
            displayName: '圆形镜框',
            matchScore: 92,
            reason: '柔和曲线平衡方脸轮廓',
            stylingNote: '适合日常通勤',
          },
          {
            rank: 2,
            type: 'aviator',
            displayName: '飞行员框',
            matchScore: 89,
            reason: '经典款式修饰脸型',
            stylingNote: '适合休闲场合',
          },
          {
            rank: 3,
            type: 'square',
            displayName: '方形镜框',
            matchScore: 86,
            reason: '几何感强增强个性',
            stylingNote: '适合时尚搭配',
          },
        ],
        avoidFrames: ['方形大框', '窄长方框'],
        sizeSuggestion: {
          frameWidth: '138-142mm',
          lensHeight: '42-46mm',
          templeLength: '145-150mm',
          wearingTips: [
            '镜框宽度与脸宽接近或略宽',
            '镜片高度适中，避免过小',
            '鼻托合适避免镜框滑落',
          ],
        },
        unlocked: true,
      }

      setCurrentReport(report)
      addToHistory(report)
      setActiveTab('report')
      navigateTo('report-overview')
    }, 3500)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [
    capturedImageUrl,
    setCurrentReport,
    addToHistory,
    setActiveTab,
    navigateTo,
  ])

  const dashOffset = CIRCUMFERENCE * (1 - progress / 100)
  const percent = Math.round(progress)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
      <ScreenHeader
        title="AI分析中"
        subtitle="预计需要10-15秒"
        onBack={goBack}
      />

      <div className="flex flex-col flex-1 px-6 pb-8 pt-4 items-center overflow-y-auto">
        {/* Circular progress */}
        <div
          className="relative mt-6"
          style={{ width: 120, height: 120 }}
        >
          <svg
            width={120}
            height={120}
            viewBox="0 0 120 120"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient
                id="analyzingGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FF689A" />
                <stop offset="50%" stopColor="#FFDB4D" />
                <stop offset="100%" stopColor="#8BF44B" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle
              cx={60}
              cy={60}
              r={RADIUS}
              fill="none"
              strokeWidth={8}
              stroke="#EDEDED"
            />
            {/* Progress */}
            <circle
              cx={60}
              cy={60}
              r={RADIUS}
              fill="none"
              strokeWidth={8}
              stroke="url(#analyzingGrad)"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 60 60)"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-ink">{percent}%</span>
            <span className="text-xs text-ink-tertiary mt-0.5">
              正在处理...
            </span>
          </div>
        </div>

        {/* Progress checklist */}
        <ul className="mt-10 w-full max-w-xs space-y-4">
          {COMPLETED_STEPS.map((step) => (
            <li key={step} className="flex items-center gap-3">
              <Check size={18} className="text-lime shrink-0" />
              <span className="text-sm text-ink-primary">{step}</span>
            </li>
          ))}
          <li className="flex items-center gap-3">
            <Loader2 size={18} className="text-brand animate-spin shrink-0" />
            <span className="text-sm text-ink-primary">{ACTIVE_STEP}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
