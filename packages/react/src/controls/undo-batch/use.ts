import { useEffect, useRef } from 'react'

import type { UndoManager } from '@open-pencil/core/scene-graph'

const BATCH_IDLE_MS = 300

export function useUndoBatch(undo: UndoManager) {
  const batchKeyRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function commitActiveBatch() {
    if (batchKeyRef.current !== null) {
      undo.commitBatch()
      batchKeyRef.current = null
    }
  }

  function flush() {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    commitActiveBatch()
  }

  function ensure(key: string, label: string) {
    if (batchKeyRef.current !== key) {
      flush()
      undo.beginBatch(label)
      batchKeyRef.current = key
    }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(commitActiveBatch, BATCH_IDLE_MS)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      commitActiveBatch()
    }
  }, [])

  return { ensure, flush }
}