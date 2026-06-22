import { TYPOGRAPHY_WEIGHTS, createTypographyActions, createTypographyState } from '#react/controls/typography/actions'
import { useEditor } from '#react/editor/context'

export interface TypographyFontLoader {
  load: (family: string, style: string) => Promise<unknown>
}

export interface UseTypographyOptions {
  fontLoader?: TypographyFontLoader
}

export function useTypography(options: UseTypographyOptions = {}) {
  const editor = useEditor()
  const state = createTypographyState(editor)
  const actions = createTypographyActions({ editor, ...state, options })

  return { editor, ...state, weights: TYPOGRAPHY_WEIGHTS, ...actions }
}