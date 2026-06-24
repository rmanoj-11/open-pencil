import { useEffect, useRef } from 'react'
import type { CanvasKit } from 'canvaskit-wasm'

import { getCanvasKit } from '@open-pencil/core/canvaskit'
import { SkiaRenderer } from '@open-pencil/core/canvas'
import type { Editor } from '@open-pencil/core/editor'

import { useViewportKind } from '#react/editor/viewport-kind/use'
import { makeGLSurface, sizeCanvas, type CanvasGLContext } from '#react/canvas/surface/gl-surface'
import { createCanvasRenderLoop } from '#react/canvas/surface/render-loop'
import { createCanvasHitTests, createRulerVisibility } from '#react/canvas/surface/overlays'
import type { UseCanvasOptions } from '#react/canvas/surface/types'

type SurfaceManagerState = {
  renderer: SkiaRenderer | null
  glContext: CanvasGLContext | null
}

export interface CanvasSurfaceManager {
  createSurface: (canvas: HTMLCanvasElement, opts?: { reloadFonts?: boolean }) => void
  resizeCanvas: (canvas: HTMLCanvasElement) => void
  renderNow: () => void
  destroy: () => void
  markDirty: () => void
  getRenderer: () => SkiaRenderer | null
}

export function createCanvasSurfaceManager({
  editor,
  canvasRef,
  options,
  getCanvasKit,
  isDestroyed,
  shouldShowRulers
}: {
  editor: Editor
  canvasRef: { current: HTMLCanvasElement | null }
  options: UseCanvasOptions | undefined
  getCanvasKit: () => CanvasKit | null
  isDestroyed: () => boolean
  shouldShowRulers: () => boolean
}): CanvasSurfaceManager {
  const state: SurfaceManagerState = { renderer: null, glContext: null }
  let sceneBackingRenderTimer: ReturnType<typeof setTimeout> | null = null

  function clearSceneBackingRenderTimer() {
    if (sceneBackingRenderTimer === null) return
    clearTimeout(sceneBackingRenderTimer)
    sceneBackingRenderTimer = null
  }

  let renderLoop: ReturnType<typeof createCanvasRenderLoop> | null = null

  function renderNow() {
    if (!state.renderer || isDestroyed()) return
    state.renderer.renderFromEditorState(
      editor.state,
      editor.graph,
      editor.textEditor,
      canvasRef.current?.clientWidth ?? 0,
      canvasRef.current?.clientHeight ?? 0,
      shouldShowRulers(),
      options?.layer ?? 'full'
    )
    renderLoop?.markRendered()
    clearSceneBackingRenderTimer()
    if (options?.layer === 'scene' && state.renderer.sceneBackingNeedsCrispRender) {
      const delay = Math.max(0, state.renderer.sceneBackingPreviewUntil - performance.now())
      sceneBackingRenderTimer = setTimeout(() => renderLoop?.markDirty(), delay)
    }
  }

  renderLoop = createCanvasRenderLoop(editor, renderNow, { layer: options?.layer })

  function createSurface(
    canvas: HTMLCanvasElement,
    { reloadFonts = false }: { reloadFonts?: boolean } = {}
  ) {
    const ck = getCanvasKit()
    if (!ck) {
      console.warn('[open-pencil] CanvasKit not initialized yet')
      return
    }

    if (state.renderer) editor.removeCanvasRenderer(state.renderer)
    state.renderer?.destroy()
    state.renderer = null
    state.glContext?.delete()
    state.glContext = null

    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (w === 0 || h === 0) {
      console.warn('[open-pencil] Canvas has zero dimensions:', { width: w, height: h })
    }

    sizeCanvas(canvas, editor)

    const result = makeGLSurface(ck, canvas, editor, options, state.glContext)
    state.glContext = result.glContext
    const surface = result.surface
    if (!surface) {
      console.warn('[open-pencil] Failed to create GL surface — WebGL may be unavailable')
      canvas.dataset.surfaceError = 'webgl'
      return
    }

    const glCtx = canvas.getContext('webgl2') ?? null
    state.renderer = new SkiaRenderer(ck, surface, glCtx)
    editor.setCanvasKit(ck, state.renderer)
    canvas.dataset.ready = '1'

    if (reloadFonts && !isDestroyed()) {
      void state.renderer.loadFonts(renderNow).then(() => {
        if (!isDestroyed()) renderNow()
      })
    }
  }

  function resizeCanvas(canvas: HTMLCanvasElement) {
    const ck = getCanvasKit()
    if (!ck || !state.renderer) {
      createSurface(canvas)
      return
    }

    sizeCanvas(canvas, editor)

    const result = makeGLSurface(ck, canvas, editor, options, state.glContext)
    state.glContext = result.glContext
    const surface = result.surface
    if (!surface) {
      console.warn('Falling back to full surface recreation after resize')
      createSurface(canvas, { reloadFonts: true })
      return
    }
    state.renderer.replaceSurface(surface)
    renderNow()
  }

  function destroy() {
    clearSceneBackingRenderTimer()
    renderLoop?.pause()
    if (state.renderer) editor.removeCanvasRenderer(state.renderer)
    state.renderer?.destroy()
    state.glContext?.delete()
  }

  return {
    createSurface,
    resizeCanvas,
    renderNow,
    destroy,
    markDirty: renderLoop.markDirty,
    getRenderer: () => state.renderer
  }
}

export function useCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  editor: Editor,
  options?: UseCanvasOptions
) {
  const ckRef = useRef<CanvasKit | null>(null)
  const lifecycleRef = useRef({ destroyed: false })
  const { isMobile } = useViewportKind()
  const isMobileRef = useRef(isMobile)
  isMobileRef.current = isMobile

  const managerRef = useRef<CanvasSurfaceManager | null>(null)
  if (!managerRef.current) {
    const shouldShowRulers = () => {
      const fn = createRulerVisibility(options)
      return fn(isMobileRef.current)
    }
    managerRef.current = createCanvasSurfaceManager({
      editor,
      canvasRef,
      options,
      getCanvasKit: () => ckRef.current,
      isDestroyed: () => lifecycleRef.current.destroyed,
      shouldShowRulers
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false

    async function init() {
      try {
        const ck = await getCanvasKit()
        if (cancelled || lifecycleRef.current.destroyed) return
        ckRef.current = ck

        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
        if (cancelled || lifecycleRef.current.destroyed) return

        const canvasEl = canvasRef.current
        if (!canvasEl) return
        managerRef.current!.createSurface(canvasEl)

        const renderer = managerRef.current!.getRenderer()
        if (renderer) {
          await renderer.loadFonts(managerRef.current!.renderNow)
        } else {
          console.warn('[open-pencil] Canvas surface creation failed — no WebGL context. Check browser WebGL support.')
        }
        if (cancelled || lifecycleRef.current.destroyed) return
        managerRef.current!.renderNow()
        options?.onReady?.()
      } catch (err) {
        console.error('[open-pencil] Canvas initialization failed:', err)
      }
    }

    void init()

    const resizeObserver = new ResizeObserver(() => {
      const canvasEl = canvasRef.current
      if (!canvasEl || !ckRef.current) return
      managerRef.current!.resizeCanvas(canvasEl)
    })
    resizeObserver.observe(canvas)

    return () => {
      cancelled = true
      lifecycleRef.current.destroyed = true
      resizeObserver.disconnect()
      managerRef.current!.destroy()
    }
  }, [editor, canvasRef, options?.layer, options?.showRulers, options?.preserveDrawingBuffer])

  const manager = managerRef.current
  const { hitTestSectionTitle, hitTestComponentLabel, hitTestFrameTitle } = createCanvasHitTests(
    editor,
    manager.getRenderer
  )

  return {
    render: manager.markDirty,
    renderNow: manager.renderNow,
    hitTestSectionTitle,
    hitTestComponentLabel,
    hitTestFrameTitle
  }
}