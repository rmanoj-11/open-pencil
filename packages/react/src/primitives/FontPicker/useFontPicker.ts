import { useMemo, useState, useEffect } from 'react'

import type { FontFamilyOption } from '@open-pencil/core/text'

export type FontAccessState = 'unsupported' | 'prompt' | 'granted' | 'denied'
export type { FontFamilyOption, FontFamilySource } from '@open-pencil/core/text'

export interface FontAccessController {
  state: () => FontAccessState
  load: () => Promise<string[] | FontFamilyOption[]>
}

export interface UseFontPickerOptions {
  modelValue: { value: string }
  listFamilies: () => Promise<string[] | FontFamilyOption[]>
  localFontAccess?: FontAccessController
  onSelect?: (family: string) => void
}

function normalizeOptions(items: string[] | FontFamilyOption[]): FontFamilyOption[] {
  return items.map((item) => (typeof item === 'string' ? { family: item, source: 'local' } : item))
}

export function useFontPicker(options: UseFontPickerOptions) {
  const [families, setFamilies] = useState<FontFamilyOption[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accessState, setAccessState] = useState<FontAccessState>(options.localFontAccess?.state() ?? 'granted')

  const filtered = useMemo(() => {
    if (!searchTerm) return families
    const q = searchTerm.toLowerCase()
    return families.filter((option) => option.family.toLowerCase().includes(q))
  }, [families, searchTerm])

  async function loadFamilies() {
    if (families.length > 0 || loading) return
    setLoading(true)
    try {
      setFamilies(normalizeOptions(await options.listFamilies()))
      setAccessState(options.localFontAccess?.state() ?? accessState)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    setSearchTerm('')
    setAccessState(options.localFontAccess?.state() ?? accessState)
    if (accessState === 'prompt') {
      void requestAccess()
      return
    }
    void loadFamilies()
  }, [open])

  async function requestAccess() {
    if (!options.localFontAccess || loading) return
    setLoading(true)
    try {
      setFamilies(normalizeOptions(await options.localFontAccess.load()))
      setAccessState(options.localFontAccess.state())
    } finally {
      setLoading(false)
    }
  }

  function select(family: string) {
    options.modelValue.value = family
    options.onSelect?.(family)
    setOpen(false)
  }

  return { families, searchTerm, setSearchTerm, open, setOpen, filtered, loading, accessState, requestAccess, select }
}