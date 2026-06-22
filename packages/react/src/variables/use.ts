import { useMemo, useState } from 'react'

import type { Variable } from '@open-pencil/core/scene-graph'

import { useEditor } from '#react/editor/context'
import { useSceneComputed } from '#react/internal/scene-computed/use'
import { createVariableCollectionActions, createVariableValueActions } from '#react/variables/helpers'

export function useVariables() {
  const editor = useEditor()
  const [searchTerm, setSearchTerm] = useState('')

  const collections = useSceneComputed(() => editor.getCollections())
  const [activeCollectionId, setActiveCollectionId] = useState(collections[0]?.id ?? '')

  const activeCollection = useMemo(
    () => editor.getCollection(activeCollectionId) ?? null,
    [editor, activeCollectionId, collections]
  )
  const activeModes = activeCollection?.modes ?? []

  const variables = useSceneComputed(() => {
    if (!activeCollectionId) return [] as Variable[]
    const all = editor.getVariablesForCollection(activeCollectionId)
    if (!searchTerm) return all
    const q = searchTerm.toLowerCase()
    return all.filter((v) => v.name.toLowerCase().includes(q))
  })

  const activeCollectionIdRef = {
    get value() { return activeCollectionId },
    set value(v: string) { setActiveCollectionId(v) }
  }

  const collectionActions = createVariableCollectionActions(editor, activeCollectionIdRef)
  const variableActions = createVariableValueActions(editor, () => activeCollection)

  return {
    editor,
    collections,
    activeCollectionId,
    setActiveCollectionId,
    activeCollection,
    activeModes,
    variables,
    searchTerm,
    setSearchTerm,
    ...collectionActions,
    ...variableActions
  }
}