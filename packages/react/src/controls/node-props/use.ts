import type { Editor } from '@open-pencil/core/editor'
import type { SceneNode } from '@open-pencil/core/scene-graph'

import {
  MIXED,
  createNodePropArrayActions,
  createNodePropScrubActions,
  createNodePropSelectionState,
  isNodeArrayMixed
} from '#react/controls/node-props/helpers'
import { useEditor } from '#react/editor/context'

export { MIXED }
export type { MixedValue } from '#react/controls/node-props/helpers'

export function useNodeProps() {
  const store = useEditor()
  const selection = createNodePropSelectionState(store)
  const { getNode, getNodes, isMulti, active, activeNode, merged, updateAllWithUndo } = selection

  function isArrayMixed(key: Parameters<typeof isNodeArrayMixed>[1]): boolean {
    return isNodeArrayMixed(getNodes(), key)
  }

  const arrayActions = createNodePropArrayActions({
    store,
    getNodes,
    getActiveNode: activeNode,
    isMulti
  })

  const scrubActions = createNodePropScrubActions(store)

  return {
    store,
    node: getNode(),
    nodes: getNodes(),
    isMulti: isMulti(),
    active: active(),
    activeNode: activeNode(),
    targetNodes: arrayActions.targetNodes,
    prop: merged,
    merged,
    updateAllWithUndo,
    updateArrayItem: arrayActions.updateArrayItem,
    removeArrayItem: arrayActions.removeArrayItem,
    toggleArrayVisibility: arrayActions.toggleArrayVisibility,
    isArrayMixed,
    updateProp: scrubActions.updateProp,
    commitProp: scrubActions.commitProp
  }
}