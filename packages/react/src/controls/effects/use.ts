import { useState } from 'react'

import type { Effect } from '@open-pencil/core/scene-graph'

import {
  createDefaultEffect, createEffectControlActions, createEffectEditActions,
  EFFECT_OPTIONS, isShadow
} from '#react/controls/effects/helpers'
import { useEditor } from '#react/editor/context'

export function useEffectsControls() {
  const editor = useEditor()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [effectsBeforeScrub, setEffectsBeforeScrub] = useState<Effect[] | null>(null)

  const expandedIndexRef = {
    get value() { return expandedIndex },
    set value(v: number | null) { setExpandedIndex(v) }
  }
  const effectsBeforeScrubRef = {
    get value() { return effectsBeforeScrub },
    set value(v: Effect[] | null) { setEffectsBeforeScrub(v) }
  }

  const editActions = createEffectEditActions(editor, effectsBeforeScrubRef)
  const controlActions = createEffectControlActions(expandedIndexRef)

  return {
    expandedIndex,
    setExpandedIndex,
    effectOptions: EFFECT_OPTIONS,
    createDefaultEffect,
    isShadow,
    ...editActions,
    ...controlActions
  }
}