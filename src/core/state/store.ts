/**
 * App state — Zustand store.
 *
 * Holds platform-agnostic state: active tab, sub-page navigation,
 * current report, history, and captured image.
 */

import { create } from 'zustand'
import type {
  TabKey,
  SubPage,
  FaceAnalysisReport,
  ImageInput,
} from '../types'

interface AppState {
  // ── Navigation ──
  activeTab: TabKey
  subPage: SubPage | null
  setActiveTab: (tab: TabKey) => void
  navigateTo: (page: SubPage) => void
  goBack: () => void

  // ── Captured image (for analysis flow) ──
  capturedImage: ImageInput | null
  capturedImageUrl: string | null
  setCapturedImage: (img: ImageInput | null, url: string | null) => void

  // ── Current report ──
  currentReport: FaceAnalysisReport | null
  setCurrentReport: (report: FaceAnalysisReport | null) => void

  // ── History ──
  history: FaceAnalysisReport[]
  addToHistory: (report: FaceAnalysisReport) => void
  clearHistory: () => void

  // ── Error ──
  error: string | null
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  // ── Navigation ──
  activeTab: 'home',
  subPage: null,
  setActiveTab: (activeTab) => set({ activeTab, subPage: null }),
  navigateTo: (subPage) => set({ subPage }),
  goBack: () => set({ subPage: null }),

  // ── Captured image ──
  capturedImage: null,
  capturedImageUrl: null,
  setCapturedImage: (capturedImage, capturedImageUrl) =>
    set({ capturedImage, capturedImageUrl }),

  // ── Current report ──
  currentReport: null,
  setCurrentReport: (currentReport) => set({ currentReport }),

  // ── History ──
  history: [],
  addToHistory: (report) =>
    set((state) => ({ history: [report, ...state.history] })),
  clearHistory: () => set({ history: [] }),

  // ── Error ──
  error: null,
  setError: (error) => set({ error }),
}))
