import { createAppearanceActions, createAppearanceState } from '#react/controls/appearance/helpers'
import { useNodeProps } from '#react/controls/node-props/use'
import { useEditor } from '#react/editor/context'

export function useAppearance() {
  const editor = useEditor()
  const { nodes, node, active, isMulti, merged, updateProp, commitProp } = useNodeProps()

  const state = createAppearanceState({
    getNode: () => node,
    getNodes: () => nodes,
    isMulti: () => isMulti,
    merged
  })

  const actions = createAppearanceActions({
    editor,
    getNode: () => node,
    getNodes: () => nodes,
    isMulti: () => isMulti,
    merged
  })

  return {
    editor,
    nodes,
    node,
    active,
    isMulti,
    hasCornerRadius: state.hasCornerRadius(),
    independentCorners: state.independentCorners(),
    cornerRadiusValue: state.cornerRadiusValue(),
    opacityPercent: state.opacityPercent(),
    visibilityState: state.visibilityState(),
    updateProp,
    commitProp,
    toggleVisibility: actions.toggleVisibility,
    toggleIndependentCorners: actions.toggleIndependentCorners,
    updateCornerProp: actions.updateCornerProp,
    commitCornerProp: actions.commitCornerProp
  }
}