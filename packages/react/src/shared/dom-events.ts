export function inputValue(e: Event): string {
  const target = e.target as unknown
  if (target instanceof HTMLInputElement) return target.value
  if (target && typeof target === 'object' && 'value' in target) return String((target as { value: unknown }).value ?? '')
  return ''
}

export function inputNumberValue(e: Event): number {
  return +inputValue(e)
}

export function blurTarget(e: Event) {
  const target = e.target as unknown
  if (target instanceof HTMLElement) target.blur()
  else if (target && typeof target === 'object' && 'blur' in target && typeof (target as { blur: unknown }).blur === 'function') (target as { blur: () => void }).blur()
}

export function selectTarget(e: Event) {
  const target = e.target as unknown
  if (target instanceof HTMLInputElement) target.select()
  else if (target && typeof target === 'object' && 'select' in target && typeof (target as { select: unknown }).select === 'function') (target as { select: () => void }).select()
}