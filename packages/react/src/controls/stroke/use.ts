import { useState } from 'react'

import {
  BORDER_SIDES, DEFAULT_STROKE, SIDE_OPTIONS,
  createStrokeSideActions, currentAlign, currentSides, updateAlign
} from '#react/controls/stroke/helpers'
import { useEditor } from '#react/editor/context'
import { useI18n } from '#react/i18n'

export function useStrokeControls() {
  const store = useEditor()
  const { panels } = useI18n()
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const sideMenuOpenRef = { value: sideMenuOpen }
  Object.defineProperty(sideMenuOpenRef, 'value', {
    get: () => sideMenuOpen, set: setSideMenuOpen
  })

  const alignOptions = [
    { value: 'INSIDE' as const, label: panels.strokeAlignInside },
    { value: 'CENTER' as const, label: panels.strokeAlignCenter },
    { value: 'OUTSIDE' as const, label: panels.strokeAlignOutside }
  ]
  const { selectSide, updateBorderWeight } = createStrokeSideActions(store, sideMenuOpenRef)

  return {
    alignOptions,
    sideOptions: SIDE_OPTIONS,
    borderSides: BORDER_SIDES,
    sideMenuOpen,
    setSideMenuOpen,
    defaultStroke: DEFAULT_STROKE,
    updateAlign: (align: 'INSIDE' | 'CENTER' | 'OUTSIDE', node: Parameters<typeof updateAlign>[2]) => updateAlign(store, align, node),
    currentAlign,
    currentSides,
    selectSide,
    updateBorderWeight
  }
}