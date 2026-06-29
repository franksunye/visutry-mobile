import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { initWebPlatform } from '@platform/web'
import { useAppStore } from '@core/state/store'
import { BottomTabBar } from './ui/components/BottomTabBar'
import { HomeScreen } from './ui/screens/HomeScreen'
import { UploadScreen } from './ui/screens/UploadScreen'
import { AnalyzingScreen } from './ui/screens/AnalyzingScreen'
import { ReportOverviewScreen } from './ui/screens/ReportOverviewScreen'
import { FrameRecommendationScreen } from './ui/screens/FrameRecommendationScreen'
import { SizeSuggestionScreen } from './ui/screens/SizeSuggestionScreen'
import { HistoryScreen } from './ui/screens/HistoryScreen'
import { ProfileScreen } from './ui/screens/ProfileScreen'

// Register web platform capabilities on first import
initWebPlatform()

export default function App() {
  const activeTab = useAppStore((s) => s.activeTab)
  const subPage = useAppStore((s) => s.subPage)
  const error = useAppStore((s) => s.error)
  const setError = useAppStore((s) => s.setError)

  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(null), 5000)
    return () => clearTimeout(timer)
  }, [error, setError])

  // ── Sub-page overlay (takes full screen, hides tab bar) ──
  const renderSubPage = () => {
    switch (subPage) {
      case 'upload':
        return <UploadScreen />
      case 'analyzing':
        return <AnalyzingScreen />
      case 'report-overview':
        return <ReportOverviewScreen />
      case 'frame-recommendation':
        return <FrameRecommendationScreen />
      case 'size-suggestion':
        return <SizeSuggestionScreen />
      case 'history':
        return <HistoryScreen />
      default:
        return null
    }
  }

  // ── Tab page (main content area with bottom tab bar) ──
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />
      case 'report':
        return <ReportOverviewScreen />
      case 'profile':
        return <ProfileScreen />
      default:
        return <HomeScreen />
    }
  }

  const isSubPageActive = subPage !== null

  return (
    <div className="relative h-full min-h-[100dvh] bg-ink-bg">
      {/* Tab content (always mounted, hidden when sub-page active) */}
      <div className={isSubPageActive ? 'hidden' : 'block pb-14'}>
        {renderTabContent()}
      </div>

      {/* Sub-page overlay */}
      {isSubPageActive && (
        <div className="absolute inset-0 z-40 bg-ink-bg overflow-y-auto no-scrollbar">
          {renderSubPage()}
        </div>
      )}

      {/* Bottom tab bar (hidden during sub-page) */}
      {!isSubPageActive && <BottomTabBar />}

      {/* Global error toast */}
      {error && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] max-w-sm w-full px-4">
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-btn px-4 py-3 shadow-lg">
            <AlertCircle className="text-red-500 shrink-0" size={18} />
            <p className="text-red-700 text-sm flex-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
