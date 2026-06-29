import { useRef } from 'react'
import { Camera, ChevronLeft, Image as ImageIcon, X } from 'lucide-react'
import { useAppStore } from '@core/state/store'
import type { ImageInput } from '@core/types'

export function UploadScreen() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const goBack = useAppStore((s) => s.goBack)
  const capturedImageUrl = useAppStore((s) => s.capturedImageUrl)
  const setCapturedImage = useAppStore((s) => s.setCapturedImage)

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const albumInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const image: ImageInput = { data: file, mimeType: file.type }
    setCapturedImage(image, url)
    e.target.value = ''
  }

  const hasImage = !!capturedImageUrl

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-12 pt-safe shrink-0">
        <button type="button" onClick={goBack} className="p-1 -ml-1 active:scale-90 transition-transform">
          <ChevronLeft size={24} className="text-ink" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-base font-semibold text-ink">上传清晰正面照</h1>
        </div>
        <button type="button" onClick={goBack} className="p-1 -mr-1 active:scale-90 transition-transform">
          <X size={20} className="text-ink-secondary" />
        </button>
      </header>

      {/* Helper text */}
      <p className="text-xs text-ink-tertiary text-center px-6 pb-4">
        请确保光线充足，面部清晰，头发不遮挡前额
      </p>

      {/* Photo preview area */}
      <div className="flex flex-col flex-1 px-5 overflow-y-auto no-scrollbar">
        <div className="bg-ink-bg rounded-card overflow-hidden shadow-card">
          {hasImage ? (
            <img
              src={capturedImageUrl ?? undefined}
              alt="待分析照片"
              className="w-full aspect-[3/4] object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={() => albumInputRef.current?.click()}
              className="w-full aspect-[3/4] flex flex-col items-center justify-center gap-3 active:scale-[0.99] transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-brand/15 flex items-center justify-center">
                <Camera size={32} className="text-brand-600" />
              </div>
              <span className="text-sm text-ink-tertiary">点击拍照或上传</span>
            </button>
          )}
        </div>

        {/* Example thumbnails */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {['正面示例', '侧面示例', '侧面示例', '仰角示例'].map((label, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-12 h-12 rounded-btn bg-ink-bg border-2 ${
                  i === 0 ? 'border-brand' : 'border-transparent'
                } flex items-center justify-center`}
              >
                <Camera size={20} className="text-ink-tertiary" />
              </div>
              <span className="text-[10px] text-ink-tertiary">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="px-5 pt-4 pb-8 pb-safe space-y-3">
        {hasImage ? (
          <button
            type="button"
            onClick={() => navigateTo('analyzing')}
            className="w-full h-13 py-3.5 bg-brand text-ink font-semibold text-base rounded-btn flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-brand"
          >
            开始分析
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 h-13 py-3.5 bg-brand text-ink font-semibold text-base rounded-btn flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-brand"
            >
              <Camera size={20} />
              拍照
            </button>
            <button
              type="button"
              onClick={() => albumInputRef.current?.click()}
              className="flex-1 h-13 py-3.5 bg-white text-ink-primary font-medium text-sm rounded-btn border border-ink-border flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <ImageIcon size={18} className="text-ink-secondary" />
              从相册选择
            </button>
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFileSelect} />
      <input ref={albumInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
    </div>
  )
}
