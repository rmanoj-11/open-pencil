import type { Editor } from '@open-pencil/core/editor'
import type { SceneNode, TextDecoration } from '@open-pencil/core/scene-graph'
import { FONT_WEIGHT_NAMES, weightToStyle } from '@open-pencil/core/text'

import type { UseTypographyOptions } from '#react/controls/typography/use'
import { useNodeFontStatus } from '#react/shared/font-status/use'

type TextAlign = 'LEFT' | 'CENTER' | 'RIGHT'
type TextDirection = SceneNode['textDirection']

export const TYPOGRAPHY_WEIGHTS = Object.entries(FONT_WEIGHT_NAMES).map(([value, label]) => ({
  value: Number(value),
  label
}))

export function createTypographyState(editor: Editor) {
  const node = editor.getSelectedNode() ?? null
  const { missingFonts, hasMissingFonts } = useNodeFontStatus(() => node)
  const fontFamily = node?.fontFamily ?? ''
  const fontWeight = node?.fontWeight ?? 400
  const fontSize = node?.fontSize ?? 16
  const currentWeightLabel = FONT_WEIGHT_NAMES[node?.fontWeight ?? 400] ?? 'Regular'
  const activeFormatting: string[] = []
  if (node) {
    if (node.fontWeight >= 700) activeFormatting.push('bold')
    if (node.italic) activeFormatting.push('italic')
    if (node.textDecoration === 'UNDERLINE') activeFormatting.push('underline')
    if (node.textDecoration === 'STRIKETHROUGH') activeFormatting.push('strikethrough')
  }

  return { node, fontFamily, fontWeight, fontSize, currentWeightLabel, activeFormatting, missingFonts, hasMissingFonts }
}

export function createTypographyActions({
  editor, node, currentWeightLabel, activeFormatting, options
}: {
  editor: Editor
  node: SceneNode | null
  currentWeightLabel: string
  activeFormatting: string[]
  options: UseTypographyOptions
}) {
  async function doLoadFont(family: string, style: string) {
    await options.fontLoader?.load(family, style)
  }

  async function setFamily(family: string) {
    if (!node) return
    await doLoadFont(family, currentWeightLabel)
    editor.updateNodeWithUndo(node.id, { fontFamily: family }, 'Change font')
  }

  async function setWeight(weight: number) {
    if (!node) return
    const { id, fontFamily } = node
    const style = weightToStyle(weight)
    editor.updateNodeWithUndo(id, { fontWeight: weight }, 'Change font weight')
    await doLoadFont(fontFamily, style)
  }

  function setAlign(align: TextAlign) {
    if (!node) return
    editor.updateNodeWithUndo(node.id, { textAlignHorizontal: align }, 'Change text alignment')
  }

  function setDirection(direction: TextDirection) {
    if (!node) return
    editor.updateNodeWithUndo(node.id, { textDirection: direction }, 'Change text direction')
  }

  function toggleBold() {
    if (!node) return
    void setWeight(node.fontWeight >= 700 ? 400 : 700)
  }

  function toggleItalic() {
    if (!node) return
    editor.updateNodeWithUndo(node.id, { italic: !node.italic }, 'Toggle italic')
  }

  function toggleDecoration(deco: 'UNDERLINE' | 'STRIKETHROUGH') {
    if (!node) return
    const current = node.textDecoration
    editor.updateNodeWithUndo(node.id, { textDecoration: (current === deco ? 'NONE' : deco) as TextDecoration }, `Toggle ${deco.toLowerCase()}`)
  }

  function onFormattingChange(values: string[]) {
    if (!node) return
    const prev = activeFormatting
    const added = values.filter((v) => !prev.includes(v))
    const removed = prev.filter((v) => !values.includes(v))
    for (const item of [...added, ...removed]) {
      if (item === 'bold') toggleBold()
      else if (item === 'italic') toggleItalic()
      else if (item === 'underline') toggleDecoration('UNDERLINE')
      else if (item === 'strikethrough') toggleDecoration('STRIKETHROUGH')
    }
  }

  function updateProp(key: string, value: number | string) {
    if (node) editor.updateNode(node.id, { [key]: value })
  }

  function commitProp(key: string, _value: number | string, previous: number | string) {
    if (node) {
      editor.commitNodeUpdate(node.id, { [key]: previous } as Partial<SceneNode>, `Change ${key}`)
    }
  }

  return { setFamily, setWeight, setAlign, setDirection, toggleBold, toggleItalic, toggleDecoration, onFormattingChange, updateProp, commitProp }
}