import { createContext, useContext } from 'react'
import type { Editor } from '@open-pencil/core/editor'
import type { SceneNode } from '@open-pencil/core/scene-graph'

type ArrayPropKey = 'fills' | 'strokes' | 'effects'

export interface PropertyListContext<T = unknown> {
  editor: Editor
  propKey: ArrayPropKey
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

const PropertyListCtx = createContext<PropertyListContext | null>(null)
PropertyListCtx.displayName = 'property-list'

export const PROPERTY_LIST_KEY = PropertyListCtx

export function PropertyListProvider<T>({ value, children }: { value: PropertyListContext<T>; children: React.ReactNode }) {
  return <PropertyListCtx.Provider value={value as PropertyListContext}>{children}</PropertyListCtx.Provider>
}

export function providePropertyList<T>(ctx: PropertyListContext<T>) {
  return function PropertyListProviderWrapper({ children }: { children: React.ReactNode }) {
    return <PropertyListCtx.Provider value={ctx as PropertyListContext}>{children}</PropertyListCtx.Provider>
  }
}

export function usePropertyList<T = unknown>(): PropertyListContext<T> {
  const ctx = useContext(PropertyListCtx)
  if (!ctx) throw new Error('[open-pencil] usePropertyList() called outside <PropertyListRoot>')
  return ctx as PropertyListContext<T>
}