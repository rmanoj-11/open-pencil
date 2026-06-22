import { type ReactNode } from 'react'
import { useAppearance } from '#react/controls/appearance/use'

export interface AppearanceControlsRootProps {
  children?: ReactNode | ((props: AppearanceControlsRootSlotProps) => ReactNode)
}

export interface AppearanceControlsRootSlotProps {
  hasCornerRadius: boolean
  independentCorners: boolean | symbol
  cornerRadiusValue: number | symbol
  opacityPercent: number | symbol
  visibilityState: 'visible' | 'hidden' | 'mixed'
  toggleVisibility: () => void
  toggleIndependentCorners: () => void
  updateCornerProp: (key: string, value: number) => void
  commitCornerProp: (key: string, value: number, previous: number) => void
  updateProp: ReturnType<typeof useAppearance>['updateProp']
  commitProp: ReturnType<typeof useAppearance>['commitProp']
}

export function AppearanceControlsRoot({ children }: AppearanceControlsRootProps) {
  const appearance = useAppearance()
  const slotProps: AppearanceControlsRootSlotProps = {
    hasCornerRadius: appearance.hasCornerRadius,
    independentCorners: appearance.independentCorners,
    cornerRadiusValue: appearance.cornerRadiusValue,
    opacityPercent: appearance.opacityPercent,
    visibilityState: appearance.visibilityState,
    toggleVisibility: appearance.toggleVisibility,
    toggleIndependentCorners: appearance.toggleIndependentCorners,
    updateCornerProp: appearance.updateCornerProp,
    commitCornerProp: appearance.commitCornerProp,
    updateProp: appearance.updateProp,
    commitProp: appearance.commitProp
  }
  return <>{typeof children === 'function' ? children(slotProps) : children}</>
}
