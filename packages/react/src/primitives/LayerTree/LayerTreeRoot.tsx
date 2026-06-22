import { type ReactNode, useState, useRef } from 'react'
import { useEditor } from '#react/editor/context'
import { useSceneComputed } from '#react/internal/scene-computed/use'
import { useLayerDrag } from '#react/primitives/LayerTree/useLayerDrag'
import {
  LayerTreeProvider,
  useLayerTree,
  type LayerTreeContext,
  type LayerNode
} from '#react/primitives/LayerTree/context'

function buildLayerTree(editor: ReturnType<typeof useEditor>): LayerNode[] {
  void editor.state.sceneVersion
  const pageId = editor.state.currentPageId
  const children = editor.graph.getChildren(pageId)
  return children.map((node) => buildLayerNode(editor, node))
}

function buildLayerNode(editor: ReturnType<typeof useEditor>, node: import('@open-pencil/core/scene-graph').SceneNode): LayerNode {
  const children = editor.graph.getChildren(node.id)
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    layoutMode: node.layoutMode,
    visible: node.visible,
    locked: node.locked,
    children: children.length > 0 ? children.map((c) => buildLayerNode(editor, c)) : undefined
  }
}

export interface LayerTreeRootProps {
  children?: ReactNode | ((props: LayerTreeRootSlotProps) => ReactNode)
  indentPerLevel?: number
  onMakeChildDrop?: (targetId: string) => void
}

export interface LayerTreeRootSlotProps {
  layers: LayerNode[]
  selectedIds: Set<string>
  select: (id: string, additive: boolean) => void
}

export function LayerTreeRoot({ children, indentPerLevel = 16, onMakeChildDrop }: LayerTreeRootProps) {
  const editor = useEditor()
  const items = useSceneComputed(() => buildLayerTree(editor))
  const selectedIds = useSceneComputed(() => editor.state.selectedIds)
  const [expanded, setExpanded] = useExpandedState()
  const treeKey = useSceneComputed(() => editor.state.sceneVersion)
  const { draggingId, instruction, instructionTargetId, setupItem } = useLayerDrag(editor, indentPerLevel, onMakeChildDrop)

  const rowRefs = useRef<Map<string, HTMLElement>>(new Map())

  function setRowRef(id: string, el: HTMLElement | null) {
    if (el) rowRefs.current.set(id, el)
    else rowRefs.current.delete(id)
  }

  function select(id: string, additive: boolean) {
    if (additive) {
      const next = new Set(selectedIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      editor.select([...next])
    } else {
      editor.select([id])
    }
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id])
  }

  function toggleVisibility(id: string) {
    const node = editor.graph.getNode(id)
    if (node) editor.updateNodeWithUndo(id, { visible: !node.visible }, 'Toggle visibility')
  }

  function toggleLock(id: string) {
    const node = editor.graph.getNode(id)
    if (node) editor.updateNodeWithUndo(id, { locked: !node.locked }, 'Toggle lock')
  }

  function rename(id: string, name: string) {
    editor.updateNodeWithUndo(id, { name }, 'Rename layer')
  }

  const ctx: LayerTreeContext = {
    editor, items, expanded, treeKey, selectedIds, indentPerLevel,
    draggingId, instruction, instructionTargetId,
    setupDrag: setupItem, select, toggleExpand, toggleVisibility, toggleLock, rename, setRowRef
  }

  const slotProps: LayerTreeRootSlotProps = { layers: items, selectedIds, select }

  return (
    <LayerTreeProvider value={ctx}>
      {typeof children === 'function' ? children(slotProps) : children}
    </LayerTreeProvider>
  )
}

export interface LayerTreeItemProps {
  id: string
  level?: number
  children?: ReactNode
}

export function LayerTreeItem({ id, level = 0, children }: LayerTreeItemProps) {
  const ctx = useLayerTreeInternal()
  const node = ctx.items.find((n: LayerNode) => n.id === id)
  if (!node) return null

  const isExpanded = ctx.expanded.includes(id)
  const isSelected = ctx.selectedIds.has(id)
  const isDragging = ctx.draggingId === id

  return (
    <div
      ref={(el) => { ctx.setRowRef(id, el); ctx.setupDrag(el, () => ({ id, level, hasChildren: !!node.children, parentId: null })) }}
      style={{ paddingLeft: level * ctx.indentPerLevel }}
      data-selected={isSelected}
      data-dragging={isDragging}
      onClick={(e) => ctx.select(id, e.shiftKey)}
    >
      {node.children && (
        <button onClick={(e) => { e.stopPropagation(); ctx.toggleExpand(id) }}>
          {isExpanded ? '▼' : '▶'}
        </button>
      )}
      <span>{node.name}</span>
      {children}
      {isExpanded && node.children?.map((child: any) => (
        <LayerTreeItem key={child.id} id={child.id} level={level + 1} />
      ))}
    </div>
  )
}

function useExpandedState() {
  return useState<string[]>([])
}

function useLayerTreeInternal() {
  return useLayerTree()
}