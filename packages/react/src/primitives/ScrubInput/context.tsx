import { createContext, useContext } from 'react'

export interface ScrubInputContext {
  modelValue: number | symbol
  displayValue: string
  isMixed: boolean
  editing: boolean
  scrubbing: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  startScrub: (e: PointerEvent) => void
  startEdit: () => void
  liveUpdate: (e: Event) => void
  commitEdit: (e: Event) => void
  onKeydown: (e: KeyboardEvent) => void
}

const ScrubInputCtx = createContext<ScrubInputContext | null>(null)
ScrubInputCtx.displayName = 'scrub-input'

export const SCRUB_INPUT_KEY = ScrubInputCtx

export function ScrubInputProvider({ value, children }: { value: ScrubInputContext; children: React.ReactNode }) {
  return <ScrubInputCtx.Provider value={value}>{children}</ScrubInputCtx.Provider>
}

export function provideScrubInput(ctx: ScrubInputContext) {
  return function ScrubInputProviderWrapper({ children }: { children: React.ReactNode }) {
    return <ScrubInputCtx.Provider value={ctx}>{children}</ScrubInputCtx.Provider>
  }
}

export function useScrubInput(): ScrubInputContext {
  const ctx = useContext(ScrubInputCtx)
  if (!ctx) throw new Error('[open-pencil] useScrubInput() called outside <ScrubInputRoot>')
  return ctx
}