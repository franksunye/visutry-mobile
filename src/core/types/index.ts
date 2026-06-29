/**
 * Core business types — aligned with the visutry main site.
 *
 * This module MUST NOT import any DOM or platform-specific API.
 * It is shared contract between web, WeChat, and future platforms.
 */

// ── Face shapes (mirror of main-site CANONICAL_FACE_SHAPES) ──

export const CANONICAL_FACE_SHAPES = [
  'round',
  'square',
  'oval',
  'heart',
  'diamond',
  'oblong',
  'triangle',
] as const

export type CanonicalFaceShape = (typeof CANONICAL_FACE_SHAPES)[number]

export function isCanonicalFaceShape(value: string): value is CanonicalFaceShape {
  return (CANONICAL_FACE_SHAPES as readonly string[]).includes(value)
}

// ── Face geometry (mirror of main-site FaceGeometryAnalysis) ──

export interface FaceGeometryRatios {
  faceAspectRatio: number
  cheekToFaceWidth: number
  jawToCheekWidth: number
  foreheadToCheekWidth: number
  eyeLineTiltDeg: number
  symmetryOffset: number
  noseBridgeToFaceWidth: number
}

export interface FaceGeometryAnalysis {
  version: 'landmark-v1'
  status: 'measured' | 'unavailable'
  source: 'mediapipe-face-landmarker' | 'ai-fallback'
  faceDetected: boolean
  faceCount: number
  qualityScore: number
  measuredShape?: CanonicalFaceShape
  measuredConfidence?: number
  ratios?: FaceGeometryRatios
  signals: string[]
  warnings: string[]
}

// ── Analysis results ──

export interface FaceAnalysisBasicResult {
  faceShape: CanonicalFaceShape
  faceShapeDisplayName: string
  confidence: number
  summary: string
  keyFeatures: string[]
  geometry?: FaceGeometryAnalysis
}

export interface FrameRecommendation {
  type: string
  displayName: string
  score: number
  reason: string
  stylingNote: string
}

export interface FaceAnalysisFullResult extends FaceAnalysisBasicResult {
  bestFrames: string[]
  framesToAvoid: string[]
  styleGuide: string
  catalogRecommendedStyles?: string[]
  catalogAvoidStyles?: string[]
  frameRecommendations?: FrameRecommendation[]
}

export interface FaceAnalysisTaskResponse {
  id: string
  status: string
  userImageUrl: string
  detectedShape?: string | null
  confidence?: number | null
  basicResult?: FaceAnalysisBasicResult | null
  fullResult?: FaceAnalysisFullResult | null
  reportUnlocked: boolean
  errorMessage?: string | null
  createdAt: string
  progress?: number
  isNewCompletion?: boolean
}

// ── App flow steps ──

export const APP_STEPS = ['home', 'photo', 'analyzing', 'result'] as const
export type AppStep = (typeof APP_STEPS)[number]

// ── Image input (platform-agnostic) ──

/**
 * Platform-agnostic image input.
 * On web: backed by File / Blob / ImageBitmap.
 * On WeChat: backed by tempFilePath ArrayBuffer.
 */
export interface ImageInput {
  /** Raw pixel/encoded data, platform-dependent */
  readonly data: unknown
  /** Width in pixels (if known) */
  readonly width?: number
  /** Height in pixels (if known) */
  readonly height?: number
  /** MIME type or format hint */
  readonly mimeType?: string
}
