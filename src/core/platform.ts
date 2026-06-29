/**
 * Platform capability interface (dependency injection boundary).
 *
 * The `core/` layer defines what capabilities it needs; the `platform/`
 * layer provides concrete implementations. This is the SEAM that makes
 * the app portable — swap the implementation to target a new platform
 * (WeChat Mini Program, React Native, etc.) without touching core logic.
 *
 * core/ MUST NOT import this file's implementation, only the interface.
 */

import type { ImageInput } from './types'

// ── Camera ──

export interface CameraConfig {
  facingMode: 'user' | 'environment'
  mirror?: boolean
}

export interface CameraFrame {
  data: ArrayBuffer
  width: number
  height: number
}

export interface CameraService {
  /** Start the camera stream with the given config */
  start(config: CameraConfig): Promise<void>
  /** Stop the camera stream and release resources */
  stop(): void
  /** Whether the camera is currently active */
  isActive(): boolean
  /** Capture a still frame from the current stream */
  capture(): Promise<ImageInput>
  /** Switch between front/back camera */
  switchCamera(): Promise<void>
}

// ── Storage ──

export interface StorageService {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}

// ── Platform capabilities container ──

export interface PlatformCapabilities {
  camera: CameraService
  storage: StorageService
  /** Platform name for analytics / debugging */
  readonly platformName: string
}

/**
 * Global platform registry. The platform layer registers itself on boot.
 * Core code accesses capabilities through `getPlatform()`.
 */
let _platform: PlatformCapabilities | null = null

export function registerPlatform(capabilities: PlatformCapabilities): void {
  _platform = capabilities
}

export function getPlatform(): PlatformCapabilities {
  if (!_platform) {
    throw new Error(
      'Platform not registered. Call registerPlatform() from the platform layer before using core.',
    )
  }
  return _platform
}
