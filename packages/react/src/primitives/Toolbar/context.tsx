import { createContext, useContext } from 'react'
import type { Editor, EditorToolDef, Tool } from '@open-pencil/core/editor'

export interface ToolbarContext {
  editor: Editor
  tools: EditorToolDef[]
  activeTool: Tool
  expandedFlyout: Tool | null
  setTool: (tool: Tool) => void
  toggleFlyout: (tool: Tool) => void
  closeFlyout: () => void
}

const ToolbarCtx = createContext<ToolbarContext | null>(null)
ToolbarCtx.displayName = 'toolbar'

export const TOOLBAR_KEY = ToolbarCtx

export function ToolbarProvider({ value, children }: { value: ToolbarContext; children: React.ReactNode }) {
  return <ToolbarCtx.Provider value={value}>{children}</ToolbarCtx.Provider>
}

export function provideToolbar(ctx: ToolbarContext) {
  return function ToolbarProviderWrapper({ children }: { children: React.ReactNode }) {
    return <ToolbarCtx.Provider value={ctx}>{children}</ToolbarCtx.Provider>
  }
}

export function useToolbar(): ToolbarContext {
  const ctx = useContext(ToolbarCtx)
  if (!ctx) throw new Error('[open-pencil] useToolbar() called outside <ToolbarRoot>')
  return ctx
}