/**
 * API client for the visutry main site.
 *
 * Pure platform-agnostic logic — uses `fetch` which is available in both
 * browser and WeChat Mini Program (via `wx.request` adapter, not yet wired).
 * For now, the web platform provides `fetch` natively.
 */

import type { FaceAnalysisReport } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

/** Simple typed fetch wrapper */
async function apiRequest<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    body?: unknown
    headers?: Record<string, string>
  } = {},
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => 'Unknown error')
    throw new Error(`API ${method} ${path} failed (${response.status}): ${text}`)
  }

  return response.json() as Promise<T>
}

// ── Face analysis endpoints ──

export const api = {
  /**
   * Submit a photo for VLM deep analysis (main site, requires upload).
   * Returns a report that can be polled for completion.
   */
  submitFaceAnalysis(imageBase64: string): Promise<FaceAnalysisReport> {
    return apiRequest<FaceAnalysisReport>('/api/face-analysis/submit', {
      method: 'POST',
      body: { image: imageBase64 },
    })
  },

  /** Get a face analysis report by ID */
  getReport(reportId: string): Promise<FaceAnalysisReport> {
    return apiRequest<FaceAnalysisReport>(`/api/face-analysis/status?id=${reportId}`)
  },

  /** Unlock the full report (Stripe checkout or credit consumption) */
  unlockReport(reportId: string): Promise<FaceAnalysisReport> {
    return apiRequest<FaceAnalysisReport>('/api/face-analysis/unlock', {
      method: 'POST',
      body: { reportId },
    })
  },

  /** Generic health check */
  health(): Promise<{ status: string }> {
    return apiRequest<{ status: string }>('/api/health')
  },
}
