import { useEffect, useRef } from 'react'
import { FullScreenSpinner } from '../components/Spinner'
import { useAppStore } from '@core/state/store'
import { getPlatform } from '@core/platform'
import { getStyleRecommendation, type FaceShapeAnalyzer } from '@core/face-shape/analyzer'
import { WebFaceShapeAnalyzer } from '@platform/web/face-shape'

export function AnalyzingScreen() {
  const setStep = useAppStore((s) => s.setStep)
  const setLocalGeometry = useAppStore((s) => s.setLocalGeometry)
  const setRecommendation = useAppStore((s) => s.setRecommendation)
  const setError = useAppStore((s) => s.setError)
  const setAnalyzing = useAppStore((s) => s.setAnalyzing)
  const analyzerRef = useRef<FaceShapeAnalyzer | null>(null)

  useEffect(() => {
    let cancelled = false

    async function runAnalysis() {
      try {
        setAnalyzing(true)

        // Get the captured image from camera or file
        const { camera } = getPlatform()
        let image
        try {
          image = await camera.capture()
        } catch {
          // If camera not active, user uploaded a file — we need to get it from preview
          // For now, this is a simplified flow; in production, store the ImageInput in state
          throw new Error('No photo available. Go back and capture or upload one.')
        }

        // Use the web face shape analyzer
        if (!analyzerRef.current) {
          analyzerRef.current = new WebFaceShapeAnalyzer()
        }

        const geometry = await analyzerRef.current.analyze(image)

        if (cancelled) return

        setLocalGeometry(geometry)

        const rec = getStyleRecommendation(geometry)
        setRecommendation(rec)

        setStep('result')
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Analysis failed')
        setStep('photo')
      } finally {
        if (!cancelled) setAnalyzing(false)
      }
    }

    runAnalysis()

    return () => {
      cancelled = true
    }
  }, [setStep, setLocalGeometry, setRecommendation, setError, setAnalyzing])

  return <FullScreenSpinner label="Analyzing your face shape..." />
}
