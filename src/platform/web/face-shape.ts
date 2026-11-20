/**
 * Web still-photo face analysis adapter.
 *
 * This adapter consumes ImageInput.data, not the live camera. It uses the
 * SDK's lightweight image-only entrypoint, so no Three.js renderer, canvas
 * mount, camera permission or recording session is required.
 */
import type { FaceShapeResult } from '@visutry/tryon-core'
import type { ImageAnalyzer } from '@visutry/tryon-web/analyzer'
import type { FaceShapeAnalyzer } from '@core/face-shape/analyzer'
import { isCanonicalFaceShape } from '@core/types'
import type { FaceGeometryAnalysis, ImageInput } from '@core/types'

const SDK_ENABLED = import.meta.env.VITE_FACE_SHAPE_SDK_ENABLED === 'true'

type BrowserImage = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap

function unavailable(message: string): FaceGeometryAnalysis {
  return {
    version: 'landmark-v1',
    status: 'unavailable',
    source: 'mediapipe-face-landmarker',
    faceDetected: false,
    faceCount: 0,
    qualityScore: 0,
    signals: [],
    warnings: [message],
  }
}

/** Keep the SDK's full seven-shape vocabulary and measured ratios. */
function mapFaceShape(result: FaceShapeResult): FaceGeometryAnalysis {
  const measured = isCanonicalFaceShape(result.primary) ? result.primary : undefined

  return {
    version: 'landmark-v1',
    status: measured ? 'measured' : 'unavailable',
    source: 'mediapipe-face-landmarker',
    // A successful image analysis means a face was detected even if the
    // classifier returned "unknown".
    faceDetected: true,
    faceCount: 1,
    qualityScore: Math.round(Math.max(0, Math.min(1, result.confidence)) * 100),
    measuredShape: measured,
    measuredConfidence: result.confidence,
    ratios: result.metrics.visutry,
    signals: result.candidates.map((c) => `${c.shape}: ${c.score.toFixed(2)}`),
    warnings: result.warnings.map((warning) => String(warning)),
  }
}

function isBrowserImage(data: unknown): data is BrowserImage {
  return (
    (typeof HTMLImageElement !== 'undefined' && data instanceof HTMLImageElement) ||
    (typeof HTMLCanvasElement !== 'undefined' && data instanceof HTMLCanvasElement) ||
    (typeof HTMLVideoElement !== 'undefined' && data instanceof HTMLVideoElement) ||
    (typeof ImageBitmap !== 'undefined' && data instanceof ImageBitmap)
  )
}

/**
 * A camera capture supplies a Blob. The MediaPipe IMAGE-mode tracker expects
 * a decoded browser image, not the Blob itself. Release the temporary URL on
 * both success and failure; never upload the input.
 */
async function resolveImage(input: ImageInput): Promise<{ image: BrowserImage; release: () => void }> {
  if (isBrowserImage(input.data)) {
    return { image: input.data, release: () => {} }
  }

  if (typeof Blob === 'undefined' || !(input.data instanceof Blob)) {
    throw new Error('Unsupported photo input: expected a Blob or decoded browser image')
  }

  const objectUrl = URL.createObjectURL(input.data)
  try {
    const image = new Image()
    if (typeof image.decode === 'function') {
      image.src = objectUrl
      await image.decode()
    } else {
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error('Unable to decode the selected photo'))
        image.src = objectUrl
      })
    }
    return { image, release: () => URL.revokeObjectURL(objectUrl) }
  } catch (error) {
    URL.revokeObjectURL(objectUrl)
    throw error
  }
}

export class WebFaceShapeAnalyzer implements FaceShapeAnalyzer {
  private analyzerPromise: Promise<ImageAnalyzer> | null = null

  private getAnalyzer(): Promise<ImageAnalyzer> {
    if (!this.analyzerPromise) {
      this.analyzerPromise = import('@visutry/tryon-web/analyzer')
        .then(({ createVisuTryImageAnalyzer }) => createVisuTryImageAnalyzer())
        .catch((error: unknown) => {
          // A failed import/initialization must not poison every retry.
          this.analyzerPromise = null
          throw error
        })
    }
    return this.analyzerPromise
  }

  async analyze(input: ImageInput): Promise<FaceGeometryAnalysis> {
    if (!SDK_ENABLED) {
      return unavailable('SDK photo analysis disabled (VITE_FACE_SHAPE_SDK_ENABLED != true)')
    }

    let release: () => void = () => {}
    try {
      const normalized = await resolveImage(input)
      release = normalized.release
      const analyzer = await this.getAnalyzer()
      const result = await analyzer.analyzeFaceShapeFromImage(normalized.image)
      return mapFaceShape(result)
    } catch (error) {
      return unavailable(
        error instanceof Error ? `SDK photo analysis failed: ${error.message}` : 'SDK photo analysis failed',
      )
    } finally {
      release()
    }
  }

  async destroy(): Promise<void> {
    const current = this.analyzerPromise
    this.analyzerPromise = null
    if (current) {
      try {
        ;(await current).destroy()
      } catch {
        // Import can fail before an SDK instance exists.
      }
    }
  }
}
