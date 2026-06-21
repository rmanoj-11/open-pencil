import { useMemo, useSyncExternalStore } from 'react'

import type { Editor } from '@open-pencil/core/editor'

import { useEditor } from '#react/editor/context'

function subscribeToScene(editor: Editor, callback: () => void): () => void {
  const unbinds: Array<() => void> = []

  const events: Parameters<typeof editor.onEditorEvent>[0][] = [
    'render:requested',
    'repaint:requested',
    'graph:replaced',
    'selection:changed',
    'tool:changed',
    'page:changed',
    'viewport:changed',
    'node:created',
    'node:updated',
    'node:deleted',
    'node:reparented',
    'node:reordered'
  ]

  for (const ev of events) {
    unbinds.push(editor.onEditorEvent(ev, callback))
  }

  return () => {
    for (const off of unbinds) off()
  }
}

function getSceneSnapshot(editor: Editor): number {
  return editor.state.sceneVersion
}

function getSelectionSnapshot(editor: Editor): Set<string> {
  return editor.state.selectedIds
}

function getRenderSnapshot(editor: Editor): number {
  return editor.state.renderVersion
}

function getPageSnapshot(editor: Editor): string {
  return editor.state.currentPageId
}

export function useSceneVersion(): number {
  const editor = useEditor()
  return useSyncExternalStore(
    (cb) => subscribeToScene(editor, cb),
    () => getSceneSnapshot(editor)
  )
}

export function useSelectionIds(): Set<string> {
  const editor = useEditor()
  return useSyncExternalStore(
    (cb) => subscribeToScene(editor, cb),
    () => getSelectionSnapshot(editor)
  )
}

export function useRenderVersion(): number {
  const editor = useEditor()
  return useSyncExternalStore(
    (cb) => subscribeToScene(editor, cb),
    () => getRenderSnapshot(editor)
  )
}

export function useCurrentPageId(): string {
  const editor = useEditor()
  return useSyncExternalStore(
    (cb) => subscribeToScene(editor, cb),
    () => getPageSnapshot(editor)
  )
}

export function useSceneComputed<T>(fn: () => T, deps: ReadonlyArray<unknown> = []): T {
  const editor = useEditor()
  const sceneVersion = useSceneVersion()
  const selectedIds = useSelectionIds()
  const currentPageId = useCurrentPageId()

  return useMemo(() => {
    void sceneVersion
    void selectedIds
    void currentPageId
    return fn()
  }, [editor, sceneVersion, selectedIds, currentPageId, ...deps])
}