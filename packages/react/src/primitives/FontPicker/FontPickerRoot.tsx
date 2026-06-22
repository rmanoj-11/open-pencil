import { type ReactNode } from 'react'
import { useFontPicker } from '#react/primitives/FontPicker/useFontPicker'
import type { UseFontPickerOptions } from '#react/primitives/FontPicker/useFontPicker'

export interface FontPickerRootProps extends Omit<UseFontPickerOptions, 'modelValue'> {
  value: string
  onChange: (value: string) => void
  children?: ReactNode | ((props: FontPickerRootSlotProps) => ReactNode)
}

export interface FontPickerRootSlotProps {
  families: ReturnType<typeof useFontPicker>['families']
  filtered: ReturnType<typeof useFontPicker>['filtered']
  searchTerm: string
  setSearchTerm: (term: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  loading: boolean
  select: (family: string) => void
}

export function FontPickerRoot({ value, onChange, children, ...options }: FontPickerRootProps) {
  const modelValue = { get value() { return value }, set value(v: string) { onChange(v) } }
  const { families, filtered, searchTerm, setSearchTerm, open, setOpen, loading, select } = useFontPicker({ ...options, modelValue })
  const slotProps: FontPickerRootSlotProps = { families, filtered, searchTerm, setSearchTerm, open, setOpen, loading, select }
  return <>{typeof children === 'function' ? children(slotProps) : children}</>
}
