import { Loader2 } from 'lucide-react'

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={`animate-spin text-brand-400 ${className ?? ''}`}
      size={32}
    />
  )
}

export function FullScreenSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[60vh]">
      <Spinner />
      {label && <p className="text-slate-400 text-sm">{label}</p>}
    </div>
  )
}
