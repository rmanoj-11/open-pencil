import { DEFAULT_SHAPE_FILL } from '@open-pencil/core/constants'

import { useColorVariableBinding } from '#react/controls/color-variable-binding/use'

export function useFillControls() {
  const ctx = useColorVariableBinding('fills')
  return { ...ctx, defaultFill: DEFAULT_SHAPE_FILL }
}