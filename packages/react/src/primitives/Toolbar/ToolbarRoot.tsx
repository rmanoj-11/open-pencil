import { type ReactNode, useState } from 'react'
import { useEditor } from '#react/editor/context'
import { EDITOR_TOOLS } from '@open-pencil/core/editor'
import type { EditorToolDef, Tool } from '@open-pencil/core/editor'
import { ToolbarProvider, type ToolbarContext } from '#react/primitives/Toolbar/context'
import { useSceneComputed } from '#react/internal/scene-computed/use'

export interface ToolbarRootProps {
  children?: ReactNode | ((props: ToolbarRootSlotProps) => ReactNode)
  tools?: EditorToolDef[]
}

export interface ToolbarRootSlotProps {
  tools: EditorToolDef[]
  activeTool: Tool
  setTool: (tool: Tool) => void
}

export function ToolbarRoot({ children, tools = EDITOR_TOOLS }: ToolbarRootProps) {
  const editor = useEditor()
  const activeTool = useSceneComputed(() => editor.state.activeTool)
  const [expandedFlyout, setExpandedFlyout] = useState<Tool | null>(null)

  function setTool(tool: Tool) {
    editor.setTool(tool)
    setExpandedFlyout(null)
  }

  function toggleFlyout(tool: Tool) {
    setExpandedFlyout((prev) => (prev === tool ? null : tool))
  }

  function closeFlyout() {
    setExpandedFlyout(null)
  }

  const ctx: ToolbarContext = {
    editor, tools, activeTool, expandedFlyout, setTool, toggleFlyout, closeFlyout
  }

  const slotProps: ToolbarRootSlotProps = { tools, activeTool, setTool }

  return (
    <ToolbarProvider value={ctx}>
      {typeof children === 'function' ? children(slotProps) : children}
    </ToolbarProvider>
  )
}

export interface ToolbarItemProps {
  tool: EditorToolDef
  children?: ReactNode | ((props: ToolbarItemSlotProps) => ReactNode)
}

export interface ToolbarItemSlotProps {
  active: boolean
  select: () => void
}

export function ToolbarItem({ tool, children }: ToolbarItemProps) {
  const ctx = useToolbarInternal()
  const active = ctx.activeTool === tool.key || (tool.flyout?.includes(ctx.activeTool) ?? false)

  function select() {
    if (tool.flyout && tool.flyout.length > 0) {
      ctx.toggleFlyout(tool.key)
    } else {
      ctx.setTool(tool.key)
    }
  }

  const slotProps: ToolbarItemSlotProps = { active, select }
  return <>{typeof children === 'function' ? children(slotProps) : children}</>
}

import { useContext } from 'react'
import { TOOLBAR_KEY } from '#react/primitives/Toolbar/context'

function useToolbarInternal() {
  const ctx = useContext(TOOLBAR_KEY)
  if (!ctx) throw new Error('[open-pencil] ToolbarItem must be used within <ToolbarRoot>')
  return ctx
}