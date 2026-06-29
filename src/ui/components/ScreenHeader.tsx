import { ChevronLeft, X } from 'lucide-react'

interface ScreenHeaderProps {
  title: string
  onBack?: () => void
  onClose?: () => void
  rightSlot?: React.ReactNode
  subtitle?: string
}

export function ScreenHeader({ title, onBack, onClose, rightSlot, subtitle }: ScreenHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 h-12 pt-safe shrink-0 bg-transparent">
      <div className="flex items-center gap-2 w-20">
        {onBack && (
          <button onClick={onBack} className="p-1 -ml-1 active:scale-90 transition-transform">
            <ChevronLeft size={24} className="text-ink" />
          </button>
        )}
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-base font-semibold text-ink">{title}</h1>
        {subtitle && <span className="text-xs text-ink-tertiary">{subtitle}</span>}
      </div>
      <div className="flex items-center justify-end gap-2 w-20">
        {rightSlot}
        {onClose && (
          <button onClick={onClose} className="p-1 active:scale-90 transition-transform">
            <X size={20} className="text-ink-secondary" />
          </button>
        )}
      </div>
    </header>
  )
}
