import { type ReactNode } from 'react'
import type { Color } from '@open-pencil/core/types'

export interface ColorPickerRootProps {
  color: Color
  onUpdate: (color: Color) => void
  children?: ReactNode | ((props: ColorPickerRootSlotProps) => ReactNode)
}

export interface ColorPickerRootSlotProps {
  color: Color
  update: (color: Color) => void
}

export function ColorPickerRoot({ color, onUpdate, children }: ColorPickerRootProps) {
  const slotProps: ColorPickerRootSlotProps = { color, update: onUpdate }
  return <>{typeof children === 'function' ? children(slotProps) : children}</>
}

export function ColorInputRoot({ color, onUpdate, children }: ColorPickerRootProps) {
  return ColorPickerRoot({ color, onUpdate, children })
}
