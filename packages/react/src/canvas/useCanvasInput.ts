import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { Editor } from '@open-pencil/core/editor'
import type { SceneNode } from '@open-pencil/core/scene-graph'
import { createCanvasPointer, type DragState } from '#react/canvas/pointer/use'
import { handleToolMouseDown } from '#react/canvas/tool-input/use'
import { createCanvasTransformInput } from '#react/canvas/transform-input/use'

export function useCanvasInput(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  editor: Editor,
  hitTestSectionTitle: (cx: number, cy: number) => SceneNode | null,
  hitTestComponentLabel: (cx: number, cy: number) => SceneNode | null,
  hitTestFrameTitle: (cx: number, cy: number) => SceneNode | null,
  onCursorMove?: (cx: number, cy: number) => void
) {
  const [drag, setDragState] = useState<DragState | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const cursorOverride = useRef<string | null>(null)
  const selectedIdsBeforeClickSequence = useRef<ReadonlySet<string>>(new Set())

  function setDrag(d: DragState) {
    dragRef.current = d
    setDragState(d)
  }

  const { getCoords, canvasToLocal, hitTestInScope, hitFns } = createCanvasPointer(
    canvasRef, editor, hitTestSectionTitle, hitTestComponentLabel, hitTestFrameTitle
  )

  const { tryStartRotation, handlePanMove, handleRotateMove, handleTextSelectMove, handleMarqueeMove } =
    createCanvasTransformInput(editor, canvasToLocal, setDrag)

  function onMouseDown(e: MouseEvent) {
    if (!editor.state.editingTextId) canvasRef.current?.focus()
    editor.setHoveredNode(null)
    const { sx, sy, cx, cy } = getCoords(e)
    handleToolMouseDown({ event: e, cx, cy, sx, sy, editor, hitFns, cursorOverride: cursorOverride.current ? { current: cursorOverride.current } : { current: null }, setDrag, tryStartRotation, handleTextEditClick: () => false })
  }

  function onMouseMove(e: MouseEvent) {
    if (onCursorMove) { const { cx, cy } = getCoords(e); onCursorMove(cx, cy) }
    const d = dragRef.current
    if (!d) return
    const { cx, cy } = getCoords(e)
    if (d.type === 'pan') { handlePanMove(d, e); return }
    if (d.type === 'marquee') { handleMarqueeMove(d, cx, cy); return }
    if (d.type === 'rotate') { handleRotateMove(d, cx, cy, e.shiftKey); return }
    if (d.type === 'text-select') { handleTextSelectMove(cx, cy); return }
  }

  function onMouseUp() {
    const d = dragRef.current
    if (!d) return
    if (d.type === 'marquee') editor.setMarquee(null)
    dragRef.current = null
    setDragState(null)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('mouseleave', () => { if (!dragRef.current) editor.setHoveredNode(null) })
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [canvasRef, editor])

  return { drag, cursorOverride: cursorOverride.current }
}