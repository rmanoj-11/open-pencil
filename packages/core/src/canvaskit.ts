/// <reference types="vite/client" />
import CanvasKitInit, { type CanvasKit } from 'canvaskit-wasm'

import { IS_BROWSER } from './constants'

let instance: CanvasKit | null = null

export interface CanvasKitOptions {
  locateFile?: (file: string) => string
}

export async function getCanvasKit(options?: CanvasKitOptions): Promise<CanvasKit> {
  if (instance) return instance

  const defaultLocate = (file: string) => {
    if (!IS_BROWSER) {
      // Node.js / SSR — return the file name, the bundler resolves it
      return file
    }
    // Browser — serve from the public root
    // Works with Vite (import.meta.env.BASE_URL), Next.js (public/), or any static host
    try {
      const base = 'env' in import.meta ? import.meta.env.BASE_URL : '/'
      const prefix = base === '/' ? '' : base.replace(/\/$/, '')
      return `${prefix}/${file}`
    } catch {
      // import.meta not available (webpack without Vite plugin) — use root
      return `/${file}`
    }
  }

  instance = await CanvasKitInit({
    locateFile: options?.locateFile ?? defaultLocate
  })

  return instance
}
