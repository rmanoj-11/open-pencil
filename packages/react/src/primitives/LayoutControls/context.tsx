import { createContext, useContext } from 'react'
import type { SceneNode } from '@open-pencil/core/scene-graph'

import type { useLayout } from '#react/controls/layout/use'

export type LayoutControlsContext = Omit<ReturnType<typeof useLayout>, 'node'> & { node: SceneNode | null }

const LayoutControlsCtx = createContext<LayoutControlsContext | null>(null)
LayoutControlsCtx.displayName = 'LayoutControlsContext'

export const LAYOUT_CONTROLS_KEY = LayoutControlsCtx

export function LayoutControlsProvider({ value, children }: { value: LayoutControlsContext; children: React.ReactNode }) {
  return <LayoutControlsCtx.Provider value={value}>{children}</LayoutControlsCtx.Provider>
}

export function provideLayoutControls(ctx: LayoutControlsContext) {
  return function LayoutControlsProviderWrapper({ children }: { children: React.ReactNode }) {
    return <LayoutControlsCtx.Provider value={ctx}>{children}</LayoutControlsCtx.Provider>
  }
}

export function useLayoutControlsContext(): LayoutControlsContext {
  const ctx = useContext(LayoutControlsCtx)
  if (!ctx) throw new Error('Layout controls must be used within LayoutControlsRoot')
  return ctx
}