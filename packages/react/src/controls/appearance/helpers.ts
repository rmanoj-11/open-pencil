import type { Editor } from '@open-pencil/core/editor'
import type { SceneNode } from '@open-pencil/core/scene-graph'

import { MIXED, type MixedValue } from '#react/controls/node-props/helpers'

const CORNER_RADIUS_TYPES = new Set(['RECTANGLE', 'ROUNDED_RECTANGLE', 'FRAME', 'COMPONENT', 'INSTANCE'])

type AppearanceStateOptions = {
  getNode: () => SceneNode | null
  getNodes: () => SceneNode[]
  isMulti: () => boolean
  merged: <K extends keyof SceneNode>(key: K) => MixedValue<SceneNode[K]>
}

type AppearanceActionOptions = AppearanceStateOptions & {
  editor: Editor
}

export function createAppearanceState({ getNode, getNodes, isMulti, merged }: AppearanceStateOptions) {
  function hasCornerRadius(): boolean {
    if (isMulti()) return getNodes().every((n) => CORNER_RADIUS_TYPES.has(n.type))
    return getNode() ? CORNER_RADIUS_TYPES.has(getNode()!.type) : false
  }

  function independentCorners(): MixedValue<boolean> {
    if (isMulti()) return merged('independentCorners')
    return getNode()?.independentCorners ?? false
  }

  function cornerRadiusValue(): MixedValue<number> {
    if (isMulti()) return merged('cornerRadius')
    return getNode()?.cornerRadius ?? 0
  }

  function opacityPercent(): MixedValue<number> {
    const v = merged('opacity')
    return v === MIXED ? MIXED : Math.round(v * 100)
  }

  function visibilityState(): 'visible' | 'hidden' | 'mixed' {
    const v = merged('visible')
    if (v === MIXED) return 'mixed'
    return v ? 'visible' : 'hidden'
  }

  return { hasCornerRadius, independentCorners, cornerRadiusValue, opacityPercent, visibilityState }
}

export function createAppearanceActions({ editor, getNode, getNodes, isMulti }: AppearanceActionOptions) {
  function toggleVisibility() {
    if (isMulti()) {
      const liveNodes = getNodes()
        .map((n) => editor.getNode(n.id))
        .filter((n): n is SceneNode => n != null)
      if (liveNodes.length === 0) return
      const allVisible = liveNodes.every((n) => n.visible)
      editor.undo.runBatch('Toggle visibility', () => {
        for (const n of liveNodes) {
          editor.updateNodeWithUndo(n.id, { visible: !allVisible }, 'Toggle visibility')
        }
      })
      return
    }

    const selected = getNode()
    if (!selected) return
    const liveNode = editor.getNode(selected.id)
    if (!liveNode) return
    editor.updateNodeWithUndo(liveNode.id, { visible: !liveNode.visible }, 'Toggle visibility')
  }

  function toggleIndependentCorners() {
    const selected = getNode()
    const singleTarget = selected ? [selected] : []
    const targets = isMulti() ? getNodes() : singleTarget
    for (const n of targets) {
      if (n.independentCorners) {
        const uniform = n.topLeftRadius
        editor.updateNodeWithUndo(
          n.id,
          {
            independentCorners: false,
            cornerRadius: uniform,
            topLeftRadius: uniform,
            topRightRadius: uniform,
            bottomRightRadius: uniform,
            bottomLeftRadius: uniform
          } as Partial<SceneNode>,
          'Uniform corner radius'
        )
      } else {
        editor.updateNodeWithUndo(
          n.id,
          {
            independentCorners: true,
            topLeftRadius: n.cornerRadius,
            topRightRadius: n.cornerRadius,
            bottomRightRadius: n.cornerRadius,
            bottomLeftRadius: n.cornerRadius
          } as Partial<SceneNode>,
          'Independent corner radii'
        )
      }
    }
  }

  function updateCornerProp(key: string, value: number) {
    if (isMulti()) {
      for (const n of getNodes()) editor.updateNode(n.id, { [key]: value })
    } else {
      const n = getNode()
      if (n) editor.updateNode(n.id, { [key]: value })
    }
  }

  function commitCornerProp(key: string, _value: number, previous: number) {
    if (isMulti()) {
      for (const n of getNodes()) {
        editor.commitNodeUpdate(n.id, { [key]: previous } as Partial<SceneNode>, `Change ${key}`)
      }
    } else {
      const n = getNode()
      if (n) {
        editor.commitNodeUpdate(n.id, { [key]: previous } as Partial<SceneNode>, `Change ${key}`)
      }
    }
  }

  return { toggleVisibility, toggleIndependentCorners, updateCornerProp, commitCornerProp }
}