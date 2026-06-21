import { useSyncExternalStore } from 'react'

import { IS_BROWSER } from '@open-pencil/core/constants'

function subscribe(callback: () => void): () => void {
  if (!IS_BROWSER) return () => {}
  const mql = window.matchMedia('(max-width: 768px)')
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getMobileSnapshot(): boolean {
  if (!IS_BROWSER) return false
  return window.matchMedia('(max-width: 768px)').matches
}

export function useViewportKind() {
  const isMobile = useSyncExternalStore(subscribe, getMobileSnapshot)
  const isDesktop = !isMobile

  return { isMobile, isDesktop }
}