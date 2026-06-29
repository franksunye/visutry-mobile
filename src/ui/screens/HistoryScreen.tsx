import { FileText, Pencil, User } from 'lucide-react'
import { Button } from '../components/Button'
import { ScreenHeader } from '../components/ScreenHeader'
import { useAppStore } from '@core/state/store'
import type { FaceAnalysisReport } from '@core/types'

/**
 * Format an ISO date string as `YYYY-MM-DD HH:mm`.
 * Falls back to the raw string when the value cannot be parsed.
 */
function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}

export function HistoryScreen() {
  const history = useAppStore((s) => s.history)
  const goBack = useAppStore((s) => s.goBack)
  const clearHistory = useAppStore((s) => s.clearHistory)
  const setActiveTab = useAppStore((s) => s.setActiveTab)

  const editButton = (
    <button
      type="button"
      aria-label="编辑"
      className="p-1 active:scale-90 transition-transform"
    >
      <Pencil size={18} className="text-ink-secondary" />
    </button>
  )

  // ── Empty state ──
  if (history.length === 0) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
        <ScreenHeader title="历史报告" onBack={goBack} rightSlot={editButton} />
        <div className="flex flex-col items-center justify-center gap-4 flex-1 px-6 text-center">
          <FileText size={48} className="text-ink-tertiary" />
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-ink">暂无历史报告</p>
            <p className="text-sm text-ink-tertiary">开始你的第一次脸型分析</p>
          </div>
          <Button variant="primary" onClick={() => setActiveTab('home')}>
            去分析
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
      <ScreenHeader title="历史报告" onBack={goBack} rightSlot={editButton} />

      <div className="flex flex-col flex-1 px-4 pb-6 pt-2 overflow-y-auto">
        {/* ── Report list ── */}
        <ul className="flex flex-col gap-3">
          {history.map((report: FaceAnalysisReport) => (
            <li
              key={report.id}
              className="bg-white rounded-card p-3 shadow-sm flex items-center gap-3"
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-full bg-brand-200 flex items-center justify-center shrink-0">
                <User size={24} className="text-ink" />
              </div>

              {/* Center info */}
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-sm font-semibold text-ink truncate">
                  {report.faceShapeDisplayName}
                </span>
                <span className="text-xs text-ink-tertiary">
                  {formatDateTime(report.createdAt)}
                </span>
              </div>

              {/* Confidence badge */}
              <span className="bg-lime/20 text-lime rounded-full px-2 py-0.5 text-xs font-medium shrink-0">
                {report.confidence}%匹配度
              </span>
            </li>
          ))}
        </ul>

        {/* ── Clear history ── */}
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={clearHistory}
            className="text-sm text-ink-tertiary active:opacity-60 transition-opacity"
          >
            清空记录
          </button>
        </div>
      </div>
    </div>
  )
}
