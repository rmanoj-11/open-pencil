import { useMemo } from 'react'

import { createEditorCommandActions } from '#react/editor/commands/actions'
import { createEditorCommandMap } from '#react/editor/commands/definitions'
import { useEditor } from '#react/editor/context'
import { useSelectionCapabilities } from '#react/editor/selection-capabilities/use'
import { useSelectionState } from '#react/selection-state/use'
import { commandMessages } from '#react/i18n'
import { useNanoStore } from '#react/internal/use-nano-store'
import { usePageList } from '#react/primitives/PageList/usePageList'

export type { EditorCommand, EditorCommandId, EditorCommandMenuEntry, EditorCommandMenuItem, EditorCommandMenuSeparator } from './types'

export function useEditorCommands() {
  const editor = useEditor()
  const selection = useSelectionState()
  const capabilities = useSelectionCapabilities()
  const { pages } = usePageList()

  const t = useNanoStore(commandMessages)

  const otherPages = useMemo(
    () => pages.filter((page) => page.id !== editor.state.currentPageId),
    [pages, editor.state.currentPageId]
  )

  function moveSelectionToPage(pageId: string) {
    if (!capabilities.canMoveToPage) return
    editor.moveToPage(pageId)
  }

  const commands = useMemo(
    () => createEditorCommandMap({ editor, selection, capabilities, messages: t, otherPages, moveSelectionToPage }),
    [editor, selection, capabilities, t, otherPages]
  )

  const actions = createEditorCommandActions(commands)

  return {
    commands,
    otherPages,
    moveSelectionToPage,
    ...actions
  }
}