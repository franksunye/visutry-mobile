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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-ink-border pb-safe z-50">
      <div className="flex items-stretch h-14">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Icon
                size={24}
                strokeWidth={2}
                className={active ? 'text-ink' : 'text-ink-tertiary'}
                fill={active ? '#FFDB4D' : 'none'}
                fillOpacity={active ? 1 : 0}
              />
              <span
                className={`text-[10px] ${active ? 'text-ink font-medium' : 'text-ink-tertiary'}`}
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
