import { Home, FileText, User } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import type { TabKey } from '@core/types'

const TABS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'report', label: '报告', icon: FileText },
  { key: 'profile', label: '我的', icon: User },
]

export function BottomTabBar() {
  const activeTab = useAppStore((s) => s.activeTab)
  const setActiveTab = useAppStore((s) => s.setActiveTab)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-ink-border pb-safe z-50 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-stretch h-14">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors active:scale-95"
            >
              <div className="relative">
                {active && (
                  <div className="absolute inset-0 -m-1.5 rounded-full bg-brand/15" />
                )}
                <Icon
                  size={22}
                  strokeWidth={2}
                  className={`relative ${active ? 'text-ink' : 'text-ink-tertiary'}`}
                  fill={active ? '#FFDB4D' : 'none'}
                  fillOpacity={active ? 1 : 0}
                />
              </div>
              <span
                className={`text-[10px] ${active ? 'text-ink font-semibold' : 'text-ink-tertiary'}`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
