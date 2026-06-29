import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { initWebPlatform } from '@platform/web'
import { useAppStore } from '@core/state/store'
import { HomeScreen } from './ui/screens/HomeScreen'
import { PhotoScreen } from './ui/screens/PhotoScreen'
import { AnalyzingScreen } from './ui/screens/AnalyzingScreen'
import { ResultScreen } from './ui/screens/ResultScreen'

// Register web platform capabilities on first import
initWebPlatform()

export default function App() {
  const step = useAppStore((s) => s.step)
  const error = useAppStore((s) => s.error)
  const setError = useAppStore((s) => s.setError)

  // Auto-dismiss errors after 5 seconds
  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(null), 5000)
    return () => clearTimeout(timer)
  }, [error, setError])

  return (
    <div className="relative h-full">
      {/* Screen router */}
      {step === 'home' && <HomeScreen />}
      {step === 'photo' && <PhotoScreen />}
      {step === 'analyzing' && <AnalyzingScreen />}
      {step === 'result' && <ResultScreen />}

      {/* Global error toast */}
      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4">
          <div className="flex items-center gap-3 bg-red-950/90 border border-red-800 rounded-xl px-4 py-3 shadow-xl backdrop-blur">
            <AlertCircle className="text-red-400 shrink-0" size={18} />
            <p className="text-red-200 text-sm flex-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
