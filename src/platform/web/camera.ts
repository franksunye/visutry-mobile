/**
 * Web camera service — implements CameraService via getUserMedia.
 *
 * This file IS allowed to use DOM APIs. It is the web-specific
 * implementation of the platform-agnostic CameraService interface.
 */

import type { CameraConfig } from '@core/platform'
import type { CameraService } from '@core/platform'
import type { ImageInput } from '@core/types'

export class WebCameraService implements CameraService {
  private stream: MediaStream | null = null
  private video: HTMLVideoElement | null = null
  private config: CameraConfig | null = null

  async start(config: CameraConfig): Promise<void> {
    this.config = config

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera API not available in this environment')
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: config.facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    })

    // Create a video element to attach the stream (not necessarily in DOM)
    this.video = document.createElement('video')
    this.video.srcObject = this.stream
    this.video.playsInline = true
    this.video.muted = true
    await this.video.play()
  }

  stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }
    if (this.video) {
      this.video.srcObject = null
      this.video = null
    }
    this.config = null
  }

  isActive(): boolean {
    return this.stream !== null && this.stream.active
  }

  async capture(): Promise<ImageInput> {
    if (!this.video || !this.video.videoWidth) {
      throw new Error('Camera not started or no video frame available')
    }

    const canvas = document.createElement('canvas')
    canvas.width = this.video.videoWidth
    canvas.height = this.video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Cannot get 2D canvas context')

    // Apply mirror if configured
    if (this.config?.mirror) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height)

    return new Promise<ImageInput>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to capture photo'))
            return
          }
          resolve({
            data: blob,
            width: canvas.width,
            height: canvas.height,
            mimeType: 'image/jpeg',
          })
        },
        'image/jpeg',
        0.92,
      )
    })
  }

  async switchCamera(): Promise<void> {
    if (!this.config) return
    const newFacing = this.config.facingMode === 'user' ? 'environment' : 'user'
    this.stop()
    await this.start({ ...this.config, facingMode: newFacing })
  }

  /** Expose the video element for UI preview (web-only) */
  getVideoElement(): HTMLVideoElement | null {
    return this.video
  }
}
