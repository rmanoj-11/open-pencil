import { useState } from 'react'

import { blurTarget } from '#react/shared/dom-events'

export interface InlineRenameState<T extends string> {
  editingId: T | null
  start: (id: T, currentName: string) => void
  focusInput: (input: HTMLInputElement | null) => void
  commit: (id: T, eventOrInput: Event | HTMLInputElement) => void
  cancel: () => void
  onKeydown: (e: KeyboardEvent) => void
}

export function useInlineRename<T extends string>(
  onCommit: (id: T, newName: string) => void
): InlineRenameState<T> {
  const [editingId, setEditingId] = useState<T | null>(null)
  let originalName = ''
  let inputRef: HTMLInputElement | null = null

  function start(id: T, currentName: string) {
    setEditingId(id)
    originalName = currentName
  }

  function focusInput(input: HTMLInputElement | null) {
    inputRef = input
    if (input) {
      requestAnimationFrame(() => {
        input.focus()
        input.select()
      })
    }
  }

  function commit(id: T, eventOrInput: Event | HTMLInputElement) {
    if (editingId !== id) return
    let input: HTMLInputElement | null
    if (eventOrInput instanceof HTMLInputElement) {
      input = eventOrInput
    } else {
      input = eventOrInput.target instanceof HTMLInputElement ? eventOrInput.target : null
    }
    if (!input) return
    const value = input.value.trim()
    if (value && value !== originalName) {
      onCommit(id, value)
    }
    setEditingId(null)
    inputRef = null
  }

  function cancel() {
    setEditingId(null)
    inputRef = null
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      blurTarget(e)
      return
    }
    if (e.code === 'Escape') {
      cancel()
    }
  }

  return { editingId, start, focusInput, commit, cancel, onKeydown }
}