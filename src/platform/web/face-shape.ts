/**
 * Web face shape analyzer — implements FaceShapeAnalyzer via @visutry/tryon-web.
 *
 * This file IS allowed to use DOM APIs (ImageBitmap, createImageBitmap).
 * The WeChat counterpart (platform/wechat/face-shape.ts) will use
 * @visutry/tryon-wechat instead.
 *
 * NOTE: SDK 1.0.0-beta API — createVisuTryWebSDK requires a canvas for the
 * Three.js renderer. For face-shape-only analysis (no AR try-on), we create
 * an offscreen canvas that is never displayed.
 */

import type { VisuTrySDK, FaceShapeResult } from '@visutry/tryon-core'
import type { FaceShapeAnalyzer } from '@core/face-shape/analyzer'
import type { FaceGeometryAnalysis, ImageInput } from '@core/types'

const SDK_ENABLED = import.meta.env.VITE_FACE_SHAPE_SDK_ENABLED === 'true'

/** Map SDK 1.0 FaceShapeResult to our FaceGeometryAnalysis */
function mapFaceShape(result: FaceShapeResult): FaceGeometryAnalysis {
  const shapeMap: Record<string, FaceGeometryAnalysis['measuredShape']> = {
    oval: 'oval',
    round: 'round',
    square: 'square',
    heart: 'heart',
    diamond: 'diamond',
    oblong: 'oblong',
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
    signals: result.candidates.map((c) => `${c.shape}: ${c.score.toFixed(2)}`),
    warnings: result.warnings.map((w) => String(w)),
  }
}

export class WebFaceShapeAnalyzer implements FaceShapeAnalyzer {
  private sdkPromise: Promise<VisuTrySDK> | null = null

  private async getSdk(): Promise<VisuTrySDK> {
    if (!this.sdkPromise) {
      this.sdkPromise = (async () => {
        const { createVisuTryWebSDK } = await import('@visutry/tryon-web')

        // SDK 1.0 requires a canvas for the Three.js renderer.
        // For face-shape-only analysis, create an offscreen canvas.
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        canvas.style.display = 'none'
        document.body.appendChild(canvas)

        const sdk = createVisuTryWebSDK({
          canvas,
          tracker: { mode: 'balanced' },
          privacy: { processOnDeviceOnly: true, allowAnalytics: true },
        })
        await sdk.initialize()
        return sdk
      })()
    }
    return this.sdkPromise
  }

  async analyze(_image: ImageInput): Promise<FaceGeometryAnalysis> {
    if (!SDK_ENABLED) {
      return {
        version: 'landmark-v1',
        status: 'unavailable',
        source: 'mediapipe-face-landmarker',
        faceDetected: false,
        faceCount: 0,
        qualityScore: 0,
        signals: [],
        warnings: ['SDK face analysis disabled (VITE_FACE_SHAPE_SDK_ENABLED != true)'],
      }
    }

    try {
      const sdk = await this.getSdk()
      const result: FaceShapeResult = await sdk.analyzeFaceShape()
      return mapFaceShape(result)
    } catch (error) {
      return {
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
      }
    }
  }

  async destroy(): Promise<void> {
    if (this.sdkPromise) {
      try {
        const sdk = await this.sdkPromise
        sdk.destroy()
      } catch {
        // ignore
      }
      this.sdkPromise = null
    }
  }
}
