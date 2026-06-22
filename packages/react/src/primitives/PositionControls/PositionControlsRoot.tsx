import { type ReactNode } from 'react'
import { usePosition } from '#react/controls/position/use'

export interface PositionControlsRootProps {
  children?: ReactNode | ((props: PositionControlsRootSlotProps) => ReactNode)
}

export interface PositionControlsRootSlotProps {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  active: boolean
  isMulti: boolean
  updateProp: ReturnType<typeof usePosition>['updateProp']
  commitProp: ReturnType<typeof usePosition>['commitProp']
  align: ReturnType<typeof usePosition>['align']
  flip: ReturnType<typeof usePosition>['flip']
  rotate: ReturnType<typeof usePosition>['rotate']
}

export function PositionControlsRoot({ children }: PositionControlsRootProps) {
  const pos = usePosition()
  const slotProps: PositionControlsRootSlotProps = {
    x: pos.x, y: pos.y, width: pos.width, height: pos.height, rotation: pos.rotation,
    active: pos.active, isMulti: pos.isMulti,
    updateProp: pos.updateProp, commitProp: pos.commitProp,
    align: pos.align, flip: pos.flip, rotate: pos.rotate
  }
  return <>{typeof children === 'function' ? children(slotProps) : children}</>
}
