import { createContext, useContext } from 'react'
import type { RefObject } from 'react'

import type { SceneNode } from '@open-pencil/core/scene-graph'

export interface CanvasContext {
  canvasRef: RefObject<HTMLCanvasElement | null>
  ready: boolean
  renderNow: () => void
  hitTestSectionTitle: (cx: number, cy: number) => SceneNode | null
  hitTestComponentLabel: (cx: number, cy: number) => SceneNode | null
  hitTestFrameTitle: (cx: number, cy: number) => SceneNode | null
}

const CanvasCtx = createContext<CanvasContext | null>(null)
CanvasCtx.displayName = 'open-pencil-canvas'

export const CANVAS_KEY = CanvasCtx

export function CanvasContextProvider({ value, children }: { value: CanvasContext; children: React.ReactNode }) {
  return <CanvasCtx.Provider value={value}>{children}</CanvasCtx.Provider>
}

export function provideCanvas(ctx: CanvasContext) {
  return function CanvasProviderWrapper({ children }: { children: React.ReactNode }) {
    return <CanvasCtx.Provider value={ctx}>{children}</CanvasCtx.Provider>
  }
}

export function useCanvasContext(): CanvasContext {
  const ctx = useContext(CanvasCtx)
  if (!ctx) throw new Error('[open-pencil] useCanvasContext() called outside <CanvasRoot>')
  return ctx
}