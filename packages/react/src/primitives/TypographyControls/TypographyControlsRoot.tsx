import { type ReactNode } from 'react'
import { useTypography, type UseTypographyOptions } from '#react/controls/typography/use'

export interface TypographyControlsRootProps extends UseTypographyOptions {
  children?: ReactNode | ((props: TypographyControlsRootSlotProps) => ReactNode)
}

export interface TypographyControlsRootSlotProps {
  fontFamily: string
  fontWeight: number
  fontSize: number
  currentWeightLabel: string
  activeFormatting: string[]
  missingFonts: string[]
  hasMissingFonts: boolean
  weights: ReturnType<typeof useTypography>['weights']
  setFamily: ReturnType<typeof useTypography>['setFamily']
  setWeight: ReturnType<typeof useTypography>['setWeight']
  setAlign: ReturnType<typeof useTypography>['setAlign']
  toggleBold: ReturnType<typeof useTypography>['toggleBold']
  toggleItalic: ReturnType<typeof useTypography>['toggleItalic']
  updateProp: ReturnType<typeof useTypography>['updateProp']
  commitProp: ReturnType<typeof useTypography>['commitProp']
}

export function TypographyControlsRoot({ children, ...options }: TypographyControlsRootProps) {
  const t = useTypography(options)
  const slotProps: TypographyControlsRootSlotProps = {
    fontFamily: t.fontFamily, fontWeight: t.fontWeight, fontSize: t.fontSize,
    currentWeightLabel: t.currentWeightLabel, activeFormatting: t.activeFormatting,
    missingFonts: t.missingFonts, hasMissingFonts: t.hasMissingFonts,
    weights: t.weights, setFamily: t.setFamily, setWeight: t.setWeight,
    setAlign: t.setAlign, toggleBold: t.toggleBold, toggleItalic: t.toggleItalic,
    updateProp: t.updateProp, commitProp: t.commitProp
  }
  return <>{typeof children === 'function' ? children(slotProps) : children}</>
}
