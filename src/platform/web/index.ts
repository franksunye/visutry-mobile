/**
 * Web platform registration — boots the web platform and registers
 * all platform capabilities with the core layer.
 *
 * Call `initWebPlatform()` once at app startup (from main.tsx / App.tsx).
 * When porting to WeChat, create platform/wechat/index.ts with the
 * same registration pattern but WeChat-native implementations.
 */

import { registerPlatform } from '@core/platform'
import { WebCameraService } from './camera'
import { WebStorageService } from './storage'

export { WebCameraService } from './camera'
export { WebStorageService } from './storage'
export { WebFaceShapeAnalyzer } from './face-shape'

let initialized = false

export function initWebPlatform(): void {
  if (initialized) {
    console.warn('[platform] Web platform already initialized')
    return
  }

  registerPlatform({
    camera: new WebCameraService(),
    storage: new WebStorageService(),
    platformName: 'web',
  })

  initialized = true
  console.info('[platform] Web platform registered')
}
