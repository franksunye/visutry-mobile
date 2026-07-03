import { useEffect, useState } from 'react'
import { Check, ChevronLeft, Loader2, X } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import { FACE_SHAPE_DISPLAY_NAMES, type FaceAnalysisReport } from '@core/types'
import { getPlatform } from '@core/platform'
import { getStyleRecommendation } from '@core/face-shape/analyzer'

const RADIUS = 80
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

    const performAnalysis = async () => {
      try {
        const platform = getPlatform()

        // Get captured image from store
        const capturedImage = useAppStore.getState().capturedImage
        if (!capturedImage) {
          throw new Error('No captured image available')
        }

        // Use platform's face shape analyzer
        const analyzer = platform.faceShapeAnalyzer
        if (!analyzer) {
          throw new Error('Face shape analyzer not available')
        }

        // Perform actual face analysis
        const analysisResult = await analyzer.analyze(capturedImage)
        const geometryResult = analysisResult.geometry

        if (cancelled) return

        // Get style recommendations based on analysis
        const styleRecommendation = getStyleRecommendation(geometryResult)

        // Build report from real analysis
        const report: FaceAnalysisReport = {
          id: `report-${Date.now()}`,
          createdAt: new Date().toISOString(),
          faceShape: geometryResult.measuredShape || 'oval',
          faceShapeDisplayName: FACE_SHAPE_DISPLAY_NAMES[geometryResult.measuredShape || 'oval'],
          confidence: Math.round((geometryResult.measuredConfidence || 0.7) * 100),
          photoUrl: capturedImageUrl ?? undefined,
          summary: styleRecommendation?.summary || '基于面部几何分析生成的脸型特征描述',
          keyFeatures: [
            { label: '脸长脸宽比', value: geometryResult.ratios?.faceAspectRatio.toFixed(2) || '1.23:1' },
            { label: '颧骨宽度比', value: geometryResult.ratios?.cheekToFaceWidth.toFixed(2) || '0.94' },
            { label: '对称度', value: `${Math.round((1 - (geometryResult.ratios?.symmetryOffset || 0.05)) * 100)}%` },
            { label: '下颌线', value: geometryResult.ratios?.jawToCheekWidth && geometryResult.ratios.jawToCheekWidth > 0.9 ? '明显' : '柔和' },
            { label: '面部轮廓', value: geometryResult.measuredShape === 'square' ? '方形' : '其他' },
            { label: '下巴形状', value: '适中' },
          ],
          bestFrames: styleRecommendation ? [
            { rank: 1, type: styleRecommendation.bestFrames[0], displayName: styleRecommendation.bestFrames[0], matchScore: 92, reason: '最佳匹配', stylingNote: '强烈推荐' },
            { rank: 2, type: styleRecommendation.bestFrames[1], displayName: styleRecommendation.bestFrames[1], matchScore: 89, reason: '次佳匹配', stylingNote: '推荐选择' },
            { rank: 3, type: styleRecommendation.bestFrames[2], displayName: styleRecommendation.bestFrames[2], matchScore: 86, reason: '备选方案', stylingNote: '可考虑' },
          ] : [],
          avoidFrames: styleRecommendation?.avoidFrames || [],
          sizeSuggestion: {
            frameWidth: '138-142mm',
            lensHeight: '52-54mm',
            templeLength: '145-150mm',
            wearingTips: ['镜框宽度与脸宽接近或略宽', '镜片高度适中，避免过小', '鼻托合适避免镜框滑落'],
          },
          unlocked: true,
          geometry: geometryResult,
        }

        if (cancelled) return

        setCurrentReport(report)
        addToHistory(report)
        setActiveTab('report')
        navigateTo('report-overview')
      } catch (error) {
        console.error('Face analysis failed:', error)
        // Fallback to mock data on error for demo purposes
        const fallbackReport: FaceAnalysisReport = {
          id: `report-${Date.now()}`,
          createdAt: new Date().toISOString(),
          faceShape: 'oval',
          faceShapeDisplayName: FACE_SHAPE_DISPLAY_NAMES.oval,
          confidence: 85,
          photoUrl: capturedImageUrl ?? undefined,
          summary: 'SDK分析暂时不可用，使用示例数据',
          keyFeatures: [
            { label: '分析状态', value: 'SDK不可用' },
            { label: '建议', value: '请稍后重试' },
          ],
          bestFrames: [],
          avoidFrames: [],
          unlocked: true,
        }

        setCurrentReport(fallbackReport)
        addToHistory(fallbackReport)
        setActiveTab('report')
        navigateTo('report-overview')
      }
    }

    const timer = setTimeout(performAnalysis, 3500)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [capturedImageUrl, setCurrentReport, addToHistory, setActiveTab, navigateTo])

  const dashOffset = CIRCUMFERENCE * (1 - progress / 100)
  const percent = Math.round(progress)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-12 pt-safe shrink-0">
        <button type="button" onClick={goBack} className="p-1 -ml-1 active:scale-90 transition-transform">
          <ChevronLeft size={24} className="text-ink" />
        </button>
        <h1 className="text-base font-semibold text-ink">AI 分析中</h1>
        <button type="button" onClick={goBack} className="p-1 -mr-1 active:scale-90 transition-transform">
          <X size={20} className="text-ink-secondary" />
        </button>
      </header>

      {/* Progress area */}
      <div className="flex flex-col items-center flex-1 px-6 pt-12">
        {/* Circular progress */}
        <div className="relative" style={{ width: 200, height: 200 }}>
          <svg width={200} height={200} viewBox="0 0 200 200">
            <defs>
              <linearGradient id="analyzingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF689A" />
                <stop offset="50%" stopColor="#FFDF4D" />
                <stop offset="100%" stopColor="#B8F44B" />
              </linearGradient>
            </defs>
            <circle cx={100} cy={100} r={RADIUS} fill="none" strokeWidth={10} stroke="#F0F0F0" />
            <circle
              cx={100}
              cy={100}
              r={RADIUS}
              fill="none"
              strokeWidth={10}
              stroke="url(#analyzingGrad)"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-ink">{percent}%</span>
            <span className="text-xs text-ink-tertiary mt-2">预计需要 10-15 秒</span>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-12 w-full max-w-xs space-y-4">
          {COMPLETED_STEPS.map((step) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
                <Check size={14} className="text-lime" strokeWidth={3} />
              </div>
              <span className="text-sm text-ink-primary">{step}</span>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
              <Loader2 size={14} className="text-brand-600 animate-spin" />
            </div>
            <span className="text-sm text-ink-primary">{ACTIVE_STEP}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
