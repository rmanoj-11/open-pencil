import type { ComponentType } from 'react'
import type { FontFamilyOption } from '@open-pencil/core/text'

export interface FontPickerUi {
  families: FontFamilyOption[]
  filtered: FontFamilyOption[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  loading: boolean
  select: (family: string) => void
}

export type { FontFamilyOption }