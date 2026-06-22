import { DEFAULT_FONT_FAMILY } from '@open-pencil/core/constants'
import type { SceneNode } from '@open-pencil/core/scene-graph'
import { fontManager } from '@open-pencil/core/text'

import { useSceneComputed } from '#react/internal/scene-computed/use'

export function useNodeFontStatus(getNode: () => SceneNode | null | undefined) {
  const missingFonts = useSceneComputed(() => {
    const n = getNode()
    if (n?.type !== 'TEXT') return [] as string[]

    const families = new Set<string>()
    families.add(n.fontFamily || DEFAULT_FONT_FAMILY)
    for (const run of n.styleRuns) {
      if (run.style.fontFamily) families.add(run.style.fontFamily)
    }

    return [...families].filter((f) => !fontManager.isLoaded(f))
  })

  const hasMissingFonts = missingFonts.length > 0

  return { missingFonts, hasMissingFonts }
}