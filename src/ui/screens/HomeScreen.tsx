import { ScanFace } from 'lucide-react'
import { Button } from '../components/Button'
import { useAppStore } from '@core/state/store'

export function HomeScreen() {
  const setStep = useAppStore((s) => s.setStep)

  return (
    <div className="flex flex-col items-center justify-between h-full min-h-[100dvh] px-6 pt-safe pb-safe">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-brand-500/10 flex items-center justify-center ring-1 ring-brand-500/20">
          <ScanFace className="text-brand-400" size={40} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">VisuTry</h1>
          <p className="text-slate-400 text-sm max-w-xs">
            Discover your face shape and find the perfect glasses — powered by
            on-device AI.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="w-full max-w-sm space-y-3 pb-6">
        <Button size="lg" className="w-full" onClick={() => setStep('photo')}>
          Analyze My Face
        </Button>
        <p className="text-center text-xs text-slate-500">
          Photos stay on your device — nothing is uploaded.
        </p>
      </div>
    </div>
  )
}
