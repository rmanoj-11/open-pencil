import { useMemo } from 'react'

import { useEditorCommands } from '#react/editor/commands/use'
import { useEditor } from '#react/editor/context'
import { buildEditMenu, buildObjectMenu, buildViewMenu } from '#react/editor/menu-model/builders'
import { buildCanvasContextMenu } from '#react/editor/menu-model/canvas'
import { useSelectionState } from '#react/selection-state/use'
import { menuMessages } from '#react/i18n'
import { useNanoStore } from '#react/internal/use-nano-store'

export type { MenuActionNode, MenuEntry, MenuSeparatorNode } from '#react/editor/menu-model/types'

import type { MenuEntry } from '#react/editor/menu-model/types'

export function useMenuModel() {
  const editor = useEditor()
  const { menuItem: commandMenuItem, otherPages, moveSelectionToPage } = useEditorCommands()
  const selection = useSelectionState()

  const t = useNanoStore(menuMessages)

  const editMenu = useMemo<MenuEntry[]>(() => buildEditMenu(commandMenuItem), [commandMenuItem])
  const viewMenu = useMemo<MenuEntry[]>(() => buildViewMenu(commandMenuItem), [commandMenuItem])
  const objectMenu = useMemo<MenuEntry[]>(() => buildObjectMenu(commandMenuItem), [commandMenuItem])
  const arrangeMenu = useMemo<MenuEntry[]>(() => [commandMenuItem('selection.wrapInAutoLayout')], [commandMenuItem])

  const appMenu = useMemo(() => [
    { label: t.edit, items: editMenu },
    { label: t.view, items: viewMenu },
    { label: t.object, items: objectMenu },
    { label: t.arrange, items: arrangeMenu }
  ], [t, editMenu, viewMenu, objectMenu, arrangeMenu])

  const canvasMenu = useMemo<MenuEntry[]>(() =>
    buildCanvasContextMenu({ commandMenuItem, otherPages, moveSelectionToPage, selection, t: { moveToPage: t.moveToPage } }),
  [commandMenuItem, otherPages, moveSelectionToPage, selection, t])

  const selectionLabelMenu = useMemo(() => ({
    visibility: (editor.getSelectedNode()?.visible ?? true) ? t.hide : t.show,
    lock: (editor.getSelectedNode()?.locked ?? false) ? t.unlock : t.lock
  }), [editor, t.hide, t.show, t.unlock, t.lock])

  return { appMenu, canvasMenu, selectionLabelMenu }
}