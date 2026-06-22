import { useState } from 'react'

import type { Editor } from '@open-pencil/core/editor'
import type { GridTrack, LayoutAlign, LayoutCounterAlign, LayoutSizing, SceneNode } from '@open-pencil/core/scene-graph'

import { useSceneComputed } from '#react/internal/scene-computed/use'

export type AlignCell = { primary: LayoutAlign; counter: LayoutCounterAlign }
type GridTrackProp = 'gridTemplateColumns' | 'gridTemplateRows'
type LayoutPanelStrings = {
  sizingFixed: string
  sizingHug: string
  sizingFill: string
  sizingFillFr?: string
  sizingFixedPx?: string
}
export type SizeLimitProp = 'minWidth' | 'maxWidth' | 'minHeight' | 'maxHeight'

export const ALIGN_HORIZONTAL: AlignCell[] = [
  { primary: 'MIN', counter: 'MIN' }, { primary: 'CENTER', counter: 'MIN' }, { primary: 'MAX', counter: 'MIN' },
  { primary: 'MIN', counter: 'CENTER' }, { primary: 'CENTER', counter: 'CENTER' }, { primary: 'MAX', counter: 'CENTER' },
  { primary: 'MIN', counter: 'MAX' }, { primary: 'CENTER', counter: 'MAX' }, { primary: 'MAX', counter: 'MAX' }
]

export const ALIGN_VERTICAL: AlignCell[] = [
  { primary: 'MIN', counter: 'MIN' }, { primary: 'MIN', counter: 'CENTER' }, { primary: 'MIN', counter: 'MAX' },
  { primary: 'CENTER', counter: 'MIN' }, { primary: 'CENTER', counter: 'CENTER' }, { primary: 'CENTER', counter: 'MAX' },
  { primary: 'MAX', counter: 'MIN' }, { primary: 'MAX', counter: 'CENTER' }, { primary: 'MAX', counter: 'MAX' }
]

export function createTrackSizingOptions(panels: LayoutPanelStrings) {
  return [
    { value: 'FR' as const, label: panels.sizingFillFr },
    { value: 'FIXED' as const, label: panels.sizingFixedPx ?? panels.sizingFixed },
    { value: 'AUTO' as const, label: 'Auto' }
  ]
}

export function trackLabel(track: GridTrack): string {
  if (track.sizing === 'FR') return `${track.value}fr`
  if (track.sizing === 'FIXED') return `${track.value}px`
  return 'Auto'
}

export function canNodeHugContents(node: SceneNode | null): boolean {
  return !!node && node.childIds.length > 0
}

export function widthSizingForNode(node: SceneNode | null, isInAutoLayout: boolean): LayoutSizing {
  if (!node) return 'FIXED'
  if (node.layoutMode === 'HORIZONTAL') return node.primaryAxisSizing
  if (node.layoutMode === 'VERTICAL') return node.counterAxisSizing
  if (canNodeHugContents(node) && node.counterAxisSizing === 'HUG') return 'HUG'
  if (isInAutoLayout && node.layoutGrow > 0) return 'FILL'
  return 'FIXED'
}

export function heightSizingForNode(node: SceneNode | null, isInAutoLayout: boolean): LayoutSizing {
  if (!node) return 'FIXED'
  if (node.layoutMode === 'VERTICAL') return node.primaryAxisSizing
  if (node.layoutMode === 'HORIZONTAL') return node.counterAxisSizing
  if (canNodeHugContents(node) && node.primaryAxisSizing === 'HUG') return 'HUG'
  if (isInAutoLayout && node.layoutAlignSelf === 'STRETCH') return 'FILL'
  return 'FIXED'
}

export function sizingOptionsForNode(
  node: SceneNode | null, isInAutoLayout: boolean,
  labels: Partial<Record<LayoutSizing, string>> = {}
): { value: LayoutSizing; label: string }[] {
  const isFlex = node?.layoutMode === 'HORIZONTAL' || node?.layoutMode === 'VERTICAL'
  const options: { value: LayoutSizing; label: string }[] = [{ value: 'FIXED', label: labels.FIXED ?? 'Fixed' }]
  if (isFlex || canNodeHugContents(node)) options.push({ value: 'HUG', label: labels.HUG ?? 'Hug' })
  if (isInAutoLayout || isFlex) options.push({ value: 'FILL', label: labels.FILL ?? 'Fill' })
  return options
}

export function createGridTrackActions(editor: Editor, getNode: () => SceneNode | null) {
  function updateGridTrack(prop: GridTrackProp, index: number, updates: Partial<GridTrack>) {
    const node = getNode()
    if (!node) return
    const tracks = [...node[prop]]
    tracks[index] = { ...tracks[index], ...updates }
    editor.updateNodeWithUndo(node.id, { [prop]: tracks }, 'Change grid track')
  }
  function addTrack(prop: GridTrackProp) {
    const node = getNode()
    if (!node) return
    editor.updateNodeWithUndo(node.id, { [prop]: [...node[prop], { sizing: 'FR' as const, value: 1 }] }, 'Add grid track')
  }
  function removeTrack(prop: GridTrackProp, index: number) {
    const node = getNode()
    if (!node) return
    editor.updateNodeWithUndo(node.id, { [prop]: node[prop].filter((_: GridTrack, i: number) => i !== index) }, 'Remove grid track')
  }
  return { updateGridTrack, addTrack, removeTrack }
}

export function createPaddingActions(editor: Editor, getNode: () => SceneNode | null) {
  const [showIndividualPadding, setShowIndividualPadding] = useState(false)

  function hasUniformPadding() {
    const n = getNode()
    if (!n) return true
    return n.paddingTop === n.paddingRight && n.paddingRight === n.paddingBottom && n.paddingBottom === n.paddingLeft
  }
  function hasSymmetricPadding() {
    const n = getNode()
    if (!n) return true
    return n.paddingLeft === n.paddingRight && n.paddingTop === n.paddingBottom
  }
  function setHorizontalPadding(v: number) {
    const n = getNode()
    if (!n) return
    editor.updateNode(n.id, { paddingLeft: v, paddingRight: v })
  }
  function commitHorizontalPadding(_value: number, previous: number) {
    const n = getNode()
    if (!n) return
    editor.commitNodeUpdate(n.id, { paddingLeft: previous, paddingRight: previous } as Partial<SceneNode>, 'Change horizontal padding')
  }
  function setVerticalPadding(v: number) {
    const n = getNode()
    if (!n) return
    editor.updateNode(n.id, { paddingTop: v, paddingBottom: v })
  }
  function commitVerticalPadding(_value: number, previous: number) {
    const n = getNode()
    if (!n) return
    editor.commitNodeUpdate(n.id, { paddingTop: previous, paddingBottom: previous } as Partial<SceneNode>, 'Change vertical padding')
  }
  function toggleIndividualPadding() {
    setShowIndividualPadding((v) => !v)
  }

  return {
    showIndividualPadding, setShowIndividualPadding,
    hasUniformPadding, hasSymmetricPadding,
    setHorizontalPadding, commitHorizontalPadding,
    setVerticalPadding, commitVerticalPadding,
    toggleIndividualPadding
  }
}

export function createLayoutActions({
  editor, getNode, isFlex, isInAutoLayout
}: {
  editor: Editor
  getNode: () => SceneNode | null
  isFlex: () => boolean
  isInAutoLayout: () => boolean
}) {
  function updateProp(key: string, value: number | string) {
    const n = getNode()
    if (n) editor.updateNode(n.id, { [key]: value })
  }
  function updateSizeLimit(prop: SizeLimitProp, value: number) {
    const n = getNode()
    if (!n) return
    editor.updateNode(n.id, { [prop]: value })
  }
  function setSizeLimitToCurrent(prop: SizeLimitProp) {
    const n = getNode()
    if (!n) return
    const value = prop === 'minWidth' || prop === 'maxWidth' ? n.width : n.height
    editor.updateNodeWithUndo(n.id, { [prop]: Math.round(value) }, `Set ${prop}`)
  }
  function commitSizeLimit(prop: SizeLimitProp, _value: number, previous: number) {
    const n = getNode()
    if (!n) return
    editor.commitNodeUpdate(n.id, { [prop]: previous }, `Change ${prop}`)
  }
  function addSizeLimit(prop: SizeLimitProp) {
    const n = getNode()
    if (!n) return
    const fallback = prop === 'minWidth' || prop === 'maxWidth' ? n.width : n.height
    editor.updateNodeWithUndo(n.id, { [prop]: Math.round(fallback) }, `Add ${prop}`)
  }
  function removeSizeLimit(prop: SizeLimitProp) {
    const n = getNode()
    if (!n) return
    editor.updateNodeWithUndo(n.id, { [prop]: null }, `Remove ${prop}`)
  }
  function commitProp(key: string, _value: number | string, previous: number | string) {
    const n = getNode()
    if (n) editor.commitNodeUpdate(n.id, { [key]: previous } as Partial<SceneNode>, `Change ${key}`)
  }
  function setWidthSizing(sizing: LayoutSizing) {
    const n = getNode()
    if (!n) return
    if (isFlex()) {
      const key = n.layoutMode === 'HORIZONTAL' ? 'primaryAxisSizing' : 'counterAxisSizing'
      updateProp(key, sizing)
    } else if (sizing === 'HUG' && n.childIds.length > 0) {
      updateProp('counterAxisSizing', 'HUG')
    } else {
      if (n.counterAxisSizing === 'HUG') updateProp('counterAxisSizing', 'FIXED')
      if (isInAutoLayout()) updateProp('layoutGrow', sizing === 'FILL' ? 1 : 0)
    }
  }
  function setHeightSizing(sizing: LayoutSizing) {
    const n = getNode()
    if (!n) return
    if (isFlex()) {
      const key = n.layoutMode === 'VERTICAL' ? 'primaryAxisSizing' : 'counterAxisSizing'
      updateProp(key, sizing)
    } else if (sizing === 'HUG' && n.childIds.length > 0) {
      updateProp('primaryAxisSizing', 'HUG')
    } else {
      if (n.primaryAxisSizing === 'HUG') updateProp('primaryAxisSizing', 'FIXED')
      if (isInAutoLayout()) updateProp('layoutAlignSelf', sizing === 'FILL' ? 'STRETCH' : 'AUTO')
    }
  }
  function setAlignment(primary: LayoutAlign, counter: LayoutCounterAlign) {
    const n = getNode()
    if (!n) return
    editor.updateNodeWithUndo(n.id, { primaryAxisAlign: primary, counterAxisAlign: counter }, 'Change alignment')
  }
  function setGapAuto(enabled: boolean) {
    const n = getNode()
    if (!n) return
    editor.updateNodeWithUndo(n.id, { primaryAxisAlign: enabled ? 'SPACE_BETWEEN' : 'MIN' }, enabled ? 'Set gap to auto' : 'Set gap to fixed')
  }
  function setLayoutDirection(direction: SceneNode['layoutDirection']) {
    const n = getNode()
    if (!n) return
    editor.updateNodeWithUndo(n.id, { layoutDirection: direction }, 'Change layout direction')
  }

  return {
    updateProp, updateSizeLimit, setSizeLimitToCurrent, commitSizeLimit,
    addSizeLimit, removeSizeLimit, commitProp, setWidthSizing, setHeightSizing,
    setAlignment, setGapAuto, setLayoutDirection
  }
}

export function createLayoutSelectionState(editor: Editor, panels: LayoutPanelStrings) {
  const node = useSceneComputed<SceneNode | null>(() => editor.getSelectedNode() ?? null)
  const layoutDirection = node?.layoutDirection ?? 'AUTO'
  const gapAuto = node?.primaryAxisAlign === 'SPACE_BETWEEN'
  const alignGrid = node?.layoutMode === 'VERTICAL' ? ALIGN_VERTICAL : ALIGN_HORIZONTAL

  const isInAutoLayout = (() => {
    const n = node
    if (!n?.parentId) return false
    const parent = editor.getNode(n.parentId)
    return parent ? parent.layoutMode !== 'NONE' : false
  })()

  const isGrid = node?.layoutMode === 'GRID'
  const isFlex = node?.layoutMode === 'HORIZONTAL' || node?.layoutMode === 'VERTICAL'
  const widthSizing = widthSizingForNode(node, isInAutoLayout)
  const heightSizing = heightSizingForNode(node, isInAutoLayout)

  const sizingOpts = () => sizingOptionsForNode(node, isInAutoLayout, {
    FIXED: panels.sizingFixed, HUG: panels.sizingHug, FILL: panels.sizingFill
  })
  const widthSizingOptions = sizingOpts()
  const heightSizingOptions = sizingOpts()

  return { node, layoutDirection, gapAuto, alignGrid, isInAutoLayout, isGrid, isFlex, widthSizing, heightSizing, widthSizingOptions, heightSizingOptions }
}