export type CanvasRenderLayer = 'full' | 'scene' | 'overlays'

export interface UseCanvasOptions {
  layer?: CanvasRenderLayer
  showRulers?: boolean
  preserveDrawingBuffer?: boolean
  onReady?: () => void
}