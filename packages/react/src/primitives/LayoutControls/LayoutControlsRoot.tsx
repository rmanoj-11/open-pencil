import { type ReactNode } from 'react'
import { useLayout } from '#react/controls/layout/use'
import { LayoutControlsProvider, type LayoutControlsContext } from '#react/primitives/LayoutControls/context'

export interface LayoutControlsRootProps {
  children?: ReactNode
}

export function LayoutControlsRoot({ children }: LayoutControlsRootProps) {
  const layout = useLayout()
  const ctx: LayoutControlsContext = layout as LayoutControlsContext
  return <LayoutControlsProvider value={ctx}>{children}</LayoutControlsProvider>
}
