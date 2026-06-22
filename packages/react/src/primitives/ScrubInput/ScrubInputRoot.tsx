import { type ReactNode, useRef, useState } from 'react'
import { ScrubInputProvider, type ScrubInputContext } from '#react/primitives/ScrubInput/context'
import { MIXED } from '#react/controls/node-props/helpers'

export interface ScrubInputRootProps {
  value: number | typeof MIXED
  displayValue: string
  isMixed?: boolean
  onScrub?: (delta: number) => void
  onCommit?: (value: number) => void
  onStart?: () => void
  children?: ReactNode | ((props: ScrubInputRootSlotProps) => ReactNode)
}

export interface ScrubInputRootSlotProps {
  isMixed: boolean
  editing: boolean
  scrubbing: boolean
  startScrub: (e: PointerEvent) => void
  startEdit: () => void
  liveUpdate: (e: Event) => void
  commitEdit: (e: Event) => void
  onKeydown: (e: KeyboardEvent) => void
}

export function ScrubInputRoot({ value, displayValue, isMixed = false, onScrub, onCommit, onStart, children }: ScrubInputRootProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [editing, setEditing] = useState(false)
  const [scrubbing, setScrubbing] = useState(false)

  function startScrub(e: PointerEvent) {
    setScrubbing(true)
    onStart?.()
  }

  function startEdit() {
    setEditing(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function liveUpdate(e: Event) {
    if (onScrub) {
      const target = e.target as HTMLInputElement
      const v = Number(target.value)
      if (Number.isFinite(v)) onScrub(v)
    }
  }

  function commitEdit(e: Event) {
    setEditing(false)
    const target = e.target as HTMLInputElement
    const v = Number(target.value)
    if (Number.isFinite(v)) onCommit?.(v)
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.code === 'Enter') (e.target as HTMLElement).blur()
    if (e.code === 'Escape') setEditing(false)
  }

  const ctx: ScrubInputContext = {
    modelValue: value, displayValue, isMixed, editing, scrubbing,
    inputRef, startScrub, startEdit, liveUpdate, commitEdit, onKeydown
  }

  const slotProps: ScrubInputRootSlotProps = { isMixed, editing, scrubbing, startScrub, startEdit, liveUpdate, commitEdit, onKeydown }

  return (
    <ScrubInputProvider value={ctx}>
      {typeof children === 'function' ? children(slotProps) : children}
    </ScrubInputProvider>
  )
}

export function ScrubInputField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input ref={useScrubInputInternal().inputRef} {...props} />
}

export function ScrubInputDisplay({ children }: { children?: ReactNode }) {
  const ctx = useScrubInputInternal()
  if (ctx.editing) return null
  return <span>{ctx.isMixed ? 'Mixed' : ctx.displayValue}{children}</span>
}

import { useContext } from 'react'
import { SCRUB_INPUT_KEY } from '#react/primitives/ScrubInput/context'

function useScrubInputInternal() {
  const ctx = useContext(SCRUB_INPUT_KEY)
  if (!ctx) throw new Error('[open-pencil] ScrubInput components must be used within <ScrubInputRoot>')
  return ctx
}
