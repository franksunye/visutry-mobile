/**
 * Web face shape analyzer — implements FaceShapeAnalyzer via @visutry/tryon-web.
 *
 * This file IS allowed to use DOM APIs (ImageBitmap, createImageBitmap).
 * The WeChat counterpart (platform/wechat/face-shape.ts) will use
 * @visutry/tryon-wechat instead.
 */

import type { VisuTrySDK } from '@visutry/tryon-core'
import type { FaceShapeAnalyzer } from '@core/face-shape/analyzer'
import type { FaceGeometryAnalysis, ImageInput } from '@core/types'

const SDK_ENABLED = import.meta.env.VITE_FACE_SHAPE_SDK_ENABLED === 'true'

export class WebFaceShapeAnalyzer implements FaceShapeAnalyzer {
  private sdkPromise: Promise<VisuTrySDK> | null = null

  private async getSdk(): Promise<VisuTrySDK> {
    if (!this.sdkPromise) {
      this.sdkPromise = (async () => {
        const { createVisuTryWebSDK } = await import('@visutry/tryon-web')

        const sdk = createVisuTryWebSDK({
          tracker: { mode: 'accurate' },
          privacy: { processOnDeviceOnly: true, allowAnalytics: true },
        })
        await sdk.initialize()
        return sdk
      })()
    }
    return this.sdkPromise
  }

  async analyze(image: ImageInput): Promise<FaceGeometryAnalysis> {
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

    // Convert platform-agnostic ImageInput to ImageBitmap for the web SDK
    const blob = image.data as Blob
    const bitmap = await createImageBitmap(blob)

    try {
      const sdk = await this.getSdk()
      const { toFaceGeometryAnalysis } = await import('@visutry/tryon-core')

      const result = await sdk.analyzeImage(bitmap, {
        maxDimension: 1024,
        applyExif: true,
      })

      return toFaceGeometryAnalysis(result) as FaceGeometryAnalysis
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
    } finally {
      bitmap.close()
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
