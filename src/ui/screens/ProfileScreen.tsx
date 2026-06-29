import {
  ChevronRight,
  Crown,
  FileText,
  Heart,
  HelpCircle,
  Info,
  Settings,
  User,
} from 'lucide-react'
import { useAppStore } from '@core/state/store'
import type { LucideIcon } from 'lucide-react'

export function ProfileScreen() {
  const currentReport = useAppStore((s) => s.currentReport)
  const navigateTo = useAppStore((s) => s.navigateTo)
  const setActiveTab = useAppStore((s) => s.setActiveTab)

  const menuItems: { label: string; icon: LucideIcon; action: () => void }[] = [
    {
      label: '我的报告',
      icon: FileText,
      action: () => (currentReport ? navigateTo('report-overview') : setActiveTab('report')),
    },
    { label: '我的收藏', icon: Heart, action: () => {} },
    { label: '设置', icon: Settings, action: () => {} },
    { label: '帮助与反馈', icon: HelpCircle, action: () => {} },
    { label: '关于我们', icon: Info, action: () => {} },
  ]

  return (
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
      {/* Yellow header card — full width, bottom rounded */}
      <div className="relative bg-brand pt-safe pb-6 px-5 rounded-b-screen overflow-hidden">
        {/* Crown decoration */}
        <Crown size={100} className="absolute top-8 right-0 text-pink/15 pointer-events-none select-none" fill="#FF689A" fillOpacity={0.1} />

        {/* Avatar + name */}
        <div className="relative flex items-center gap-3 mt-2">
          <div className="w-16 h-16 rounded-full bg-white/40 flex items-center justify-center shrink-0 ring-3 ring-white/50">
            <User size={32} className="text-ink" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold text-ink">VisuTry 用户</span>
            <span className="text-xs text-ink-primary">ID: 123456789</span>
          </div>
        </div>

        {/* Upgrade banner */}
        <div className="relative bg-white/80 rounded-btn px-4 py-3 flex items-center justify-between mt-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-ink">解锁完整版报告 & 试戴</span>
            <span className="text-xs text-ink-secondary">完整风格指南，更多镜框推荐</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-base font-bold text-pink">¥19.9</span>
            <button className="bg-pink text-white text-xs font-semibold rounded-btn px-3 py-1.5 active:scale-95 transition-transform">
              立即解锁
            </button>
          </div>
        </div>
      </div>

      {/* Menu list */}
      <div className="bg-white rounded-card overflow-hidden shadow-card mx-4 mt-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isLast = index === menuItems.length - 1
          return (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className={`flex items-center justify-between px-4 h-14 w-full text-left active:bg-black/[0.02] transition-colors ${
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
  )
}
