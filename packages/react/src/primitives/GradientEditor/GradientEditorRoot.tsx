import { type ReactNode } from 'react'
import { useGradientStops } from '#react/primitives/GradientEditor/useGradientStops'
import type { Fill } from '@open-pencil/core/scene-graph'

export interface GradientEditorRootProps {
  fill: Fill
  onUpdate: (fill: Fill) => void
  children?: ReactNode | ((props: GradientEditorRootSlotProps) => ReactNode)
}

export interface GradientEditorRootSlotProps {
  activeStopIndex: number
  stops: ReturnType<typeof useGradientStops>['stops']
  subtype: ReturnType<typeof useGradientStops>['subtype']
  subtypes: ReturnType<typeof useGradientStops>['subtypes']
  activeColor: ReturnType<typeof useGradientStops>['activeColor']
  barBackground: string
  setSubtype: ReturnType<typeof useGradientStops>['setSubtype']
  selectStop: ReturnType<typeof useGradientStops>['selectStop']
  addStop: ReturnType<typeof useGradientStops>['addStop']
  removeStop: ReturnType<typeof useGradientStops>['removeStop']
  updateStopPosition: ReturnType<typeof useGradientStops>['updateStopPosition']
  updateStopColor: ReturnType<typeof useGradientStops>['updateStopColor']
  updateStopOpacity: ReturnType<typeof useGradientStops>['updateStopOpacity']
  updateActiveColor: ReturnType<typeof useGradientStops>['updateActiveColor']
  dragStop: ReturnType<typeof useGradientStops>['dragStop']
}

export function GradientEditorRoot({ fill, onUpdate, children }: GradientEditorRootProps) {
  const result = useGradientStops(fill, onUpdate)
  const slotProps = result as unknown as GradientEditorRootSlotProps
  return <>{typeof children === 'function' ? children(slotProps) : children}</>
}

export function GradientEditorBar({ children, onClick }: { children?: ReactNode; onClick?: (e: React.MouseEvent) => void }) {
  return <div onClick={onClick}>{children}</div>
}

export function GradientEditorStop({ children, ...props }: { children?: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}
