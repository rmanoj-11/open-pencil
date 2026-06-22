import type { Editor } from '@open-pencil/core/editor'

export interface LayerNode {
  id: string
  name: string
  type: string
  layoutMode: string
  visible: boolean
  locked: boolean
  children?: LayerNode[]
}

export interface LayerDragInstruction {
  type: 'reorder-above' | 'reorder-below' | 'make-child'
}

export interface LayerTreeContext {
  editor: Editor
  items: LayerNode[]
  expanded: string[]
  treeKey: number
  selectedIds: Set<string>
  indentPerLevel: number
  draggingId: string | null
  instruction: LayerDragInstruction | null
  instructionTargetId: string | null
  setupDrag: (el: HTMLElement | null, item: () => { id: string; level: number; hasChildren: boolean; parentId: string | null }) => void
  select: (id: string, additive: boolean) => void
  toggleExpand: (id: string) => void
  toggleVisibility: (id: string) => void
  toggleLock: (id: string) => void
  rename: (id: string, name: string) => void
  setRowRef: (id: string, el: HTMLElement | null) => void
}

import { createContext, useContext } from 'react'

const LayerTreeCtx = createContext<LayerTreeContext | null>(null)
LayerTreeCtx.displayName = 'layer-tree'

export const LAYER_TREE_KEY = LayerTreeCtx

export function LayerTreeProvider({ value, children }: { value: LayerTreeContext; children: React.ReactNode }) {
  return <LayerTreeCtx.Provider value={value}>{children}</LayerTreeCtx.Provider>
}

export function provideLayerTree(ctx: LayerTreeContext) {
  return function LayerTreeProviderWrapper({ children }: { children: React.ReactNode }) {
    return <LayerTreeCtx.Provider value={ctx}>{children}</LayerTreeCtx.Provider>
  }
}

export function useLayerTree(): LayerTreeContext {
  const ctx = useContext(LayerTreeCtx)
  if (!ctx) throw new Error('[open-pencil] useLayerTree() called outside <LayerTreeRoot>')
  return ctx
}