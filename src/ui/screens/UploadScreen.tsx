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
    // reset so selecting the same file again still fires `change`
    e.target.value = ''
  }

  const hasImage = !!capturedImageUrl

  return (
    <div className="flex flex-col min-h-[100dvh] bg-ink-bg">
      <ScreenHeader title="上传清晰正面照" onBack={goBack} onClose={goBack} />

      <div className="flex flex-col flex-1 px-4 pb-6 pt-2 overflow-y-auto">
        {/* White card */}
        <div className="bg-white rounded-card p-4 shadow-sm space-y-4">
          <p className="text-sm text-ink-secondary">
            请确保光线充足，面部清晰，头发不遮挡前额
          </p>

          {/* Preview area */}
          {hasImage ? (
            <img
              src={capturedImageUrl ?? undefined}
              alt="待分析照片"
              className="w-full aspect-square rounded-btn object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={() => albumInputRef.current?.click()}
              className="w-full aspect-square rounded-btn border-2 border-dashed border-ink-border flex flex-col items-center justify-center gap-3 active:scale-[0.99] transition-transform"
            >
              <Camera size={48} className="text-ink-tertiary" />
              <span className="text-sm text-ink-tertiary">点击拍照或上传</span>
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6">
          {hasImage ? (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => albumInputRef.current?.click()}
              >
                重新选择
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => navigateTo('analyzing')}
              >
                <Sparkles size={20} />
                开始分析
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera size={20} />
                拍照
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => albumInputRef.current?.click()}
              >
                <ImageIcon size={20} />
                从相册选择
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={albumInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  )
}
