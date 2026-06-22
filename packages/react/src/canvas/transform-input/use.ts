import type { Editor } from '@open-pencil/core/editor'
import type { DragState } from '#react/canvas/pointer/use'

export function createCanvasTransformInput(editor: Editor, canvasToLocal: (cx: number, cy: number, scopeId: string) => { x: number; y: number }, setDrag: (d: DragState) => void) {
  function tryStartRotation(cx: number, cy: number): boolean {
    const node = editor.getSelectedNode()
    if (!node) return false
    return false
  }

  function handlePanMove(d: Extract<DragState, { type: 'pan' }>, e: MouseEvent) {
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    const panX = d.panX + dx
    const panY = d.panY + dy
    const zoom = editor.state.zoom
    if (typeof (editor as Record<string, unknown>).setViewport === 'function') {
      (editor as unknown as { setViewport: (v: { panX: number; panY: number; zoom: number }) => void }).setViewport({ panX, panY, zoom })
    } else if (typeof (editor as Record<string, unknown>).setPan === 'function') {
      (editor as unknown as { setPan: (x: number, y: number) => void }).setPan(panX, panY)
    }
  }

  function handleRotateMove(d: Extract<DragState, { type: 'rotate' }>, cx: number, cy: number, shiftKey: boolean) {}

  function handleTextSelectMove(cx: number, cy: number) {}

  function handleMarqueeMove(d: Extract<DragState, { type: 'marquee' }>, cx: number, cy: number) {
    const x = Math.min(d.startX, cx)
    const y = Math.min(d.startY, cy)
    const w = Math.abs(cx - d.startX)
    const h = Math.abs(cy - d.startY)
    editor.setMarquee({ x, y, width: w, height: h })
  }

  return { tryStartRotation, handlePanMove, handleRotateMove, handleTextSelectMove, handleMarqueeMove }
}