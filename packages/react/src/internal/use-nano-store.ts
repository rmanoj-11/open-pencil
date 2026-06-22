import { useSyncExternalStore } from 'react'
import type { Store } from 'nanostores'

export function useNanoStore<T>(store: Store<T>): T {
  return useSyncExternalStore(
    (callback) => store.listen(callback),
    () => store.get()
  )
}