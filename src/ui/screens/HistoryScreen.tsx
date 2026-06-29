import { ChevronLeft, Pencil } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import type { FaceAnalysisReport } from '@core/types'

/** Mock history data for UI preview */
const MOCK_HISTORY: FaceAnalysisReport[] = [
  {
    id: 'mock-1',
    createdAt: '2024-06-14T12:30:00.000Z',
    faceShape: 'square',
    faceShapeDisplayName: '方形脸',
    confidence: 92,
    summary: '',
    keyFeatures: [],
    bestFrames: [],
    avoidFrames: [],
    unlocked: true,
  },
  {
    id: 'mock-2',
    createdAt: '2024-05-20T09:45:00.000Z',
    faceShape: 'round',
    faceShapeDisplayName: '圆形脸',
    confidence: 89,
    summary: '',
    keyFeatures: [],
    bestFrames: [],
    avoidFrames: [],
    unlocked: true,
  },
  {
    id: 'mock-3',
    createdAt: '2024-05-10T11:20:00.000Z',
    faceShape: 'oval',
    faceShapeDisplayName: '椭圆形脸',
    confidence: 90,
    summary: '',
    keyFeatures: [],
    bestFrames: [],
    avoidFrames: [],
    unlocked: true,
  },
  {
    id: 'mock-4',
    createdAt: '2024-03-25T14:15:00.000Z',
    faceShape: 'heart',
    faceShapeDisplayName: '心形脸',
    confidence: 88,
    summary: '',
    keyFeatures: [],
    bestFrames: [],
    avoidFrames: [],
    unlocked: true,
  },
]

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function HistoryScreen() {
  const history = useAppStore((s) => s.history)
  const goBack = useAppStore((s) => s.goBack)

  // Merge real history with mock data for preview
  const displayHistory = history.length > 0 ? history : MOCK_HISTORY

  return (
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-12 pt-safe shrink-0 bg-white">
        <button type="button" onClick={goBack} className="p-1 -ml-1 active:scale-90 transition-transform">
          <ChevronLeft size={24} className="text-ink" />
        </button>
        <h1 className="text-base font-semibold text-ink">历史报告</h1>
        <button type="button" className="p-1 -mr-1 active:scale-90 transition-transform">
          <Pencil size={18} className="text-ink-secondary" />
        </button>
      </header>

      {/* Report list */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-6 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-3">
          {displayHistory.map((report) => (
            <div key={report.id} className="bg-white rounded-card p-3 shadow-card flex items-center gap-3">
              {/* Thumbnail — rounded rectangle */}
              <div className="w-12 h-12 rounded-btn bg-ink-bg flex items-center justify-center shrink-0 overflow-hidden">
                {report.photoUrl ? (
                  <img src={report.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand/20" />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-sm font-semibold text-ink">{report.faceShapeDisplayName}</span>
                <span className="text-xs text-ink-tertiary">{formatDateTime(report.createdAt)}</span>
              </div>

              {/* Match score */}
              <span className="bg-lime/20 text-lime rounded-full px-2 py-0.5 text-xs font-medium shrink-0">
                {report.confidence}% 匹配
              </span>
            </div>
          ))}
        </div>

        {/* Clear button */}
        <div className="flex justify-center pt-6">
          <button type="button" className="text-sm text-ink-tertiary active:opacity-60 transition-opacity">
            清空记录
          </button>
        </div>
      </div>
    </div>
  )
}
