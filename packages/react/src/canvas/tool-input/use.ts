import type { Editor } from '@open-pencil/core/editor'
import type { DragState } from '#react/canvas/pointer/use'
import type { HitTestFns } from '#react/canvas/pointer/use'
import type { RefObject } from 'react'

type ToolMouseDownOptions = {
  event: MouseEvent
  cx: number
  cy: number
  sx: number
  sy: number
  editor: Editor
  hitFns: HitTestFns
  cursorOverride: { current: string | null }
  setDrag: (d: DragState) => void
  tryStartRotation: (cx: number, cy: number) => boolean
  handleTextEditClick: (cx: number, cy: number, shiftKey: boolean) => boolean
}

export function handleToolMouseDown({
  event, cx, cy, sx, sy, editor, hitFns, cursorOverride, setDrag, tryStartRotation, handleTextEditClick
}: ToolMouseDownOptions) {
  const tool = editor.state.activeTool

  if (event.button === 1 || tool === 'HAND') {
    setDrag({ type: 'pan', startX: sx, startY: sy, panX: editor.state.panX, panY: editor.state.panY })
    return
  }

  if (tool === 'SELECT') {
    const hit = hitFns.hitTestInScope(cx, cy, false)
    if (hit) {
      const ids = [...editor.state.selectedIds]
      if (!ids.includes(hit.id)) editor.select([hit.id])
    } else {
      editor.clearSelection()
      setDrag({ type: 'marquee', startX: cx, startY: cy })
    }
    return
  }

  if (tool === 'TEXT') {
    editor.setTool('TEXT')
    return
  }

  setDrag({ type: 'draw', nodeType: tool, startX: cx, startY: cy })
}