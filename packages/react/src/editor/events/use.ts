import { useEffect } from 'react'

import type { EditorEventName, EditorEvents } from '@open-pencil/core/editor'

import { useEditor } from '#react/editor/context'

export function useEditorEvent<K extends EditorEventName>(
  event: K,
  handler: EditorEvents[K],
  deps: ReadonlyArray<unknown> = []
) {
  const editor = useEditor()
  useEffect(() => {
    const stop = editor.onEditorEvent(event, handler)
    return stop
  }, [editor, event, ...deps])
}