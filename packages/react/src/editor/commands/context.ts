import type { Editor } from '@open-pencil/core/editor'

import type { useSelectionCapabilities } from '#react/editor/selection-capabilities/use'
import type { useSelectionState } from '#react/selection-state/use'

export type CommandMessagesValue = Record<string, string>
export type SelectionState = ReturnType<typeof useSelectionState>
export type SelectionCapabilities = ReturnType<typeof useSelectionCapabilities>

export type EditorCommandMapOptions = {
  editor: Editor
  selection: SelectionState
  capabilities: SelectionCapabilities
  messages: CommandMessagesValue
  otherPages: Array<{ id: string }>
  moveSelectionToPage: (pageId: string) => void
}