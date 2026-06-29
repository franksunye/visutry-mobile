import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, SwitchCamera, Upload, X } from 'lucide-react'
import { Button } from '../components/Button'
import { useAppStore } from '@core/state/store'
import { getPlatform } from '@core/platform'
import type { ImageInput } from '@core/types'

export function PhotoScreen() {
  const setStep = useAppStore((s) => s.setStep)
  const setError = useAppStore((s) => s.setError)

  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const { camera } = getPlatform()
      await camera.start({ facingMode: 'user', mirror: true })
      const video = (camera as any).getVideoElement() as HTMLVideoElement | null
      if (video && videoRef.current) {
        videoRef.current.srcObject = video.srcObject
        await videoRef.current.play()
      }
      setCameraActive(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to start camera',
      )
    }
  }, [setError])

  const stopCamera = useCallback(() => {
    const { camera } = getPlatform()
    camera.stop()
    setCameraActive(false)
  }, [])

  const handleCapture = useCallback(async () => {
    try {
      const { camera } = getPlatform()
      const image: ImageInput = await camera.capture()
      stopCamera()
      setPreview(URL.createObjectURL(image.data as Blob))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Capture failed')
    }
  }, [stopCamera, setError])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setPreview(URL.createObjectURL(file))
      setCameraActive(false)
    },
    [],
  )

  const handleAnalyze = useCallback(async () => {
    setStep('analyzing')
  }, [setStep])

  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  return (
    <div className="flex flex-col h-full min-h-[100dvh] bg-black">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 pt-safe">
        <Button variant="ghost" size="sm" onClick={() => setStep('home')}>
          <X size={20} />
        </Button>
        <span className="text-slate-300 text-sm font-medium">Take Photo</span>
        <div className="w-9" />
      </div>

      {/* Camera / Preview area */}
      <div className="flex-1 relative overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button variant="secondary" size="lg" onClick={startCamera}>
                  <Camera className="mr-2" size={20} />
                  Start Camera
                </Button>
              </div>
            )}
          </>
        )}

        {/* Face guide overlay */}
        {cameraActive && !preview && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-72 border-2 border-white/30 rounded-[50%]" />
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="px-6 py-6 pb-safe space-y-3 bg-slate-950">
        {preview ? (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => {
                setPreview(null)
                startCamera()
              }}
            >
              Retake
            </Button>
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAnalyze}
            >
              Analyze
            </Button>
          </div>
        ) : cameraActive ? (
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={stopCamera}>
              Cancel
            </Button>
            <button
              onClick={handleCapture}
              className="w-16 h-16 rounded-full border-4 border-white bg-white/20 active:scale-90 transition-transform"
              aria-label="Capture"
            />
            <Button variant="ghost" size="sm">
              <SwitchCamera size={20} />
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2" size={20} />
              Upload
            </Button>
            <Button
              size="lg"
              className="flex-1"
              onClick={startCamera}
            >
              <Camera className="mr-2" size={20} />
              Camera
            </Button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  )
}
