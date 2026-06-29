/**
 * App state — Zustand store.
 *
 * This store lives in the core layer and holds only platform-agnostic
 * state (current step, analysis results, errors). UI state that is
 * web-specific (e.g. modal open/close) should live in the ui layer.
 */

import { create } from 'zustand'
import type {
  AppStep,
  FaceGeometryAnalysis,
  FaceAnalysisTaskResponse,
} from '../types'
import type { StyleRecommendation } from '../face-shape/analyzer'

interface AppState {
  // ── Navigation ──
  step: AppStep
  setStep: (step: AppStep) => void

  // ── Local face analysis (on-device, free) ──
  localGeometry: FaceGeometryAnalysis | null
  setLocalGeometry: (geometry: FaceGeometryAnalysis | null) => void

  // ── Style recommendation (derived from localGeometry) ──
  recommendation: StyleRecommendation | null
  setRecommendation: (rec: StyleRecommendation | null) => void

  // ── Remote VLM analysis (main site, paid) ──
  remoteTask: FaceAnalysisTaskResponse | null
  setRemoteTask: (task: FaceAnalysisTaskResponse | null) => void

  // ── Error handling ──
  error: string | null
  setError: (error: string | null) => void

  // ── Loading flags ──
  isAnalyzing: boolean
  setAnalyzing: (analyzing: boolean) => void

  // ── Reset to initial state ──
  reset: () => void
}

const initialState = {
  step: 'home' as AppStep,
  localGeometry: null,
  recommendation: null,
  remoteTask: null,
  error: null,
  isAnalyzing: false,
}

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setLocalGeometry: (localGeometry) => set({ localGeometry }),
  setRecommendation: (recommendation) => set({ recommendation }),
  setRemoteTask: (remoteTask) => set({ remoteTask }),
  setError: (error) => set({ error }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  reset: () => set(initialState),
}))
