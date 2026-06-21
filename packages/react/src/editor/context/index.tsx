import { createContext, useContext, type ReactNode } from 'react'

import type { Editor } from '@open-pencil/core/editor'

const EditorContext = createContext<Editor | null>(null)
EditorContext.displayName = 'open-pencil-editor'

export const EDITOR_KEY = EditorContext

export interface EditorProviderProps {
  editor: Editor
  children: ReactNode
}

export function EditorProvider({ editor, children }: EditorProviderProps) {
  return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
}

export function provideEditor(editor: Editor) {
  return function EditorProviderWrapper({ children }: { children: ReactNode }) {
    return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
  }
}

export function useEditor(): Editor {
  const editor = useContext(EditorContext)
  if (!editor) {
    throw new Error(
      '[open-pencil] useEditor() called without a provided editor. ' +
        'Wrap your React subtree in <EditorProvider editor={editor}> first.'
    )
  }
  return editor
}