import { useRef, useState, type ReactNode } from 'react'

import { useEditor } from '#react/editor/context'
import { useCanvas } from '#react/canvas/surface/use'
import type { UseCanvasOptions } from '#react/canvas/surface/types'
import {
  CanvasContextProvider,
  useCanvasContext,
  type CanvasContext
} from '#react/canvas/context'

export interface CanvasRootProps extends UseCanvasOptions {
  children?: ReactNode | ((props: CanvasRootSlotProps) => ReactNode)
}

export interface CanvasRootSlotProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  ready: boolean
  renderNow: () => void
}

export function CanvasRoot({ children, ...options }: CanvasRootProps) {
  const editor = useEditor()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [ready, setReady] = useState(false)

  const { renderNow, hitTestSectionTitle, hitTestComponentLabel, hitTestFrameTitle } = useCanvas(
    canvasRef,
    editor,
    {
      ...options,
      onReady: () => {
        setReady(true)
        options.onReady?.()
      }
    }
  )

  const ctx: CanvasContext = {
    canvasRef,
    ready,
    renderNow,
    hitTestSectionTitle,
    hitTestComponentLabel,
    hitTestFrameTitle
  }

  const slotProps: CanvasRootSlotProps = { canvasRef, ready, renderNow }

  return (
    <CanvasContextProvider value={ctx}>
      {typeof children === 'function' ? children(slotProps) : children}
    </CanvasContextProvider>
  )
}

export function CanvasSurface(props: React.HTMLAttributes<HTMLCanvasElement>) {
  const { canvasRef } = useCanvasContext()
  return <canvas ref={canvasRef} {...props} />
}