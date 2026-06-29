/**
 * Face shape analysis — platform-agnostic interface & recommendation logic.
 *
 * The actual SDK invocation (MediaPipe on web, VKSession on WeChat) lives
 * in the platform layer. Core only defines the contract and the
 * recommendation rules that consume the analysis result.
 */

import type { CanonicalFaceShape, FaceGeometryAnalysis, ImageInput } from '../types'

// ── Analyzer interface (implemented by platform layer) ──

export interface FaceShapeAnalyzer {
  /** Analyze an image and return face geometry */
  analyze(image: ImageInput): Promise<FaceGeometryAnalysis>
  /** Release SDK resources */
  destroy(): Promise<void>
}

// ── Recommendation rules (pure logic, no platform deps) ──

interface StyleRule {
  shape: CanonicalFaceShape
  best: string[]
  avoid: string[]
  summary: string
}

const STYLE_RULES: Record<CanonicalFaceShape, StyleRule> = {
  oval: {
    shape: 'oval',
    best: ['Wayfarer', 'Rectangle', 'Geometric'],
    avoid: ['Oversized round'],
    summary: 'Oval faces suit most frame styles. Experiment with bold shapes.',
  },
  round: {
    shape: 'round',
    best: ['Rectangle', 'Square', 'Browline'],
    avoid: ['Round', 'Oversized'],
    summary: 'Angular frames add definition and length to round faces.',
  },
  square: {
    shape: 'square',
    best: ['Round', 'Oval', 'Aviator'],
    avoid: ['Square', 'Geometric'],
    summary: 'Rounded frames soften strong jawlines and angular features.',
  },
  heart: {
    shape: 'heart',
    best: ['Round', 'Oval', 'Rimless'],
    avoid: ['Top-heavy', 'Decorated temples'],
    summary: 'Lighter, bottom-heavy frames balance a wide forehead.',
  },
  diamond: {
    shape: 'diamond',
    best: ['Oval', 'Cat-eye', 'Rimless'],
    avoid: ['Narrow', 'Boxy'],
    summary: 'Frames that highlight the brow line complement diamond faces.',
  },
  oblong: {
    shape: 'oblong',
    best: ['Oversized', 'Round', 'Decorative'],
    avoid: ['Narrow', 'Tall'],
    summary: 'Tall, wide frames shorten and balance oblong faces.',
  },
  triangle: {
    shape: 'triangle',
    best: ['Browline', 'Cat-eye', 'Top-heavy'],
    avoid: ['Bottom-heavy', 'Narrow bottom'],
    summary: 'Top-heavy frames add width to the upper face.',
  },
}

export interface StyleRecommendation {
  faceShape: CanonicalFaceShape
  bestFrames: string[]
  avoidFrames: string[]
  summary: string
}

export function getStyleRecommendation(
  geometry: FaceGeometryAnalysis,
): StyleRecommendation | null {
  if (geometry.status !== 'measured' || !geometry.measuredShape) {
    return null
  }

  const rule = STYLE_RULES[geometry.measuredShape]
  return {
    faceShape: rule.shape,
    bestFrames: rule.best,
    avoidFrames: rule.avoid,
    summary: rule.summary,
  }
}
