import { useMemo } from 'react'
import type { RefObject } from 'react'

import type { Editor } from '@open-pencil/core/editor'
import type { Vector } from '@open-pencil/core/types'

import { useSceneComputed } from '#react/internal/scene-computed/use'

type CanvasVirtualReference = {
  getBoundingClientRect: () => DOMRect
}

export function useCanvasVirtualReference(
  canvasRef: RefObject<HTMLElement | null>,
  editor: Editor,
  anchor: () => Vector | null
) {
  return useSceneComputed<CanvasVirtualReference | null>(() => {
    const point = anchor()
    const canvas = canvasRef.current
    if (!point || !canvas) return null

    const zoom = editor.state.zoom
    const panX = editor.state.panX
    const panY = editor.state.panY

    return {
      getBoundingClientRect() {
        const rect = canvas.getBoundingClientRect()
        const x = rect.left + point.x * zoom + panX
        const y = rect.top + point.y * zoom + panY
        return new DOMRect(x, y, 0, 0)
      }
    }
  })
}