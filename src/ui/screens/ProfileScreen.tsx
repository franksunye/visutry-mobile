import {
  ChevronRight,
  Crown,
  Diamond,
  FileText,
  Heart,
  HelpCircle,
  Info,
  Settings,
  User,
} from 'lucide-react'
import { Button } from '../components/Button'
import { useAppStore } from '@core/state/store'
import type { LucideIcon } from 'lucide-react'

interface MenuItem {
  label: string
  icon: LucideIcon
  action: () => void
}

export function ProfileScreen() {
  const currentReport = useAppStore((s) => s.currentReport)
  const navigateTo = useAppStore((s) => s.navigateTo)
  const setActiveTab = useAppStore((s) => s.setActiveTab)

  const menuItems: MenuItem[] = [
    {
      label: '我的报告',
      icon: FileText,
      action: () =>
        currentReport
          ? navigateTo('report-overview')
          : setActiveTab('report'),
    },
    {
      label: '我的收藏',
      icon: Heart,
      action: () => {},
    },
    {
      label: '设置',
      icon: Settings,
      action: () => {},
    },
    {
      label: '帮助与反馈',
      icon: HelpCircle,
      action: () => {},
    },
    {
      label: '关于我们',
      icon: Info,
      action: () => {},
    },
  ]

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-ink-bg overflow-y-auto">
      {/* Decorative crown (top-right) */}
      <Crown
        size={120}
        className="absolute top-8 right-0 text-pink/15 pointer-events-none select-none -z-0"
      />

      <div className="relative flex flex-col gap-4 px-4 pt-safe pb-4">
        {/* ── Profile card ── */}
        <div className="bg-gradient-to-br from-brand to-brand-300 rounded-card p-4 flex flex-col gap-3 mt-2">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center shrink-0">
              <User size={32} className="text-ink" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-base font-semibold text-ink">VisuTry 用户</span>
              <div className="flex items-center gap-1">
                <Diamond size={16} className="text-ink-primary" />
                <span className="text-xs text-ink-primary">
                  解锁完整版报告 &amp; 试戴
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            variant="secondary"
            size="sm"
            className="self-start bg-white text-pink border-0"
          >
            立即解锁 ¥19.9
          </Button>
        </div>

        {/* ── Menu list ── */}
        <div className="bg-white rounded-card overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isLast = index === menuItems.length - 1
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className={`flex items-center justify-between px-4 py-3 w-full text-left active:bg-black/[0.03] transition-colors ${
                  isLast ? '' : 'border-b border-ink-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-ink-secondary" />
                  <span className="text-sm text-ink-primary">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-ink-tertiary" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
