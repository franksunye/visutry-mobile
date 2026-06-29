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

// ── Face shape display names (Chinese) ──

export const FACE_SHAPE_DISPLAY_NAMES: Record<CanonicalFaceShape, string> = {
  round: '圆形脸',
  square: '方形脸',
  oval: '椭圆形脸',
  heart: '心形脸',
  diamond: '菱形脸',
  oblong: '长形脸',
  triangle: '三角形脸',
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

// ── Analysis report ──

export interface FaceFeatureMetric {
  label: string
  value: string
  level?: 'high' | 'medium' | 'low'
}

export interface FrameRecommendationItem {
  rank: number
  type: string
  displayName: string
  matchScore: number
  reason: string
  stylingNote: string
}

export interface SizeSuggestion {
  frameWidth: string
  lensHeight: string
  templeLength: string
  wearingTips: string[]
}

export interface FaceAnalysisReport {
  id: string
  createdAt: string
  faceShape: CanonicalFaceShape
  faceShapeDisplayName: string
  confidence: number
  photoUrl?: string
  summary: string
  keyFeatures: FaceFeatureMetric[]
  bestFrames: FrameRecommendationItem[]
  avoidFrames: string[]
  sizeSuggestion?: SizeSuggestion
  unlocked: boolean
  geometry?: FaceGeometryAnalysis
}

// ── Navigation ──

export type TabKey = 'home' | 'report' | 'profile'

export type SubPage =
  | 'upload'
  | 'analyzing'
  | 'report-overview'
  | 'frame-recommendation'
  | 'size-suggestion'
  | 'history'

// ── Image input (platform-agnostic) ──

export interface ImageInput {
  readonly data: unknown
  readonly width?: number
  readonly height?: number
  readonly mimeType?: string
}
