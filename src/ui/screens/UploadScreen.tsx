import { useRef } from 'react'
import { Camera, Image as ImageIcon, Sparkles } from 'lucide-react'
import { Button } from '../components/Button'
import { ScreenHeader } from '../components/ScreenHeader'
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
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
      <ScreenHeader title="上传清晰正面照" onBack={goBack} onClose={goBack} />

      <div className="flex flex-col flex-1 px-4 pb-6 pt-2 overflow-y-auto no-scrollbar">
        {/* Photo guidelines card */}
        <div className="bg-white rounded-card p-4 shadow-card space-y-4">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-brand/15 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs text-brand-700 font-bold">i</span>
            </div>
            <p className="text-sm text-ink-secondary leading-relaxed">
              请确保光线充足，面部清晰，头发不遮挡前额
            </p>
          </div>

          {/* Preview area */}
          {hasImage ? (
            <div className="relative">
              <img
                src={capturedImageUrl ?? undefined}
                alt="待分析照片"
                className="w-full aspect-[3/4] rounded-btn object-cover"
              />
              <button
                onClick={() => albumInputRef.current?.click()}
                className="absolute bottom-3 right-3 bg-black/50 text-white text-xs rounded-full px-3 py-1.5 backdrop-blur active:scale-95 transition-transform"
              >
                换一张
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => albumInputRef.current?.click()}
              className="w-full aspect-[3/4] rounded-btn border-2 border-dashed border-ink-border flex flex-col items-center justify-center gap-3 active:scale-[0.99] transition-transform bg-ink-bg/50"
            >
              <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
                <Camera size={32} className="text-brand-600" />
              </div>
              <span className="text-sm text-ink-tertiary">点击拍照或上传</span>
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6">
          {hasImage ? (
            <Button variant="primary" size="lg" onClick={() => navigateTo('analyzing')}>
              <Sparkles size={20} />
              开始分析
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="primary" size="lg" className="flex-1" onClick={() => cameraInputRef.current?.click()}>
                <Camera size={20} />
                拍照
              </Button>
              <Button variant="secondary" size="lg" className="flex-1" onClick={() => albumInputRef.current?.click()}>
                <ImageIcon size={20} />
                从相册选择
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file inputs */}
      <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFileSelect} />
      <input ref={albumInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
    </div>
  )
}
