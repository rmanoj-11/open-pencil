import { canMakeBooleanSourceNode, hasVisibleStrokeSourceNode } from '@open-pencil/core/canvas'

import { useSelectionState } from '#react/selection-state/use'
import { useSceneComputed } from '#react/internal/scene-computed/use'

export function useSelectionCapabilities() {
  const selection = useSelectionState()
  const { editor, selectedIds, selectedNode, selectedCount, hasSelection } = selection

  const selectedNodesCanFlatten = useSceneComputed(() => {
    const nodes = editor.getSelectedNodes()
    return nodes.length > 0 && nodes.every((node) => canMakeBooleanSourceNode(node, editor.graph))
  })

  const canOutlineText = useSceneComputed(() => {
    const nodes = editor.getSelectedNodes()
    return nodes.length > 0 && nodes.every((node) => node.type === 'TEXT' && canMakeBooleanSourceNode(node, editor.graph))
  })

  const canOutlineStroke = useSceneComputed(() => {
    const nodes = editor.getSelectedNodes()
    return nodes.length > 0 && nodes.every((node) => hasVisibleStrokeSourceNode(node, editor.graph) && canMakeBooleanSourceNode(node, editor.graph))
  })

  const canMoveToPage = useSceneComputed(() => hasSelection && editor.graph.getPages().length > 1)
  const canSelectAll = useSceneComputed(() => editor.graph.getChildren(editor.state.currentPageId).length > 0)
  const canUndo = useSceneComputed(() => editor.undo.canUndo)
  const canRedo = useSceneComputed(() => editor.undo.canRedo)

  return {
    selectedIds,
    selectedNode,
    canCopy: hasSelection,
    canCut: hasSelection,
    canPaste: true,
    canDelete: hasSelection,
    canDuplicate: hasSelection,
    canExportSelection: hasSelection,
    canGroup: selectedCount >= 2,
    canFrameSelection: hasSelection,
    canUngroup: selection.isGroup,
    canCreateComponent: hasSelection,
    canCreateComponentSet: selection.canCreateComponentSet,
    canDetachInstance: selection.isInstance,
    canWrapInAutoLayout: hasSelection,
    canBringToFront: hasSelection,
    canSendToBack: hasSelection,
    canToggleVisibility: hasSelection,
    canToggleLock: hasSelection,
    canFlip: hasSelection,
    canBooleanOperation: selectedCount >= 2 && selectedNodesCanFlatten,
    canFlatten: selectedNodesCanFlatten,
    canOutlineText,
    canOutlineStroke,
    canGoToMainComponent: selection.isInstance,
    canCreateInstance: selectedNode?.type === 'COMPONENT',
    canMoveToPage,
    canSelectAll,
    canUndo,
    canRedo,
    canZoomToSelection: hasSelection
  }
}