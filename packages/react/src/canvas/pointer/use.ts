import type { RefObject } from 'react'
import type { Editor } from '@open-pencil/core/editor'
import type { SceneNode } from '@open-pencil/core/scene-graph'

export function createCanvasPointer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  editor: Editor,
  hitTestSectionTitle: (cx: number, cy: number) => SceneNode | null,
  hitTestComponentLabel: (cx: number, cy: number) => SceneNode | null,
  hitTestFrameTitle: (cx: number, cy: number) => SceneNode | null
) {
  function getCoords(e: MouseEvent) {
    const canvas = canvasRef.current
    if (!canvas) return { sx: 0, sy: 0, cx: 0, cy: 0 }
    const rect = canvas.getBoundingClientRect()
    const sx = e.clientX - rect.left
    const sy = e.clientY - rect.top
    const { x, y } = editor.screenToCanvas(sx, sy)
    return { sx, sy, cx: x, cy: y }
  }

  function canvasToLocal(cx: number, cy: number, _scopeId: string) {
    return { x: cx, y: cy }
  }

  function hitTestInScope(cx: number, cy: number, _deep: boolean) {
    return editor.graph.hitTest?.(cx, cy) ?? null
  }

  function isInsideContainerBounds(_cx: number, _cy: number, _containerId: string) {
    return true
  }

  const hitFns = {
    hitTestInScope,
    isInsideContainerBounds,
    hitTestSectionTitle,
    hitTestComponentLabel,
    hitTestFrameTitle
  }

  return { getCoords, canvasToLocal, hitTestInScope, isInsideContainerBounds, hitFns }
}

export type HitTestFns = ReturnType<typeof createCanvasPointer>['hitFns']

export type DragState =
  | { type: 'pan'; startX: number; startY: number; panX: number; panY: number }
  | { type: 'rotate'; nodeId: string; origRotation: number; cx: number; cy: number }
  | { type: 'move'; nodeIds: string[]; startX: number; startY: number; origPositions: Map<string, { x: number; y: number }> }
  | { type: 'text-select'; nodeId: string }
  | { type: 'resize'; nodeId: string; handle: string; startX: number; startY: number; origBounds: { x: number; y: number; width: number; height: number } }
  | { type: 'pen-drag' }
  | { type: 'edit-node' }
  | { type: 'edit-handle' }
  | { type: 'bend-handle' }
  | { type: 'draw'; nodeType: string; startX: number; startY: number }
  | { type: 'marquee'; startX: number; startY: number }