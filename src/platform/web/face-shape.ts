/**
 * Web face shape analyzer — implements FaceShapeAnalyzer via @visutry/tryon-web.
 *
 * Uses the lightweight `createVisuTryImageAnalyzer` (MediaPipe only, no Three.js)
 * and `analyzeFaceShapeFromImage` for static photo analysis — no camera required.
 */

import type { FaceShapeResult, NormalizedFaceResult } from '@visutry/tryon-core'
import type { FaceShapeAnalyzer } from '@core/face-shape/analyzer'
import type { FaceGeometryAnalysis, FaceShapeAnalysisResult, FaceTryOnPlacement, ImageInput } from '@core/types'

/** Map SDK FaceShapeResult to our FaceGeometryAnalysis */
function mapFaceShape(result: FaceShapeResult): FaceGeometryAnalysis {
  const shapeMap: Record<string, FaceGeometryAnalysis['measuredShape']> = {
    oval: 'oval',
    round: 'round',
    square: 'square',
    heart: 'heart',
    diamond: 'diamond',
    oblong: 'oblong',
    triangle: 'triangle',
    unknown: undefined,
  }

  const measured = shapeMap[result.primary] ?? undefined

  return {
    version: 'landmark-v1',
    status: measured ? 'measured' : 'unavailable',
    source: 'mediapipe-face-landmarker',
    faceDetected: measured !== undefined,
    faceCount: measured ? 1 : 0,
    qualityScore: Math.round(result.confidence * 100),
    measuredShape: measured,
    measuredConfidence: result.confidence,
    ratios: result.metrics.visutry,
    signals: result.candidates.map((c) => `${c.shape}: ${c.score.toFixed(2)}`),
    warnings: result.warnings.map((w) => String(w)),
  }
}

function getTryOnPlacement(face: NormalizedFaceResult | null): FaceTryOnPlacement | undefined {
  const left = face?.landmarks.semantic.leftEyeOuter
  const right = face?.landmarks.semantic.rightEyeOuter
  const center = face?.landmarks.semantic.eyesCenter
  if (!left || !right || !center) return undefined

  const eyeDistance = Math.hypot(right.x - left.x, right.y - left.y)
  return {
    centerX: center.x,
    centerY: center.y + eyeDistance * 0.12,
    width: Math.min(0.78, Math.max(0.28, eyeDistance * 1.75)),
    rotationDeg: Math.atan2(right.y - left.y, right.x - left.x) * 180 / Math.PI,
  }
}

/** Load a File/Blob into an HTMLImageElement for SDK consumption. */
async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    return img
  } finally {
    // Revoke after the image is decoded — the decoded bitmap is in memory.
    URL.revokeObjectURL(url)
  }
}

export class WebFaceShapeAnalyzer implements FaceShapeAnalyzer {
  private analyzerPromise: Promise<{
    analyzeFaceShapeFromImage(image: unknown): Promise<FaceShapeResult>
    getLastFaceResult(): NormalizedFaceResult | null
    destroy(): void
  }> | null = null

  private async getAnalyzer() {
    if (!this.analyzerPromise) {
      this.analyzerPromise = (async () => {
        const { createVisuTryImageAnalyzer } = await import('@visutry/tryon-web')
        const analyzer = createVisuTryImageAnalyzer()
        return analyzer
      })()
    }
    return this.analyzerPromise
  }

  async analyze(image: ImageInput): Promise<FaceShapeAnalysisResult> {
    try {
      const analyzer = await this.getAnalyzer()

      // Convert the ImageInput data to an HTMLImageElement if it's a File/Blob.
      let imageElement: unknown = image.data
      if (image.data instanceof File || image.data instanceof Blob) {
        imageElement = await fileToImage(image.data as File)
      }

      const result: FaceShapeResult = await analyzer.analyzeFaceShapeFromImage(imageElement)
      return {
        geometry: mapFaceShape(result),
        sdkResult: result,
        tryOnPlacement: getTryOnPlacement(analyzer.getLastFaceResult()),
      }
    } catch (error) {
      console.error('[WebFaceShapeAnalyzer] analyze failed:', error)
      return {
        geometry: {
          version: 'landmark-v1',
          status: 'unavailable',
          source: 'mediapipe-face-landmarker',
          faceDetected: false,
          faceCount: 0,
          qualityScore: 0,
          signals: [],
          warnings: [
            error instanceof Error
              ? `SDK face analysis failed: ${error.message}`
              : 'SDK face analysis failed.',
          ],
        },
      }
    }
  }

  async destroy(): Promise<void> {
    if (this.analyzerPromise) {
      try {
        const analyzer = await this.analyzerPromise
        analyzer.destroy()
      } catch {
        // ignore
      }
      this.analyzerPromise = null
    }
  }
}
