import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// Mobile contract tests belong to this repository's src/ tree.
// The SDK git submodule has its own Vitest config (jsdom and coverage) and
// must be executed separately, not discovered by the Mobile runner.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      environment: 'node',
    },
  }),
)
