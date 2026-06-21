import { createContext as reactCreateContext, useContext } from 'react'

export function createContext<T>(name: string) {
  const Ctx = reactCreateContext<T | null>(null)
  Ctx.displayName = name

  function useCtx(): T {
    const value = useContext(Ctx)
    if (value === null || value === undefined) {
      throw new Error(
        `[open-pencil] Context \`${name}\` not found. Component must be used within the corresponding Provider.`
      )
    }
    return value
  }

  function Provider({ value, children }: { value: T; children: React.ReactNode }) {
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
  }

  return [useCtx, Provider, Ctx] as const
}