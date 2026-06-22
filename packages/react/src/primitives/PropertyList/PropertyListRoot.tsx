import { type ReactNode, useContext } from 'react'
import { useEditor } from '#react/editor/context'
import { useSceneComputed } from '#react/internal/scene-computed/use'
import {
  PropertyListProvider, PROPERTY_LIST_KEY,
  type PropertyListContext
} from '#react/primitives/PropertyList/context'
import type { Effect, Fill, SceneNode, Stroke } from '@open-pencil/core/scene-graph'
import { MIXED } from '#react/controls/node-props/helpers'
import { isNodeArrayMixed } from '#react/controls/node-props/helpers'

type ArrayPropKey = 'fills' | 'strokes' | 'effects'

export interface PropertyListRootProps<T = unknown> {
  propKey: ArrayPropKey
  defaults: T
  children?: ReactNode | ((props: PropertyListRootSlotProps<T>) => ReactNode)
}

export interface PropertyListRootSlotProps<T = unknown> {
  items: T[]
  isMixed: boolean
  activeNode: SceneNode | null
  isMulti: boolean
  add: (defaults: T) => void
  remove: (index: number) => void
  update: (index: number, item: T) => void
  patch: (index: number, changes: Partial<T>) => void
  toggleVisibility: (index: number) => void
}

export function PropertyListRoot<T = Fill | Stroke | Effect>({ propKey, defaults, children }: PropertyListRootProps<T>) {
  const editor = useEditor()
  const nodes = useSceneComputed(() => editor.getSelectedNodes())
  const activeNode = useSceneComputed<SceneNode | null>(() => editor.getSelectedNode() ?? null)
  const isMulti = nodes.length > 1

  const items = useSceneComputed(() => {
    if (nodes.length === 0) return [] as T[]
    const first = nodes[0][propKey] as unknown as T[]
    return [...first]
  })

  const isMixed = useSceneComputed(() => isNodeArrayMixed(nodes, propKey))

  function add(d: T) {
    for (const n of nodes) {
      const arr = [...(n[propKey] as unknown[])] as T[]
      arr.push(d)
      editor.updateNodeWithUndo(n.id, { [propKey]: arr } as Partial<SceneNode>, `Add ${propKey}`)
    }
  }

  function remove(index: number) {
    for (const n of nodes) {
      editor.updateNodeWithUndo(n.id, { [propKey]: (n[propKey] as unknown[]).filter((_, i) => i !== index) } as Partial<SceneNode>, `Remove ${propKey}`)
    }
  }

  function update(index: number, item: T) {
    for (const n of nodes) {
      const arr = [...(n[propKey] as unknown[])] as T[]
      arr[index] = item
      editor.updateNodeWithUndo(n.id, { [propKey]: arr } as Partial<SceneNode>, `Update ${propKey}`)
    }
  }

  function patch(index: number, changes: Partial<T>) {
    for (const n of nodes) {
      const arr = [...(n[propKey] as unknown[])] as T[]
      arr[index] = { ...arr[index], ...changes }
      editor.updateNodeWithUndo(n.id, { [propKey]: arr } as Partial<SceneNode>, `Update ${propKey}`)
    }
  }

  function toggleVisibility(index: number) {
    for (const n of nodes) {
      const items = n[propKey] as Array<{ visible: boolean }>
      if (!items[index]) continue
      const arr = [...items]
      arr[index] = { ...arr[index], visible: !items[index].visible }
      editor.updateNodeWithUndo(n.id, { [propKey]: arr } as Partial<SceneNode>, `Toggle ${propKey} visibility`)
    }
  }

  const ctx: PropertyListContext<T> = {
    editor, propKey, items, isMixed, activeNode, isMulti,
    add, remove, update, patch, toggleVisibility
  }

  const slotProps: PropertyListRootSlotProps<T> = { items, isMixed, activeNode, isMulti, add, remove, update, patch, toggleVisibility }

  return (
    <PropertyListProvider value={ctx}>
      {typeof children === 'function' ? children(slotProps) : children}
    </PropertyListProvider>
  )
}

export function PropertyListItem({ children }: { children?: ReactNode }) {
  return <>{children}</>
}