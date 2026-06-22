import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { Editor } from '@open-pencil/core/editor'

export function useTextEdit(canvasRef: RefObject<HTMLCanvasElement | null>, editor: Editor) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function onCanvasMouseDown() {
      if (editor.state.editingTextId) {
        editor.commitTextEdit()
      }
    }

    canvas.addEventListener('mousedown', onCanvasMouseDown)
    return () => canvas.removeEventListener('mousedown', onCanvasMouseDown)
  }, [canvasRef, editor])

  return { textareaRef }
}