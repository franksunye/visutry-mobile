import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const sdkMock = vi.hoisted(() => ({
  analyzePhoto: vi.fn(),
  destroy: vi.fn(),
  create: vi.fn(),
}))

vi.mock('@visutry/tryon-web/analyzer', () => ({
  createVisuTryImageAnalyzer: () => {
    sdkMock.create()
    return {
      analyzeFaceShapeFromImage: sdkMock.analyzePhoto,
      destroy: sdkMock.destroy,
    }
  },
}))

const visutryRatios = {
  faceAspectRatio: 1.25,
  cheekToFaceWidth: 0.92,
  jawToCheekWidth: 0.83,
  foreheadToCheekWidth: 0.88,
  eyeLineTiltDeg: 0.8,
  symmetryOffset: 0.02,
  noseBridgeToFaceWidth: 0.16,
}

function response(primary: string) {
  return {
    primary,
    confidence: 0.82,
    candidates: [{ shape: primary, score: 0.9 }],
    warnings: [],
    metrics: { visutry: visutryRatios },
  }
}

function stubPhotoDecoding() {
  class DecodedImage {
    src = ''
    decode = vi.fn().mockResolvedValue(undefined)
  }
  vi.stubGlobal('Image', DecodedImage)
  const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:visutry-test')
  const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  return { create, revoke, DecodedImage }
}

describe('WebFaceShapeAnalyzer — still-photo SDK contract', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.stubEnv('VITE_FACE_SHAPE_SDK_ENABLED', 'true')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it.each(['oval', 'round', 'square', 'heart', 'diamond', 'oblong', 'triangle'])(
    'analyzes the supplied Blob photo and preserves the %s result',
    async (shape) => {
      const { create, revoke, DecodedImage } = stubPhotoDecoding()
      sdkMock.analyzePhoto.mockResolvedValue(response(shape))
      const { WebFaceShapeAnalyzer } = await import('./face-shape')
      const analyzer = new WebFaceShapeAnalyzer()
      const blob = new Blob(['fixture'], { type: 'image/jpeg' })

      const result = await analyzer.analyze({ data: blob, mimeType: 'image/jpeg' })

      expect(create).toHaveBeenCalledWith(blob)
      expect(sdkMock.analyzePhoto).toHaveBeenCalledWith(expect.any(DecodedImage))
      expect(revoke).toHaveBeenCalledOnce()
      expect(revoke).toHaveBeenCalledWith('blob:visutry-test')
      expect(result).toMatchObject({
        status: 'measured',
        source: 'mediapipe-face-landmarker',
        measuredShape: shape,
        measuredConfidence: 0.82,
        qualityScore: 82,
        faceDetected: true,
        faceCount: 1,
        ratios: visutryRatios,
      })
      await analyzer.destroy()
      expect(sdkMock.destroy).toHaveBeenCalledOnce()
    },
  )

  it('preserves detected-face truth when the classifier returns unknown', async () => {
    stubPhotoDecoding()
    sdkMock.analyzePhoto.mockResolvedValue(response('unknown'))
    const { WebFaceShapeAnalyzer } = await import('./face-shape')
    const result = await new WebFaceShapeAnalyzer().analyze({ data: new Blob(['photo']) })
    expect(result).toMatchObject({ status: 'unavailable', faceDetected: true, faceCount: 1 })
    expect(result.measuredShape).toBeUndefined()
  })

  it('never opens the SDK or camera for unsupported input', async () => {
    const { WebFaceShapeAnalyzer } = await import('./face-shape')
    const result = await new WebFaceShapeAnalyzer().analyze({ data: 123 })
    expect(result.status).toBe('unavailable')
    expect(result.warnings[0]).toContain('Unsupported photo input')
    expect(sdkMock.create).not.toHaveBeenCalled()
  })

  it('returns a disabled state without loading the SDK', async () => {
    vi.stubEnv('VITE_FACE_SHAPE_SDK_ENABLED', 'false')
    const { WebFaceShapeAnalyzer } = await import('./face-shape')
    const result = await new WebFaceShapeAnalyzer().analyze({ data: new Blob(['photo']) })
    expect(result.status).toBe('unavailable')
    expect(result.warnings[0]).toContain('disabled')
    expect(sdkMock.create).not.toHaveBeenCalled()
  })

  it('releases object URLs after SDK failures', async () => {
    const { revoke } = stubPhotoDecoding()
    sdkMock.analyzePhoto.mockRejectedValue(new Error('No face detected'))
    const { WebFaceShapeAnalyzer } = await import('./face-shape')
    const result = await new WebFaceShapeAnalyzer().analyze({ data: new Blob(['photo']) })
    expect(result.status).toBe('unavailable')
    expect(result.warnings[0]).toContain('No face detected')
    expect(revoke).toHaveBeenCalledWith('blob:visutry-test')
  })

  it('releases object URLs when decoding fails without loading the SDK', async () => {
    const { revoke } = stubPhotoDecoding()
    vi.stubGlobal('Image', class {
      src = ''
      decode = vi.fn().mockRejectedValue(new Error('bad image'))
    })
    const { WebFaceShapeAnalyzer } = await import('./face-shape')
    const result = await new WebFaceShapeAnalyzer().analyze({ data: new Blob(['photo']) })
    expect(result.status).toBe('unavailable')
    expect(result.warnings[0]).toContain('bad image')
    expect(revoke).toHaveBeenCalledWith('blob:visutry-test')
    expect(sdkMock.create).not.toHaveBeenCalled()
  })
})
