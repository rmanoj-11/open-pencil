import { type ReactNode } from 'react'
import { useFillPicker } from '#react/primitives/FillPicker/useFillPicker'
import type { Fill } from '@open-pencil/core/scene-graph'

export interface FillPickerRootProps {
  fill: Fill
  onUpdate: (fill: Fill) => void
  children?: ReactNode | ((props: FillPickerRootSlotProps) => ReactNode)
}

export interface FillPickerRootSlotProps {
  category: 'SOLID' | 'GRADIENT' | 'IMAGE'
  swatchBg: string
  toSolid: () => void
  toGradient: () => void
  toImage: () => void
}

export function FillPickerRoot({ fill, onUpdate, children }: FillPickerRootProps) {
  const { category, swatchBg, toSolid, toGradient, toImage } = useFillPicker(fill, onUpdate)
  const slotProps: FillPickerRootSlotProps = { category, swatchBg, toSolid, toGradient, toImage }
  return <>{typeof children === 'function' ? children(slotProps) : children}</>
}
